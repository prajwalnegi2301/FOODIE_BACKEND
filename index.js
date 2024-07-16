import express from "express";
import dotenv from "dotenv";
import cors from "cors";
const app = express();
import userRouter from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import { dbConnection } from "./database/dbConnection.js";
import fileUpload from "express-fileupload";
import cloudinary from 'cloudinary';
import { errorMiddleware } from "./middlewares/error.js";
import taskRouter from './routes/task.routes.js'


dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

app.use("/api/v1/user", userRouter);
app.use("api/v1/admin", adminRouter);

dbConnection();

app.use(errorMiddleware);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log("app is running");
});
