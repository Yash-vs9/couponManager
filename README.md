🎟️ E-Commerce Coupon Management System

A robust, full-stack Next.js application designed to manage, validate, and simulate dynamic discount coupons for e-commerce platforms. This system features a logic engine capable of parsing complex eligibility rules (User Tiers, Cart Value, Category Exclusions) to determine the absolute best discount for a customer.

🚀 Features

Smart Coupon Engine: Validates coupons based on 10+ parameters including User Tier, Lifetime Spend, Geolocation, and Cart Contents.

Real-Time Simulator: An interactive playground to test user profiles and cart items against active coupons to see exactly which one wins and why.

Dynamic Rule Creation: Admin interface to generate coupons with "Flat" or "Percentage" discounts, expiry dates, and complex inclusion/exclusion criteria.

In-Memory Database: Uses a Global Singleton pattern to persist data during development sessions without external database dependencies.

Modern UI/UX: Built with Glassmorphism design principles using Tailwind CSS and Framer Motion for fluid animations.

🛠️ Tech Stack

Framework: Next.js 14 (App Router)

Language: TypeScript

Styling: Tailwind CSS

Icons: Lucide React

Animations: Framer Motion

State Management: React Hooks & Server-Side In-Memory Store

🏁 Getting Started

1. Clone the Repository

```git clone [https://github.com/your-username/coupon-system.git](https://github.com/your-username/coupon-system.git)
cd coupon-system


2. Install Dependencies

npm install
# OR
yarn install


3. Run the Development Server

npm run dev


Open http://localhost:3000 with your browser.
```

📂 Project Structure
```
app/
├── admin/
│   └── coupons/
│       ├── create/               # UI for creating new coupons
│       └── best-coupon-simulator/# UI for testing cart logic
├── api/
│   └── coupons/
│       ├── route.ts              # GET/POST endpoints for coupon management
│       └── best/                 # Logic Engine endpoint
├── lib/
│   └── db.ts                     # Global Singleton In-Memory Database
├── utils/
│   └── couponManager.ts          # Shared Types & Client API Bridge
└── login/                        # Authentication Page
```

📡 API Documentation

1. Create Coupon

Endpoint: POST /api/coupons

Description: Stores a new coupon in the in-memory database.

Payload:
```
{
  "code": "WELCOME50",
  "discountType": "PERCENT",
  "discountValue": 50,
  "eligibility": {
    "allowedUserTiers": ["NEW", "GOLD"],
    "minCartValue": 500
  }
}
```

2. Get All Coupons

Endpoint: GET /api/coupons

Description: Returns a list of all active coupons (used for debugging).

3. Find Best Coupon

Endpoint: POST /api/coupons/best

Description: Runs the logic engine to find the highest discount.

Payload:
```
{
  "user": { "userTier": "GOLD", "country": "IN", ... },
  "cart": { "items": [{ "category": "electronics", "price": 1000 }] }
}
```

🧠 Logic Engine Details

The "Best Coupon" algorithm follows a strict Process of Elimination:

Fetch: Retrieves all coupons from the store.

Filter: Iterates through coupons and checks eligibility rules.

Date Check: Is now between startDate and endDate?

Tier Check: Is the user's tier in the allowed list? (Supports "ALL" wildcard).

Category Check: Does the cart contain at least one applicableCategory?

Exclusion Check: Does the cart contain any excludedCategory?

Calculate: Computes the monetary discount for all valid coupons.

Applies % logic and checks against maxDiscountAmount.

Ensures discount does not exceed total cart value.

Select: Compares results and returns the coupon with the highest numeric discount.

⚠️ Important Notes

Data Persistence: This project uses an In-Memory Store (app/lib/db.ts).

Consequence: If the server restarts (or if deployed to a serverless environment that goes idle), all created coupons will be wiped.

Solution: For the demo, create coupons fresh every time you restart the application.

Case Sensitivity: The logic engine is Case Insensitive.

"Electronics", "electronics", and "ELECTRONICS" are treated as identical