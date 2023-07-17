import logger from "./logger.js";
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
logger.log("Intialiazing with: project -", firebaseConfig.projectId);
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const logData = (operation, type, data) => {
  logger.blue(`--${operation} to : `, type);
  logger.debug("--with data: ", data);
};
// write record to firebase users's collection
const writeRecord = async (userId, record) => {
  const type = record.type;
  record.createdAt = new Date().toDateString();
  record.updatedAt = new Date().toDateString();
  delete record.type;
  logData('writing', type, record);
  return set(
    ref(db, `users/${userId}/${type}/${record.id}`),
    record
  ).catch((error) => {
    logger.red(`DB:Failed to write ${type} to the database`, error.message);
    throw error;
  });
};

// read all or a single record from firebase users's collection
const readRecord = async (userId, record, callback) => {
  const type = record.type;
  delete record.type;
  logData('reading', type, record);
  let recordRef = record.id
    ? ref(db, `users/${userId}/${type}/${record.id}`)
    : ref(db, `users/${userId}/${type}`);
  return await onValue(recordRef, (snapshot) => {
    const data = snapshot.val();
    return callback(data);
  });
};

const updateRecord = async (userId, record, data) => {
  const type = record.type;
  data.updatedAt = new Date().toDateString();
  logData('updating', type, data);
  set(ref(db, `users/${userId}/${type}/${record.id}`), data).catch(
    (error) => {
      logger.red(`DB:Failed to update ${type} in the database`, error);
      return error;
    }
  );
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
    const record = { id: noteId, type: "notes" };
    return await updateRecord(userId, record, note);
  },
  deleteNote: async (userId, noteId) => {
    const record = { id: noteId, type: "notes" };
    return await updateRecord(userId, record, null);
  },
  createTeam: async (userId, team) => {
    const record = { ...team, type: "teams" };
    return await writeRecord(userId, record);
  },
  getTeam: async (userId, teamId, callback) => {
    return await readRecord(userId, { type: "teams", id: teamId }, callback);
  },
  updateTeam: async (userId, teamId, team) => {
    const record = { id: teamId, type: "teams" };
    return await updateRecord(userId, record, team);
  },
  deleteTeam: async (userId, teamId) => {
    const record = { id: teamId, type: "teams" };
    return await updateRecord(userId, record, null);
  },
  getBoard: async (userId, teamId, boardId, callback) => {
    return await readRecord(
      userId,
      { type: `teams/${teamId}/boards/`, id: boardId },
      callback
    );
  },
  createBoard: async (userId, board) => {
    const record = { ...board, type: `teams/${board.teamId}/boards/` };
    return await writeRecord(userId, record);
  },
  updateBoard: async (userId, board) => {
    const record = { id: board.id, type: `teams/${board.teamId}/boards/` };
    return await updateRecord(userId, record, board);
  },
  deleteBoard: async (userId, boardId, teamId) => {
    const record = { id: boardId, type: `teams/${teamId}/boards/` };
    return await updateRecord(userId, record, null);
  }
};
