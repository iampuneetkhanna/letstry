const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const twilio = require('twilio');
const { SpeechClient } = require('microsoft-cognitiveservices-speech-sdk');

const app = express();
app.use(bodyParser.json());

const azureSpeechKey = 'EMmVxF8X8cKtVtmhIykg58cpqB2oBDSfUYL0rILimy9izPFMih66JQQJ99BEAC4f1cMXJ3w3AAAYACOGKR1A';
const azureSpeechRegion = 'westus';
const twilioAccountSid = 'YOUR_TWILIO_ACCOUNT_SID';
const twilioAuthToken = 'YOUR_TWILIO_AUTH_TOKEN';
const client = twilio(twilioAccountSid, twilioAuthToken);

app.post('/process-conversation', async (req, res) => {
    const { conversation, whatsappNumber } = req.body;
    // Process conversation using Azure Speech Service
    const speechClient = new SpeechClient(azureSpeechKey, azureSpeechRegion);
    const response = await speechClient.recognize({
        audio: conversation,
        language: 'hi-IN'
    });
    const groceryItems = response.results;
    // Send grocery list to WhatsApp
    await client.messages.create({
        from: 'whatsapp:+14155238886',
        to: `whatsapp:${whatsappNumber}`,
        body: `Grocery List: ${groceryItems.join(', ')}`
    });
    res.send({ success: true });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
