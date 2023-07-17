import notes from "./notes.js";
import teams from "./teams.js";
import boards from "./boards.js";
module.exports = (app, db, logger) => {
  notes(app, db, logger);
  teams(app, db, logger);
  boards(app, db, logger);
};