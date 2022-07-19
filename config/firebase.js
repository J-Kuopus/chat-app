import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyC4Mks67a5pf5KN23qsYi7cGLJvsgWBD0g",
    authDomain: "meet-app-352610.firebaseapp.com",
    projectId: "meet-app-352610",
    storageBucket: "meet-app-352610.appspot.com",
    messagingSenderId: "590789825703",
    appId: "1:590789825703:web:a31eb550ca5bc62f743782"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service (db)
export const db = getFirestore(app);