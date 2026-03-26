export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          display_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          city: string | null;
          latitude: number | null;
          longitude: number | null;
          auth_type: 'email' | 'google' | 'apple' | null;
          has_had_pet: boolean;
          is_verified: boolean;
          is_admin: boolean;
          is_email_verified: boolean;
          is_deactivated: boolean;
          kyc_status: 'not_submitted' | 'pending' | 'submitted' | 'approved' | 'rejected';
          points_balance: number;
          points_alltime_high: number;
          care_given_count: number;
          care_received_count: number;
          language: 'en' | 'fr';
          theme_pref: 'system' | 'light' | 'dark';
          push_subscription: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          city?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          auth_type?: 'email' | 'google' | 'apple' | null;
          has_had_pet?: boolean;
          is_verified?: boolean;
          is_admin?: boolean;
          is_email_verified?: boolean;
          is_deactivated?: boolean;
          kyc_status?: 'not_submitted' | 'pending' | 'submitted' | 'approved' | 'rejected';
          points_balance?: number;
          points_alltime_high?: number;
          care_given_count?: number;
          care_received_count?: number;
          language?: 'en' | 'fr';
          theme_pref?: 'system' | 'light' | 'dark';
          push_subscription?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          city?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          auth_type?: 'email' | 'google' | 'apple' | null;
          has_had_pet?: boolean;
          is_verified?: boolean;
          is_admin?: boolean;
          is_email_verified?: boolean;
          is_deactivated?: boolean;
          kyc_status?: 'not_submitted' | 'pending' | 'submitted' | 'approved' | 'rejected';
          points_balance?: number;
          points_alltime_high?: number;
          care_given_count?: number;
          care_received_count?: number;
          language?: 'en' | 'fr';
          theme_pref?: 'system' | 'light' | 'dark';
          push_subscription?: Json | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      admin_push_subscriptions: {
        Row: {
          id: string;
          user_id: string;
          subscription: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          subscription: Json;
          created_at?: string;
        };
        Update: {
          subscription?: Json;
        };
        Relationships: [
          {
            foreignKeyName: 'admin_push_subscriptions_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      admin_notifications: {
        Row: {
          id: string;
          type: string;
          title: string;
          message: string;
          triggered_by: string | null;
          reference_id: string | null;
          reference_type: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          type: string;
          title: string;
          message: string;
          triggered_by?: string | null;
          reference_id?: string | null;
          reference_type?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          is_read?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: 'admin_notifications_triggered_by_fkey';
            columns: ['triggered_by'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
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
