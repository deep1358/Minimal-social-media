import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

var firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
};

var firebaseApp;

if (!firebase.apps.length) firebaseApp = firebase.initializeApp(firebaseConfig);
else firebaseApp = firebase.app();

const db = firebaseApp.firestore();
const Auth = firebase.auth();
const storage = firebase.storage();
const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;
const googleProvider = new firebase.auth.GoogleAuthProvider();

export { Auth, googleProvider, storage, serverTimestamp };
export default db;
