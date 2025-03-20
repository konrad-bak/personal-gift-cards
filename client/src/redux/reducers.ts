// src/redux/reducers.ts
import { createReducer } from '@reduxjs/toolkit';
import { clearUser, setUser } from './actions';

interface UserState {
  isLoggedIn: boolean;
  username: string | null;
  // userId: string | null;
  // token: string | null;
}

const initialState: UserState = {
  isLoggedIn: false,
  username: null,

  // userId: null,
  // token: null,
};

export const userReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setUser, (state, action) => {
      // state.userId = action.payload.userId;
      // state.token = action.payload.token;
      state.username = action.payload.username;
      state.isLoggedIn = true;
    })
    .addCase(clearUser, (state) => {
      // state.userId = null;
      // state.token = null;
      state.username = null;
      state.isLoggedIn = false;
    });
});
