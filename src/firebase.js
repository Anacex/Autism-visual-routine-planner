// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, doc, getDocs, query, where, setDoc, getDoc } from "firebase/firestore";

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
export const userDocRef = (userId) => doc(db, "users", userId); // Document reference for user
export const routinesCollection = (userId, date) => collection(userDocRef(userId), date); // Direct date-based collection
export const historyCollection = (userId) => collection(userDocRef(userId), "history");

export const fetchRoutines = async (userId) => {
  const q = query(routinesCollection(userId, new Date().toISOString().split("T")[0]));
  const querySnapshot = await getDocs(q);
  const routines = [];
  querySnapshot.forEach((doc) => {
    routines.push({ id: doc.id, ...doc.data() });
  });
  return routines;
};

export const fetchLastUpdated = async (userId) => {
  const userRef = userDocRef(userId);
  const docSnap = await getDoc(userRef);
  return docSnap.exists() ? docSnap.data().lastUpdated : null;
};

export const saveLastUpdated = async (userId, date) => {
  const userRef = userDocRef(userId);
  await setDoc(userRef, { lastUpdated: date }, { merge: true });
};

export const saveHistory = async (userId, date, completed, total) => {
  const historyDoc = doc(historyCollection(userId), date);
  await setDoc(historyDoc, { completed, total }, { merge: true });
};