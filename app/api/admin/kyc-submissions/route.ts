import { NextResponse } from 'next/server';
import { requireAdminClient } from '@/lib/api/admin/auth';
import { listKycSubmissionsForAdmin } from '@/lib/api/admin/kyc';

/**
 * GET /api/admin/kyc-submissions
 * Lists all KYC submissions for admin review.
 */
export async function GET() {
  try {
    const result = await requireAdminClient();
    if (result instanceof NextResponse) return result;
    const { admin } = result;

    const { data, error } = await listKycSubmissionsForAdmin(admin);

    if (error) {
      console.error('[api/admin/kyc-submissions] GET', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('[KYC DEBUG] count:', data?.length ?? 0);
    return NextResponse.json({ submissions: data ?? [] });
  } catch (e) {
    console.error('[api/admin/kyc-submissions] GET', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

