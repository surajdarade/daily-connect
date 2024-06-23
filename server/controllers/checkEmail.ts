import { Request, Response } from "express";
import UserModel, { IUser } from "../models/userModel";

const checkEmail = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email } = req.body;

    const checkEmail = await UserModel.findOne({ email }).select(
      "-name -email -password -avatar -createdAt -updatedAt"
    );

    if (!checkEmail) {
      return res.status(200).json({
        message: "User does not exist",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Please enter password to sign in",
      success: true,
      data: checkEmail,
    });
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "An error occurred",
      error: true,
      success: false,
    });
  }
};

export default checkEmail;
