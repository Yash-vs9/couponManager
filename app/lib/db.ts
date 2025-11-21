import { Coupon } from "@/app/utils/couponManager";

/**
 * GLOBAL STORE PATTERN
 * In Next.js development, simple variables reset on every file save.
 * We attach the store to `globalThis` so it persists while the server is running.
 */

// 1. Define the global type
declare global {
  // eslint-disable-next-line no-var
  var _couponStore: Coupon[] | undefined;
}

// 2. Use existing store or create new one
export const COUPON_STORE: Coupon[] = globalThis._couponStore || [];

// 3. Save reference back to global
if (process.env.NODE_ENV !== "production") {
  globalThis._couponStore = COUPON_STORE;
}