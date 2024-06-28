import mongoose, { Document, Schema, Model } from "mongoose";

// Interface for the User document
export interface IUser extends Document {
  _id?: string;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the user schema
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Kindly provide name"],
    },
    email: {
      type: String,
      required: [true, "Kindly provide email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Kindly provide password"],
    },
    avatar: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Create the User model
const UserModel: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default UserModel;
