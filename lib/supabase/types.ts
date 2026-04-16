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
          latitude: number | null;
          longitude: number | null;
          auth_type: string;
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
          language: string;
          theme_pref: string;
          created_at: string;
          updated_at: string;
          // Backward-compat for existing admin UI queries.
          display_name: string | null;
          push_subscription: Json | null;
        };
        Insert: {
          id?: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          city?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          auth_type?: string;
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
          language?: string;
          theme_pref?: string;
          created_at?: string;
          updated_at?: string;
          display_name?: string | null;
          push_subscription?: Json | null;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          city?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          auth_type?: string;
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
          language?: string;
          theme_pref?: string;
          updated_at?: string;
          display_name?: string | null;
          push_subscription?: Json | null;
        };
        Relationships: [];
      };
      pets: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          species: string;
          breed: string | null;
          yard_type: string | null;
          age_range: string | null;
          energy_level: string | null;
          has_special_needs: boolean;
          special_needs_description: string | null;
          age_years: number | null;
          weight_kg: number | null;
          photo_urls: string[] | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          species: string;
          breed?: string | null;
          yard_type?: string | null;
          age_range?: string | null;
          energy_level?: string | null;
          has_special_needs?: boolean;
          special_needs_description?: string | null;
          age_years?: number | null;
          weight_kg?: number | null;
          photo_urls?: string[] | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          owner_id?: string;
          name?: string;
          species?: string;
          breed?: string | null;
          yard_type?: string | null;
          age_range?: string | null;
          energy_level?: string | null;
          has_special_needs?: boolean;
          special_needs_description?: string | null;
          age_years?: number | null;
          weight_kg?: number | null;
          photo_urls?: string[] | null;
          notes?: string | null;
        };
        Relationships: [];
      };
      pet_likes: {
        Row: {
          user_id: string;
          pet_id: string;
          care_request_id: string | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          pet_id: string;
          care_request_id?: string | null;
          created_at?: string;
        };
        Update: {
          care_request_id?: string | null;
        };
        Relationships: [];
      };
      care_requests: {
        Row: {
          id: string;
          owner_id: string;
          pet_id: string;
          taker_id: string | null;
          care_type: string;
          status: string;
          start_date: string;
          end_date: string;
          start_time: string | null;
          end_time: string | null;
          points_offered: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          pet_id: string;
          taker_id?: string | null;
          care_type: string;
          status?: string;
          start_date: string;
          end_date: string;
          start_time?: string | null;
          end_time?: string | null;
          points_offered?: number;
          created_at?: string;
        };
        Update: {
          owner_id?: string;
          pet_id?: string;
          taker_id?: string | null;
          care_type?: string;
          status?: string;
          start_date?: string;
          end_date?: string;
          start_time?: string | null;
          end_time?: string | null;
          points_offered?: number;
        };
        Relationships: [];
      };
      contracts: {
        Row: {
          id: string;
          request_id: string;
          owner_id: string;
          taker_id: string;
          signed_owner: boolean;
          signed_taker: boolean;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          request_id: string;
          owner_id: string;
          taker_id: string;
          signed_owner?: boolean;
          signed_taker?: boolean;
          status?: string;
          created_at?: string;
        };
        Update: {
          request_id?: string;
          owner_id?: string;
          taker_id?: string;
          signed_owner?: boolean;
          signed_taker?: boolean;
          status?: string;
        };
        Relationships: [];
      };
      check_ins: {
        Row: {
          id: string;
          contract_id: string;
          taker_id: string;
          photo_urls: string[];
          note: string | null;
          checked_in_at: string;
        };
        Insert: {
          id?: string;
          contract_id: string;
          taker_id: string;
          photo_urls?: string[];
          note?: string | null;
          checked_in_at?: string;
        };
        Update: {
          photo_urls?: string[];
          note?: string | null;
          checked_in_at?: string;
        };
        Relationships: [];
      };
      reviews: {
        Row: {
          id: string;
          contract_id: string;
          reviewer_id: string;
          reviewee_id: string;
          rating: number;
          comment: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          contract_id: string;
          reviewer_id: string;
          reviewee_id: string;
          rating: number;
          comment?: string | null;
          created_at?: string;
        };
        Update: {
          rating?: number;
          comment?: string | null;
        };
        Relationships: [];
      };
      messages: {
        Row: {
          id: string;
          thread_id: string;
          sender_id: string;
          content: string;
          type: string;
          metadata: Json | null;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          thread_id: string;
          sender_id: string;
          content: string;
          type?: string;
          metadata?: Json | null;
          read_at?: string | null;
          created_at?: string;
        };
        Update: {
          content?: string;
          type?: string;
          metadata?: Json | null;
          read_at?: string | null;
        };
        Relationships: [];
      };
      threads: {
        Row: {
          id: string;
          participant_ids: string[];
          request_id: string | null;
          last_message_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          participant_ids: string[];
          request_id?: string | null;
          last_message_at?: string | null;
          created_at?: string;
        };
        Update: {
          participant_ids?: string[];
          request_id?: string | null;
          last_message_at?: string | null;
        };
        Relationships: [];
      };
      user_blocks: {
        Row: {
          blocker_id: string;
          blocked_id: string;
          created_at: string;
        };
        Insert: {
          blocker_id: string;
          blocked_id: string;
          created_at?: string;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
      taker_profiles: {
        Row: {
          id: string;
          user_id: string;
          accepted_species: string[];
          max_pets: number;
          availability_json: Json;
          hourly_points: number;
          experience_years: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          accepted_species?: string[];
          max_pets?: number;
          availability_json?: Json;
          hourly_points?: number;
          experience_years?: number;
          created_at?: string;
        };
        Update: {
          accepted_species?: string[];
          max_pets?: number;
          availability_json?: Json;
          hourly_points?: number;
          experience_years?: number;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          body: string;
          data: Json | null;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          title: string;
          body: string;
          data?: Json | null;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          type?: string;
          title?: string;
          body?: string;
          data?: Json | null;
          read?: boolean;
        };
        Relationships: [];
      };
      emergency_contacts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          phone: string;
          relationship: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          phone: string;
          relationship?: string | null;
          created_at?: string;
        };
        Update: {
          name?: string;
          phone?: string;
          relationship?: string | null;
        };
        Relationships: [];
      };
      kyc_submissions: {
        Row: {
          id: string;
          user_id: string;
          document_type: string;
          front_url: string;
          back_url: string | null;
          selfie_url: string | null;
          status: string;
          reviewer_notes: string | null;
          submitted_at: string | null;
          reviewed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          document_type: string;
          front_url: string;
          back_url?: string | null;
          selfie_url?: string | null;
          status?: string;
          reviewer_notes?: string | null;
          submitted_at?: string | null;
          reviewed_at?: string | null;
        };
        Update: {
          document_type?: string;
          front_url?: string;
          back_url?: string | null;
          selfie_url?: string | null;
          status?: string;
          reviewer_notes?: string | null;
          submitted_at?: string | null;
          reviewed_at?: string | null;
        };
        Relationships: [];
      };
      point_transactions: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          type: string;
          description: string;
          contract_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          type: string;
          description: string;
          contract_id?: string | null;
          created_at?: string;
        };
        Update: {
          amount?: number;
          type?: string;
          description?: string;
          contract_id?: string | null;
        };
        Relationships: [];
      };
      reports: {
        Row: {
          id: string;
          reporter_id: string;
          reported_user_id: string;
          reason: string;
          details: string | null;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          reporter_id: string;
          reported_user_id: string;
          reason: string;
          details?: string | null;
          status?: string;
          created_at?: string;
        };
        Update: {
          reason?: string;
          details?: string | null;
          status?: string;
        };
        Relationships: [];
      };
      push_tokens: {
        Row: {
          id: string;
          user_id: string;
          token: string;
          platform: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          token: string;
          platform: string;
          created_at?: string;
        };
        Update: {
          token?: string;
          platform?: string;
        };
        Relationships: [];
      };
      // Admin-web specific tables kept for current dashboard features.
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
