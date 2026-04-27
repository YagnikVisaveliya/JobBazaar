import { createSlice } from "@reduxjs/toolkit";

const sanitizeUser = (user) => {
  if (!user || typeof user !== "object") return user;
  const { password, refreshToken, ...safeUser } = user;
  return safeUser;
};

const authSlice = createSlice({
  name: "auth",
  initialState: {   
    loading: false,
    user: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUser: (state, action) => {
      state.user = sanitizeUser(action.payload);
    }
    
  },
});
export const { setLoading ,setUser} = authSlice.actions;
export default authSlice.reducer;