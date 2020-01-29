import * as firebase from "firebase";
import 'firebase/firestore';

const config = {
    apiKey: "AIzaSyBcrrIsC8_N3q00BJy1NSC9ZvOWRCeb4D0",
    databaseURL: "https://rorysmytube.firebaseio.com",
    projectId: "rorysmytube",
    appId: "1:942530803543:web:0be70dc558182459467012",
    measurementId: "G-YE2VM9S32Z"
}

export default !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();