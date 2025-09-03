'use client'

import { useCallback, useRef } from 'react'
import { usePostHog } from 'posthog-js/react'
import { useAuth } from '@/components/providers/auth-provider'

interface AnalyticsEventProperties {
  [key: string]: any
}

export function useAnalytics() {
  const posthog = usePostHog()
  const { user } = useAuth()
  const lastEventRef = useRef<{ event: string; timestamp: number } | null>(null)
  
  // Rate limiting: prevent same event within 1 second
  const isRateLimited = (event: string) => {
    const now = Date.now()
    const last = lastEventRef.current
    
    if (last && last.event === event && (now - last.timestamp) < 1000) {
      return true
    }
    
    lastEventRef.current = { event, timestamp: now }
    return false
  }

  const track = useCallback((event: string, properties?: AnalyticsEventProperties) => {
    if (!posthog || isRateLimited(event)) return
    
    try {
      // Add common properties to all events
      const enrichedProperties = {
        ...properties,
        timestamp: new Date().toISOString(),
        user_id: user?.id,
        user_email: user?.email,
        is_authenticated: !!user,
      }

      posthog.capture(event, enrichedProperties)
    } catch (error) {
      console.warn('Analytics tracking failed:', error)
    }
  }, [posthog, user?.id, user?.email])

  const identify = useCallback((userId: string, traits?: Record<string, any>) => {
    if (!posthog) return
    try {
      posthog.identify(userId, traits)
    } catch (error) {
      console.warn('Analytics identify failed:', error)
    }
  }, [posthog])

  const page = useCallback((name?: string, properties?: AnalyticsEventProperties) => {
    const eventKey = `$pageview_${name || 'default'}`
    if (!posthog || isRateLimited(eventKey)) return
    
    try {
      posthog.capture('$pageview', {
        ...properties,
        page_name: name,
      })
    } catch (error) {
      console.warn('Analytics page tracking failed:', error)
    }
  }, [posthog])

  // Landing Page Events
  const trackLandingCTA = useCallback((ctaType: 'start_building' | 'view_example') => {
    track('landing_cta_clicked', {
      cta_type: ctaType,
      section: 'hero'
    })
  }, [track])

  const trackFeatureView = useCallback((featureTitle: string) => {
    track('feature_viewed', {
      feature: featureTitle
    })
  }, [track])

  const trackExampleInteraction = useCallback((action: 'viewed' | 'expanded') => {
    track('example_interaction', {
      action,
      section: 'example_faqs'
    })
  }, [track])

  // Authentication Events  
  const trackAuthAttempt = useCallback((action: 'login' | 'register', method?: string) => {
    track('auth_attempt', {
      action,
      method: method || 'email'
    })
  }, [track])

  const trackAuthSuccess = useCallback((action: 'login' | 'register', method?: string) => {
    track('auth_success', {
      action,
      method: method || 'email'
    })
  }, [track])

  const trackAuthError = useCallback((action: 'login' | 'register', error: string) => {
    track('auth_error', {
      action,
      error
    })
  }, [track])

  // FAQ Generation Events (enhanced)
  const trackFAQFormField = useCallback((field: string, value: string) => {
    track('faq_form_field_completed', {
      field,
      value,
      form_section: 'configuration'
    })
  }, [track])

  const trackFAQTabSwitch = useCallback((tab: 'preview' | 'jsonld' | 'export') => {
    track('faq_tab_switched', {
      tab,
      section: 'results'
    })
  }, [track])

  const trackFAQExport = useCallback((exportType: 'json' | 'markdown' | 'jsonld_script') => {
    track('faq_exported', {
      export_type: exportType
    })
  }, [track])

  const trackFAQCopy = useCallback((copyType: 'markdown' | 'jsonld') => {
    track('faq_copied', {
      copy_type: copyType
    })
  }, [track])

  // Dashboard Events
  const trackDashboardAction = useCallback((action: 'viewed_history' | 'deleted_faq' | 'regenerated') => {
    track('dashboard_action', {
      action
    })
  }, [track])

  // Performance Events
  const trackPerformance = useCallback((metric: string, value: number, context?: string) => {
    track('performance_metric', {
      metric,
      value,
      context
    })
  }, [track])

  return {
    track,
    identify,
    page,
    trackLandingCTA,
    trackFeatureView, 
    trackExampleInteraction,
    trackAuthAttempt,
    trackAuthSuccess,
    trackAuthError,
    trackFAQFormField,
    trackFAQTabSwitch,
    trackFAQExport,
    trackFAQCopy,
    trackDashboardAction,
    trackPerformance,
  }
}