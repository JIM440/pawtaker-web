import { NextRequest, NextResponse } from 'next/server';
import { requireAdminClient } from '@/lib/api/admin/auth';
import { updateKycSubmissionStatusForAdmin } from '@/lib/api/admin/kyc';

interface PatchBody {
  status?: 'approved' | 'rejected';
  reviewer_notes?: string;
}

/**
 * PATCH /api/admin/kyc-submissions/:id
 * Body:
 * - { status: 'approved' }
 * - { status: 'rejected', reviewer_notes: 'reason' }
 */
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const result = await requireAdminClient();
    if (result instanceof NextResponse) return result;
    const { admin } = result;

    const { id } = await context.params;
    const body = (await request.json()) as PatchBody;

    if (!id) {
      return NextResponse.json({ error: 'Submission id is required.' }, { status: 400 });
    }

    if (body.status !== 'approved' && body.status !== 'rejected') {
      return NextResponse.json(
        { error: "Invalid status. Use 'approved' or 'rejected'." },
        { status: 400 }
      );
    }

    if (body.status === 'rejected' && !body.reviewer_notes?.trim()) {
      return NextResponse.json(
        { error: 'Rejection reason is required when rejecting KYC.' },
        { status: 400 }
      );
    }

    const { data, error } = await updateKycSubmissionStatusForAdmin(
      admin,
      id,
      body.status,
      body.reviewer_notes
    );

    if (error) {
      console.error('[api/admin/kyc-submissions/:id] PATCH', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ submission: data });
  } catch (e) {
    console.error('[api/admin/kyc-submissions/:id] PATCH', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

