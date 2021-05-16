
const nodemailer = require('nodemailer');
const functions = require("firebase-functions");

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
exports.sendConsentEmail = functions.firestore
    .document('users/{userID}')
    .onCreate((snap, context) => {

        const mailOptions = {
            from: `567turtle@rorysmytube.com`,
            to: snap.data().parentEmail,
            subject: `${snap.data().pName}, Your child would like to receive updates from RorysMytube`,
            html:

                `<link href="https://fonts.googleapis.com/css2?family=Poppins&family=Roboto+Condensed&display=swap" rel="stylesheet">
            <style>
            h2 {font-family: 'Roboto Condensed', sans-serif;} p, li, h4 {font-family: 'Poppins', sans-serif;} .spacing-below {margin-bottom: 3em;}</style>
            
            <h2>${snap.data().fname} would like to receive updates from 567turtle (Rory Brennan) and we would like your permission please!</h2>
            <p> ${snap.data().fname} ${snap.data().lname} has requested to subscribe to rorysmytube.com and has given your details as their parent/guardian.  These are the other details we have for ${snap.data().fname}:</p>
                <ul>
                <li>Child's First Name: ${snap.data().fname}</li>
                    <li>Child's Last Name: ${snap.data().lname}</li>
                    <li>Child's Email: ${snap.data().email}</li>
                    <li>Child's password: ${snap.data().password}</li>
                    <li>Parent's name: ${snap.data().pName}</li>
                    <li>Parent's email: ${snap.data().parentEmail}</li>
                    <li>Aged under 13 (box ticked)</li>

                </ul>
            
            <p>By law we have to ask your permission for them to automatically receive an update each time Rory uploads a new video to the site.</p>
            
            <p>'RorysMytube.com' is a web app in the style of YouTube that displays videos that Rory has made himself.  The videos do show a link to the source off the video on YouTube itself at the beginning of the video because we can't use YouTube to store the videos without getting this link, but it disappears quite quickly and the app is designed to show children the videos on rorysmytube not on YouTube (where the videos don't appear in searches).  You should know that there is a possibility that your child could follow the link to the main YouTube site however, though we are currently looking at affordable alternative hosts so we hope this won't be the case for long!  </p> 
            
            <p>We'll also send them upates sometimes on what 567turtle has been doing. </p>
            
            <p>If you are happy for your child to subscribe to 'rorysmytube' then please email us on <a href='mailto: ' + 567turtle@rorysmytube.com"> 567turtle@rorysmytube.com</a> to confirm.  Or you can wait a couple of days when will be adding a user button to the rorysmytube.com search bar to enable you to consent online - if you do then please make sure the details you give us in the form match the details your child has given us so we can identify them.  The  user button will also give you or your child the opportunity to remove them from our subscribers list at a later date if you want to.</p>
            
            <p>You can see our privacy policy <a href="https://www.pixelist.design/rorysmytube/privacy.html">here.</a></p>

            <p>That's all we need, thank you!  But if you have any questions please don't hesitate to contact us <a href='mailto: ' + 567turtle@rorysmytube.com"> here</a> .</p>

            <p>All the best</p>
            <h4>The Administrator</h4>
            <h4>RorysMytube</h4>`
        };

        return transporter.sendMail(mailOptions)
            .then(() => {
                console.log('sent')
            })
            .catch(error => {
                console.log(error)
                return
            })

    });