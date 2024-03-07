import { initializeApp } from "firebase/app";
import {getDatabase} from "firebase/database";
import {getStorage} from "firebase/storage";
import {getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyB0JyZvHGl9Odk5JAUiokFuVUJI0Gw9Wfw",
  authDomain: "getsente-f09f3.firebaseapp.com",
  projectId: "getsente-f09f3",
  storageBucket: "getsente-f09f3.appspot.com",
  messagingSenderId: "794518004026",
  appId: "1:794518004026:web:62f67a21be8b60c92b3003"
};

const app = initializeApp(firebaseConfig);
const firebase_database = getDatabase(app);
const firebase_auth = getAuth(app);
const firebase_storage = getStorage(app);
const firebase_firestore = getFirestore(app);
export {
    app, firebase_auth, firebase_database, firebase_storage, firebase_firestore
}