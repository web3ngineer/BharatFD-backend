import express from "express";
import cors from "cors";

const app = express();

// Middlewares use
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);


export default app;

