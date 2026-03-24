import { NextResponse } from 'next/server';
import { requireAdminClient } from '@/lib/api/admin/auth';

function formatServiceDates(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return `${startDate} - ${endDate}`;
  const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${fmt(start)} - ${fmt(end)}`;
}

function mapCareType(type: string): 'daytime' | 'play/walk' | 'vacation' | 'night' {
  if (type === 'walking') return 'play/walk';
  if (type === 'boarding') return 'vacation';
  return 'daytime';
}

function mapStatus(status: string): 'ongoing' | 'completed' | 'canceled' {
  if (status === 'completed') return 'completed';
  if (status === 'cancelled') return 'canceled';
  return 'ongoing';
}

export async function GET() {
  try {
    const result = await requireAdminClient();
    if (result instanceof NextResponse) return result;
    const { admin } = result;

    const { data, error } = await admin
      .from('care_requests')
      .select('id, pet_id, owner_id, taker_id, care_type, status, start_date, end_date, owner:users!care_requests_owner_id_fkey(full_name, display_name, email, avatar_url), taker:users!care_requests_taker_id_fkey(full_name, display_name, email, avatar_url)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[api/admin/requests] GET', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const requests = (data ?? []).map((row) => {
      const requestRow = row as {
        id: string;
        pet_id: string;
        care_type: string;
        status: string;
        start_date: string;
        end_date: string;
        owner?: { full_name?: string | null; display_name?: string | null; email?: string | null; avatar_url?: string | null } | null;
        taker?: { full_name?: string | null; display_name?: string | null; email?: string | null; avatar_url?: string | null } | null;
      };
      return {
      id: requestRow.id,
      petName: requestRow.pet_id ? `Pet ${String(requestRow.pet_id).slice(0, 6)}` : 'Unknown Pet',
      petBreed: '-',
      petImage: `https://picsum.photos/seed/${requestRow.id}/160`,
      ownerName: requestRow.owner?.full_name || requestRow.owner?.display_name || requestRow.owner?.email || 'Unknown',
      ownerImage: requestRow.owner?.avatar_url ?? null,
      ownerEmail: requestRow.owner?.email ?? '-',
      careGivenByName: requestRow.taker?.full_name || requestRow.taker?.display_name || requestRow.taker?.email || 'Unassigned',
      careGivenByImage: requestRow.taker?.avatar_url ?? null,
      careGivenByEmail: requestRow.taker?.email ?? '-',
      careType: mapCareType(requestRow.care_type),
      serviceDates: formatServiceDates(requestRow.start_date, requestRow.end_date),
      status: mapStatus(requestRow.status),
    };
    });

    return NextResponse.json({ requests });
  } catch (e) {
    console.error('[api/admin/requests] GET', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

