import { NextResponse } from "next/server";
import { COUPON_STORE } from "@/app/lib/db";
import { UserContext, Cart, Coupon } from "@/app/utils/couponManager";

export async function POST(request: Request) {
  try {
    const { user, cart }: { user: UserContext; cart: Cart } = await request.json();

    console.log("--- CALCULATING BEST COUPON ---");
    console.log(`User Tier: ${user.userTier}, Cart Items: ${cart.items.length}`);
    console.log(`Available Coupons in DB: ${COUPON_STORE.length}`);

    const now = new Date().getTime();
    
    const cartTotal = cart.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    
    let bestCoupon: Coupon | null = null;
    let maxDiscount = -1; // Start at -1 so even a ₹0 discount can win if it's the only valid one

    // Helper to check list membership ignoring Case and Spaces
    const hasMatch = (list: string[] | undefined, value: string) => {
        if (!list || list.length === 0) return false;
        return list.some(item => item.trim().toUpperCase() === value.trim().toUpperCase());
    };

    for (const coupon of COUPON_STORE) {
      // Safety check if eligibility is missing
      const rules = coupon.eligibility || {};
      
      let isValid = true;
      let rejectionReason = "";

      // --- 1. Date Validation ---
      if (coupon.startDate) {
         const start = new Date(coupon.startDate).getTime();
         if (now < start) {
             isValid = false;
             rejectionReason = `Not started yet (Start: ${coupon.startDate})`;
         }
      }
      if (isValid && coupon.endDate) {
         const endDateObj = new Date(coupon.endDate);
         endDateObj.setHours(23, 59, 59, 999);
         if (now > endDateObj.getTime()) {
             isValid = false;
             rejectionReason = `Expired (End: ${coupon.endDate})`;
         }
      }

      // --- 2. Eligibility Checks ---

      // User Tier Check
      if (isValid && rules.allowedUserTiers?.length) {
          const allowsAll = hasMatch(rules.allowedUserTiers, "ALL");
          const allowsUser = hasMatch(rules.allowedUserTiers, user.userTier);
          
          if (!allowsAll && !allowsUser) {
              isValid = false;
              rejectionReason = `Tier mismatch (User: ${user.userTier} not in [${rules.allowedUserTiers}])`;
          }
      }

      // Country Check
      if (isValid && rules.allowedCountries?.length) {
          const allowsGlobal = hasMatch(rules.allowedCountries, "GLOBAL") || hasMatch(rules.allowedCountries, "ALL");
          const allowsCountry = hasMatch(rules.allowedCountries, user.country);

          if (!allowsGlobal && !allowsCountry) {
              isValid = false;
              rejectionReason = `Country mismatch (User: ${user.country} not in [${rules.allowedCountries}])`;
          }
      }

      if (isValid && rules.minCartValue && cartTotal < rules.minCartValue) {
          isValid = false;
          rejectionReason = `Cart value too low (${cartTotal} < ${rules.minCartValue})`;
      }
      
      if (isValid && rules.minItemsCount && totalItems < rules.minItemsCount) {
          isValid = false;
          rejectionReason = `Not enough items (${totalItems} < ${rules.minItemsCount})`;
      }

      if (isValid && rules.firstOrderOnly && !user.isFirstOrder) {
          isValid = false;
          rejectionReason = `First order only`;
      }

      // Applicable Categories
      if (isValid && rules.applicableCategories?.length) {
        const hasCategory = cart.items.some(item => hasMatch(rules.applicableCategories, item.category));
        if (!hasCategory) {
            isValid = false;
            rejectionReason = `Cart has no items from: [${rules.applicableCategories}]`;
        }
      }

      // Excluded Categories
      if (isValid && rules.excludedCategories?.length) {
        const hasExcluded = cart.items.some(item => hasMatch(rules.excludedCategories, item.category));
        if (hasExcluded) {
            isValid = false;
            rejectionReason = `Cart contains excluded category item`;
        }
      }

      if (!isValid) {
          console.log(`❌ Rejected ${coupon.code}: ${rejectionReason}`);
          continue;
      }

      // --- 3. Calculate Discount ---
      let discountAmount = 0;
      const value = Number(coupon.discountValue) || 0;

      if (coupon.discountType === "FLAT") {
        discountAmount = value;
      } else {
        discountAmount = (cartTotal * value) / 100;
        if (coupon.maxDiscountAmount && coupon.maxDiscountAmount > 0) {
          discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
        }
      }

      discountAmount = Math.min(discountAmount, cartTotal);
      discountAmount = Math.round(discountAmount * 100) / 100;

      console.log(`✅ Accepted ${coupon.code}: Discount ₹${discountAmount}`);

      // FIX: Use >= so that the first valid coupon is selected even if discount is 0
      if (discountAmount >= maxDiscount) {
        maxDiscount = discountAmount;
        bestCoupon = coupon;
      }
    }

    if (bestCoupon) {
      // If maxDiscount is still -1 (because it was 0 and initialized to -1), reset to 0 for UI
      const finalDiscount = maxDiscount < 0 ? 0 : maxDiscount;
      return NextResponse.json({ coupon: bestCoupon, discount: finalDiscount });
    } else {
      return NextResponse.json({ coupon: null, discount: 0 });
    }

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Calculation failed" }, { status: 500 });
  }
}