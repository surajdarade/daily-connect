import { Request, Response } from "express";
import UserModel, { IUser } from "../models/userModel";
import bcryptjs from "bcryptjs";

// Regular expressions for validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

interface File {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
  location?: string;
}

export interface CustomFile extends File {
  location?: string;
}

const signUpUser = async (
  req: Request & { file?: CustomFile },
  res: Response
): Promise<Response> => {
  try {
    let { name, email, password } = req.body;

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
        message: "Email is already taken",
        error: true,
        success: false,
      });
    }

    // Password hashing
    const salt = await bcryptjs.genSalt(10);
    const hashpassword = await bcryptjs.hash(password, salt);

    if (req?.file && req?.file?.location) {
      const avatar_location = req.file.location;
      const payload: Partial<IUser> = {
        name,
        email,
        password: hashpassword,
        avatar: avatar_location,
      };
      const user = new UserModel(payload);
      const userSave = await user.save();
    } else {
      const payload: Partial<IUser> = {
        name,
        email,
        password: hashpassword,
      };
      const user = new UserModel(payload);
      const userSave = await user.save();
    }

    // const {
    //   name: savedName,
    //   email: savedEmail,
    //   avatar: savedProfilePic,
    // } = userSave;

    return res.status(201).json({
      message: "Account created successfully",
      // data: {
      //   name: savedName,
      //   email: savedEmail,
      //   avatar: savedProfilePic,
      // },
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
