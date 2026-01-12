import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Database {
  public: {
    Tables: {
      campaigns: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          created_at: string;
          lead_count: number;
          created_timestamp: string;
        };
        Insert: {
          id: string;
          user_id: string;
          name: string;
          created_at: string;
          lead_count?: number;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          created_at?: string;
          lead_count?: number;
        };
      };
      leads: {
        Row: {
          id: string;
          user_id: string;
          campaign_id: string;
          name: string;
          company: string;
          phone: string;
          email: string | null;
          address: string | null;
          website: string | null;
          rating: string | null;
          reviews: string | null;
          summary: string | null;
          status: string;
          created_timestamp: string;
        };
        Insert: {
          id: string;
          user_id: string;
          campaign_id: string;
          name: string;
          company: string;
          phone: string;
          email?: string | null;
          address?: string | null;
          website?: string | null;
          rating?: string | null;
          reviews?: string | null;
          summary?: string | null;
          status?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          campaign_id?: string;
          name?: string;
          company?: string;
          phone?: string;
          email?: string | null;
          address?: string | null;
          website?: string | null;
          rating?: string | null;
          reviews?: string | null;
          summary?: string | null;
          status?: string;
        };
      };
      clients: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          company: string;
          close_date: string;
          upfront_value: number;
          monthly_value: number;
          monthly_retainer_date: string | null;
          status: string;
          created_timestamp: string;
        };
        Insert: {
          id: string;
          user_id: string;
          name: string;
          company: string;
          close_date: string;
          upfront_value: number;
          monthly_value?: number;
          monthly_retainer_date?: string | null;
          status?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          company?: string;
          close_date?: string;
          upfront_value?: number;
          monthly_value?: number;
          monthly_retainer_date?: string | null;
          status?: string;
        };
      };
      demo_events: {
        Row: {
          id: string;
          user_id: string;
          lead_id: string;
          date: string;
          created_timestamp: string;
        };
        Insert: {
          id: string;
          user_id: string;
          lead_id: string;
          date: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          lead_id?: string;
          date?: string;
        };
      };
      twilio_credentials: {
        Row: {
          id: string;
          user_id: string;
          account_sid: string;
          auth_token: string;
          phone_number: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          account_sid: string;
          auth_token: string;
          phone_number: string;
        };
        Update: {
          account_sid?: string;
          auth_token?: string;
          phone_number?: string;
          updated_at?: string;
        };
      };
    };
  };
}