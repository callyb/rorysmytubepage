const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

//google account credentials used to send email
var transporter = nodemailer.createTransport({
    host: 'server25.hostwhitelabel.com',
    port: 465,
    secure: true,
    auth: {
        user: '567turtle@rorysmytube.com',
        pass: 'turtle2011',
    }
});

//Creating a Firebase Cloud Function
exports.sendWelcomeEmail = functions.firestore
    .document('mytubePage/data/users/{userID}')
    .onUpdate((change, context) => {
        // Document id of the updated document
        const previousValue = change.before.data();
        // Data before update and after update
        const newValue = change.after.data();

        if (newValue.consentGiven === true) {
            const mailOptions = {
                from: `567turtle@rorysmytube.com`,
                to: previousValue.subscriberEmail,
                subject: 'Welcome',
                html: `<link href="https://fonts.googleapis.com/css2?family=Poppins&family=Roboto+Condensed&display=swap" rel="stylesheet">
            <style>
            h2 {font-family: 'Roboto Condensed', sans-serif;} p, li, h4 {font-family: 'Poppins', sans-serif;} .spacing-below {margin-bottom: 3em;}</style>
            
            <h2>Welcome to rorysmytube ${previousValue.fname}!</h2>
        <p> Welcome to rorysmytube ${previousValue.fname}, and thank you for subscribing!  Your parent ${previousValue.pName} has given us permission so you are now subscribed and we are ready to send you updates every time a new video is uploaded by 567turtle.  We'll also send you upates sometimes on what 567turtle has been doing. </p></ br>
        <h4>Watch your emails for news of the next video!</h4>
        
        <p>Yours,</p> <p>567turtle :-) </p>`
            };

            return transporter.sendMail(mailOptions)
                .then(() => {
                    console.log('sent')
                })
                .catch(error => {
                    console.log(error)
                    return
                })
        }
    });
