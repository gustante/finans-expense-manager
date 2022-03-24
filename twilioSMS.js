const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


exports.smsAlert = (message,phoneNumber) => {
    const destination = "+1" + phoneNumber;
    console.log("sendind text to " + destination)

    client.messages.create({
        body: message,
        to: destination,  // Text this number
        from: '+19105659985' // From a valid Twilio number
    })
        .then(message => {
            console.log('message sent succesfully')
        })
        .catch(error=>{
            console.log(error)
        })
}
