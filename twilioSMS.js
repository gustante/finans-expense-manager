const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


exports.smsAlert = (message) => {
    client.messages.create({
        body: message,
        to: '+12368636833',  // Text this number
        from: '+19105659985' // From a valid Twilio number
    })
        .then(message => {
            console.log('message sent succesfully')
        })
}
