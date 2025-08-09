// src/firebase.js
    import { initializeApp } from "firebase/app";
    import { getAuth } from "firebase/auth";
    import { getFirestore, collection } from "firebase/firestore";

    const firebaseConfig = {
      apiKey: "AIzaSyB2n8tN3f9U7bbBMbvq6yrrS128fnUBCwA",
      authDomain: "autism-daily-visual-planner.firebaseapp.com",
      projectId: "autism-daily-visual-planner",
      storageBucket: "autism-daily-visual-planner.firebasestorage.app",
      messagingSenderId: "813448066529",
      appId: "1:813448066529:web:e9665a4d49c0ea36098ea0"
    };

    const app = initializeApp(firebaseConfig);

    export const auth = getAuth(app);
    export const db = getFirestore(app);
    export const routinesCollection = (userId) => collection(db, `users/${userId}/routines`);