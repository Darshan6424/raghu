export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      damage_report_comments: {
        Row: {
          content: string
          created_at: string
          damage_report_id: string | null
          id: string
          image_url: string | null
          likes: number | null
          user_id: string | null
          user_likes: string[] | null
        }
        Insert: {
          content: string
          created_at?: string
          damage_report_id?: string | null
          id?: string
          image_url?: string | null
          likes?: number | null
          user_id?: string | null
          user_likes?: string[] | null
        }
        Update: {
          content?: string
          created_at?: string
          damage_report_id?: string | null
          id?: string
          image_url?: string | null
          likes?: number | null
          user_id?: string | null
          user_likes?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "damage_report_comments_damage_report_id_fkey"
            columns: ["damage_report_id"]
            isOneToOne: false
            referencedRelation: "damage_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      damage_reports: {
        Row: {
          created_at: string
          description: string
          id: string
          image_url: string | null
          location: string
          verified: boolean | null
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          image_url?: string | null
          location: string
          verified?: boolean | null
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          location?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      expert_consultations: {
        Row: {
          answer: string | null
          contact_info: string
          created_at: string
          id: string
          question: string
          status: string | null
        }
        Insert: {
          answer?: string | null
          contact_info: string
          created_at?: string
          id?: string
          question: string
          status?: string | null
        }
        Update: {
          answer?: string | null
          contact_info?: string
          created_at?: string
          id?: string
          question?: string
          status?: string | null
        }
        Relationships: []
      }
      missing_person_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          image_url: string | null
          likes: number | null
          missing_person_id: string | null
          user_id: string | null
          user_likes: string[] | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          likes?: number | null
          missing_person_id?: string | null
          user_id?: string | null
          user_likes?: string[] | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          likes?: number | null
          missing_person_id?: string | null
          user_id?: string | null
          user_likes?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "missing_person_comments_missing_person_id_fkey"
            columns: ["missing_person_id"]
            isOneToOne: false
            referencedRelation: "missing_persons"
            referencedColumns: ["id"]
          },
        ]
      }
      missing_persons: {
        Row: {
          age: number | null
          created_at: string
          gender: string | null
          id: string
          identifying_features: string | null
          image_url: string | null
          last_seen_location: string
          name: string
          reporter_contact: string | null
          reporter_id: string | null
          status: string | null
        }
        Insert: {
          age?: number | null
          created_at?: string
          gender?: string | null
          id?: string
          identifying_features?: string | null
          image_url?: string | null
          last_seen_location: string
          name: string
          reporter_contact?: string | null
          reporter_id?: string | null
          status?: string | null
        }
        Update: {
          age?: number | null
          created_at?: string
          gender?: string | null
          id?: string
          identifying_features?: string | null
          image_url?: string | null
          last_seen_location?: string
          name?: string
          reporter_contact?: string | null
          reporter_id?: string | null
          status?: string | null
        }
        Relationships: []
      }
      news_updates: {
        Row: {
          category: string | null
          content: string
          created_at: string
          id: string
          image_url: string | null
          title: string
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          title: string
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          title?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
