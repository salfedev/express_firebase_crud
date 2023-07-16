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

// write record to firebase users's collection
const writeRecord = async (userId, record) => {
  return set(
    ref(db, `users/${userId}/${record.type}/${record.id}`),
    record
  ).catch((error) => {
    log("Failed to write note to the database", error);
    return error;
  });
};

// read all or a single record from firebase users's collection
const readRecord = async (userId, record, callback) => {
  let noteRef = record.id
    ? ref(db, `users/${userId}/${record.type}/${record.id}`)
    : ref(db, `users/${userId}/${record.type}`);
  return await onValue(noteRef, (snapshot) => {
    const data = snapshot.val();
    return callback(data);
  })
};

const updateRecord = async (userId, record, data) => {
  set(ref(db, `users/${userId}/${record.type}/${record.id}`), data)
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
  writeNote: async (userId, record) => {
    record.type = "notes";
    return await writeRecord(userId, record);
  },
  readNote: async (userId, noteId, callback) => {
    return await readRecord(userId, { type: "notes", id: noteId }, callback);
  },
  updateNote: async (userId, noteId, note) => {
    const record = {id: noteId, type: "notes"};
    return await updateRecord(userId, record, note);
  },
  deleteNote,
};