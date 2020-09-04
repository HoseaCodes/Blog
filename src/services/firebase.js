import firebase from "firebase/app";
import "firebase/auth";

const config =
{
    apiKey: "AIzaSyC3kykUu2qvOfOfkjYSxDeSUljA71dbmmU",
    authDomain: "hoseacodes.firebaseapp.com",
    databaseURL: "https://hoseacodes.firebaseio.com",
    projectId: "hoseacodes",
    storageBucket: "hoseacodes.appspot.com",
    messagingSenderId: "95996898355",
    appId: "1:95996898355:web:a991b3570d3870a54c0746",
    measurementId: "G-G6RJ0773QB"
};

firebase.initializeApp(config);

const auth = firebase.auth();

/* Configure a provider for authentication */
const googleAuthProvider = new firebase.auth.GoogleAuthProvider()

/* Set up a login/lougout */

function login() {
    return auth.signInWithPopup(googleAuthProvider);
}

function logout() {
    return auth.signOut();
}
/* Export functionality */

export {
    login,
    logout,
    auth
}