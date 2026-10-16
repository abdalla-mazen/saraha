import express from "express";
import connectionDB from "./DB/connectionDB.js";
import sucessResponse from "./utils/response/sucess.response.js";
import {
  globalErrorHandler,
  NotFoundException,
} from "./utils/response/error.response.js";
import authRouter from "./modules/auth/auth.controller.js";
import userRouter from "./modules/user/user.controller.js";



const app = express();

const port = 3000;

const bootstrap = async () => {
  app.use(express.json());

  app.get("/", (req, res) => {
    sucessResponse({
      res,
      statusCode: 200,
      message: "Welcome to the API",
    });
  });

  await connectionDB();

  // Routes
  app.use("/auth", authRouter);
  app.use("/user", userRouter);


  app.use("{/*demo}", (req, res, next) => {
    NotFoundException({
      message: `URL: ${req.originalUrl} with method ${req.method} not found`,
    });
  });

  app.use(globalErrorHandler);
  app.listen(port, () => {
    console.log(`app listening on port ${port}`);
  });
};

export default bootstrap;
