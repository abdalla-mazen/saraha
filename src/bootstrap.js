import express from "express";
import connectionDB from "./DB/connectionDB.js";
import sucessResponse from "./utils/response/sucess.response.js";
import {
  globalErrorHandler,
  NotFoundException,
} from "./utils/response/error.response.js";
import authRouter from "./modules/auth/auth.controller.js";
import userRouter from "./modules/user/user.controller.js";
import { resolve } from "path";
import messageRouter from "./modules/messages/message.controller.js";
import cors from "cors";
import helmet from "helmet";
import rateLimitMiddleware from "./common/rate-limit.js";
import { loggerMiddleware } from "./utils/logger/logger.js";

const app = express();

const port = 3000;


const bootstrap = async () => {
  // connect to database
  await connectionDB();

  // logger middleware
  app.use(loggerMiddleware);

  // middlewares
  app.use(express.json(), cors(), helmet());

  // rate limit middleware
  app.use(rateLimitMiddleware());


  // Routes
  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/message", messageRouter);
  app.use("/uploads", express.static(resolve("./src/uploads")));

  // Home route
  app.get("/", (req, res) => {
    sucessResponse({
      res,
      statusCode: 200,
      message: "Welcome to the API",
    });
  });

  // 404 route
  app.use("{/*demo}", (req, res, next) => {
    NotFoundException({
      message: `URL: ${req.originalUrl} with method ${req.method} not found`,
    });
  });


  // global error handler
  app.use(globalErrorHandler);

  // start server
  app.listen(port, () => {
    console.log(`app listening on port ${port}`);
  });
};

export default bootstrap;
