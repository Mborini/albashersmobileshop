import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export type CartItem = {
  id: number;
  title: string;
  price: number;
  discountedPrice: number;
  quantity: number;
  images: string[];
  color: string; 
  
};

type InitialState = {
  items: CartItem[];
};

const CART_KEY = "cart_items";
const EXPIRY_DURATION = 1000 * 60 * 60 * 24; // 24 ساعة

// ✅ حفظ في localStorage مع تاريخ الانتهاء
const saveCartToLocalStorage = (items: CartItem[]) => {
  const data = JSON.stringify({
    items,
    expiry: Date.now() + EXPIRY_DURATION,
  });
  if (typeof window !== "undefined") {
    localStorage.setItem(CART_KEY, data);
  }
};

// ✅ تحميل من localStorage مع التحقق من انتهاء الصلاحية
const loadCartFromLocalStorage = (): CartItem[] => {
  if (typeof window === "undefined") return [];

  const data = localStorage.getItem(CART_KEY);
  if (!data) return [];

  try {
    const parsed = JSON.parse(data);
    if (Date.now() > parsed.expiry) {
      localStorage.removeItem(CART_KEY);
      return [];
    }
    return parsed.items || [];
  } catch {
    return [];
  }
};

const initialState: InitialState = {
  items: loadCartFromLocalStorage(),
};

export const cart = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find((item) => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      saveCartToLocalStorage(state.items);
    },
    removeItemFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      saveCartToLocalStorage(state.items);
    },
    updateCartItemQuantity: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>
    ) => {
      const existingItem = state.items.find((item) => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity = action.payload.quantity;
      }
      saveCartToLocalStorage(state.items);
    },
    removeAllItemsFromCart: (state) => {
      state.items = [];
      saveCartToLocalStorage(state.items);
    },
  },
});

export const selectCartItems = (state: RootState) => state.cartReducer.items;

export const selectTotalPrice = createSelector([selectCartItems], (items) =>
  items.reduce((total, item) => total + item.discountedPrice * item.quantity, 0)
);

export const {
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
  removeAllItemsFromCart,
} = cart.actions;

export default cart.reducer;
