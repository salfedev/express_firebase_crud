import "dotenv/config";
import express from 'express';
import cors from 'cors';
import logger from "./logger.js";
import routes from "./routes/index.js";
import * as db from "./firebase.js";
// import uuid4 from "uuid4";

// initialize express
const app = express();
app.use(cors());

// port
const port = process.env.PORT || 3000;

// routes
routes(app, db, logger);

// start the Express server
app.listen(port, () => {
  logger.log_green(`Server listening on port ${port}!`);
});
