import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import tiktokRoutes from "./src/routes/tiktok-routes";
import linkedinRoutes from "./src/routes/linkedin-routes";
import instagramRoutes from "./src/routes/instagram-routes";
import facebookRoutes from "./src/routes/facebook-routes";
import userRoutes from "./src/routes/user-routes";
import postRoutes from "./src/routes/post-routes";
import https from "https";
import fs from "fs";
import "./src/cron-job/cron-schedule-post";

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "20mb" }));
app.use(bodyParser.urlencoded({ limit: "20mb", extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});
const options = {
  key: fs.readFileSync("server.key"),
  cert: fs.readFileSync("server.cert"),
};

app.use("/linkedin", linkedinRoutes);
app.use("/facebook", facebookRoutes);
app.use("/instagram", instagramRoutes);
app.use("/tiktok", tiktokRoutes);
app.use("/post", postRoutes);
app.use("/user", userRoutes);

app.get("/", (req, res) => {
  res.send(`
    linkedinRoutes: '/linkedin',
    --
    facebookRoutes: '/facebook',
    --
    instagramRoutes: '/instagram',
    --
    tiktokRoutes: '/tiktok',
    `);
});

if(process.env.MONGODB_URI){
  mongoose
  .connect(process.env.MONGODB_URI, {})
  .then(() =>
  console.log("<<<<<<-------MONGODB CONNECTED AND MONGOD RUNNING------->>>>>")
  )
  .catch((err) => console.log("🚀 ~ err:", err));
}

const server = https.createServer(options, app);
const PORT = process.env.PORT || 8000;

server.listen(PORT, () =>
  console.log("🚀 ~ app.listen ~ listening on port:", 8000)
);
