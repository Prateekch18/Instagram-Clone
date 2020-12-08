import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCU7LFyzG4bertXvO2e0UYLvBSE11pinsM",
    authDomain: "insta-a46e3.firebaseapp.com",
    projectId: "insta-a46e3",
    storageBucket: "insta-a46e3.appspot.com",
    messagingSenderId: "662799527468",
    appId: "1:662799527468:web:e9651a9252c7178030eb89",
    measurementId: "G-JB9DEXBNZL"
});


const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const storage = firebaseApp.storage();

export { db, auth, storage };