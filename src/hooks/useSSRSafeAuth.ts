'use client'

import { useAuth } from '@/components/providers/auth-provider'
import { useHydrated } from './useHydrated'

export function useSSRSafeAuth() {
  const auth = useAuth()
  const hydrated = useHydrated()

  return {
    user: hydrated ? auth.user : null,
    loading: hydrated ? auth.loading : true,
    signOut: auth.signOut,
    refreshUser: auth.refreshUser,
  }
}