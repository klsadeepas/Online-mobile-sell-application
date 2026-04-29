import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users/';

const initialState = {
  users: [],
  user: null,
  userStats: null,
  isLoading: false,
  isError: false,
  message: '',
  pages: 1,
  page: 1,
  total: 0,
};

// Get all users (admin)
export const getUsers = createAsyncThunk('users/getUsers', async (params = {}, thunkAPI) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const queryString = new URLSearchParams(params).toString();
    const response = await axios.get(API_URL + (queryString ? `?${queryString}` : ''), {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Delete user (admin)
export const deleteUser = createAsyncThunk('users/deleteUser', async (id, thunkAPI) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    await axios.delete(API_URL + id, {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    return id;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Get user stats (admin)
export const getUserStats = createAsyncThunk('users/getUserStats', async (_, thunkAPI) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await axios.get(API_URL + 'stats', {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = '';
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all users
      .addCase(getUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.users;
        state.pages = action.payload.pages;
        state.page = action.payload.page;
        state.total = action.payload.total;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Delete user
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user._id !== action.payload);
      })
      // Get user stats
      .addCase(getUserStats.fulfilled, (state, action) => {
        state.userStats = action.payload;
      });
  },
});

export const { reset } = userSlice.actions;
export default userSlice.reducer;