import uuid4 from "uuid4";
module.exports = (app, db, logger) => {
  const routePath = "/api/boards";
  app.get(routePath, async (req, res) => {
    logger.green("GET HTTP method on /Boards resource");
    logger.yellow(req.query);
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
  app.post(routePath, async (req, res) => {
    const { userId, sprint, description, teamId } = req.query;
    logger.yellow(userId, sprint, description, teamId);
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
        logger.yellow("Board written to the database");
        return res.send(response);
      })
      .catch((error) => {
        logger.red("Route:Failed to write Board to the database", error);
        return error;
      });
  });
  app.put(routePath, async (req, res) => {
    const { userId, sprint, description, teamId, boardId } = req.query;
    const Board = {
      userId: userId,
      id: boardId,
      sprint,
      description,
      teamId,
    };

    await db
      .updateBoard(userId, Board)
      .then((response) => {
        logger.yellow("Board written to the database");
        return res.send(response);
      })
      .catch((error) => {
        logger.red("Route:Failed to write Board to the database", error);
        return error;
      });
  });
  app.delete(routePath, async (req, res) => {
    const { userId, teamId, boardId } = req.query;
    logger.yellow(userId, teamId, boardId);
    await db
      .deleteBoard(userId, boardId, teamId)
      .then((response) => {
        logger.yellow("Board deleted from the database");
        return res.send(response);
      })
      .catch((error) => {
        logger.red("Route:Failed to delete Board from the database", error);
        return error;
      });
  });
};
