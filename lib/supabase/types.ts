export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          city: string | null;
          points_balance: number;
          is_verified: boolean;
          kyc_status: 'pending' | 'submitted' | 'approved' | 'rejected';
          is_admin: boolean;
          language: 'en' | 'fr';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          city?: string | null;
          points_balance?: number;
          is_verified?: boolean;
          kyc_status?: 'pending' | 'submitted' | 'approved' | 'rejected';
          is_admin?: boolean;
          language?: 'en' | 'fr';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          city?: string | null;
          points_balance?: number;
          is_verified?: boolean;
          kyc_status?: 'pending' | 'submitted' | 'approved' | 'rejected';
          is_admin?: boolean;
          language?: 'en' | 'fr';
          updated_at?: string;
        };
        Relationships: [];
      };
      care_requests: {
        Row: {
          id: string;
          owner_id: string;
          pet_id: string;
          taker_id: string | null;
          care_type: 'sitting' | 'walking' | 'boarding';
          status: 'open' | 'matched' | 'active' | 'completed' | 'cancelled';
          start_date: string;
          end_date: string;
          points_offered: number;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          pet_id: string;
          taker_id?: string | null;
          care_type: 'sitting' | 'walking' | 'boarding';
          status?: 'open' | 'matched' | 'active' | 'completed' | 'cancelled';
          start_date: string;
          end_date: string;
          points_offered: number;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          owner_id?: string;
          pet_id?: string;
          taker_id?: string | null;
          care_type?: 'sitting' | 'walking' | 'boarding';
          status?: 'open' | 'matched' | 'active' | 'completed' | 'cancelled';
          start_date?: string;
          end_date?: string;
          points_offered?: number;
          description?: string | null;
        };
        Relationships: [];
      };
      kyc_submissions: {
        Row: {
          id: string;
          user_id: string;
          document_type: 'passport' | 'drivers_license' | 'national_id';
          front_url: string;
          back_url: string | null;
          selfie_url: string | null;
          status: 'pending' | 'approved' | 'rejected';
          reviewer_notes: string | null;
          submitted_at: string;
          reviewed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          document_type: 'passport' | 'drivers_license' | 'national_id';
          front_url: string;
          back_url?: string | null;
          selfie_url?: string | null;
          status?: 'pending' | 'approved' | 'rejected';
          reviewer_notes?: string | null;
          submitted_at?: string;
          reviewed_at?: string | null;
        };
        Update: {
          status?: 'pending' | 'approved' | 'rejected';
          reviewer_notes?: string | null;
          reviewed_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'kyc_submissions_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      reports: {
        Row: {
          id: string;
          reporter_id: string;
          reported_user_id: string;
          reason: string;
          details: string | null;
          status: 'open' | 'reviewed' | 'resolved';
          created_at: string;
        };
        Insert: {
          id?: string;
          reporter_id: string;
          reported_user_id: string;
          reason: string;
          details?: string | null;
          status?: 'open' | 'reviewed' | 'resolved';
          created_at?: string;
        };
        Update: {
          status?: 'open' | 'reviewed' | 'resolved';
          details?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
