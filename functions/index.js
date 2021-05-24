
// Firebase init
const admin = require('firebase-admin');
admin.initializeApp();

const sendConsentEmail = require('./sendConsentEmail.js')
const sendWelcomeEmail = require('./sendWelcomeEmail.js')
const sendgridNewVideo = require('./sendgridNewVideo')

exports.sendConsentEmail = sendConsentEmail.sendConsentEmail;
exports.sendWelcomeEmail = sendWelcomeEmail.sendWelcomeEmail;
exports.sendgridNewVideo = sendgridNewVideo.sendgridNewVideo;