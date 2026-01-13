import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET',
        'Access-Control-Allow-Headers': '*',
      }
    })
  }

  try {
    // Get all parameters from form data
    const formData = await req.formData()
    const to = formData.get('To') as string
    const userId = formData.get('UserId') as string || ''
    const record = formData.get('Record') as string || 'false'
    const leadId = formData.get('LeadId') as string || ''
    const campaignId = formData.get('CampaignId') as string || ''
    const leadName = formData.get('LeadName') as string || 'Unknown'

    console.log('📞 Voice webhook received')
    console.log('To:', to)
    console.log('Record:', record)
    console.log('UserId:', userId)
    console.log('LeadId:', leadId)

    if (!to) {
      throw new Error('Missing To parameter')
    }

    // Get user's phone number from database
    let twilioNumber = '+18881234567'

    if (userId) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey)
      const { data: credentials } = await supabase
        .from('twilio_credentials')
        .select('phone_number')
        .eq('user_id', userId)
        .single()

      if (credentials?.phone_number) {
        twilioNumber = credentials.phone_number
      }
    }

    // Build TwiML with optional recording
    let twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>`

    if (record === 'true') {
      // Build callback URL with XML-escaped ampersands
      const callbackUrl = supabaseUrl + '/functions/v1/recording-status' +
        '?userId=' + userId +
        '&amp;leadId=' + leadId +
        '&amp;campaignId=' + campaignId +
        '&amp;leadName=' + leadName.replace(/[^a-zA-Z0-9]/g, '_') +
        '&amp;phone=' + to.replace(/[^0-9+]/g, '')
      
      console.log('🎙️ Recording callback URL:', callbackUrl)
      
      twiml += `
  <Dial callerId="${twilioNumber}" record="record-from-answer" recordingStatusCallback="${callbackUrl}" recordingStatusCallbackMethod="POST">
    ${to}
  </Dial>`
    } else {
      twiml += `
  <Dial callerId="${twilioNumber}">${to}</Dial>`
    }

    twiml += `
</Response>`

    console.log('✅ TwiML generated successfully')

    return new Response(twiml, {
      status: 200,
      headers: {
        'Content-Type': 'text/xml'
      }
    })

  } catch (error: any) {
    console.error('❌ Error:', error)
    
    const errorTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>An error occurred. ${error.message}</Say>
</Response>`

    return new Response(errorTwiml, {
      status: 200,
      headers: {
        'Content-Type': 'text/xml'
      }
    })
  }
})