import { Router } from "express";
import signUpUser from "../controllers/signUpUser";
import checkEmail from "../controllers/checkEmail";
import checkPassword from "../controllers/checkPassword";
import userDetails from "../controllers/userDetails";

const authRouter = Router();

authRouter.post("/signup", signUpUser);
authRouter.post("/email", checkEmail);
authRouter.post("/password", checkPassword);
authRouter.get("/getUserDetailsFromToken", userDetails);

export default authRouter;
