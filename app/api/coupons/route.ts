import { NextResponse } from "next/server";
import { COUPON_STORE } from "@/app/lib/db";
import { Coupon } from "@/app/utils/couponManager";

// GET /api/coupons
// Lists all coupons (for debugging)
export async function GET() {
  return NextResponse.json(COUPON_STORE);
}

// POST /api/coupons
// Creates a new coupon
export async function POST(request: Request) {
  try {
    const newCoupon: Coupon = await request.json();
    
    // Basic validation
    if (!newCoupon.code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    // Handle duplicates: Overwrite if exists (as per prompt suggestion)
    const existingIndex = COUPON_STORE.findIndex((c) => c.code === newCoupon.code);
    
    if (existingIndex > -1) {
      COUPON_STORE[existingIndex] = newCoupon;
    } else {
      COUPON_STORE.push(newCoupon);
    }

    return NextResponse.json({ success: true, message: "Coupon created", coupon: newCoupon });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 500 });
  }
}