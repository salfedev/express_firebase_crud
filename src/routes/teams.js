import uuid4 from "uuid4";
module.exports = (app, db, logger) => {
  app.get("/api/teams", async (req, res) => {
    logger.log_green("GET HTTP method on /teams resource");
    const userId = req.query?.userId || null;
    const teamId = req.query?.teamId || null;
    if (teamId) {
      await db.readNote(userId, teamId, (data) => {
        return res.send(data);
      });
    } else {
      await db.readNote(userId, null, (data) => {
        return res.send(data);
      });
    }
    if (!userId) {
      return res.send({ error: "No user ID provided" });
    }
  });
  app.post("/api/teams", async (req, res) => {
    const { userId, title, content, tags } = req.query;
    logger.log_yellow(userId, title, content);
    const note = {
      userId: userId,
      id: uuid4(),
      title: title,
      content: content,
      tags: tags ? tags.split(",") : [],
    };
    await db
      .writeNote(note.userId, note)
      .then((response) => {
        logger.log_yellow("Note written to the database");
        return res.send(response);
      })
      .catch((error) => {
        logger.log_red("Failed to write note to the database", error);
        return error;
      });
  });
  // update note
  app.put("/api/teams/", async (req, res) => {
    const { userId, teamId, title, content, tags } = req.query;
    logger.log_yellow(`PUT HTTP method on /teams/${teamId} resource`);
    const note = {
      userId,
      title,
      content,
      id: teamId,
      tags: tags ? tags.split(",") : [],
    };
    await db
      .updateNote(userId, teamId, note)
      .then((response) => {
        logger.log_yellow("Note updated in the database");
        return res.send(response);
      })
      .catch((error) => {
        logger.log_red("Failed to update note in the database", error);
        return error;
      });
  });
  // delete note
  app.delete("/api/teams/", async (req, res) => {
    const { userId, teamId } = req.query;
    logger.log_red(`DELETE HTTP method on /teams/${teamId} resource`);
    await db
      .deleteNote(userId, teamId)
      .then((response) => {
        logger.log_yellow("Note deleted from the database");
        return res.send(response);
      })
      .catch((error) => {
        logger.log_red("Failed to delete note from the database", error);
        return error;
      });
  });
};
