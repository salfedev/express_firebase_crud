import "dotenv/config";
import express from 'express';
import cors from 'cors';
import { log, log_green, log_red, log_yellow } from "./logger.js";
import { writeNoteData } from "./firebase.js";

const app = express();
app.use(cors());
const port = process.env.PORT || 3000;

app.get("/api/notes", (req, res) => {
  log("GET HTTP method on /notes resource");
  return res.send("GET HTTP method on /notes resource");
});

app.post("/api/notes", async (req, res) => {
  const note = {
    userId: "1",
    id: "1",
    title: "My first note",
    content: "Hello world!",
  };
  await writeNoteData(note.userId, note).then((response) => {
    log_yellow("Note written to the database");
    return res.send(response);
  })
  .catch((error) => {
    log_red("Note failed to write to the database", error);
  });
});

app.put("/api/notes/:noteID", (req, res) => {
  return res.send(`PUT HTTP method on /notes/${req.params.noteID} resource`);
});

app.delete("/api/notes/:noteID", (req, res) => {
  return res.send(`DELETE HTTP method on /notes/${req.params.noteID} resource`);
});

app.listen(port, () => {
  log_green(`Server listening on port ${port}!`);
});



