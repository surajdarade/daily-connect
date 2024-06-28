import { Request, Response } from "express";
import UserModel, { IUser } from "../models/userModel";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const checkPassword = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { password, userId } = req.body;

    if (!userId) {
      return res.status(200).json({
        message: "Please enter email first",
        success: false,
      });
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(200).json({
        message: "User not found",
        success: false,
      });
    }

    const verifyPassword = await bcryptjs.compare(password, user.password);

    if (!verifyPassword) {
      return res.status(200).json({
        message: "Invalid password",
        success: false,
      });
    }

    const tokenData = {
      id: user._id,
      email: user.email,
    };
    const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY!, {
      expiresIn: "1d",
    });

    const cookieOptions = {
      httpOnly: true,
      secure: true,
    };

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      message: "Logged in successfully",
      success: true,
      data: token,
    });
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Internal Server Error",
      error: true,
    });
  }
};

export default checkPassword;
