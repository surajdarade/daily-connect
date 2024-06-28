import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define a type for the slice state
export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  token: string;
  onlineUser: string[];
  socketId: string | null;
}

export interface UserState {
  user: User | null;
}

// Define the initial state using that type
const initialState: UserState = {
  user: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setToken: (state, action: PayloadAction<string>) => {
      if (state.user) state.user.token = action.payload;
    },
    setOnlineUser: (state, action: PayloadAction<string[]>) => {
      if (state.user) state.user.onlineUser = action.payload;
    },
    setSocketId: (state, action: PayloadAction<string | null>) => {
      if (state.user) state.user.socketId = action.payload;
    },
    userSliceReset: () => initialState,
  },
});

export const {
  setUser,
  setToken,
  setOnlineUser,
  setSocketId,
  userSliceReset,
} = userSlice.actions;

export const selectUser = (state: UserState) => state.user;

export default userSlice.reducer;