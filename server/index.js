import express from 'express';
import twilio from 'twilio';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// In-memory storage for Twilio credentials
// In production, you'd want to store these in a database
let twilioCredentials = {
  accountSid: process.env.TWILIO_ACCOUNT_SID || '',
  authToken: process.env.TWILIO_AUTH_TOKEN || '',
  phoneNumber: process.env.TWILIO_PHONE_NUMBER || ''
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Save Twilio credentials (from your Automations page)
app.post('/api/twilio/credentials', (req, res) => {
  const { accountSid, authToken, phoneNumber } = req.body;
  
  if (!accountSid || !authToken || !phoneNumber) {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing required credentials' 
    });
  }
  
  twilioCredentials = {
    accountSid,
    authToken,
    phoneNumber
  };
  
  console.log('✅ Twilio credentials updated');
  res.json({ success: true, message: 'Credentials saved' });
});

// Get current Twilio phone number (for display purposes)
app.get('/api/twilio/phone-number', (req, res) => {
  res.json({ 
    success: true, 
    phoneNumber: twilioCredentials.phoneNumber || null 
  });
});

// Make an outbound call
app.post('/api/twilio/call', async (req, res) => {
  const { to, from } = req.body;
  
  if (!twilioCredentials.accountSid || !twilioCredentials.authToken) {
    return res.status(400).json({ 
      success: false, 
      error: 'Twilio credentials not configured. Please configure in Automations.' 
    });
  }
  
  if (!to) {
    return res.status(400).json({ 
      success: false, 
      error: 'Phone number is required' 
    });
  }
  
  try {
    const client = twilio(
      twilioCredentials.accountSid,
      twilioCredentials.authToken
    );
    
    const fromNumber = from || twilioCredentials.phoneNumber;
    
    console.log(`📞 Initiating call from ${fromNumber} to ${to}`);
    
    const call = await client.calls.create({
      // TwiML instruction - you can customize this
      twiml: '<Response><Say>Hello! This call is from your Horizon CRM system. Please hold while we connect you.</Say><Pause length="2"/></Response>',
      to: to,
      from: fromNumber,
      statusCallback: `http://localhost:${process.env.PORT || 3001}/api/twilio/status`,
      statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
      statusCallbackMethod: 'POST'
    });
    
    console.log(`✅ Call initiated with SID: ${call.sid}`);
    
    res.json({ 
      success: true, 
      callSid: call.sid,
      status: call.status,
      from: fromNumber,
      to: to
    });
  } catch (error) {
    console.error('❌ Call error:', error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Webhook for call status updates
app.post('/api/twilio/status', (req, res) => {
  console.log('📊 Call Status Update:', {
    CallSid: req.body.CallSid,
    CallStatus: req.body.CallStatus,
    Duration: req.body.CallDuration
  });
  res.sendStatus(200);
});

// Get call details
app.get('/api/twilio/call/:callSid', async (req, res) => {
  if (!twilioCredentials.accountSid || !twilioCredentials.authToken) {
    return res.status(400).json({ 
      success: false, 
      error: 'Twilio credentials not configured' 
    });
  }
  
  try {
    const client = twilio(
      twilioCredentials.accountSid,
      twilioCredentials.authToken
    );
    
    const call = await client.calls(req.params.callSid).fetch();
    
    res.json({ 
      success: true, 
      call: {
        sid: call.sid,
        status: call.status,
        duration: call.duration,
        from: call.from,
        to: call.to,
        startTime: call.startTime,
        endTime: call.endTime
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// End/hangup a call
app.post('/api/twilio/call/:callSid/hangup', async (req, res) => {
  if (!twilioCredentials.accountSid || !twilioCredentials.authToken) {
    return res.status(400).json({ 
      success: false, 
      error: 'Twilio credentials not configured' 
    });
  }
  
  try {
    const client = twilio(
      twilioCredentials.accountSid,
      twilioCredentials.authToken
    );
    
    const call = await client.calls(req.params.callSid).update({
      status: 'completed'
    });
    
    console.log(`🔴 Call ${call.sid} ended`);
    
    res.json({ 
      success: true,
      callSid: call.sid,
      status: call.status
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Twilio Backend Server running on http://localhost:${PORT}`);
  console.log(`📞 Ready to make calls!`);
});