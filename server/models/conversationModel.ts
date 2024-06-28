import mongoose, { Document, Schema, Model } from "mongoose";
import { IMessage } from "./messageModel";

// Interface for the Conversation document
export interface IConversation extends Document {
  sender: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  messages: mongoose.Types.ObjectId[] | IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

// Define the conversation schema
const conversationSchema = new Schema<IConversation>(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Create the Conversation model
const ConversationModel: Model<IConversation> = mongoose.model<IConversation>(
  "Conversation",
  conversationSchema
);

export default ConversationModel;