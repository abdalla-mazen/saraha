import morgan from "morgan";
import fs from "node:fs";
import path from "node:path";

const logDirectory = path.join(process.cwd(), "src/utils/logger");

fs.mkdirSync(logDirectory, { recursive: true });

const logFile = path.join(logDirectory, "access.log");

console.log("Log file path:", logFile);

const accessLogStream = fs.createWriteStream(logFile, {
  flags: "a",
});

accessLogStream.on("open", () => {
  console.log("Log file opened successfully");
});

accessLogStream.on("error", (err) => {
  console.error("Log stream error:", err);
});

export const loggerMiddleware = morgan("combined", {
  stream: accessLogStream,
});
