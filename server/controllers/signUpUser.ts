import { Request, Response } from "express";
import UserModel, { IUser } from "../models/userModel";
import bcryptjs from "bcryptjs";

// Regular expressions for validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

const signUpUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    let { name, email, password, profile_pic } = req.body;

    // Trim name and email
    name = name.trim();
    email = email.trim();

    // Validate name length
    if (name.length > 50) {
      return res.status(400).json({
        message: "Name should not exceed 50 characters",
        error: true,
        success: false,
      });
    }

    // Validate email format
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format",
        error: true,
        success: false,
      });
    }

    // Validate password format
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must contain at least one lowercase letter, one uppercase letter, one number, one special character, and be at least 6 characters long",
        error: true,
        success: false,
      });
    }

    const checkEmail = await UserModel.findOne({ email });

    if (checkEmail) {
      return res.status(400).json({
        message: "User already exists",
        error: true,
        success: false,
      });
    }

    // Password hashing
    const salt = await bcryptjs.genSalt(10);
    const hashpassword = await bcryptjs.hash(password, salt);

    const payload: Partial<IUser> = {
      name,
      email,
      profile_pic,
      password: hashpassword,
    };

    const user = new UserModel(payload);
    const userSave = await user.save();

    return res.status(201).json({
      message: "User created successfully",
      data: userSave,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "An error occurred",
      error: true,
      success: false,
    });
  }
};

export default signUpUser;
