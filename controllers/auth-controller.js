import UserModel from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const maxAge = 3 * 365 * 24 * 60 * 60 * 1000;

const signup = async (req, res) => {

  const { name, email, password, avatar } = req.body;
  // console.log(req.body);
  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "Email already exists" });
    }
    const newUser = new UserModel({ name, email, password, avatar});
    newUser.password = await bcrypt.hash(password, 10);
    await newUser.save();
    // res.status(201).json({ email, message: 'Successfully signed up!', success: true});
    const jwtToken = jwt.sign(
      { email, _id: newUser._id,  role: newUser.role},
      process.env.JWT_SECRET,
      { expiresIn: "3y" }
    );
    res.cookie('jwt_token', jwtToken, { httpOnly: true, maxAge: maxAge * 1000, sameSite: "none", secure: true });
    return res.status(201).json({token: jwtToken, message: "Successfully signed up!", success: true, user: newUser });  
  } catch (err) {
    // const errors = handleErrors(err);
    console.log(err);
    res.status(400).json({ message: "Internal server error", success: false });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const jwtToken = jwt.sign(
      { email, _id: user._id, role: user.role},
      process.env.JWT_SECRET,
      { expiresIn: "3y" }
    );
    res.cookie('jwt_token', jwtToken, { httpOnly: true, maxAge: maxAge * 1000, sameSite: "none", secure: true });
    return res.status(201).json({ token: jwtToken, message: "Successfully logged in!", success: true, user }); 

  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Internal server error", success: false });
  }
};


const logout = async (req, res) => {
  res.cookie('jwt_token', '', { maxAge: 1 });
  res.status(200).json({ message: "Successfully logged out!", success: true });
}

export { signup, login, logout };
