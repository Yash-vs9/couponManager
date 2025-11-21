// Shared Types used by both Frontend and Backend

export interface CartItem {
  productId: string;
  category: string;
  unitPrice: number;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
}

export interface UserContext {
  userId: string;
  userTier: "NEW" | "REGULAR" | "GOLD";
  country: string;
  lifetimeSpend: number;
  ordersPlaced: number;
  isFirstOrder: boolean;
}

export interface Eligibility {
  allowedUserTiers?: string[];
  minLifetimeSpend?: number;
  minOrdersPlaced?: number;
  firstOrderOnly?: boolean;
  allowedCountries?: string[];
  minCartValue?: number;
  applicableCategories?: string[]; // ["electronics", "fashion"]
  excludedCategories?: string[];   // ["books"]
  minItemsCount?: number;
}

export interface Coupon {
  code: string;
  description: string;
  discountType: "FLAT" | "PERCENT";
  discountValue: number;
  maxDiscountAmount?: number;
  startDate: string;
  endDate: string;
  usageLimitPerUser?: number;
  eligibility: Eligibility;
}

// --- API Calls (Replacing LocalStorage) ---

/**
 * Sends a new coupon to the server to be saved.
 * POST /api/coupons
 */
export const saveCoupon = async (coupon: Coupon) => {
  const res = await fetch("/api/coupons", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(coupon),
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to save coupon");
  }
  
  return res.json();
};

/**
 * Sends user and cart data to the server to calculate the best coupon.
 * POST /api/coupons/best
 */
export const findBestCoupon = async (user: UserContext, cart: Cart) => {
  const res = await fetch("/api/coupons/best", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user, cart }),
  });
  
  if (!res.ok) {
    throw new Error("Failed to calculate best coupon");
  }
  
  // Returns { coupon: Coupon | null, discount: number }
  return res.json(); 
};