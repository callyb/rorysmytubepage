const functions = require("firebase-functions");
const sgMail = require('@sendgrid/mail')

const SENDGRID_API_KEY = functions.config().sendgrid.key
sgMail.setApiKey(SENDGRID_API_KEY)

//Creating a Firebase Cloud Function
exports.sendConsentEmail = functions.firestore
    .document('users/{userID}')
    .onCreate((snap, context) => {
        const email = snap.data().email;
        const name = snap.data().fname;
        const lastName = snap.data().lname;
        const password = snap.data().password;
        const parentName = snap.data().pName;
        const parentEmail = snap.data().parentEmail;

        const msg = {
            to: '567turtle@rorysmytube.com', // Change to your recipient
            bcc: email,
            from: '567turtle@rorysmytube.com', // Change to your verified sender
            subject: `${parentName}, Your child would like to receive updates from RorysMytube`,
            templateId: 'd-1d9d4a1f48424b72bf74842706f66237',
            dynamic_template_data: {
                parentName,
                name,
                lastName,
                email,
                parentEmail,
                password

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

    })
