import { Request, Response } from "express";
import getUserDetailsFromToken from "../helpers/getUserDetailsFromToken";

const userDetails = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token || "";

    const user = await getUserDetailsFromToken(token);

    return res.status(200).json({
      message: "User details",
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

export default userDetails;
