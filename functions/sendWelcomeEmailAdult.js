const functions = require('firebase-functions');
const sgMail = require('@sendgrid/mail')

const SENDGRID_API_KEY = functions.config().sendgrid.key
sgMail.setApiKey(SENDGRID_API_KEY)

//Creating a Firebase Cloud Function
exports.sendWelcomeEmailAdult = functions.firestore
    .document('users/{userID}')
    .onCreate(async (snap, context) => {
        // Data before update and after update
        const firstName = snap.data().fname;
        const lastName = snap.data().lname;
        if (snap.data().consent) {
            const msg = {
                to: '567turtle@rorysmytube.com', // Change to your recipient
                bcc: snap.data().email,
                from: '567turtle@rorysmytube.com', // Change to your verified sender
                subject: 'Welcome!',
                templateId: 'd03deb05e4194c1c8e7199450020729b',
                dynamic_template_data: {
                    firstName,
                    lastName
                }
            }

            return sgMail
                .send(msg)
                .then(() => {
                    console.log('Email sent')
                })
                .catch((error) => {
                    console.error(error)
                })
        }

    })