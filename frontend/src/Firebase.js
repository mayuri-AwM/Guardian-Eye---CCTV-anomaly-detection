// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAT-MW8Ji8yB-MY1L6qpb7Eq823M8B8r68",
  authDomain: "guardian-ai-20.firebaseapp.com",
  projectId: "guardian-ai-20",
  storageBucket: "guardian-ai-20.firebasestorage.app",
  messagingSenderId: "730639221350",
  appId: "1:730639221350:web:e4890c67f942f1f25f63a7",
  measurementId: "G-QQGPHXY472",
  databaseURL: "https://guardian-ai-20-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);