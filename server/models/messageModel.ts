import mongoose, { Document, Schema, Model } from "mongoose";

// Interface for the Message document
export interface IMessage extends Document {
  text: string;
  imageUrl: string;
  videoUrl: string;
  seen: boolean;
  msgByUserId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Define the message schema
const messageSchema = new Schema<IMessage>(
  {
    text: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      default: "",
    },
    videoUrl: {
      type: String,
      default: "",
    },
    seen: {
      type: Boolean,
      default: false,
    },
    msgByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Create the Message model
const MessageModel: Model<IMessage> = mongoose.model<IMessage>(
  "Message",
  messageSchema
);

export default MessageModel;
