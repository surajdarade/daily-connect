import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import type { RootState } from "./store";

// Define a type for the slice state

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  token: string;
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
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    setToken: (state, action: PayloadAction<string>) => {
      if (state.user) state.user.token = action.payload;
    },
    userSliceReset: () => initialState,
  },
});

export const { setUser, setToken, userSliceReset } = userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectUser = (state: UserState) => state.user;

export default userSlice.reducer;
