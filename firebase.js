import firebase from "firebase";
import "firebase/auth"
import "firebase/firestore"
import "firebase/storage"

var firebaseConfig = {
  apiKey: "AIzaSyB3c0R6rTH4e2umanhKW19rTn6615dREiM",
  authDomain: "minimal-social-media.firebaseapp.com",
  projectId: "minimal-social-media",
  storageBucket: "minimal-social-media.appspot.com",
  messagingSenderId: "864231971024",
  appId: "1:864231971024:web:7c7007958cd3b063cb66d5",
};

var firebaseApp;

if (!firebase.apps.length) {
  firebaseApp = firebase.initializeApp(firebaseConfig);
} else {
  firebaseApp = firebase.app();
}

const db = firebaseApp.firestore();
const Auth = firebase.auth();
const storage = firebase.storage();
const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp
const googleProvider = new firebase.auth.GoogleAuthProvider();
const facebookProvider = new firebase.auth.FacebookAuthProvider();
const githubProvider = new firebase.auth.GithubAuthProvider();

export { Auth, googleProvider, facebookProvider, githubProvider, storage,serverTimestamp };
export default db;