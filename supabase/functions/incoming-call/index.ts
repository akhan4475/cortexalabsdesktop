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
    console.log('📞 Incoming call - forwarding')

    // Get user's credentials from database
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    const { data: credentials } = await supabase
      .from('twilio_credentials')
      .select('phone_number, forward_to_number')
      .limit(1)
      .single()

    const twilioNumber = credentials?.phone_number || '+18881234567'
    const forwardToNumber = credentials?.forward_to_number || '+14105551234' // You'll need to add this field

    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Dial callerId="${twilioNumber}">${forwardToNumber}</Dial>
</Response>`

    return new Response(twiml, {
      status: 200,
      headers: {
        'Content-Type': 'text/xml'
      }
    })

  } catch (error) {
    console.error('❌ Error:', error)
    
    const errorTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>Sorry, unable to forward your call.</Say>
</Response>`

    return new Response(errorTwiml, {
      status: 200,
      headers: {
        'Content-Type': 'text/xml'
      }
    })
  }
})