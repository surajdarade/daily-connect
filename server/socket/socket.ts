import express from "express";
import { Server } from "socket.io";
import * as http from "http";
import dotenv from "dotenv";
import getUserDetailsFromToken from "../helpers/getUserDetailsFromToken";
import UserModel from "../models/userModel";
import ConversationModel from "../models/conversationModel";
import { uploadImageToS3, uploadVideoToS3 } from "../utils/awsFunctions";
import MessageModel from "../models/messageModel";
import getConversation from "../helpers/getConversation";

export const app = express();

dotenv.config();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URI!,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// onlineUsers set

const onlineUser = new Set();

io.on("connection", async (socket) => {
  console.log("User Connected: ", socket.id);

  const token = socket?.handshake?.auth?.token;

  // get current user details

  const user = await getUserDetailsFromToken(token);

  // create a room
  socket.join(user?._id?.toString() || "");
  onlineUser.add(user?._id?.toString());

  io.emit("onlineUser", Array.from(onlineUser));

  socket.on("messagePage", async (userId) => {
    const userDetails = await UserModel.findById(userId).select(
      "-password -createdAt -updatedAt"
    );

    const payload = {
      _id: userDetails?._id,
      name: userDetails?.name,
      email: userDetails?.email,
      avatar: userDetails?.avatar,
      online: onlineUser.has(userId),
    };
    socket.emit("messageUser", payload);

    //get previous message
    const getConversationMessage = await ConversationModel.findOne({
      $or: [
        { sender: user?._id, receiver: userId },
        { sender: userId, receiver: user?._id },
      ],
    })
      .populate("messages")
      .sort({ updatedAt: -1 });

    socket.emit("message", getConversationMessage?.messages || []);
  });

  // new message
  socket.on("newMessage", async (messageData) => {
    // console.log("Received new message:", messageData);

    //check conversation is available both user

    let conversation = await ConversationModel.findOne({
      $or: [
        { sender: messageData?.sender, receiver: messageData?.receiver },
        { sender: messageData?.receiver, receiver: messageData?.sender },
      ],
    });

    //if conversation is not available
    if (!conversation) {
      const createConversation = new ConversationModel({
        sender: messageData?.sender,
        receiver: messageData?.receiver,
      });
      conversation = await createConversation.save();
    }

    if (messageData.text && !messageData.image && !messageData.video) {
      try {
        const message = new MessageModel({
          text: messageData.text,
          msgByUserId: messageData?.msgByUserId,
        });
        const saveMessage = await message.save();

        await ConversationModel.updateOne(
          { _id: conversation?._id },
          {
            $push: { messages: saveMessage?._id },
          }
        );

        const getConversationMessage = await ConversationModel.findOne({
          $or: [
            { sender: messageData?.sender, receiver: messageData?.receiver },
            { sender: messageData?.receiver, receiver: messageData?.sender },
          ],
        })
          .populate("messages")
          .sort({ updatedAt: -1 });

        io.to(messageData?.sender).emit(
          "message",
          getConversationMessage?.messages || []
        );
        io.to(messageData?.receiver).emit(
          "message",
          getConversationMessage?.messages || []
        );

        //send conversation
        const conversationSender = await getConversation(messageData?.sender);
        const conversationReceiver = await getConversation(
          messageData?.receiver
        );

        io.to(messageData?.sender).emit("conversation", conversationSender);
        io.to(messageData?.receiver).emit("conversation", conversationReceiver);
      } catch (error) {
        console.error("Error ending message", error);
      }
    }

    if (messageData.image) {
      try {
        const image = {
          buffer: Buffer.from(messageData.image.buffer),
          filename: messageData.image.filename,
          mimetype: messageData.image.mimetype,
        };
        const imageMediaS3Url = await uploadImageToS3(image);
        // console.log("Image uploaded to S3: ", imageMediaS3Url);

        const message = new MessageModel({
          text: messageData.text,
          imageUrl: imageMediaS3Url,
          msgByUserId: messageData?.msgByUserId,
        });
        const saveMessage = await message.save();

        await ConversationModel.updateOne(
          { _id: conversation?._id },
          {
            $push: { messages: saveMessage?._id },
          }
        );

        const getConversationMessage = await ConversationModel.findOne({
          $or: [
            { sender: messageData?.sender, receiver: messageData?.receiver },
            { sender: messageData?.receiver, receiver: messageData?.sender },
          ],
        })
          .populate("messages")
          .sort({ updatedAt: -1 });

        io.to(messageData?.sender).emit(
          "message",
          getConversationMessage?.messages || []
        );
        io.to(messageData?.receiver).emit(
          "message",
          getConversationMessage?.messages || []
        );

        //send conversation
        const conversationSender = await getConversation(messageData?.sender);
        const conversationReceiver = await getConversation(
          messageData?.receiver
        );

        io.to(messageData?.sender).emit("conversation", conversationSender);
        io.to(messageData?.receiver).emit("conversation", conversationReceiver);

        // Add the imageUrl to messageData or perform other actions as needed
      } catch (error) {
        console.error("Error uploading image: ", error);
      }
    }

    if (messageData.video) {
      try {
        const video = {
          buffer: Buffer.from(messageData.video.buffer),
          filename: messageData.video.filename,
          mimetype: messageData.video.mimetype,
        };
        const videoMediaS3Url = await uploadVideoToS3(video);
        // console.log("Video uploaded to S3: ", videoMediaS3Url);

        const message = new MessageModel({
          text: messageData.text,
          videoUrl: videoMediaS3Url,
          msgByUserId: messageData?.msgByUserId,
        });
        const saveMessage = await message.save();

        await ConversationModel.updateOne(
          { _id: conversation?._id },
          {
            $push: { messages: saveMessage?._id },
          }
        );

        const getConversationMessage = await ConversationModel.findOne({
          $or: [
            { sender: messageData?.sender, receiver: messageData?.receiver },
            { sender: messageData?.receiver, receiver: messageData?.sender },
          ],
        })
          .populate("messages")
          .sort({ updatedAt: -1 });

        io.to(messageData?.sender).emit(
          "message",
          getConversationMessage?.messages || []
        );
        io.to(messageData?.receiver).emit(
          "message",
          getConversationMessage?.messages || []
        );

        //send conversation
        const conversationSender = await getConversation(messageData?.sender);
        const conversationReceiver = await getConversation(
          messageData?.receiver
        );

        io.to(messageData?.sender).emit("conversation", conversationSender);
        io.to(messageData?.receiver).emit("conversation", conversationReceiver);
        // Add the videoUrl to messageData or perform other actions as needed
      } catch (error) {
        console.error("Error uploading video: ", error);
      }
    }
  });

  //sidebar
  socket.on("sidebar", async (currentUserId) => {
    // console.log("current user", currentUserId);

    const conversation = await getConversation(currentUserId);

    socket.emit("conversation", conversation);
  });

  socket.on("seen", async (paramsUserId) => {
    let conversation = await ConversationModel.findOne({
      $or: [
        { sender: user?._id, receiver: paramsUserId },
        { sender: paramsUserId, receiver: user?._id },
      ],
    });

    const conversationMessageId = conversation?.messages || [];

    await MessageModel.updateMany(
      { _id: { $in: conversationMessageId }, msgByUserId: paramsUserId },
      { $set: { seen: true } }
    );

    //send conversation
    const conversationSender = await getConversation(
      user?._id?.toString() || ""
    );
    const conversationReceiver = await getConversation(paramsUserId);

    io.to(user?._id?.toString() || "").emit("conversation", conversationSender);
    io.to(paramsUserId).emit("conversation", conversationReceiver);
  });

  socket.on("disconnect", () => {
    onlineUser.delete(user?._id?.toString());
    console.log("User Disconnected: ", socket.id);
  });
});

export default server;
