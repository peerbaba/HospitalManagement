import express from "express"; 
import cors from "cors";
import fileUpload from "express-fileupload";
import { dbConnection } from "./database/dbConnection.js";
import cookieParser from "cookie-parser";
import messageRouter from "./router/messageRouter.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import userRouter from "./router/userRouter.js"; // ✅ FIXED import
import appointmentRouter from "./router/appointmentRouter.js"; 
const app = express();
 
// Connect to database
dbConnection();

const allowedOrigins = [
  "http://localhost:5173",  // local frontend
  "http://localhost:5174",  // deployed frontend
];
// Middleware setup
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // ✅ Allow request
      } else {
        callback(new Error("Not allowed by CORS")); // ❌ Block unknown origins
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./temp/",
  })
);

// Routers
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter); // ✅ now correctly points to userRouter
app.use("/api/v1/appointment", appointmentRouter);
// Test route
app.get("/test", (req, res) => {
  res.send("✅ API Working Properly");
});

// Error handling middleware
app.use(errorMiddleware);

export default app;
