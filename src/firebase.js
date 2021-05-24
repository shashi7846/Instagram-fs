import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyC9qTW8kT5z3fkYIbyXMMEvt9sIeyHI_iU",
authDomain: "instagram-fs.firebaseapp.com",
projectId: "instagram-fs",
storageBucket: "instagram-fs.appspot.com",
messagingSenderId: "933075752552",
appId: "1:933075752552:web:5ed46fa06dd7ab06a58ddd"
    
});
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db, auth, storage};