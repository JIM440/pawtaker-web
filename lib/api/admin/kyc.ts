import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/types';

type KycRow = Database['public']['Tables']['kyc_submissions']['Row'];
type KycStatus = KycRow['status'];
type UserKycStatus = Database['public']['Tables']['users']['Update']['kyc_status'];

export interface AdminKycSubmissionDto {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userImage: string | null;
  userInitials: string;
  submittedAt: string;
  documentType: 'Passport' | "Driver's License" | 'National ID';
  status: 'Pending' | 'Approved' | 'Rejected';
  rejectionReason?: string;
  images: string[];
}

function toUserInitials(name: string, email: string) {
  const src = name.trim() || email;
  const parts = src.split(' ').filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
}

function documentLabel(v: KycRow['document_type']): AdminKycSubmissionDto['documentType'] {
  if (v === 'passport') return 'Passport';
  if (v === 'drivers_license') return "Driver's License";
  return 'National ID';
}

function uiStatus(v: KycStatus): AdminKycSubmissionDto['status'] {
  if (v === 'approved') return 'Approved';
  if (v === 'rejected') return 'Rejected';
  return 'Pending';
}

function userStatusFromKyc(v: KycStatus): UserKycStatus {
  if (v === 'approved') return 'approved';
  if (v === 'rejected') return 'rejected';
  return 'pending';
}

function imageList(row: KycRow) {
  return [row.front_url, row.back_url, row.selfie_url].filter(Boolean) as string[];
}

export async function listKycSubmissionsForAdmin(supabase: SupabaseClient<Database>) {
  const { data: submissions, error } = await supabase
    .from('kyc_submissions')
    .select('*')
    .order('submitted_at', { ascending: false });

  if (error) return { data: null, error };
  const rows = submissions ?? [];
  const userIds = [...new Set(rows.map((r) => r.user_id))];

  if (!userIds.length) return { data: [] as AdminKycSubmissionDto[], error: null };

  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('id,email,full_name,display_name,avatar_url')
    .in('id', userIds);

  if (usersError) return { data: null, error: usersError };

  const usersById = new Map((users ?? []).map((u) => [u.id, u]));

  const mapped: AdminKycSubmissionDto[] = rows.map((row) => {
    const u = usersById.get(row.user_id);
    const email = u?.email ?? 'unknown@pawtaker.com';
    const name = u?.display_name || u?.full_name || email;
    return {
      id: row.id,
      userId: row.user_id,
      userName: name,
      userEmail: email,
      userImage: u?.avatar_url ?? null,
      userInitials: toUserInitials(name, email),
      submittedAt: row.submitted_at,
      documentType: documentLabel(row.document_type),
      status: uiStatus(row.status),
      rejectionReason: row.reviewer_notes ?? undefined,
      images: imageList(row),
    };
  });

  return { data: mapped, error: null };
}

export async function updateKycSubmissionStatusForAdmin(
  supabase: SupabaseClient<Database>,
  submissionId: string,
  nextStatus: Extract<KycStatus, 'approved' | 'rejected'>,
  rejectionReason?: string
) {
  const updatePayload: Database['public']['Tables']['kyc_submissions']['Update'] = {
    status: nextStatus,
    reviewer_notes: nextStatus === 'rejected' ? rejectionReason?.trim() ?? null : null,
    reviewed_at: new Date().toISOString(),
  };

  const { data: updatedSubmission, error: updateError } = await supabase
    .from('kyc_submissions')
    .update(updatePayload)
    .eq('id', submissionId)
    .select('*')
    .single();

  if (updateError || !updatedSubmission) return { data: null, error: updateError };

  const { error: userUpdateError } = await supabase
    .from('users')
    .update({ kyc_status: userStatusFromKyc(nextStatus) })
    .eq('id', updatedSubmission.user_id);

  if (userUpdateError) return { data: null, error: userUpdateError };

  return { data: updatedSubmission, error: null };
}

