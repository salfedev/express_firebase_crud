// console.log('Hello: ', process.env.MY_SECRET);
import "dotenv/config";
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
const port = process.env.PORT || 3000;
app.get('/', (req, res) => {
  res.send('Hello ever running world!');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}!`);
});



