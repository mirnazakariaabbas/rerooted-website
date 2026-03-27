export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      active_sessions: {
        Row: {
          id: string
          ip_address: string | null
          is_active: boolean
          last_active_at: string
          started_at: string
          user_agent: string | null
          user_email: string | null
          user_id: string
          user_name: string | null
          user_role: string | null
        }
        Insert: {
          id?: string
          ip_address?: string | null
          is_active?: boolean
          last_active_at?: string
          started_at?: string
          user_agent?: string | null
          user_email?: string | null
          user_id: string
          user_name?: string | null
          user_role?: string | null
        }
        Update: {
          id?: string
          ip_address?: string | null
          is_active?: boolean
          last_active_at?: string
          started_at?: string
          user_agent?: string | null
          user_email?: string | null
          user_id?: string
          user_name?: string | null
          user_role?: string | null
        }
        Relationships: []
      }
      admin_access_requests: {
        Row: {
          created_at: string
          id: string
          requested_role: string
          review_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          user_email: string | null
          user_id: string
          user_name: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          requested_role?: string
          review_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          user_email?: string | null
          user_id: string
          user_name?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          requested_role?: string
          review_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          user_email?: string | null
          user_id?: string
          user_name?: string | null
        }
        Relationships: []
      }
      assessments: {
        Row: {
          answers: Json | null
          completed_at: string | null
          created_at: string
          id: string
          score: number | null
          user_id: string
        }
        Insert: {
          answers?: Json | null
          completed_at?: string | null
          created_at?: string
          id?: string
          score?: number | null
          user_id: string
        }
        Update: {
          answers?: Json | null
          completed_at?: string | null
          created_at?: string
          id?: string
          score?: number | null
          user_id?: string
        }
        Relationships: []
      }
      audit_log: {
        Row: {
          action_type: string
          created_at: string
          id: string
          ip_address: string | null
          new_value: Json | null
          old_value: Json | null
          record_id: string | null
          record_name: string | null
          record_type: string | null
          section: string | null
          user_id: string | null
          user_name: string | null
          user_role: string | null
        }
        Insert: {
          action_type: string
          created_at?: string
          id?: string
          ip_address?: string | null
          new_value?: Json | null
          old_value?: Json | null
          record_id?: string | null
          record_name?: string | null
          record_type?: string | null
          section?: string | null
          user_id?: string | null
          user_name?: string | null
          user_role?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          new_value?: Json | null
          old_value?: Json | null
          record_id?: string | null
          record_name?: string | null
          record_type?: string | null
          section?: string | null
          user_id?: string | null
          user_name?: string | null
          user_role?: string | null
        }
        Relationships: []
      }
      coach_assignments: {
        Row: {
          assigned_at: string
          coach_id: string
          id: string
          user_id: string
        }
        Insert: {
          assigned_at?: string
          coach_id: string
          id?: string
          user_id: string
        }
        Update: {
          assigned_at?: string
          coach_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coach_assignments_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coaches"
            referencedColumns: ["id"]
          },
        ]
      }
      coach_availability: {
        Row: {
          coach_id: string
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          start_time: string
        }
        Insert: {
          coach_id: string
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          start_time: string
        }
        Update: {
          coach_id?: string
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "coach_availability_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coaches"
            referencedColumns: ["id"]
          },
        ]
      }
      coaches: {
        Row: {
          bio: string | null
          certification_level: string
          created_at: string
          email: string | null
          id: string
          name: string
          photo_url: string | null
          specialties: Json | null
          user_id: string | null
        }
        Insert: {
          bio?: string | null
          certification_level?: string
          created_at?: string
          email?: string | null
          id?: string
          name: string
          photo_url?: string | null
          specialties?: Json | null
          user_id?: string | null
        }
        Update: {
          bio?: string | null
          certification_level?: string
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          photo_url?: string | null
          specialties?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      competitors: {
        Row: {
          analysis: Json | null
          created_at: string
          id: string
          last_analyzed_at: string | null
          logo_url: string | null
          name: string
          website: string | null
        }
        Insert: {
          analysis?: Json | null
          created_at?: string
          id?: string
          last_analyzed_at?: string | null
          logo_url?: string | null
          name: string
          website?: string | null
        }
        Update: {
          analysis?: Json | null
          created_at?: string
          id?: string
          last_analyzed_at?: string | null
          logo_url?: string | null
          name?: string
          website?: string | null
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          audience_type: string | null
          created_at: string
          email: string
          id: string
          message: string
          name: string
          replied_at: string | null
          status: string
          subject: string | null
        }
        Insert: {
          audience_type?: string | null
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          replied_at?: string | null
          status?: string
          subject?: string | null
        }
        Update: {
          audience_type?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          replied_at?: string | null
          status?: string
          subject?: string | null
        }
        Relationships: []
      }
      contacts: {
        Row: {
          country: string | null
          created_at: string
          created_by: string | null
          email: string | null
          first_name: string
          gdpr_consent: boolean | null
          gdpr_consent_date: string | null
          id: string
          job_title: string | null
          journey_stage: string | null
          language: string | null
          last_name: string
          notes: Json | null
          organization_id: string | null
          phone: string | null
          source: Database["public"]["Enums"]["contact_source"]
          tags: Json | null
        }
        Insert: {
          country?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          first_name: string
          gdpr_consent?: boolean | null
          gdpr_consent_date?: string | null
          id?: string
          job_title?: string | null
          journey_stage?: string | null
          language?: string | null
          last_name?: string
          notes?: Json | null
          organization_id?: string | null
          phone?: string | null
          source?: Database["public"]["Enums"]["contact_source"]
          tags?: Json | null
        }
        Update: {
          country?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          first_name?: string
          gdpr_consent?: boolean | null
          gdpr_consent_date?: string | null
          id?: string
          job_title?: string | null
          journey_stage?: string | null
          language?: string | null
          last_name?: string
          notes?: Json | null
          organization_id?: string | null
          phone?: string | null
          source?: Database["public"]["Enums"]["contact_source"]
          tags?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      invitations: {
        Row: {
          created_at: string
          email: string
          id: string
          invited_by: string | null
          status: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          invited_by?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          invited_by?: string | null
          status?: string
        }
        Relationships: []
      }
      ip_allowlist: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          ip_address: string
          is_active: boolean
          label: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          ip_address: string
          is_active?: boolean
          label?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          ip_address?: string
          is_active?: boolean
          label?: string | null
        }
        Relationships: []
      }
      linkedin_contacts: {
        Row: {
          company: string | null
          connected_on: string | null
          converted_to_contact_id: string | null
          email: string | null
          first_name: string
          id: string
          imported_at: string
          imported_by: string | null
          last_name: string | null
          linkedin_url: string | null
          position: string | null
          tags: Json | null
        }
        Insert: {
          company?: string | null
          connected_on?: string | null
          converted_to_contact_id?: string | null
          email?: string | null
          first_name: string
          id?: string
          imported_at?: string
          imported_by?: string | null
          last_name?: string | null
          linkedin_url?: string | null
          position?: string | null
          tags?: Json | null
        }
        Update: {
          company?: string | null
          connected_on?: string | null
          converted_to_contact_id?: string | null
          email?: string | null
          first_name?: string
          id?: string
          imported_at?: string
          imported_by?: string | null
          last_name?: string | null
          linkedin_url?: string | null
          position?: string | null
          tags?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "linkedin_contacts_converted_to_contact_id_fkey"
            columns: ["converted_to_contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      meeting_bookings: {
        Row: {
          coach_id: string
          created_at: string
          duration_minutes: number
          id: string
          scheduled_at: string
          status: string
          user_id: string
        }
        Insert: {
          coach_id: string
          created_at?: string
          duration_minutes?: number
          id?: string
          scheduled_at: string
          status?: string
          user_id: string
        }
        Update: {
          coach_id?: string
          created_at?: string
          duration_minutes?: number
          id?: string
          scheduled_at?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meeting_bookings_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coaches"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletters: {
        Row: {
          body_html: string
          click_count: number | null
          created_at: string
          created_by: string | null
          from_name: string | null
          id: string
          open_count: number | null
          recipient_count: number | null
          recipient_segment: string | null
          reply_to: string | null
          scheduled_at: string | null
          sent_at: string | null
          status: string
          subject: string
          unsubscribe_count: number | null
          updated_at: string
        }
        Insert: {
          body_html?: string
          click_count?: number | null
          created_at?: string
          created_by?: string | null
          from_name?: string | null
          id?: string
          open_count?: number | null
          recipient_count?: number | null
          recipient_segment?: string | null
          reply_to?: string | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string
          subject: string
          unsubscribe_count?: number | null
          updated_at?: string
        }
        Update: {
          body_html?: string
          click_count?: number | null
          created_at?: string
          created_by?: string | null
          from_name?: string | null
          id?: string
          open_count?: number | null
          recipient_count?: number | null
          recipient_segment?: string | null
          reply_to?: string | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string
          subject?: string
          unsubscribe_count?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          link: string | null
          message: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message?: string | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      organizations: {
        Row: {
          country: string | null
          created_at: string
          id: string
          industry: string | null
          name: string
          notes: string | null
          primary_contact_id: string | null
          status: string
          website: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string
          id?: string
          industry?: string | null
          name: string
          notes?: string | null
          primary_contact_id?: string | null
          status?: string
          website?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string
          id?: string
          industry?: string | null
          name?: string
          notes?: string | null
          primary_contact_id?: string | null
          status?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organizations_primary_contact_id_fkey"
            columns: ["primary_contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          approval_status: Database["public"]["Enums"]["approval_status"]
          arrival_date: string | null
          country_from: string | null
          country_to: string | null
          created_at: string
          family_setup: string | null
          full_name: string | null
          has_children: boolean | null
          id: string
          notify_checkins: boolean | null
          notify_reflections: boolean | null
          onboarding_complete: boolean | null
          primary_language: string | null
          stage: string | null
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Insert: {
          approval_status?: Database["public"]["Enums"]["approval_status"]
          arrival_date?: string | null
          country_from?: string | null
          country_to?: string | null
          created_at?: string
          family_setup?: string | null
          full_name?: string | null
          has_children?: boolean | null
          id: string
          notify_checkins?: boolean | null
          notify_reflections?: boolean | null
          onboarding_complete?: boolean | null
          primary_language?: string | null
          stage?: string | null
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Update: {
          approval_status?: Database["public"]["Enums"]["approval_status"]
          arrival_date?: string | null
          country_from?: string | null
          country_to?: string | null
          created_at?: string
          family_setup?: string | null
          full_name?: string | null
          has_children?: boolean | null
          id?: string
          notify_checkins?: boolean | null
          notify_reflections?: boolean | null
          onboarding_complete?: boolean | null
          primary_language?: string | null
          stage?: string | null
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Relationships: []
      }
      reflections: {
        Row: {
          created_at: string
          id: string
          prompt: string
          response: string | null
          shared_with_coach: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          prompt: string
          response?: string | null
          shared_with_coach?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          prompt?: string
          response?: string | null
          shared_with_coach?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      role_version_history: {
        Row: {
          changed_by: string | null
          changed_by_name: string | null
          created_at: string
          id: string
          new_role: string
          old_role: string | null
          reason: string | null
          user_email: string | null
          user_id: string
          user_name: string | null
        }
        Insert: {
          changed_by?: string | null
          changed_by_name?: string | null
          created_at?: string
          id?: string
          new_role: string
          old_role?: string | null
          reason?: string | null
          user_email?: string | null
          user_id: string
          user_name?: string | null
        }
        Update: {
          changed_by?: string | null
          changed_by_name?: string | null
          created_at?: string
          id?: string
          new_role?: string
          old_role?: string | null
          reason?: string | null
          user_email?: string | null
          user_id?: string
          user_name?: string | null
        }
        Relationships: []
      }
      rss_mentions: {
        Row: {
          article_title: string
          article_url: string
          discovered_at: string
          id: string
          is_read: boolean
          published_at: string | null
          snippet: string | null
          source_name: string
          source_url: string
        }
        Insert: {
          article_title: string
          article_url: string
          discovered_at?: string
          id?: string
          is_read?: boolean
          published_at?: string | null
          snippet?: string | null
          source_name: string
          source_url: string
        }
        Update: {
          article_title?: string
          article_url?: string
          discovered_at?: string
          id?: string
          is_read?: boolean
          published_at?: string | null
          snippet?: string | null
          source_name?: string
          source_url?: string
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          email: string
          first_name: string | null
          id: string
          is_active: boolean
          last_name: string | null
          source: string | null
          subscribed_at: string
          tags: Json | null
          unsubscribed_at: string | null
        }
        Insert: {
          email: string
          first_name?: string | null
          id?: string
          is_active?: boolean
          last_name?: string | null
          source?: string | null
          subscribed_at?: string
          tags?: Json | null
          unsubscribed_at?: string | null
        }
        Update: {
          email?: string
          first_name?: string | null
          id?: string
          is_active?: boolean
          last_name?: string | null
          source?: string | null
          subscribed_at?: string
          tags?: Json | null
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user" | "coach"
      approval_status: "pending" | "approved" | "rejected"
      contact_source:
        | "contact_form"
        | "csv_import"
        | "linkedin_import"
        | "manual_entry"
        | "referral"
        | "event"
      user_type: "individual" | "organization"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user", "coach"],
      approval_status: ["pending", "approved", "rejected"],
      contact_source: [
        "contact_form",
        "csv_import",
        "linkedin_import",
        "manual_entry",
        "referral",
        "event",
      ],
      user_type: ["individual", "organization"],
    },
  },
} as const
