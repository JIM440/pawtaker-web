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
      .select('id, pet_id, owner_id, taker_id, care_type, status, start_date, end_date, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[api/admin/requests] GET', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const careRows = (data ?? []) as Array<Record<string, unknown>>;

    const petIds = Array.from(
      new Set(
        careRows
          .map((r) => (typeof r.pet_id === 'string' ? r.pet_id : null))
          .filter((v): v is string => Boolean(v))
      )
    );
    const ownerIds = Array.from(
      new Set(
        careRows
          .map((r) => (typeof r.owner_id === 'string' ? r.owner_id : null))
          .filter((v): v is string => Boolean(v))
      )
    );
    const takerIds = Array.from(
      new Set(
        careRows
          .map((r) => (typeof r.taker_id === 'string' ? r.taker_id : null))
          .filter((v): v is string => Boolean(v))
      )
    );

    const petsClient = admin as unknown as {
      from: (table: string) => {
        select: (query: string) => {
          in: (
            column: string,
            values: string[]
          ) => Promise<{
            data: Array<Record<string, unknown>> | null;
            error: { message: string } | null;
          }>;
        };
      };
    };

    const { data: petsData } =
      petIds.length > 0
        ? await petsClient
            .from('pets')
            .select('id,name,breed,photo_urls,species,age_range,owner_id')
            .in('id', petIds)
        : { data: [] };

    const pets = (petsData ?? []) as Array<Record<string, unknown>>;
    const petById = new Map(pets.map((p) => [String(p.id), p] as const));

    const { data: ownersData } =
      ownerIds.length > 0
        ? await admin
            .from('users')
            .select('id, full_name, display_name, email, avatar_url')
            .in('id', ownerIds)
        : { data: [] };

    const { data: takersData } =
      takerIds.length > 0
        ? await admin
            .from('users')
            .select('id, full_name, display_name, email, avatar_url')
            .in('id', takerIds)
        : { data: [] };

    const userById = new Map(
      [...(ownersData ?? []), ...(takersData ?? [])].map((u) => [u.id, u] as const)
    );

    const requests = careRows.map((r) => {
      const id = String(r.id);
      const petId = typeof r.pet_id === 'string' ? r.pet_id : '';
      const ownerId = typeof r.owner_id === 'string' ? r.owner_id : '';
      const takerId = typeof r.taker_id === 'string' ? r.taker_id : null;

      const pet = petById.get(petId);
      const owner = userById.get(ownerId);
      const taker = takerId ? userById.get(takerId) : undefined;

      const photoUrls = pet && Array.isArray(pet.photo_urls) ? (pet.photo_urls as unknown[]) : [];
      const firstPhotoUrl = photoUrls.find((v) => typeof v === 'string') as string | undefined;

      const startDate =
        typeof r.start_date === 'string' ? r.start_date : (String(r.start_date ?? '') as string);
      const endDate =
        typeof r.end_date === 'string' ? r.end_date : (String(r.end_date ?? '') as string);

      return {
        id,
        petName: (pet?.name as string) ?? 'Unknown Pet',
        petBreed: (pet?.breed as string) ?? '-',
        petImage: firstPhotoUrl ?? '/logos/primary-logo.png',
        ownerName: owner?.full_name ?? owner?.display_name ?? owner?.email ?? 'Unknown',
        ownerImage: owner?.avatar_url ?? '',
        ownerEmail: owner?.email ?? '-',
        careGivenByName: taker?.full_name ?? taker?.display_name ?? taker?.email ?? 'Unassigned',
        careGivenByImage: taker?.avatar_url ?? '',
        careGivenByEmail: taker?.email ?? '-',
        careType: mapCareType(String(r.care_type ?? '')),
        serviceDates: formatServiceDates(startDate, endDate),
        status: mapStatus(String(r.status ?? '')),
      };
    });

    return NextResponse.json({ requests });
  } catch (e) {
    console.error('[api/admin/requests] GET', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

