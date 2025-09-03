'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { usePostHog } from 'posthog-js/react'
import type { AuthContextType, AuthUser } from '@/lib/auth/types'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const posthog = usePostHog()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      setUser(session?.user as AuthUser | null)
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const newUser = session?.user as AuthUser | null
      setUser(newUser)
      setLoading(false)
      
      // Identify user in PostHog when they sign in
      if (newUser && posthog) {
        posthog.identify(newUser.id, {
          email: newUser.email,
          user_metadata: newUser.user_metadata,
          created_at: newUser.created_at
        })
      } else if (!newUser && posthog) {
        // Reset PostHog when user signs out
        posthog.reset()
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const refreshUser = async () => {
    const {
      data: { user: refreshedUser },
    } = await supabase.auth.getUser()
    setUser(refreshedUser as AuthUser | null)
  }

  const value = {
    user,
    loading,
    signOut,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}