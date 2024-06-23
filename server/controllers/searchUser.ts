import { Request, Response } from "express";
import UserModel from "../models/userModel";

const searchUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { search, selfId } = req.body;

    const query = new RegExp(search, "i");

    const user = await UserModel.find({
      $or: [{ name: query }, { email: query }],
      _id: { $ne: selfId },
    }).select("-password -createdAt -updatedAt");

    return res.json({
      message: "search user results",
      data: user,
      success: true,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export default searchUser;