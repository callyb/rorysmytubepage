const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail')

const SENDGRID_API_KEY = functions.config().sendgrid.key
sgMail.setApiKey(SENDGRID_API_KEY)

//Creating a Firebase Cloud Function
exports.sendgridNewVideo = functions.firestore
    .document('mytubePage/{uid}')
    .onCreate(async (snap, context) => {

        const newVideoName = snap.data().title;
        const newVideoDescription = snap.data().description;

        const userSnapshots = await admin.firestore().collection('users').get();
        const emails = userSnapshots.docs.map(snap => snap.data().email);
        console.log('emails = ', emails)

        const msg = {
            to: '567turtle@rorysmytube.com', // Change to your recipient
            bcc: emails,
            from: '567turtle@rorysmytube.com', // Change to your verified sender
            subject: 'New video on rorysmytube.com',
            templateId: 'd-67f1b971259e48e9bffb5a1ae5f33130',
            dynamic_template_data: {
                title: newVideoName,
                description: newVideoDescription
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
