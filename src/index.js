import "dotenv/config";
import express from 'express';
import cors from 'cors';
import { log, log_green, log_red, log_yellow } from "./logger.js";
import {
  writeNote,
  readNotes,
  readNote,
  updateNote,
} from "./firebase.js";
import uuid4 from "uuid4";
const app = express();
app.use(cors());
const port = process.env.PORT || 3000;
app.get("/api/notes", async (req, res) => {
  log_green("GET HTTP method on /notes resource");
  const userId = req.query?.userId || null;
  const noteId = req.query?.noteId || null;
  if (noteId) {
    await readNote(userId, noteId, (data) => {
      return res.send(data);
    });
  }else {
    await readNotes(userId, (data) => {
      return res.send(data);
    });
  }
  if (!userId) {
    return res.send({ error: "No user ID provided"});
  }
});
app.post("/api/notes", async (req, res) => {
  const { userId, title, content, tags } = req.query;
  log_yellow(userId, title, content);
  const note = {
    userId: userId,
    id: uuid4(),
    title: title,
    content: content,
    tags: tags ? tags.split(",") : []
  };
  await writeNote(note.userId, note).then((response) => {
    log_yellow("Note written to the database");
    return res.send(response);
  })
  .catch((error) => {
    log_red("Failed to write note to the database", error);
  });
});
app.put("/api/notes/:noteID", async (req, res) => {
  log_yellow(`PUT HTTP method on /notes/${req.params.noteID} resource`);
  const { userId, noteId, title, content, tags } = req.query;
  const note = {
    userId,
    title,
    content,
    id: noteId,
    tags: tags ? tags.split(",") : []
  };
  await updateNote(userId, noteId, note).then((response) => {
    log_yellow("Note updated in the database");
    return res.send(response);
  });
});
app.delete("/api/notes/:noteID", (req, res) => {
  return res.send(`DELETE HTTP method on /notes/${req.params.noteID} resource`);
});
app.listen(port, () => {
  log_green(`Server listening on port ${port}!`);
});
