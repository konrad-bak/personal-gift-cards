// src/redux/actions.ts
import { createAction } from '@reduxjs/toolkit';

export const setUser = createAction<{ username: string }>('user/setUser');
export const clearUser = createAction('user/clearUser');
// Add more actions as needed
