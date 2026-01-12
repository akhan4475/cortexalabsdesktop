import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

function base64url(source: ArrayBuffer): string {
  let base64 = btoa(String.fromCharCode(...new Uint8Array(source)))
  base64 = base64.replace(/=/g, '')
  base64 = base64.replace(/\+/g, '-')
  base64 = base64.replace(/\//g, '_')
  return base64
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      }
    })
  }

  try {
    const { identity, userId } = await req.json()
    
    if (!identity || !userId) {
      return new Response(
        JSON.stringify({ error: 'Identity and userId are required' }),
        { 
          status: 400,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      )
    }

    // Get user's Twilio credentials from database
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    const { data: credentials, error: dbError } = await supabase
      .from('twilio_credentials')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (dbError || !credentials) {
      return new Response(
        JSON.stringify({ error: 'Twilio credentials not found. Please configure them in Automations.' }),
        { 
          status: 400,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      )
    }

    const TWILIO_ACCOUNT_SID = credentials.account_sid
    const TWILIO_API_KEY = credentials.api_key
    const TWILIO_API_SECRET = credentials.api_secret
    const TWILIO_TWIML_APP_SID = credentials.twiml_app_sid

    if (!TWILIO_API_KEY || !TWILIO_API_SECRET || !TWILIO_TWIML_APP_SID) {
      return new Response(
        JSON.stringify({ error: 'Missing API credentials. Please add API Key and TwiML App SID in Automations.' }),
        { 
          status: 400,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      )
    }

    const now = Math.floor(Date.now() / 1000)
    const exp = now + 3600

    const payload = {
      jti: `${TWILIO_API_KEY}-${now}`,
      iss: TWILIO_API_KEY,
      sub: TWILIO_ACCOUNT_SID,
      exp: exp,
      grants: {
        identity: identity,
        voice: {
          outgoing: {
            application_sid: TWILIO_TWIML_APP_SID
          }
        }
      }
    }

    const header = { alg: "HS256", typ: "JWT", cty: "twilio-fpa;v=1" }

    const encoder = new TextEncoder()
    const headerB64 = base64url(encoder.encode(JSON.stringify(header)))
    const payloadB64 = base64url(encoder.encode(JSON.stringify(payload)))
    
    const message = `${headerB64}.${payloadB64}`
    
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(TWILIO_API_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    
    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message))
    const signatureB64 = base64url(signature)
    const jwt = `${message}.${signatureB64}`

    console.log('✅ Token generated for user:', userId)

    return new Response(
      JSON.stringify({ token: jwt, identity }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )

  } catch (error) {
    console.error('❌ Token error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
  }
})