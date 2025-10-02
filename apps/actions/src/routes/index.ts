import { Hono } from "hono";
import votingRouter from "./voting.routes";

const rootRouter = new Hono();

rootRouter.route("/voting", votingRouter);

export default rootRouter;
