// src/utils/saveRoutines.js
import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  addDoc,
  getDoc,
} from "firebase/firestore";
import { routinesCollection, userDocRef, historyCollection } from "../firebase";

// Utility to get today's string 'YYYY-MM-DD'
const dateStr = (d = new Date()) => d.toISOString().split("T")[0];

/**
 * Fetch all steps for a given user and date (returns array of step objects).
 * If no date provided, uses today's date.
 */
export const fetchDailySteps = async (userId, date = dateStr()) => {
  if (!userId) return [];
  const dateCol = routinesCollection(userId, date); // users/{userId}/{date}
  console.log(`Fetching steps for userId: ${userId}, date: ${date}`);
  try {
    const snap = await getDocs(dateCol);
    const steps = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    console.log(`Successfully fetched ${steps.length} steps for ${date}`);
    return steps;
  } catch (err) {
    console.error(`Failed to fetch daily steps for ${date}:`, err);
    return [];
  }
};

/**
 * Save (create or update) a single step under the user's date collection.
 * step must include .id (if not, a new doc id will be generated).
 */
export const saveDailyStep = async (userId, date = dateStr(), step) => {
  if (!userId || !step) return;
  const dateCol = routinesCollection(userId, date); // users/{userId}/{date}
  console.log(`Saving step for userId: ${userId}, date: ${date}, stepId: ${step.id || 'new'}`);
  try {
    if (step.id) {
      const stepRef = doc(dateCol, step.id);
      await setDoc(stepRef, { ...step }, { merge: true });
      console.log(`Successfully saved step ${step.id} for ${date}`);
      return { id: step.id, ...step };
    } else {
      const newDocRef = await addDoc(dateCol, { ...step });
      console.log(`Successfully added new step ${newDocRef.id} for ${date}`);
      return { id: newDocRef.id, ...step };
    }
  } catch (err) {
    console.error(`Failed to save daily step for ${date}, stepId: ${step.id}:`, err);
  }
};

export const addRoutineToFirestore = async (userId, step, date = dateStr()) => {
  console.log(`Adding routine to Firestore for userId: ${userId}, date: ${date}`);
  return await saveDailyStep(userId, date, step);
};

/**
 * Delete a step from Firestore
 */
export const deleteDailyStep = async (userId, date = dateStr(), stepId) => {
  if (!userId || !stepId) return;
  const dateCol = routinesCollection(userId, date);
  const stepRef = doc(dateCol, stepId);
  console.log(`Deleting step for userId: ${userId}, date: ${date}, stepId: ${stepId}`);
  try {
    await deleteDoc(stepRef);
    console.log(`Successfully deleted step ${stepId} for ${date}`);
  } catch (err) {
    console.error(`Failed to delete step ${stepId} for ${date}:`, err);
  }
};

/**
 * Fetch the last updated date for a user from Firestore.
 */
export const fetchLastUpdated = async (userId) => {
  if (!userId) return null;
  const userRef = userDocRef(userId);
  console.log(`Fetching lastUpdated for userId: ${userId}`);
  try {
    const docSnap = await getDoc(userRef);
    const lastUpdated = docSnap.exists() ? docSnap.data().lastUpdated : null;
    console.log(`Successfully fetched lastUpdated: ${lastUpdated} for ${userId}`);
    return lastUpdated;
  } catch (err) {
    console.error(`Failed to fetch lastUpdated for ${userId}:`, err);
    return null;
  }
};

/**
 * Save the last updated date for a user to Firestore.
 */
export const saveLastUpdated = async (userId, date) => {
  if (!userId || !date) return;
  const userRef = userDocRef(userId);
  console.log(`Saving lastUpdated: ${date} for userId: ${userId}`);
  try {
    await setDoc(userRef, { lastUpdated: date }, { merge: true });
    console.log(`Successfully saved lastUpdated: ${date} for ${userId}`);
  } catch (err) {
    console.error(`Failed to save lastUpdated for ${userId}:`, err);
  }
};

/**
 * Save the daily history summary for a user to Firestore.
 */
export const saveHistory = async (userId, date, completed, total) => {
  if (!userId || !date || total === 0) return;
  const historyDoc = doc(historyCollection(userId), date);
  console.log(`Saving history for userId: ${userId}, date: ${date}, completed: ${completed}, total: ${total}`);
  try {
    await setDoc(historyDoc, { completed, total }, { merge: true });
    console.log(`Successfully saved history for ${date}`);
  } catch (err) {
    console.error(`Failed to save history for ${date}:`, err);
  }
};