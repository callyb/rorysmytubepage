import * as firebase from "firebase";
import 'firebase/firestore';

const config = {
    apiKey: process.env.REACT_APP_FIREBASE_KEY,
    databaseURL: "https://rorysmytube.firebaseio.com",
    projectId: "rorysmytube",
    appId: process.env.REACT_APP_FIREBASE_APPID,
    measurementId: "G-YE2VM9S32Z"
}

export default !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();