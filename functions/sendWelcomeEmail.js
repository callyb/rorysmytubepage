const functions = require('firebase-functions');
const sgMail = require('@sendgrid/mail')

const SENDGRID_API_KEY = functions.config().sendgrid.key
sgMail.setApiKey(SENDGRID_API_KEY)

//Creating a Firebase Cloud Function
exports.sendWelcomeEmail = functions.firestore
    .document('users/{userID}')
    .onUpdate((change, context) => {
        // Data before update and after update
        const previousValue = change.before.data();
        const newValue = change.after.data();
        if (newValue.consentGiven) {
            const msg = {
                to: '567turtle@rorysmytube.com', // Change to your recipient
                bcc: previousValue.email,
                from: '567turtle@rorysmytube.com', // Change to your verified sender
                subject: 'Welcome!',
                templateId: 'd-97f114a4b9aa40908584fe0d1208d86a',
                dynamic_template_data: {
                    name: previousValue.fname,
                    parentName: previousValue.pname
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