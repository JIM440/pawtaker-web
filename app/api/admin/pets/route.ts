import { NextResponse } from 'next/server';
import { requireAdminClient } from '@/lib/api/admin/auth';

export async function GET() {
  try {
    const result = await requireAdminClient();
    if (result instanceof NextResponse) return result;
    const { admin } = result;

    const petsClient = admin as unknown as {
      from: (table: string) => {
        select: (query: string) => {
          order: (column: string, opts: { ascending: boolean }) => Promise<{
            data: Array<Record<string, unknown>> | null;
            error: { message: string } | null;
          }>;
        };
      };
    };

    const { data, error } = await petsClient
      .from('pets')
      .select(
        'id,owner_id,name,species,breed,age_range,age_years,photo_urls,has_special_needs,special_needs_description,yard_type,energy_level,created_at'
      )
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[api/admin/pets] GET fallback to empty:', error.message);
      return NextResponse.json({ pets: [] });
    }

    const petsRows = (data ?? []) as Array<Record<string, unknown>>;

    const petIds = petsRows
      .map((r) => (typeof r.id === 'string' ? r.id : null))
      .filter((v): v is string => Boolean(v));
    const ownerIds = petsRows
      .map((r) => (typeof r.owner_id === 'string' ? r.owner_id : null))
      .filter((v): v is string => Boolean(v));

    const { data: ownersData } =
      ownerIds.length > 0
        ? await admin
            .from('users')
            .select('id, full_name, display_name, email, avatar_url')
            .in('id', ownerIds)
        : { data: [] };

    const ownerById = new Map(
      (ownersData ?? []).map((u) => [u.id, u] as const)
    );

    const { data: careRows } =
      petIds.length > 0
        ? await admin.from('care_requests').select('pet_id').in('pet_id', petIds)
        : { data: [] };

    const careCountByPetId = new Map<string, number>();
    for (const row of (careRows ?? []) as Array<{ pet_id: string }>) {
      const pid = row.pet_id;
      careCountByPetId.set(pid, (careCountByPetId.get(pid) ?? 0) + 1);
    }

    const pets = petsRows.map((r) => {
      const id = String(r.id);
      const owner = typeof r.owner_id === 'string' ? ownerById.get(r.owner_id) : undefined;

      const photoUrls = Array.isArray(r.photo_urls) ? (r.photo_urls as unknown[]) : [];
      const firstPhotoUrl = photoUrls.find((v) => typeof v === 'string') as string | undefined;

      const ageRange = typeof r.age_range === 'string' ? r.age_range : '';
      const ageYears =
        typeof r.age_years === 'number'
          ? String(r.age_years)
          : typeof r.age_years === 'string'
            ? r.age_years
            : '';

      // Component expects `dob`; we supply `age_range` (or age_years) as a string.
      const dob = ageRange || ageYears;

      const species = typeof r.species === 'string' && r.species ? r.species : 'Other';

      return {
        id,
        name: typeof r.name === 'string' && r.name ? r.name : 'Unnamed',
        image: firstPhotoUrl ?? '/logos/primary-logo.png',
        species,
        breed: typeof r.breed === 'string' && r.breed ? r.breed : '-',
        ownerName:
          owner ? (owner.full_name ?? owner.display_name ?? owner.email ?? 'Unknown') : 'Unknown',
        ownerImage: owner?.avatar_url ?? '',
        ownerEmail: owner?.email ?? '',
        dob,
        tags: [],
        careRequests: careCountByPetId.get(id) ?? 0,
      };
    });

    return NextResponse.json({ pets });
  } catch (e) {
    console.error('[api/admin/pets] GET', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

