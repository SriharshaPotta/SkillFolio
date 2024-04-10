import { initializeApp } from 'firebase/app';
//import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import {firebase} from 'firebase/compat/app';

const firebaseConfig = {
  apiKey: "AIzaSyCi0qp2B-PrL7HT8eqyKiUnIRIVkLtINwY",
  authDomain: "fbla-mobileappdev.firebaseapp.com",
  projectId: "fbla-mobileappdev",
  storageBucket: "fbla-mobileappdev.appspot.com",
  messagingSenderId: "489359386388",
  appId: "1:489359386388:web:846648226bdfed7d500401",
  measurementId: "G-NSRTGL9F9Z",
};

export const app = initializeApp(firebaseConfig);
export const FIRESTORE_DB = getFirestore(app);
export {firebase};
//export const FIREBASE_AUTH = getAuth(FIREBASE_APP);