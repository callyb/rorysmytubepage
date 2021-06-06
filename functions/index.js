
// Firebase init
const admin = require('firebase-admin');
admin.initializeApp();

const sendConsentEmail = require('./sendConsentEmail.js')
const sendWelcomeEmail = require('./sendWelcomeEmail.js')
const sendgridNewVideo = require('./sendgridNewVideo')
const sendWelcomeEmailAdult = require('./sendWelcomeEmailAdult.js')
const moveRecord = require('./moveRecord.js')

exports.sendConsentEmail = sendConsentEmail.sendConsentEmail;
exports.sendWelcomeEmail = sendWelcomeEmail.sendWelcomeEmail;
exports.sendgridNewVideo = sendgridNewVideo.sendgridNewVideo;
exports.sendWelcomeEmailAdult = sendWelcomeEmailAdult.sendWelcomeEmailAdult;
exports.moveRecord = moveRecord.moveRecord;
