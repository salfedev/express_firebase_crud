import notes from "./notes.js";
import teams from "./teams.js";

module.exports = (app, db, logger) => {
  notes(app, db, logger);
  teams(app, db, logger);
};