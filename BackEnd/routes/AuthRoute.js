import express from "express"
//import { Login, singUp, verifyEmail, resendVerification } from "../controllers/AuthController.js"
import { Login, singUp, verifyEmail, resendVerification, Logout } from "../controllers/AuthController.js"
import { AuthUser } from "../middleware/Authmid.js"
import { isAuth } from "../controllers/AuthController.js"
const AuthRoute = express.Router()

AuthRoute.post("/Singup",  singUp)
AuthRoute.post("/Login",    Login)
AuthRoute.get("/verify-email", verifyEmail)
AuthRoute.post("/resend-verification", resendVerification)
// ...
AuthRoute.post("/Logout", Logout)
AuthRoute.get("/isAuth", AuthUser , isAuth)


export default AuthRoute