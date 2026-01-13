import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID')!
const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN')!

serve(async (req: Request) => {
  try {
    const url = new URL(req.url)
    const recordingSid = url.searchParams.get('sid')

    if (!recordingSid) {
      return new Response('Missing recording SID', { status: 400 })
    }

    // Fetch from Twilio with auth
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Recordings/${recordingSid}.mp3`
    
    const response = await fetch(twilioUrl, {
      headers: {
        'Authorization': 'Basic ' + btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch recording')
    }

    const audioBlob = await response.blob()

    return new Response(audioBlob, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Access-Control-Allow-Origin': '*'
      }
    })

  } catch (error: any) {
    return new Response(error.message, { status: 500 })
  }
})