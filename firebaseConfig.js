import { initializeApp } from 'firebase/app';
//import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import {firebase} from 'firebase/compat/app';

const firebaseConfig = {
  apiKey: "AIzaSyAqLWdEX2bdwTQklwdB8BADwdi1qqVyUTw",
  authDomain: "skillfolio-firebase.firebaseapp.com",
  projectId: "skillfolio-firebase",
  storageBucket: "skillfolio-firebase.appspot.com",
  messagingSenderId: "984322750658",
  appId: "1:984322750658:web:8fe6dec58bb795f5fee35b",
};

export const app = initializeApp(firebaseConfig);
export const FIRESTORE_DB = getFirestore(app);
export {firebase};
//export const FIREBASE_AUTH = getAuth(FIREBASE_APP);