import express from "express";
import CORS from "cors";
// import crypto from"crypto";
const app = express();

app.use(
  CORS({
    origin: process.env.CORS_ORIGIN,
    credentials: true, 
  })
);
// common middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

// function generateAccessToken(length) {
//   return crypto.randomBytes(length).toString("hex"); // Convert to a hexadecimal string
// }
// const token = generateAccessToken(32); // Generates a 64-character token
// console.log("Generated Access Token:", token);

//import routes
import healthcheckRouter from "./controllers/healthCheck.controller.js";

//routes
app.use("/api/v1/healthcheckup", healthcheckRouter);
export { app };
