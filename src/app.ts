import express, { Application, Request, Response } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import rateLimit from "express-rate-limit";
import cors from "cors";

const app: Application = express();
const port: number = 3000;
const API_SERVICE_URL = "https://apiv2.spect.network/";
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // limit each IP to 60 requests per windowMs
});

app.use(
  cors({
    origin: function (origin, callback) {
      return callback(null, true);
    },
    optionsSuccessStatus: 200,
    credentials: true,
  })
);
app.use(limiter);

app.get("/", (req: Request, res: Response) => {
  console.log("hello world!");
  res.send("Hello World ser!!");
});

app.use("", (req, res, next) => {
  const token = req.headers?.authorization?.split(" ")[1];
  console.log("API_TOKEN", token);

  if (token === "SPECT_BETA_API_TOKEN") {
    next();
  } else {
    res.sendStatus(403);
  }
});

app.use(
  "/api",
  createProxyMiddleware({
    target: API_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      [`^/api`]: "",
    },
  })
);

app.listen(port, "0.0.0.0", function () {
  console.log(`App is listening on port ${port} !`);
});
