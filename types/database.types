export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          plan_tier: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          plan_tier?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          plan_tier?: string
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      api_specs: {
        Row: {
          id: string
          project_id: string
          version: string
          file_path: string
          content: Json | null
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          version?: string
          file_path: string
          content?: Json | null
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          version?: string
          file_path?: string
          content?: Json | null
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      customizations: {
        Row: {
          id: string
          project_id: string
          logo_url: string | null
          primary_color: string | null
          theme: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          logo_url?: string | null
          primary_color?: string | null
          theme?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          logo_url?: string | null
          primary_color?: string | null
          theme?: string
          created_at?: string
          updated_at?: string
        }
      }
      domains: {
        Row: {
          id: string
          project_id: string
          domain: string
          verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          domain: string
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          domain?: string
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      access_controls: {
        Row: {
          id: string
          project_id: string
          is_password_protected: boolean
          password_hash: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          is_password_protected?: boolean
          password_hash?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          is_password_protected?: boolean
          password_hash?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      team_members: {
        Row: {
          id: string
          user_id: string
          project_id: string
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_id: string
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_id?: string
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
      analytics: {
        Row: {
          id: string
          project_id: string
          page_path: string
          view_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          page_path: string
          view_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          page_path?: string
          view_count?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
