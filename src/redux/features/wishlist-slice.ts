import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export type WishlistItem = {
  id: number;
  title: string;
  price: number;
  discountedPrice: number;
  quantity: number;
  images: string[];
  color: string;
  status?: string;
};

type InitialState = {
  items: WishlistItem[];
};

const WISHLIST_KEY = "wishlist_items";
const EXPIRY_DURATION = 1000 * 60 * 60 * 24; // 24 ساعة

// ✅ حفظ البيانات في localStorage مع تاريخ انتهاء
const saveWishlistToLocalStorage = (items: WishlistItem[]) => {
  const data = JSON.stringify({
    items,
    expiry: Date.now() + EXPIRY_DURATION,
  });
  if (typeof window !== "undefined") {
    localStorage.setItem(WISHLIST_KEY, data);
  }
};

// ✅ تحميل البيانات مع التحقق من انتهاء الصلاحية
const loadWishlistFromLocalStorage = (): WishlistItem[] => {
  if (typeof window === "undefined") return [];

  const data = localStorage.getItem(WISHLIST_KEY);
  if (!data) return [];

  try {
    const parsed = JSON.parse(data);
    if (Date.now() > parsed.expiry) {
      localStorage.removeItem(WISHLIST_KEY);
      return [];
    }
    return parsed.items || [];
  } catch {
    return [];
  }
};

const initialState: InitialState = {
  items: loadWishlistFromLocalStorage(),
};

export const wishlist = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addItemToWishlist: (state, action: PayloadAction<WishlistItem>) => {
      const existingItem = state.items.find(
        (item) =>
          item.id === action.payload.id &&
          item.color === action.payload.color
      );

      if (!existingItem) {
        state.items.push(action.payload);
        saveWishlistToLocalStorage(state.items);
      }
    },

    removeItemFromWishlist: (
      state,
      action: PayloadAction<{ id: number; color: string }>
    ) => {
      state.items = state.items.filter(
        (item) =>
          item.id !== action.payload.id ||
          item.color !== action.payload.color
      );
      saveWishlistToLocalStorage(state.items);
    },

    removeAllItemsFromWishlist: (state) => {
      state.items = [];
      saveWishlistToLocalStorage(state.items);
    },
  },
});

export const {
  addItemToWishlist,
  removeItemFromWishlist,
  removeAllItemsFromWishlist,
} = wishlist.actions;

export const selectWishlistItems = (state: RootState) =>
  state.wishlistReducer.items;

export default wishlist.reducer;
