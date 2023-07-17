import notes from "./api/notes.js";
import teams from "./api/teams.js";
import boards from "./api/boards.js";
module.exports = (app, db, logger) => {
  notes(app, db, logger);
  teams(app, db, logger);
  boards(app, db, logger);
};