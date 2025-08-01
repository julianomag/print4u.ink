import { create } from 'zustand'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

type UserProfile = Database['public']['Tables']['users']['Row']

interface AuthState {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, companyName: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<{ error: any }>
  loadProfile: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any }>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: true,

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (!error && data.user) {
      set({ user: data.user })
      await get().loadProfile()
    }
    
    return { error }
  },

  signUp: async (email: string, password: string, companyName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          company_name: companyName,
        }
      }
    })
    
    if (!error && data.user) {
      set({ user: data.user })
      await get().loadProfile()
    }
    
    return { error }
  },

  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null, profile: null })
  },

  signInWithGoogle: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    
    console.log('Google OAuth redirect URL:', `${window.location.origin}/auth/callback`)
    return { error }
  },

  loadProfile: async () => {
    const { user } = get()
    if (!user) return

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!error && data) {
      set({ profile: data })
    }
  },

  updateProfile: async (updates: Partial<UserProfile>) => {
    const { user } = get()
    if (!user) return { error: new Error('No user logged in') }

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()

    if (!error && data) {
      set({ profile: data })
    }

    return { error }
  },
}))

// Inicializar estado de autenticação
supabase.auth.getSession().then(({ data: { session } }) => {
  if (session?.user) {
    useAuthStore.setState({ user: session.user })
    useAuthStore.getState().loadProfile()
  }
  useAuthStore.setState({ loading: false })
}).catch(() => {
  // Se houver erro (Supabase não configurado), definir loading como false
  useAuthStore.setState({ loading: false })
})

// Escutar mudanças de autenticação
supabase.auth.onAuthStateChange(async (event, session) => {
  if (session?.user) {
    useAuthStore.setState({ user: session.user })
    await useAuthStore.getState().loadProfile()
  } else {
    useAuthStore.setState({ user: null, profile: null })
  }
  useAuthStore.setState({ loading: false })
}) 