import { Router } from "express";
import userDetails from "../controllers/userDetails";
import updateUserDetails from "../controllers/updateUserDetails";
import { uploadAvatar } from "../utils/awsFunctions";

const userRouter = Router();

userRouter.get("/userDetails", userDetails);
userRouter.put(
  "/updateUser",
  uploadAvatar.single("avatar"),
  updateUserDetails
);

export default userRouter;
