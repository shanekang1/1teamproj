import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "ui",
  initialState: {
    isBizDropdownOpen: false,
    isMyPageOpen: false, // 다음 단계(마이페이지 패널)에서 사용
  },
  reducers: {
    toggleBizDropdown(state) {
      state.isBizDropdownOpen = !state.isBizDropdownOpen;
    },
    closeBizDropdown(state) {
      state.isBizDropdownOpen = false;
    },
    openMyPage(state) {
      state.isMyPageOpen = true;
    },
    closeMyPage(state) {
      state.isMyPageOpen = false;
    },
  },
});

export const { toggleBizDropdown, closeBizDropdown, openMyPage, closeMyPage } =
  slice.actions;
export default slice.reducer;
