// Auto-generated via Supabase MCP (generate_typescript_types). Do not hand-edit —
// regenerate after any migration instead.

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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      competitions: {
        Row: {
          created_at: string
          end_date: string | null
          id: number
          name: string
          season: number
          ssr_link: string | null
          start_date: string
          track_id: number | null
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          id: number
          name: string
          season: number
          ssr_link?: string | null
          start_date: string
          track_id?: number | null
        }
        Update: {
          created_at?: string
          end_date?: string | null
          id?: number
          name?: string
          season?: number
          ssr_link?: string | null
          start_date?: string
          track_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "competitions_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      races: {
        Row: {
          category: string | null
          competition_id: number
          distance: number
          gender: string
          id: number
          ssr_race_id: number | null
        }
        Insert: {
          category?: string | null
          competition_id: number
          distance: number
          gender: string
          id?: never
          ssr_race_id?: number | null
        }
        Update: {
          category?: string | null
          competition_id?: number
          distance?: number
          gender?: string
          id?: never
          ssr_race_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "races_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
        ]
      }
      records: {
        Row: {
          age: string
          competition_id: number | null
          country: string | null
          distance: number
          gender: string
          id: number
          race_date: string | null
          skater_id: number | null
          synced_at: string
          time_ms: number
          time_raw: string
          track_id: number | null
          type: string
        }
        Insert: {
          age?: string
          competition_id?: number | null
          country?: string | null
          distance: number
          gender: string
          id?: never
          race_date?: string | null
          skater_id?: number | null
          synced_at?: string
          time_ms: number
          time_raw: string
          track_id?: number | null
          type: string
        }
        Update: {
          age?: string
          competition_id?: number | null
          country?: string | null
          distance?: number
          gender?: string
          id?: never
          race_date?: string | null
          skater_id?: number | null
          synced_at?: string
          time_ms?: number
          time_raw?: string
          track_id?: number | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "records_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "records_skater_id_fkey"
            columns: ["skater_id"]
            isOneToOne: false
            referencedRelation: "skaters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "records_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      results: {
        Row: {
          competition_id: number | null
          created_at: string
          distance: number
          gender: string
          id: number
          is_pr: boolean
          is_sb: boolean
          race_date: string
          race_id: number | null
          season: number
          skater_id: number
          ssr_link: string | null
          time_ms: number
          time_raw: string
          track_id: number | null
        }
        Insert: {
          competition_id?: number | null
          created_at?: string
          distance: number
          gender: string
          id?: never
          is_pr?: boolean
          is_sb?: boolean
          race_date: string
          race_id?: number | null
          season: number
          skater_id: number
          ssr_link?: string | null
          time_ms: number
          time_raw: string
          track_id?: number | null
        }
        Update: {
          competition_id?: number | null
          created_at?: string
          distance?: number
          gender?: string
          id?: never
          is_pr?: boolean
          is_sb?: boolean
          race_date?: string
          race_id?: number | null
          season?: number
          skater_id?: number
          ssr_link?: string | null
          time_ms?: number
          time_raw?: string
          track_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "results_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "results_race_id_fkey"
            columns: ["race_id"]
            isOneToOne: false
            referencedRelation: "races"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "results_skater_id_fkey"
            columns: ["skater_id"]
            isOneToOne: false
            referencedRelation: "skaters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "results_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      skaters: {
        Row: {
          birthdate: string | null
          category: string | null
          country: string
          created_at: string
          family_name: string
          gender: string
          given_name: string
          id: number
          last_synced_at: string | null
          slug: string
        }
        Insert: {
          birthdate?: string | null
          category?: string | null
          country: string
          created_at?: string
          family_name: string
          gender: string
          given_name: string
          id: number
          last_synced_at?: string | null
          slug: string
        }
        Update: {
          birthdate?: string | null
          category?: string | null
          country?: string
          created_at?: string
          family_name?: string
          gender?: string
          given_name?: string
          id?: number
          last_synced_at?: string | null
          slug?: string
        }
        Relationships: []
      }
      sync_state: {
        Row: {
          cursor: Json | null
          job: string
          last_error: string | null
          last_run_at: string | null
          status: string
        }
        Insert: {
          cursor?: Json | null
          job: string
          last_error?: string | null
          last_run_at?: string | null
          status?: string
        }
        Update: {
          cursor?: Json | null
          job?: string
          last_error?: string | null
          last_run_at?: string | null
          status?: string
        }
        Relationships: []
      }
      tracks: {
        Row: {
          altitude_m: number | null
          city: string | null
          country: string
          created_at: string
          id: number
          indoor: boolean
          name: string
        }
        Insert: {
          altitude_m?: number | null
          city?: string | null
          country: string
          created_at?: string
          id: number
          indoor?: boolean
          name: string
        }
        Update: {
          altitude_m?: number | null
          city?: string | null
          country?: string
          created_at?: string
          id?: number
          indoor?: boolean
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      mv_adelskalender: {
        Row: {
          gender: string | null
          kind: string | null
          points: number | null
          skater_id: number | null
        }
        Relationships: [
          {
            foreignKeyName: "results_skater_id_fkey"
            columns: ["skater_id"]
            isOneToOne: false
            referencedRelation: "skaters"
            referencedColumns: ["id"]
          },
        ]
      }
      v_adelskalender: {
        Row: {
          gender: string | null
          kind: string | null
          points: number | null
          skater_id: number | null
        }
        Relationships: [
          {
            foreignKeyName: "results_skater_id_fkey"
            columns: ["skater_id"]
            isOneToOne: false
            referencedRelation: "skaters"
            referencedColumns: ["id"]
          },
        ]
      }
      v_personal_records: {
        Row: {
          competition_id: number | null
          distance: number | null
          gender: string | null
          race_date: string | null
          skater_id: number | null
          ssr_link: string | null
          time_ms: number | null
          time_raw: string | null
          track_id: number | null
        }
        Relationships: [
          {
            foreignKeyName: "results_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "results_skater_id_fkey"
            columns: ["skater_id"]
            isOneToOne: false
            referencedRelation: "skaters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "results_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      v_season_bests: {
        Row: {
          competition_id: number | null
          distance: number | null
          gender: string | null
          race_date: string | null
          season: number | null
          skater_id: number | null
          ssr_link: string | null
          time_ms: number | null
          time_raw: string | null
          track_id: number | null
        }
        Relationships: [
          {
            foreignKeyName: "results_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "results_skater_id_fkey"
            columns: ["skater_id"]
            isOneToOne: false
            referencedRelation: "skaters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "results_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
