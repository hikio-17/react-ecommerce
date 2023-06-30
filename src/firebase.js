import firebase from "firebase/compat/app";
import "firebase/compat/auth";

//firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCr0eoVKQSmgp3SVs0nppxo-f0P_1uVw_E",
  authDomain: "ecommerce-465aa.firebaseapp.com",
  projectId: "ecommerce-465aa",
  storageBucket: "ecommerce-465aa.appspot.com",
  messagingSenderId: "1090447031357",
  appId: "1:1090447031357:web:b594ba73de4580cd787e54",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//export
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
