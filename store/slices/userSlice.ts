import {
  createSlice,
  // createAsyncThunk
} from "@reduxjs/toolkit";

// 由于刷新token比较特殊，需要在request中使用，而request又依赖于store/store.ts，所以此处不能使用，否者会造成循环依赖
// import * as apisOauth from "@/apis/oauth/oauth";

const initialState = {
  username: "",
  accessToken: "",
  refreshToken: "",
  tokenType: "",
};

// /** 异步操作 */
// export const postRefreshToken = createAsyncThunk(
//   // 只是一个标识
//   "user/postRefreshToken",
//   async (params: any, thunkAPI) => {
//     // const {dispatch} = thunkAPI;
//     return apisOauth.postOauthToken(params);
//   }
// );

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser(state, action) {
      state.username = action.payload.username;
    },
    updateTokenConfig(state, action) {
      const { access_token, refresh_token, token_type } = action.payload;
      state.accessToken = access_token;
      state.refreshToken = refresh_token;
      state.tokenType = token_type;
    },
    clearTokenConfig(state) {
      state.accessToken = "";
      state.refreshToken = "";
      state.tokenType = "";
    },
    clearUser() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // builder.addCase(postRefreshToken.fulfilled, (state, action) => {
    //   state.accessToken = action.payload.accessToken;
    //   state.refreshToken = action.payload.refreshToken;
    //   state.tokenType = action.payload.tokenType;
    // });
    // builder.addCase(postRefreshToken.rejected, (state) => {
    //   state.accessToken = "";
    //   state.refreshToken = "";
    //   state.tokenType = "";
    // });
  },
});

export const { updateTokenConfig, clearUser, clearTokenConfig } =
  userSlice.actions;
export default userSlice.reducer;
