/**
 * Firestore helpers for date-based routines.
 *
 * Path layout:
 * /users/{userId}/routines/{YYYY-MM-DD}/{stepId}
 *
 * Exports:
 * - fetchDailySteps(userId, date)
 * - saveDailyStep(userId, date, step)   // creates/updates a single step
 * - deleteDailyStep(userId, date, stepId)
 * - addRoutineToFirestore(userId, date, step) // creates step doc with provided id (or generates one)
 *
 * NOTE: This file expects your ../firebase to export a routinesCollection(userId) helper
 * that returns a CollectionReference where per-date subcollections will live.
 *
 * Example of routinesCollection(userId) expected behavior:
 *   routinesCollection(userId) -> collection(db, 'users', userId, 'routinesRoot')
 *
 * We then use collection(routinesCollection(userId), date) to create per-date collections.
 */

import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  addDoc,
} from "firebase/firestore";
import { routinesCollection } from "../firebase";

// utility to get today's string 'YYYY-MM-DD'
const dateStr = (d = new Date()) => d.toISOString().split("T")[0];

/**
 * Fetch all steps for a given user and date (returns array of step objects).
 * If no date provided, uses today's date.
 */
export const fetchDailySteps = async (userId, date = dateStr()) => {
  if (!userId) return [];
  const dateCol = collection(routinesCollection(userId), date);
  const snap = await getDocs(dateCol);
  const steps = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  // keep original order if you stored an order field, otherwise natural
  return steps;
};

/**
 * Save (create or update) a single step under the user's date collection.
 * step must include .id (if not, a new doc id will be generated).
 */
export const saveDailyStep = async (userId, date = dateStr(), step) => {
  if (!userId || !step) return;
  const dateCol = collection(routinesCollection(userId), date);

  if (step.id) {
    const stepRef = doc(dateCol, step.id);
    await setDoc(stepRef, { ...step }, { merge: true });
    return { id: step.id, ...step };
  } else {
    // create new step with generated id
    const newDocRef = await addDoc(dateCol, { ...step });
    return { id: newDocRef.id, ...step };
  }
};

/**
 * Add a step to Firestore and return the stored step (with id).
 * This mirrors older addRoutineToFirestore but places it under the date collection.
 * If step.id exists, it will be used.
 */
export const addRoutineToFirestore = async (userId, step, date = dateStr()) => {
  return await saveDailyStep(userId, date, step);
};

/**
 * Delete a step from Firestore
 */
export const deleteDailyStep = async (userId, date = dateStr(), stepId) => {
  if (!userId || !stepId) return;
  const stepRef = doc(collection(routinesCollection(userId), date), stepId);
  await deleteDoc(stepRef);
};
