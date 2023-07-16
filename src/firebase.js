import { log } from "./logger.js";
import { initializeApp } from "firebase/app";
// firebase database
import { getDatabase, ref, set, onValue } from "firebase/database";
// firebase auth
// import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};
// Initialize Firebase
log("Intialiazing with: project -", firebaseConfig.projectId);
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// write note to firebase
const writeNote = async (userId, note) => {
  return set(ref(db, `users/${userId}/notes/${note.id}`), note).catch((error) => {
    log("Failed to write note to the database", error);
    return error;
  })
};

// read all or a single note from firebase
const readNote = async (userId, noteId, callback) => {
  let noteRef = noteId ? ref(db, `users/${userId}/notes/${noteId}`) : ref(db, `users/${userId}/notes`);
  return await onValue(noteRef, (snapshot) => {
    const data = snapshot.val();
    return callback(data);
  })
};

const updateNote = async (userId, noteId, note) => {
  set(ref(db, `users/${userId}/notes/${noteId}`), note)
  .catch((error) => {
    log("Failed to update note in the database", error);
    return error;
  });
};

const deleteNote = async (userId, noteId) => {
  set(ref(db, `users/${userId}/notes/${noteId}`), null)
  .catch((error) => {
    log("Failed to delete note from the database", error);
    return error;
  });
};

module.exports = {
  writeNote,
  readNote,
  updateNote,
  deleteNote,
};