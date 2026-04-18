// src/lib/analytics.ts
import { supabase } from '@/lib/supabase'

export async function trackEvent(eventName: string, metadata: any = {}) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    const { error } = await supabase
      .from('analytics_events')
      .insert({
        event_name: eventName,
        user_id: user?.id || null,
        metadata: {
          ...metadata,
          url: window.location.href,
          timestamp: new Date().toISOString()
        }
      })

    if (error) throw error
  } catch (err) {
    console.error('Analytics Error:', err)
  }
}