import express from "express";
import cors from "cors";

const app = express();

// Middlewares use
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);

app.use(express.json()); // Add this to parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Optional: Parses URL-encoded data


// Routes import
import faqRoutes from "./routes/faq.routes";
import healthcheckRoutes from "./routes/healthcheck.routes";

// Routes use
app.use("/api/faq", faqRoutes);
app.use("/api/healthcheck", healthcheckRoutes);

export default app;

