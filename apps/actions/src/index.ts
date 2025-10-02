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

export default app;

if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  serve({
    fetch: app.fetch,
    port: 3001,
  });
  console.log("Server is running on port 3001");
}
