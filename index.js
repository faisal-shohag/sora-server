import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import './models/db.js'
import authRouter from "./routes/auth-router.js";
import { authentication } from "./middlewares/auth.js";

const app = express();
const PORT = process.env.PORT || 5000;

// const cookieOptions = {
//   httpOnly: true,
//   secure: process.env.NODE_ENV === "production",
//   sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
// };

app.use(
  cors({
    origin: ["http://localhost:5173", "https://sora-vocab.vercel.app", "https://sora-vocab.netlify.app"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/auth', authRouter)


app.get("/", (req, res) => {
  res.send("🚀 Working fine!");
});

app.get('/find', authentication, (req, res) => {
  res.send('🚀 Secret revealed!');
})




app.listen(PORT, () => {
  console.log(`🚀 App is Running on ${PORT}`);
});

export default app;
