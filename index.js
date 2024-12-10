import express from "express";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("🚀 Working fine!");
});

app.listen(PORT, () => {
  console.log(`🚀 App is Running on ${PORT}`);
});

export default app;
