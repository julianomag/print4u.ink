import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Tipos TypeScript baseados no schema do banco
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          company_name: string | null
          stripe_customer_id: string | null
          plan_details: {
            planId: 'free' | 'pro' | 'enterprise'
            maxPrints: number
            maxComputers: number
            monthlyPrintCount: number
            billingCycleStart: string
          }
          created_at: string
        }
        Insert: {
          id: string
          email: string
          company_name?: string | null
          stripe_customer_id?: string | null
          plan_details?: {
            planId: 'free' | 'pro' | 'enterprise'
            maxPrints: number
            maxComputers: number
            monthlyPrintCount: number
            billingCycleStart: string
          }
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          company_name?: string | null
          stripe_customer_id?: string | null
          plan_details?: {
            planId: 'free' | 'pro' | 'enterprise'
            maxPrints: number
            maxComputers: number
            monthlyPrintCount: number
            billingCycleStart: string
          }
          created_at?: string
        }
      }
      computers: {
        Row: {
          id: string
          user_id: string
          computer_name: string
          status: 'online' | 'offline'
          last_seen: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          computer_name: string
          status?: 'online' | 'offline'
          last_seen?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          computer_name?: string
          status?: 'online' | 'offline'
          last_seen?: string
          created_at?: string
        }
      }
      print_jobs: {
        Row: {
          id: string
          user_id: string
          printer_id: string
          computer_id: string | null
          status: 'pending' | 'printing' | 'completed' | 'error'
          file_storage_path: string
          title: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          printer_id: string
          computer_id?: string | null
          status?: 'pending' | 'printing' | 'completed' | 'error'
          file_storage_path: string
          title: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          printer_id?: string
          computer_id?: string | null
          status?: 'pending' | 'printing' | 'completed' | 'error'
          file_storage_path?: string
          title?: string
          created_at?: string
        }
      }
      api_keys: {
        Row: {
          id: string
          user_id: string
          key_hash: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          key_hash: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          key_hash?: string
          created_at?: string
        }
      }
    }
  }
} 