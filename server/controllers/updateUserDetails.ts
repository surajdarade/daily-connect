import { Request, Response } from "express";
import getUserDetailsFromToken from "../helpers/getUserDetailsFromToken";
import UserModel, { IUser } from "../models/userModel";
import { CustomFile } from "./signUpUser";
import { deleteFile } from "../utils/awsFunctions";

const updateUserDetails = async (
  req: Request & { file?: CustomFile },
  res: Response
) => {
  try {
    const token = req.cookies.token || "";

    const userResponse = await getUserDetailsFromToken(token);

    if (userResponse && "logout" in userResponse && userResponse.logout) {
      return res.status(401).json({
        message: userResponse.message,
        success: false,
      });
    }

    const user = userResponse as IUser | null;

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    const { name } = req.body;
    let avatar: string | undefined;

    if (req.file && req.file.location) {
      if (user.avatar) {
        await deleteFile(user.avatar);
      }
      avatar = req.file.location;
    } else {
      avatar = user.avatar;
    }

    const newUserData: Partial<IUser> = {
      name,
      avatar,
    };

    await UserModel.findByIdAndUpdate({ _id: user._id }, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    const userInformation = await UserModel.findById(user._id).select(
      "-password -createdAt -updatedAt"
    );

    return res.json({
      message: "Profile updated successfully",
      data: userInformation,
      success: true,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
};

export default updateUserDetails;