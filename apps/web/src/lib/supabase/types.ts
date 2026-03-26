export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          plan: "free" | "pro";
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          plan?: "free" | "pro";
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          plan?: "free" | "pro";
          created_at?: string;
        };
        Relationships: [];
      };
      api_keys: {
        Row: {
          id: string;
          user_id: string;
          hashed_key: string;
          key_prefix: string;
          label: string;
          usage_count: number;
          usage_limit: number | null;
          last_used_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          hashed_key: string;
          key_prefix: string;
          label?: string;
          usage_count?: number;
          usage_limit?: number | null;
          last_used_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          hashed_key?: string;
          key_prefix?: string;
          label?: string;
          usage_count?: number;
          usage_limit?: number | null;
          last_used_at?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "api_keys_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      usage_logs: {
        Row: {
          id: string;
          user_id: string | null;
          ip_address: string;
          endpoint: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          ip_address: string;
          endpoint: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          ip_address?: string;
          endpoint?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "usage_logs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
