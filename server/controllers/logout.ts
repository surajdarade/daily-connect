import { Request, Response } from "express";

const logout = async (req: Request, res: Response) => {
  try {
    const cookieOptions = {
      httpOnly: true,
      secure: true,
    };

    return res.cookie("token", "", cookieOptions).status(200).json({
      message: "session out",
      success: true,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
};

export default logout;
