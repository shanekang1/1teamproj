import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../lib/supabase";

export const fetchMyBusinesses = createAsyncThunk(
  "business/fetchMine",
  async (ownerId) => {
    const { data, error } = await supabase
      .from("businesses")
      .select(
        "id, brand_name, category, owner_name, address, phone, region, created_at"
      )
      .eq("owner_id", ownerId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const normalized = (data || []).map((b) => ({
      ...b,
      name: b.brand_name,
    }));

    return normalized;
  }
);

const slice = createSlice({
  name: "business",
  initialState: {
    list: [],
    currentId: null,
    status: "idle",
    error: null,
  },
  reducers: {
    switchBusiness(state, action) {
      state.currentId = action.payload;
      localStorage.setItem("businessId", action.payload); // 유지용
    },
    addBusinessSuccess(state, action) {
      const row = action.payload;
      state.list.unshift(row);
      state.currentId = row.id;
    },
    updateBusinessSuccess(state, action) {
      const row = action.payload;
      const idx = state.list.findIndex((b) => b.id === row.id);
      if (idx >= 0) state.list[idx] = { ...state.list[idx], ...row };
    },
    clearBusiness(state) {
      state.list = [];
      state.currentId = null;
      state.status = "idle";
      state.error = null;
    },
    // 추가: TopBar 등에서 강제 새로고침 요청시 상태 초기화
    refreshBusinessList(state) {
      state.status = "idle";
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchMyBusinesses.pending, (s) => {
      s.status = "loading";
    });
    b.addCase(fetchMyBusinesses.fulfilled, (s, a) => {
      s.status = "succeeded";
      s.list = a.payload;
      if (!s.currentId && a.payload?.[0]) s.currentId = a.payload[0].id;
    });
    b.addCase(fetchMyBusinesses.rejected, (s, a) => {
      s.status = "failed";
      s.error = a.error?.message || null;
    });
  },
});

export const {
  switchBusiness,
  addBusinessSuccess,
  updateBusinessSuccess,
  clearBusiness,
  refreshBusinessList,
} = slice.actions;

export default slice.reducer;
