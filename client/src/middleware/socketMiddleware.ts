import { Middleware } from "@reduxjs/toolkit";
import { io, Socket } from "socket.io-client";
import { setOnlineUser, userSliceReset } from "../store/userSlice";

let socket: Socket | null = null;

const isActionWithType = (action: unknown): action is { type: string } => {
  return typeof action === "object" && action !== null && "type" in action && typeof (action as { type: unknown }).type === "string";
};

export const socketMiddleware: Middleware = ({ dispatch }) => (next) => (action) => {
  if (!isActionWithType(action)) {
    return next(action);
  }

  if (action.type === "user/connectSocket") {
    const token = localStorage.getItem("token");
    if (token) {
      socket = io("https://daily-connect-server.vercel.app", {
        auth: {
          token,
        },
      });

      socket.on("onlineUser", (data) => {
        dispatch(setOnlineUser(data));
      });

      socket.on("disconnect", () => {
        socket = null;
      });
    }
  }

  if (action.type === userSliceReset.type) {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  }

  return next(action);
};

export const getSocket = () => socket;