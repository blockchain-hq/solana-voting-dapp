import { serve } from "@hono/node-server";
import { Hono } from "hono";
import rootRouter from "./routes/index";
import { cors } from "hono/cors";

const app = new Hono();

app.use(
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/api/v1", rootRouter);

serve(
  {
    fetch: app.fetch,
    port: 5050,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
