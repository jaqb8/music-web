export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
	public: {
		Tables: {
			profiles: {
				Row: {
					avatar_url: string | null;
					id: string;
					updated_at: string | null;
					user_name: string | null;
				};
				Insert: {
					avatar_url?: string | null;
					id: string;
					updated_at?: string | null;
					user_name?: string | null;
				};
				Update: {
					avatar_url?: string | null;
					id?: string;
					updated_at?: string | null;
					user_name?: string | null;
				};
			};
			ratings: {
				Row: {
					album_id: string;
					created_at: string | null;
					id: number;
					rating: Database['public']['Enums']['rating_enum'] | null;
					user_id: string;
				};
				Insert: {
					album_id: string;
					created_at?: string | null;
					id?: number;
					rating?: Database['public']['Enums']['rating_enum'] | null;
					user_id: string;
				};
				Update: {
					album_id?: string;
					created_at?: string | null;
					id?: number;
					rating?: Database['public']['Enums']['rating_enum'] | null;
					user_id?: string;
				};
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			rating_enum: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10';
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
}
