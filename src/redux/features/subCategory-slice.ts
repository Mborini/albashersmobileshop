// src/redux/features/subCategory-slice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SubCategoryState {
  selectedSubCategoryName: string;
}

// اقرأ القيمة من localStorage إذا كانت موجودة
const getInitialSubCategoryName = (): string => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("selectedSubCategoryName") || "";
  }
  return "";
};

const initialState: SubCategoryState = {
  selectedSubCategoryName: getInitialSubCategoryName(),
};

const subCategorySlice = createSlice({
  name: "subCategory",
  initialState,
  reducers: {
    setSelectedSubCategoryName: (state, action: PayloadAction<string>) => {
      state.selectedSubCategoryName = action.payload;

      // خزّن القيمة في localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("selectedSubCategoryName", action.payload);
      }
    },
  },
});

export const { setSelectedSubCategoryName } = subCategorySlice.actions;
export default subCategorySlice.reducer;
