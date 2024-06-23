import jwt from "jsonwebtoken";
import UserModel, { IUser } from "../models/userModel";

interface DecodedToken {
  id: string;
}

interface ITokenResponse {
  message: string;
  logout: boolean;
}

const getUserDetailsFromToken = async (
  token: string
): Promise<IUser | ITokenResponse | null> => {
  if (!token) {
    return {
      message: "session out",
      logout: true,
    };
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    ) as DecodedToken;

    const user = await UserModel.findById(decoded.id).select(
      "-password -createdAt -updatedAt"
    );

    return user;
  } catch (error) {
    return {
      message: "Invalid token",
      logout: true,
    };
  }
};

export default getUserDetailsFromToken;
