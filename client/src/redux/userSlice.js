import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchLoggedUser = createAsyncThunk(
  'user/fetchLoggedUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/user/status');

      //res.status(200).json({ user: req.user }); from server if logged in.
      const user = response.data;
      return user;
    } catch (error) {
      if (!error.response) {
        console.error('Network Error:', error.message);
        return rejectWithValue('Network Error');
      }
      //  return res.status(500).json({ error: 'You are not authorized yet.' }); from server if not logged in.
      console.error('Server Error:', error.response.data);
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async (user, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/user/login', user);
      const userData = response.data;
      return userData;
    } catch (error) {
      if (!error.response) {
        console.error('Network Error:', error.message);
        return rejectWithValue('Network Error');
      }
      // return res.status(401).json({ success: false, message: info }); on login fail
      console.error('Server Error:', error.response.data);
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const logoutThunk = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.delete('/api/user/logout');
      //   res.status(200).json({ success: true, message: 'Logout successful' }); if logged out
      return response.data;
    } catch (error) {
      if (!error.response) {
        console.error('Network Error:', error.message);
        return rejectWithValue('Network Error');
      }
      console.error('Server Error:', error.response.data);
      return rejectWithValue(error.response.data.message);
    }
  }
);

const initialState = {
  loading: false,
  data: {},
  error: '',
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //async request to check the login status through existing cookies
    builder.addCase(fetchLoggedUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchLoggedUser.fulfilled, (state, action) => {
      state.loading = false;
      state.error = '';
      state.data = action.payload;
      state.isLoggedIn = true;
    });
    builder.addCase(fetchLoggedUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    //async request to login user
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.isLoggedIn = true;
      state.error = '';
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      console.log('checl', action);
      state.error = action.payload;
    });

    //async request for logout
    builder.addCase(logoutThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(logoutThunk.fulfilled, (state) => {
      document.cookie =
        'connect.sid' + '=; expires=' + new Date(0).toUTCString() + '; path=/';
      state.loading = false;
      state.isLoggedIn = false;
      state = initialState;
    });
    builder.addCase(logoutThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default userSlice.reducer;
