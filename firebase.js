// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBCdtwzuqrHdo2c0N6Cba5qcY9OMVQYuRs",
  authDomain: "flashcard-saas-17dbd.firebaseapp.com",
  projectId: "flashcard-saas-17dbd",
  storageBucket: "flashcard-saas-17dbd.appspot.com",
  messagingSenderId: "345400008142",
  appId: "1:345400008142:web:496c8f65bef626d55f1f9f",
  measurementId: "G-Z8EP0QNHTR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app)

export {db}