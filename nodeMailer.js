const nodemailer = require('nodemailer');

exports.emailAlert = (subject, message, userEmail) => {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: 'finansexpensemanager@gmail.com', pass: process.env.NODEMAILERPASSWORD }
    });
    const mailOptions = {
        from: 'Finans',
        to: userEmail,
        subject: subject,
        text: message
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    })
}