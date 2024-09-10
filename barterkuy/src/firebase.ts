// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA658QHqHBoxv4nHszgrVEfjVa3UnYl5Z4",
  authDomain: "barterkuy-otp.firebaseapp.com",
  projectId: "barterkuy-otp",
  storageBucket: "barterkuy-otp.appspot.com",
  messagingSenderId: "611178317632",
  appId: "1:611178317632:web:5e8bf5fcc5e41b1629dca5"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
auth.useDeviceLanguage();

export {auth};