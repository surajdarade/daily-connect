import mongoose from "mongoose";
import ConversationModel, { IConversation } from "../models/conversationModel";
import { IMessage } from "../models/messageModel";

interface IConversationInfo {
  _id: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  unseenMsg: number;
  lastMsg: IMessage | null;
}

const isIMessage = (message: mongoose.Types.ObjectId | IMessage): message is IMessage => {
  return (message as IMessage).msgByUserId !== undefined;
};

const getConversation = async (currentUserId: string): Promise<IConversationInfo[]> => {
  // console.log("current user id", currentUserId);
  if (currentUserId) {
    const currentUserConversation = await ConversationModel.find({
      $or: [{ sender: currentUserId }, { receiver: currentUserId }]
    })
      .sort({ updatedAt: -1 })
      .populate({
        path: 'messages',
        model: 'Message'
      })
      .populate('sender')
      .populate('receiver')
      .exec();

    const conversation: IConversationInfo[] = currentUserConversation.map((conv) => {
      const countUnseenMsg = (conv.messages as IMessage[]).reduce((prev, curr) => {
        if (isIMessage(curr)) {
          const msgByUserId = curr.msgByUserId.toString();
          if (msgByUserId !== currentUserId) {
            return prev + (curr.seen ? 0 : 1);
          }
        }
        return prev;
      }, 0);

      return {
        _id: conv._id as mongoose.Types.ObjectId,
        sender: conv.sender as mongoose.Types.ObjectId,
        receiver: conv.receiver as mongoose.Types.ObjectId,
        unseenMsg: countUnseenMsg,
        lastMsg: conv.messages.length > 0 && isIMessage(conv.messages[conv.messages.length - 1])
          ? conv.messages[conv.messages.length - 1] as IMessage
          : null
      };
    });
    // console.log("conversation", conversation)

    return conversation;
  } else {
    return [];
  }
};

export default getConversation;
