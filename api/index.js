import express from "express";
import cors from "cors";
import "dotenv/config";

import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import router from "../routes/index.js";
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cors());
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/assets", express.static(path.join(__dirname, "assets")));

app.use("/api", router);
// export app, BUKAN listen
export default app;
