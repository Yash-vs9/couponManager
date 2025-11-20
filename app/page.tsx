import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-10">
      <h1 className="text-4xl font-bold text-cyan-400 mb-10">Coupon Management System</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <Link href="/admin/coupons/create" className="group">
          <Card className="bg-gray-900 border-gray-700 hover:border-cyan-500 transition-all h-40 flex items-center justify-center cursor-pointer">
            <CardContent>
              <h2 className="text-2xl font-semibold group-hover:text-cyan-300">Create Coupon</h2>
              <p className="text-gray-400 text-center mt-2">Define rules and discounts</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/coupons/best-coupon-simulator" className="group">
          <Card className="bg-gray-900 border-gray-700 hover:border-cyan-500 transition-all h-40 flex items-center justify-center cursor-pointer">
            <CardContent>
              <h2 className="text-2xl font-semibold group-hover:text-cyan-300">Simulator</h2>
              <p className="text-gray-400 text-center mt-2">Test cart & user eligibility</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}