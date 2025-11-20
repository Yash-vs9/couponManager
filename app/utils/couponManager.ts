// app/utils/couponManager.ts

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
    applicableCategories?: string[]; 
    excludedCategories?: string[]; 
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
  
  const STORAGE_KEY = "ecommerce_coupons";
  
  // --- Storage Helpers ---
  
  export const getCoupons = (): Coupon[] => {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  };
  
  export const saveCoupon = (coupon: Coupon) => {
    const coupons = getCoupons();
    // Remove existing if duplicate code
    const filtered = coupons.filter((c) => c.code !== coupon.code);
    filtered.push(coupon);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  };
  
  // --- The "Best Coupon" Logic Engine ---
  
  export const findBestCoupon = (user: UserContext, cart: Cart): { coupon: Coupon | null; discount: number } => {
    const coupons = getCoupons();
    const now = new Date().getTime();
    
    // Calculate Cart Total
    const cartTotal = cart.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const cartCategories = cart.items.map(item => item.category);
  
    let bestCoupon: Coupon | null = null;
    let maxDiscount = 0;
  
    for (const coupon of coupons) {
      // 1. Date Validation
      const start = new Date(coupon.startDate).getTime();
      const end = new Date(coupon.endDate).getTime();
      if (now < start || now > end) continue;
  
      // 2. Eligibility Checks
      const rules = coupon.eligibility;
  
      // User Tier
      if (rules.allowedUserTiers?.length && rules.allowedUserTiers.length > 0) {
        if (!rules.allowedUserTiers.includes(user.userTier)) continue;
      }
  
      // Lifetime Spend
      if (rules.minLifetimeSpend && user.lifetimeSpend < rules.minLifetimeSpend) continue;
  
      // Orders Placed
      if (rules.minOrdersPlaced && user.ordersPlaced < rules.minOrdersPlaced) continue;
  
      // First Order
      if (rules.firstOrderOnly && !user.isFirstOrder) continue;
  
      // Country
      if (rules.allowedCountries?.length && rules.allowedCountries.length > 0) {
        if (!rules.allowedCountries.includes(user.country)) continue;
      }
  
      // Cart Value
      if (rules.minCartValue && cartTotal < rules.minCartValue) continue;
  
      // Min Items
      if (rules.minItemsCount && totalItems < rules.minItemsCount) continue;
  
      // Applicable Categories (Must contain at least one item from list)
      if (rules.applicableCategories?.length && rules.applicableCategories.length > 0) {
        const hasCategory = cart.items.some(item => rules.applicableCategories!.includes(item.category));
        if (!hasCategory) continue;
      }
  
      // Excluded Categories (Must NOT contain any item from list)
      if (rules.excludedCategories?.length && rules.excludedCategories.length > 0) {
        const hasExcluded = cart.items.some(item => rules.excludedCategories!.includes(item.category));
        if (hasExcluded) continue;
      }
  
      // 3. Calculate Discount Amount
      let discountAmount = 0;
      if (coupon.discountType === "FLAT") {
        discountAmount = coupon.discountValue;
      } else {
        discountAmount = (cartTotal * coupon.discountValue) / 100;
        if (coupon.maxDiscountAmount) {
          discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
        }
      }
  
      // Ensure discount doesn't exceed cart total
      discountAmount = Math.min(discountAmount, cartTotal);
  
      if (discountAmount > maxDiscount) {
        maxDiscount = discountAmount;
        bestCoupon = coupon;
      }
    }
  
    return { coupon: bestCoupon, discount: maxDiscount };
  };