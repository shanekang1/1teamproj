import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../lib/supabase";

export const initSession = createAsyncThunk("auth/initSession", async () => {
  const { data } = await supabase.auth.getUser();
  return data?.user ?? null;
});

const slice = createSlice({
  name: "auth",
  initialState: { user: null, status: "idle", error: null },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
  },
  extraReducers: (b) => {
    b.addCase(initSession.pending, (s) => {
      s.status = "loading";
    });
    b.addCase(initSession.fulfilled, (s, a) => {
      s.status = "succeeded";
      s.user = a.payload;
    });
    b.addCase(initSession.rejected, (s, a) => {
      s.status = "failed";
      s.error = a.error?.message || null;
    });
  },
});

export const { setUser } = slice.actions;
export default slice.reducer;
