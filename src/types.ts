export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)";
  };
  public: {
    Tables: {
      post: {
        Row: {
          author_id: string;
          content: string;
          created_at: string;
          id: number;
          image_urls: string[] | null;
          like_count: number;
        };
        Insert: {
          author_id?: string;
          content?: string;
          created_at?: string;
          id?: number;
          image_urls?: string[] | null;
          like_count?: number;
        };
        Update: {
          author_id?: string;
          content?: string;
          created_at?: string;
          id?: number;
          image_urls?: string[] | null;
          like_count?: number;
        };
        Relationships: [];
      };
      profile: {
        Row: {
          avatar_url: string | null;
          bio: string;
          created_at: string;
          id: string;
          nickname: string;
        };
        Insert: {
          avatar_url?: string | null;
          bio?: string;
          created_at?: string;
          id?: string;
          nickname?: string;
        };
        Update: {
          avatar_url?: string | null;
          bio?: string;
          created_at?: string;
          id?: string;
          nickname?: string;
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
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type PostEntity = Database["public"]["Tables"]["post"]["Row"];

export type UseMutationCallback = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onMutate?: () => void;
  onSettled?: () => void;
};
