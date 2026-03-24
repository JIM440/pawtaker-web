import { NextResponse } from 'next/server';
import { requireAdminClient } from '@/lib/api/admin/auth';

export async function GET() {
  try {
    const result = await requireAdminClient();
    if (result instanceof NextResponse) return result;
    const { admin } = result;

    const [usersRes, reportsRes, kycRes, requestsRes] = await Promise.all([
      admin
        .from('users')
        .select('id, full_name, display_name, email, created_at')
        .order('created_at', { ascending: false })
        .limit(4),
      admin
        .from('reports')
        .select('id, reason, status, created_at')
        .order('created_at', { ascending: false })
        .limit(4),
      admin
        .from('kyc_submissions')
        .select('id, status, submitted_at')
        .order('submitted_at', { ascending: false })
        .limit(4),
      admin
        .from('care_requests')
        .select('id, status, created_at')
        .order('created_at', { ascending: false })
        .limit(4),
    ]);

    const notifications = [
      ...(usersRes.data ?? []).map((u: { id: string; full_name: string | null; display_name: string | null; email: string; created_at: string }) => ({
        id: `user-${u.id}`,
        title: `New user: ${u.full_name || u.display_name || u.email}`,
        preview: 'A new account was created.',
        age: new Date(u.created_at).toLocaleString(),
        unread: true,
        avatarUrl: `https://picsum.photos/seed/user-${u.id}/64`,
      })),
      ...(reportsRes.data ?? []).map((r: { id: string; reason: string | null; status: string; created_at: string }) => ({
        id: `report-${r.id}`,
        title: `Report ${String(r.id).slice(0, 8)}`,
        preview: r.reason || `Status: ${r.status}`,
        age: new Date(r.created_at).toLocaleString(),
        unread: r.status === 'open',
        avatarUrl: `https://picsum.photos/seed/report-${r.id}/64`,
      })),
      ...(kycRes.data ?? []).map((k: { id: string; status: string; submitted_at: string }) => ({
        id: `kyc-${k.id}`,
        title: `KYC ${String(k.id).slice(0, 8)}`,
        preview: `Status: ${k.status}`,
        age: new Date(k.submitted_at).toLocaleString(),
        unread: k.status === 'pending',
        avatarUrl: `https://picsum.photos/seed/kyc-${k.id}/64`,
      })),
      ...(requestsRes.data ?? []).map((r: { id: string; status: string; created_at: string }) => ({
        id: `request-${r.id}`,
        title: `Care request ${String(r.id).slice(0, 8)}`,
        preview: `Status: ${r.status}`,
        age: new Date(r.created_at).toLocaleString(),
        unread: r.status === 'open' || r.status === 'matched',
        avatarUrl: `https://picsum.photos/seed/request-${r.id}/64`,
      })),
    ]
      .sort((a, b) => new Date(b.age).getTime() - new Date(a.age).getTime())
      .slice(0, 12);

    return NextResponse.json({ notifications });
  } catch (e) {
    console.error('[api/admin/notifications] GET', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

