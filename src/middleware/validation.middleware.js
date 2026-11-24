import { z } from "zod";
import { BadRequestException } from "../utils/response/error.response.js";

export const validation = (schema) => {
  const requestSchema = z.object(schema);

  return async (req, res, next) => {
    const results = await requestSchema.safeParseAsync({
      body: req.body,
      params: req.params,
      query: req.query,
      headers: req.headers,
      file: req.file,
      files: req.files,
    });

    if (!results.success) {
      throw BadRequestException({
        message: "Validation Error",
        extra: results.error.issues.map((issue) => ({
          location: issue.path[0],
          filed: issue.path.slice(1).join("."),
          message: issue.message,
        })),
      });
    }

    req.validate = results.data;
    return next();
  };
};
