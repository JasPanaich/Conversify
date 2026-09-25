import arcjet, { shield, detectBot, slidingWindow } from "@arcjet/node";
import { ENV } from "./env.js";

const aj = arcjet({
  key: ENV.ARCJET_KEY,
  rules: [
    // Shield protects your app from common attacks such as SQL injection
    shield({ mode: "LIVE" }),
    // Create a bot detection rule
    detectBot({
      mode: "LIVE", // Blocks requests. Use "DRY_RUN" to log only
      // Block all bots except the following
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
        "CATEGORY:TOOL", // To allow postman to send requests
      ],
    }),
    // Create a token bucket rate limit. Other algorithms are supported.
    // Allow 100 requests / minute
    slidingWindow({
      mode: "LIVE", // Blocks requests
      max:100,
      interval:60,
    }),
  ],
});

export default aj;