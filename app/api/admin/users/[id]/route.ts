import { NextRequest, NextResponse } from 'next/server';
import { requireAdminClient } from '@/lib/api/admin/auth';

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const result = await requireAdminClient();
    if (result instanceof NextResponse) return result;
    const { admin } = result;
    const { id } = await context.params;
    const body = (await request.json()) as { is_deactivated?: boolean };

    if (!id) return NextResponse.json({ error: 'User id is required.' }, { status: 400 });
    if (typeof body.is_deactivated !== 'boolean') {
      return NextResponse.json({ error: '`is_deactivated` must be a boolean.' }, { status: 400 });
    }

    const { error } = await admin.from('users').update({ is_deactivated: body.is_deactivated }).eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[api/admin/users/:id] PATCH', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const result = await requireAdminClient();
    if (result instanceof NextResponse) return result;
    const { admin } = result;
    const { id } = await context.params;

    if (!id) return NextResponse.json({ error: 'User id is required.' }, { status: 400 });

    type DynamicClient = {
      from: (table: string) => {
        select: (columns: string) => {
          eq: (column: string, value: string) => Promise<{ data: Array<Record<string, unknown>> | null; error: { message: string } | null }>;
          in: (column: string, values: string[]) => Promise<{ data: Array<Record<string, unknown>> | null; error: { message: string } | null }>;
          or: (filter: string) => Promise<{ data: Array<Record<string, unknown>> | null; error: { message: string } | null }>;
          contains: (column: string, values: string[]) => Promise<{ data: Array<Record<string, unknown>> | null; error: { message: string } | null }>;
        };
        delete: () => {
          eq: (column: string, value: string) => Promise<{ error: { message: string } | null }>;
          in: (column: string, values: string[]) => Promise<{ error: { message: string } | null }>;
          or: (filter: string) => Promise<{ error: { message: string } | null }>;
        };
      };
    };

    const client = admin as unknown as DynamicClient;

    const runDeleteEq = async (table: string, column: string, value: string) => {
      const { error } = await client.from(table).delete().eq(column, value);
      if (error) throw new Error(`${table}: ${error.message}`);
    };

    const runDeleteIn = async (table: string, column: string, values: string[]) => {
      if (values.length === 0) return;
      const { error } = await client.from(table).delete().in(column, values);
      if (error) throw new Error(`${table}: ${error.message}`);
    };

    // 1) Gather related IDs first
    const { data: petsData, error: petsError } = await client
      .from('pets')
      .select('id')
      .eq('owner_id', id);
    if (petsError) throw new Error(`pets(select): ${petsError.message}`);
    const petIds = (petsData ?? [])
      .map((r) => (typeof r.id === 'string' ? r.id : null))
      .filter((v): v is string => Boolean(v));

    const { data: careReqByUserData, error: careReqByUserError } = await client
      .from('care_requests')
      .select('id')
      .or(`owner_id.eq.${id},taker_id.eq.${id}`);
    if (careReqByUserError) throw new Error(`care_requests(select-user): ${careReqByUserError.message}`);

    const { data: careReqByPetData, error: careReqByPetError } =
      petIds.length > 0
        ? await client.from('care_requests').select('id').in('pet_id', petIds)
        : { data: [], error: null };
    if (careReqByPetError) throw new Error(`care_requests(select-pet): ${careReqByPetError.message}`);

    const careRequestIds = Array.from(
      new Set(
        [...(careReqByUserData ?? []), ...(careReqByPetData ?? [])]
          .map((r) => (typeof r.id === 'string' ? r.id : null))
          .filter((v): v is string => Boolean(v))
      )
    );

    const { data: contractsByUserData, error: contractsByUserError } = await client
      .from('contracts')
      .select('id')
      .or(`owner_id.eq.${id},taker_id.eq.${id}`);
    if (contractsByUserError) throw new Error(`contracts(select-user): ${contractsByUserError.message}`);

    const { data: contractsByReqData, error: contractsByReqError } =
      careRequestIds.length > 0
        ? await client.from('contracts').select('id').in('request_id', careRequestIds)
        : { data: [], error: null };
    if (contractsByReqError) throw new Error(`contracts(select-request): ${contractsByReqError.message}`);

    const contractIds = Array.from(
      new Set(
        [...(contractsByUserData ?? []), ...(contractsByReqData ?? [])]
          .map((r) => (typeof r.id === 'string' ? r.id : null))
          .filter((v): v is string => Boolean(v))
      )
    );

    const { data: threadsByUserData, error: threadsByUserError } = await client
      .from('threads')
      .select('id')
      .contains('participant_ids', [id]);
    if (threadsByUserError) throw new Error(`threads(select-user): ${threadsByUserError.message}`);

    const { data: threadsByRequestData, error: threadsByRequestError } =
      careRequestIds.length > 0
        ? await client.from('threads').select('id').in('request_id', careRequestIds)
        : { data: [], error: null };
    if (threadsByRequestError) throw new Error(`threads(select-request): ${threadsByRequestError.message}`);

    const threadIds = Array.from(
      new Set(
        [...(threadsByUserData ?? []), ...(threadsByRequestData ?? [])]
          .map((r) => (typeof r.id === 'string' ? r.id : null))
          .filter((v): v is string => Boolean(v))
      )
    );

    // 2) Delete children/dependents first
    await runDeleteEq('messages', 'sender_id', id);
    await runDeleteIn('messages', 'thread_id', threadIds);
    await runDeleteEq('emergency_contacts', 'user_id', id);
    await runDeleteEq('notifications', 'user_id', id);
    await runDeleteEq('admin_push_subscriptions', 'user_id', id);
    await runDeleteEq('push_tokens', 'user_id', id);
    await runDeleteEq('point_transactions', 'user_id', id);
    await runDeleteEq('my_blocked_users', 'blocked_id', id);
    await runDeleteEq('admin_notifications', 'triggered_by', id);
    await runDeleteEq('taker_profiles', 'user_id', id);
    await runDeleteEq('reviews', 'reviewer_id', id);
    await runDeleteEq('reviews', 'reviewee_id', id);
    await runDeleteEq('user_blocks', 'blocker_id', id);
    await runDeleteEq('user_blocks', 'blocked_id', id);

    await runDeleteEq('pet_likes', 'user_id', id);
    await runDeleteIn('pet_likes', 'pet_id', petIds);
    await runDeleteIn('pet_likes', 'care_request_id', careRequestIds);

    await runDeleteEq('check_ins', 'taker_id', id);
    await runDeleteIn('check_ins', 'contract_id', contractIds);

    await runDeleteEq('reports', 'reporter_id', id);
    await runDeleteEq('reports', 'reported_user_id', id);

    await runDeleteEq('kyc_submissions', 'user_id', id);
    await runDeleteIn('threads', 'id', threadIds);
    await runDeleteIn('point_transactions', 'contract_id', contractIds);
    await runDeleteIn('contracts', 'id', contractIds);
    await runDeleteIn('care_requests', 'id', careRequestIds);
    await runDeleteIn('pets', 'id', petIds);

    // 3) Delete app profile row
    const { error: userDeleteError } = await admin.from('users').delete().eq('id', id);
    if (userDeleteError) {
      return NextResponse.json({ error: userDeleteError.message }, { status: 500 });
    }

    // 4) Delete auth account
    const { error: authDeleteError } = await admin.auth.admin.deleteUser(id);
    if (authDeleteError) {
      return NextResponse.json(
        { error: `Auth delete failed: ${authDeleteError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[api/admin/users/:id] DELETE', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

