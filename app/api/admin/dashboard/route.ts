import { NextResponse } from 'next/server';
import { requireAdminClient } from '@/lib/api/admin/auth';

export async function GET() {
  try {
    const result = await requireAdminClient();
    if (result instanceof NextResponse) return result;
    const { admin } = result;

    const [
      usersCountRes,
      verifiedUsersRes,
      activeCareRes,
      pendingKycRes,
      reportsOpenRes,
      usersRecentRes,
      requestsRecentRes,
      kycRecentRes,
      reportsRecentRes,
      usersAllRes,
      careAllRes,
    ] = await Promise.all([
      admin.from('users').select('id', { count: 'exact', head: true }),
      admin.from('users').select('id', { count: 'exact', head: true }).eq('kyc_status', 'approved'),
      admin
        .from('care_requests')
        .select('id', { count: 'exact', head: true })
        .in('status', ['active', 'matched', 'open']),
      admin.from('kyc_submissions').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      admin.from('reports').select('id', { count: 'exact', head: true }).eq('status', 'open'),
      admin.from('users').select('id, full_name, display_name, email, created_at').order('created_at', { ascending: false }).limit(3),
      admin.from('care_requests').select('id, created_at, status').order('created_at', { ascending: false }).limit(3),
      admin.from('kyc_submissions').select('id, created_at:submitted_at, status').order('submitted_at', { ascending: false }).limit(3),
      admin.from('reports').select('id, created_at, reason, status').order('created_at', { ascending: false }).limit(3),
      admin.from('users').select('created_at').order('created_at', { ascending: true }),
      admin.from('care_requests').select('created_at, taker_id').order('created_at', { ascending: true }),
    ]);

    const pointsAgg = await admin
      .from('users')
      .select('points_balance')
      .limit(1000);

    if (
      usersCountRes.error ||
      verifiedUsersRes.error ||
      activeCareRes.error ||
      pendingKycRes.error ||
      reportsOpenRes.error
    ) {
      const firstError =
        usersCountRes.error ||
        verifiedUsersRes.error ||
        activeCareRes.error ||
        pendingKycRes.error ||
        reportsOpenRes.error;
      return NextResponse.json({ error: firstError?.message ?? 'Failed to fetch dashboard data.' }, { status: 500 });
    }

    const pointsInCirculation = (pointsAgg.data ?? []).reduce(
      (sum: number, row: { points_balance?: number | null }) => sum + Number(row.points_balance ?? 0),
      0
    );

    const recentActivity = [
      ...(usersRecentRes.data ?? []).map((u: { id: string; full_name: string | null; display_name: string | null; email: string; created_at: string }) => ({
        id: `user-${u.id}`,
        title: `New user joined: ${u.full_name || u.display_name || u.email}`,
        desc: 'Registered account',
        time: u.created_at,
        type: 'user',
      })),
      ...(requestsRecentRes.data ?? []).map((r: { id: string; created_at: string; status: string }) => ({
        id: `care-${r.id}`,
        title: `Care request #${String(r.id).slice(0, 8)}`,
        desc: `Status: ${r.status}`,
        time: r.created_at,
        type: 'care',
      })),
      ...(kycRecentRes.data ?? []).map((k: { id: string; created_at: string | null; status: string }) => ({
        id: `kyc-${k.id}`,
        title: `KYC submission #${String(k.id).slice(0, 8)}`,
        desc: `Status: ${k.status}`,
        time: k.created_at ?? '',
        type: 'kyc',
      })),
      ...(reportsRecentRes.data ?? []).map((r: { id: string; created_at: string; reason: string | null }) => ({
        id: `report-${r.id}`,
        title: `Report #${String(r.id).slice(0, 8)}`,
        desc: r.reason || 'New report created',
        time: r.created_at,
        type: 'report',
      })),
    ]
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 9);

    const growthByMonth = new Map<string, number>();
    let cumulativeUsers = 0;
    for (const row of usersAllRes.data ?? []) {
      const createdAt = (row as { created_at?: string | null }).created_at;
      if (!createdAt) continue;
      const d = new Date(createdAt);
      if (Number.isNaN(d.getTime())) continue;
      const month = d.toLocaleDateString('en-US', { month: 'short' });
      cumulativeUsers += 1;
      growthByMonth.set(month, cumulativeUsers);
    }

    const now = new Date();
    const monthKeys = Array.from({ length: 12 }).map((_, idx) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (11 - idx), 1);
      return d.toLocaleDateString('en-US', { month: 'short' });
    });
    const growth = monthKeys.map((month) => ({ month, users: growthByMonth.get(month) ?? 0 }));

    const careWeekMap = new Map<string, { given: number; received: number }>();
    for (const row of careAllRes.data ?? []) {
      const careRow = row as { created_at?: string | null; taker_id?: string | null };
      if (!careRow.created_at) continue;
      const d = new Date(careRow.created_at);
      if (Number.isNaN(d.getTime())) continue;
      const weekIndex = Math.max(1, Math.ceil(d.getDate() / 7));
      const key = `${d.getFullYear()}-${d.getMonth()}-${weekIndex}`;
      const current = careWeekMap.get(key) ?? { given: 0, received: 0 };
      current.received += 1;
      if (careRow.taker_id) current.given += 1;
      careWeekMap.set(key, current);
    }

    const careActivity = Array.from({ length: 8 }).map((_, idx) => {
      const d = new Date(now);
      d.setDate(now.getDate() - (7 * (7 - idx)));
      const weekIndex = Math.max(1, Math.ceil(d.getDate() / 7));
      const key = `${d.getFullYear()}-${d.getMonth()}-${weekIndex}`;
      const values = careWeekMap.get(key) ?? { given: 0, received: 0 };
      return { week: `W${idx + 1}`, ...values };
    });

    return NextResponse.json({
      metrics: {
        totalUsers: usersCountRes.count ?? 0,
        totalVerifiedUsers: verifiedUsersRes.count ?? 0,
        activeCareContracts: activeCareRes.count ?? 0,
        pointsInCirculation,
        pendingKyc: pendingKycRes.count ?? 0,
        openReports: reportsOpenRes.count ?? 0,
      },
      recentActivity,
      charts: {
        growth,
        careActivity,
      },
    });
  } catch (e) {
    console.error('[api/admin/dashboard] GET', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

