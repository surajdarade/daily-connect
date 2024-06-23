import { Router } from "express";
import signUpUser from "../controllers/signUpUser";
import checkEmail from "../controllers/checkEmail";
import checkPassword from "../controllers/checkPassword";
import logout from "../controllers/logout";
import { uploadAvatar } from "../utils/awsFunctions";

const authRouter = Router();

authRouter.post("/signup", uploadAvatar.single("avatar"), signUpUser);
authRouter.post("/email", checkEmail);
authRouter.post("/password", checkPassword);
authRouter.post("/logout", logout);

export default authRouter;