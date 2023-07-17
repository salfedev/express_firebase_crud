import uuid4 from "uuid4";
module.exports = (app, db, logger) => {
  app.get("/api/Boards", async (req, res) => {
    logger.log_green("GET HTTP method on /Boards resource");
    logger.log_yellow(req.query);
    const userId = req.query?.userId || null;
    const teamId = req.query?.teamId || null;
    const boardId = req.query?.boardId || null;
    if (boardId) {
      await db.getBoard(userId, teamId, boardId, (data) => {
        return res.send(data);
      });
    } else {
      await db.getBoard(userId, teamId, null, (data) => {
        return res.send(data);
      });
    }
    if (!userId || !teamId) {
      return res.send({ error: "No user ID provided" });
    }
  });
  app.post("/api/Boards", async (req, res) => {
    const { userId, sprint, description, teamId } = req.query;
    logger.log_yellow(userId, sprint, description, teamId);
    const Board = {
      userId: userId,
      id: uuid4(),
      sprint,
      description,
      teamId,
    };
    await db
      .createBoard(userId, Board)
      .then((response) => {
        logger.log_yellow("Board written to the database");
        return res.send(response);
      })
      .catch((error) => {
        logger.log_red("Route:Failed to write Board to the database", error);
        return error;
      });
  });
};
