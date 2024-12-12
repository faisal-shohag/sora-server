import { Router } from "express";
import jwt from "jsonwebtoken";
import UserModel from "../../models/user.js";
const router = Router();

router.get("/user", async (req, res) => {
  const token = req.cookies.jwt_token;

  try {
    if (!token)
      return res.status(401).json({ message: "Unauthorized", success: false });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded)
      return res.status(401).json({ message: "Unauthorized", success: false });
    const user = await UserModel.findOne({ email: decoded.email });
    return res.status(200).json({ message: "User found", success: true, user });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
});



export default router;
