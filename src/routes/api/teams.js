import uuid4 from "uuid4";
module.exports = (app, db, logger) => {
  app.get("/api/teams", async (req, res) => {
    logger.log_green("GET HTTP method on /teams resource");
    const userId = req.query?.userId || null;
    const teamId = req.query?.teamId || null;
    if (teamId) {
      await db.getTeam(userId, teamId, (data) => {
        return res.send(data);
      });
    } else {
      await db.getTeam(userId, null, (data) => {
        return res.send(data);
      });
    }
    if (!userId) {
      return res.send({ error: "No user ID provided" });
    }
  });
  app.post("/api/teams", async (req, res) => {
    const { userId, title, description, members } = req.query;
    logger.log_yellow(userId, title, description);
    const Team = {
      userId: userId,
      id: uuid4(),
      title: title,
      description,
      members: members ? members.split(",") : [],
    };
    await db
      .createTeam(userId, Team)
      .then((response) => {
        logger.log_yellow("Team written to the database");
        return res.send(response);
      })
      .catch((error) => {
        logger.log_red("Route:Failed to write Team to the database", error);
        return error;
      });
  });
  // update Team
  app.put("/api/teams/", async (req, res) => {
    const { userId, teamId, title, description, members } = req.query;
    logger.log_yellow(`PUT HTTP method on /teams/${teamId} resource`);
    const Team = {
      userId: userId,
      id: teamId,
      title: title,
      description,
      members: members ? members.split(",") : [],
    };
    await db
      .updateTeam(userId, teamId, Team)
      .then((response) => {
        logger.log_yellow("Team updated in the database");
        return res.send(response);
      })
      .catch((error) => {
        logger.log_red("Route:Failed to update Team in the database", error);
        return error;
      });
  });
  // delete Team
  app.delete("/api/teams/", async (req, res) => {
    const { userId, teamId } = req.query;
    logger.log_red(`DELETE HTTP method on /teams/${teamId} resource`);
    await db
      .deleteTeam(userId, teamId)
      .then((response) => {
        logger.log_yellow("Route:Team deleted from the database");
        return res.send(response);
      })
      .catch((error) => {
        logger.log_red("Route:Failed to delete Team from the database", error);
        return error;
      });
  });
};
