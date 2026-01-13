import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async (req: Request) => {
  // Handle OPTIONS first
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET',
        'Access-Control-Allow-Headers': '*',
      }
    })
  }

  // Handle GET requests (for testing) - BEFORE trying to parse body
  if (req.method === 'GET') {
    return new Response('Recording status webhook is active', { 
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    })
  }

  // Handle POST requests (from Twilio)
  if (req.method === 'POST') {
    try {
      // Get query params
      const url = new URL(req.url)
      const userId = url.searchParams.get('userId')
      const leadId = url.searchParams.get('leadId')
      const campaignId = url.searchParams.get('campaignId')
      const leadName = url.searchParams.get('leadName')
      const phone = url.searchParams.get('phone')

      // Get recording data from Twilio
      const formData = await req.formData()
      const recordingUrl = formData.get('RecordingUrl') as string
      const recordingSid = formData.get('RecordingSid') as string
      const recordingDuration = parseInt(formData.get('RecordingDuration') as string || '0')
      const recordingStatus = formData.get('RecordingStatus') as string

      console.log('📼 Recording status:', recordingStatus, 'SID:', recordingSid)
      console.log('User ID:', userId, 'Lead:', leadName)

      if (recordingStatus === 'completed' && userId) {
        // Save to database
        const supabase = createClient(supabaseUrl, supabaseServiceKey)
        
        const { error } = await supabase
          .from('call_recordings')
          .insert({
            user_id: userId,
            lead_id: leadId || null,
            campaign_id: campaignId || null,
            lead_name: leadName || 'Unknown',
            phone_number: phone || 'Unknown',
            recording_url: recordingUrl,
            recording_sid: recordingSid,
            duration: recordingDuration,
            call_date: new Date().toISOString()
          })

        if (error) {
          console.error('❌ DB error:', error)
        } else {
          console.log('✅ Recording saved to database')
        }
      }

      return new Response('OK', { status: 200 })

    } catch (error: any) {
      console.error('❌ Error:', error)
      return new Response(JSON.stringify({ error: error.message }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }

  // Default response for other methods
  return new Response('Method not allowed', { status: 405 })
})