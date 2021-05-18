
// Firebase init
const admin = require('firebase-admin');
admin.initializeApp();

const sendConsentEmail = require('./sendConsentEmail.js')
const sendWelcomeEmail = require('./sendWelcomeEmail.js')
const sendNewVidEmail = require('./sendNewVidEmail.js')

exports.sendConsentEmail = sendConsentEmail.sendConsentEmail;
exports.sendWelcomeEmail = sendWelcomeEmail.sendWelcomeEmail;
exports.sendNewVidEmail = sendNewVidEmail.sendNewVidEmail;