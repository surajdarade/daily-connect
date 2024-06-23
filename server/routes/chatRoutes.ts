import { Router } from "express";
import searchUser from "../controllers/searchUser";
const chatRouter = Router();

chatRouter.post("/searchUser", searchUser);

export default chatRouter;
