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
exports.sendNewVideoEmail = functions.firestore
    .document('mytubePage/{uid}/')
    .onCreate(async (snap, context) => {
        // Get an object representing the document
        // e.g. {'name': 'Marie', 'age': 66}
        const newValue = snap.data();
        const users = functions.firestore.document('users2/{uid}');
        // access a particular field as you would any JS property
        const newVideoTitle = newValue.title;
        const newVideoDescription = newValue.description;
        users.get()
            .then((querySnapshot) => {
                let users = [];
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    console.log(doc.id, " => ", doc.data());
                    users.push(doc.data().subscriberEmail)
                    console.log('users = ', users)
                });
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
        // perform desired operations ...
        if (newVideoTitle) {

            const mailOptions = {
                from: `567turtle@rorysmytube.com`,
                to: users,
                subject: '567turtle has uploaded a new video!',
                html: `<link href="https://fonts.googleapis.com/css2?family=Poppins&family=Roboto+Condensed&display=swap" rel="stylesheet">
    <style>
    h2 {font-family: 'Roboto Condensed', sans-serif;} p, li, h4 {font-family: 'Poppins', sans-serif;} .spacing-below {margin-bottom: 3em;}</style>
    
    <h2>rorysyoutube.com has a new video called ${newVideoTitle}</h2>

<p> 567turtle says this about ${newVideoTitle}: ${newVideoDescription}.  
</p></ br>
<h4>Watch ${newVideoTitle} <a href="https://rorysmytube.com" target="_blank">here.</a>and please tick 'like' if you like it!</h4>

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