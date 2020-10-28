import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAOsyqoWHemIQtrU-mokDwSmgINykMoIb8",
  authDomain: "epap-fileupload.firebaseapp.com",
  databaseURL: "https://epap-fileupload.firebaseio.com",
  projectId: "epap-fileupload",
  storageBucket: "epap-fileupload.appspot.com",
  messagingSenderId: "1081787855174",
  appId: "1:1081787855174:web:b934512f105b28109eb547",
  measurementId: "G-KJ1005CNBL",
};

firebase.initializeApp(firebaseConfig);

export const realtimeDb = firebase.database();
export const firestoreDb = firebase.firestore();
