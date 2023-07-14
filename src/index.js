// console.log('Hello: ', process.env.MY_SECRET);
import "dotenv/config";
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
const port = process.env.PORT || 3000;

app.get("/api/notes", (req, res) => {
  return res.send("GET HTTP method on user resource");
});

app.post("/api/notes", (req, res) => {
  return res.send("POST HTTP method on user resource");
});

app.put("/api/notes", (req, res) => {
  return res.send("PUT HTTP method on user resource");
});

app.delete("/api/notes", (req, res) => {
  return res.send("DELETE HTTP method on user resource");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}!`);
});



