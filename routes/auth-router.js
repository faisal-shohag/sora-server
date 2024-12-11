import { Router } from "express";
import { loginValidation, signupValidation } from "../middlewares/auth-validation.js";
import { login, logout, signup } from "../controllers/auth-controller.js";

const router = Router()

router.post('/login', loginValidation, login)

router.post('/signup', signupValidation, signup)

router.post('/logout', logout)




export default router