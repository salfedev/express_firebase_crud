import { log } from "./logger.js";
import { initializeApp } from "firebase/app";
// firebase database
import { getDatabase, ref, set, onValue } from "firebase/database";
// firebase auth
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";

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
log('Intialiazing with: ', firebaseConfig);
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// write note to firebase
const writeNote = async (userId, note) => {
  set(ref(db, `users/${userId}/notes/${note.id}`), note);
};

// read all user's notes from firebase
const readNotes = async (userId, callback) => {
  const notesRef = ref(db, `users/${userId}/notes`);
  onValue(notesRef, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });
};

// read single note from firebase
const readNote = async (userId, noteId, callback) => {
  const noteRef = ref(db, `users/${userId}/notes/${noteId}`);
  onValue(noteRef, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });
};

const updateNote = async (userId, noteId, note) => {
  set(ref(db, `users/${userId}/notes/${noteId}`), note);
};



module.exports = {
  writeNote,
  readNotes,
  readNote,
  updateNote,
};