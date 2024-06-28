import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectToDatabase from "./config/database";
import authRouter from "./routes/authRoutes";
import userRouter from "./routes/userRoutes";
import chatRouter from "./routes/chatRoutes";
import server, { app } from "./socket/socket";

// const app = express();

dotenv.config();

app.use(
  cors({
    origin: process.env.CLIENT_URI!,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 8000;

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/chat", chatRouter);

connectToDatabase().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT} 🚀`);
  });
});
