import express from "express"
import cors from "cors"
import singleGameRouter from "./routes/singleplayerGame.routes.js"
const app = express();

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
//middlewares
app.use(
  cors({
    origin:CLIENT_URL ,
    credentials: true,
  }),
);

//common middleare
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});


//routes
app.use("/app/v1/single", singleGameRouter);

export default app;