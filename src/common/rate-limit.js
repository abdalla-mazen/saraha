import { rateLimit, ipKeyGenerator } from "express-rate-limit";
import { expireKey, incrkey } from "./services/cache.service.js";

function rateLimitMiddleware({
  windowMs = 15 * 60 * 1000,
  limit = 100,
} = {}) {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,

    handler: (req, res) => {
      return res.status(429).json({
        message: "Too many requests, try later",
      });
    },

    keyGenerator: (req) => {
      const ip = ipKeyGenerator(req.ip);

      return `${ip}_${req.path}`;
    },

    store: {
      async increment(key) {
        const totalHits = Number(await incrkey(key));

        if (totalHits === 1) {
          await expireKey({
            key,
            ttl: Math.ceil(windowMs / 1000),
          });
        }

        return {
          totalHits,
          resetTime: new Date(Date.now() + windowMs),
        };
      },

      async decrement(key) {
        // Optional
      },

      async resetKey(key) {
        // Optional
      },
    },
  });
}

export default rateLimitMiddleware;
