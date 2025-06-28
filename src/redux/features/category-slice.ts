// src/redux/features/category-slice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CategoryState {
  selectedCategoryName: string;
}

// اقرأ القيمة من localStorage إذا كانت موجودة
const getInitialCategoryName = (): string => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("selectedCategoryName") || "";
  }
  return "";
};

const initialState: CategoryState = {
  selectedCategoryName: getInitialCategoryName(),
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setSelectedCategoryName: (state, action: PayloadAction<string>) => {
      state.selectedCategoryName = action.payload;

      // خزّن القيمة في localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("selectedCategoryName", action.payload);
      }
    },
  },
});

export const { setSelectedCategoryName } = categorySlice.actions;
export default categorySlice.reducer;
