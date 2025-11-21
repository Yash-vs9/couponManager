"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { findBestCoupon, UserContext, Cart, CartItem, Coupon } from "@/app/utils/couponManager";
import { ShoppingCart, User, Calculator, Plus, Trash2, DollarSign, MapPin, Crown, History, Loader2, AlertCircle, Tag } from "lucide-react";
import Link from "next/link";

export default function BestCouponSimulatorPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);
    
    const [user, setUser] = useState<UserContext>({
      userId: "u1",
      userTier: "NEW",
      country: "IN",
      lifetimeSpend: 0,
      ordersPlaced: 0,
      isFirstOrder: true,
    });

    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [newItem, setNewItem] = useState<CartItem>({ productId: "p1", category: "electronics", unitPrice: 100, quantity: 1 });
    const [result, setResult] = useState<{ text: string; log: string; success: boolean } | null>(null);

    // --- NEW: Fetch Coupons on Load to Debug ---
    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                const res = await fetch("/api/coupons");
                if (res.ok) {
                    const data = await res.json();
                    setAvailableCoupons(data);
                }
            } catch (e) {
                console.error("Failed to fetch coupons", e);
            }
        };
        fetchCoupons();
    }, []);

    const addItem = () => {
        if (!newItem.category || newItem.unitPrice <= 0) return;
        setCartItems([...cartItems, newItem]);
        setNewItem({ ...newItem, productId: `p${cartItems.length + 2}`, category: "", unitPrice: 0, quantity: 1 });
    };

    const removeItem = (index: number) => {
        const newItems = [...cartItems];
        newItems.splice(index, 1);
        setCartItems(newItems);
    };

    const simulate = async () => {
      const cart: Cart = { items: cartItems };
      setIsLoading(true);
      setResult(null);
      
      try {
        const { coupon, discount } = await findBestCoupon(user, cart);
        
        if (coupon) {
          setResult({
              success: true,
              text: `Winner: ${coupon.code}`,
              log: `Applied '${coupon.description}'. Total Discount: ₹${discount}`
          });
        } else {
          setResult({
              success: false,
              text: "No Coupon Applied",
              log: "Rules mismatch. Check the 'Available Coupons' list below to see requirements."
          });
        }
      } catch (error) {
         setResult({
            success: false,
            text: "Connection Error",
            log: "Could not reach the calculation API."
        });
      } finally {
        setIsLoading(false);
      }
    };

    const cartTotal = cartItems.reduce((acc, i) => acc + (i.unitPrice * i.quantity), 0);
    const inputClass = "w-full bg-gray-950/50 border border-gray-800 text-gray-100 text-sm rounded-lg focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 block p-2.5 transition-all duration-200 placeholder-gray-600";

    return (
      <div className="min-h-screen bg-gray-950 text-white p-4 md:p-10 flex justify-center items-start">
        <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5 }}
             className="w-full max-w-6xl"
        >
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
                        Coupon Simulator
                    </h1>
                    <p className="text-gray-400 mt-1">Test real-time eligibility logic.</p>
                </div>
                 <div className="flex items-center gap-2 bg-gray-900 p-2 rounded-lg border border-gray-800">
                    <div className={`w-3 h-3 rounded-full ${availableCoupons.length > 0 ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                    <span className="text-xs text-gray-400 font-mono">
                        DB Status: {availableCoupons.length} Coupons Active
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* LEFT: User & Cart Inputs */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* User Context */}
                        <Card className="bg-gray-900/80 backdrop-blur border-gray-800">
                            <CardHeader className="pb-2 border-b border-gray-800/50">
                                <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                                    <User className="w-4 h-4 text-cyan-400" /> User Profile
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-5 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] uppercase text-gray-500 font-bold mb-1">Tier</label>
                                        <select className={inputClass} value={user.userTier} onChange={e => setUser({...user, userTier: e.target.value as any})}>
                                            <option value="NEW">NEW</option>
                                            <option value="REGULAR">REGULAR</option>
                                            <option value="GOLD">GOLD</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase text-gray-500 font-bold mb-1">Country</label>
                                        <input type="text" placeholder="IN" className={inputClass} value={user.country} onChange={e => setUser({...user, country: e.target.value})} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] uppercase text-gray-500 font-bold mb-1">Spend</label>
                                        <input type="number" className={inputClass} value={user.lifetimeSpend} onChange={e => setUser({...user, lifetimeSpend: Number(e.target.value)})} />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase text-gray-500 font-bold mb-1">Orders</label>
                                        <input type="number" className={inputClass} value={user.ordersPlaced} onChange={e => setUser({...user, ordersPlaced: Number(e.target.value)})} />
                                    </div>
                                </div>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={user.isFirstOrder} onChange={e => setUser({...user, isFirstOrder: e.target.checked})} className="rounded bg-gray-800 border-gray-600 text-cyan-500" />
                                    <span className="text-xs text-gray-300">Is First Order?</span>
                                </label>
                            </CardContent>
                        </Card>

                        {/* Cart Builder */}
                        <Card className="bg-gray-900/80 backdrop-blur border-gray-800 flex flex-col">
                            <CardHeader className="pb-2 border-b border-gray-800/50">
                                <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                                    <ShoppingCart className="w-4 h-4 text-cyan-400" /> Cart ({cartItems.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-5 flex-1 flex flex-col">
                                <div className="flex gap-2 mb-4">
                                    <input placeholder="Cat (e.g. electronics)" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} className={`${inputClass} w-2/5`} />
                                    <input type="number" placeholder="₹" value={newItem.unitPrice || ''} onChange={e => setNewItem({...newItem, unitPrice: Number(e.target.value)})} className={`${inputClass} w-1/4`} />
                                    <Button onClick={addItem} className="bg-cyan-600 hover:bg-cyan-500 flex-1 h-[42px]">
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                                
                                <div className="flex-1 min-h-[100px] max-h-[150px] overflow-y-auto space-y-2 mb-4 pr-1 custom-scrollbar">
                                    {cartItems.length === 0 && <p className="text-xs text-gray-600 text-center py-4">Cart Empty</p>}
                                    {cartItems.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center text-xs bg-gray-800/50 p-2 rounded">
                                            <span>{item.category} (x{item.quantity})</span>
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono">₹{item.unitPrice}</span>
                                                <Trash2 className="w-3 h-3 text-red-400 cursor-pointer" onClick={() => removeItem(idx)} />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-2 border-t border-gray-800 flex justify-between items-center">
                                    <span className="text-xs font-bold text-gray-400">TOTAL</span>
                                    <span className="text-xl font-bold text-white">₹{cartTotal}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Result Area */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Button 
                            onClick={simulate} 
                            disabled={cartItems.length === 0 || isLoading}
                            className="md:col-span-1 h-20 text-lg font-bold bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 shadow-lg shadow-cyan-900/20 disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : "Run Simulation"}
                        </Button>

                        <div className={`md:col-span-2 p-4 rounded-xl border flex items-center justify-center transition-all ${
                            result 
                                ? result.success 
                                    ? "bg-teal-950/30 border-teal-500/50 shadow-[0_0_30px_-10px_rgba(20,184,166,0.3)]" 
                                    : "bg-red-950/30 border-red-500/50" 
                                : "bg-gray-900 border-gray-800 border-dashed"
                        }`}>
                            {result ? (
                                <div className="text-center">
                                    <h3 className={`text-xl font-bold ${result.success ? "text-teal-400" : "text-red-400"}`}>{result.text}</h3>
                                    <p className="text-sm text-gray-400 mt-1">{result.log}</p>
                                </div>
                            ) : (
                                <p className="text-gray-600 text-sm flex items-center gap-2">
                                    <Calculator className="w-4 h-4" /> Results will appear here
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT: Live DB Inspector */}
                <div className="lg:col-span-4">
                    <Card className="bg-gray-900/80 backdrop-blur border-gray-800 h-full max-h-[600px] flex flex-col">
                        <CardHeader className="pb-2 border-b border-gray-800">
                            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                                <Tag className="w-4 h-4 text-cyan-400" /> Available Coupons
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 flex-1 overflow-y-auto custom-scrollbar">
                            {availableCoupons.length === 0 ? (
                                <div className="p-8 text-center">
                                    <AlertCircle className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                                    <p className="text-gray-500 text-sm">No coupons found.</p>
                                    <Link href="/admin/coupons/create">
                                        {/* FIXED: Changed from variant="link" to variant="ghost" */}
                                        <Button variant="ghost" className="text-cyan-400 mt-2 hover:text-cyan-300 hover:bg-gray-800">Create one now &rarr;</Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-800">
                                    {availableCoupons.map((c, i) => (
                                        <div key={i} className="p-4 hover:bg-gray-800/50 transition-colors">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="font-bold text-cyan-300 font-mono">{c.code}</span>
                                                <span className="text-[10px] bg-gray-800 px-2 py-0.5 rounded border border-gray-700">
                                                    {c.discountType === "FLAT" ? `₹${c.discountValue} OFF` : `${c.discountValue}% OFF`}
                                                </span>
                                            </div>
                                            <div className="space-y-1 text-[10px] text-gray-500 uppercase font-mono">
                                                {c.eligibility.allowedUserTiers?.length ? <p>• Tiers: {c.eligibility.allowedUserTiers.join(", ")}</p> : null}
                                                {c.eligibility.minCartValue ? <p>• Min Cart: ₹{c.eligibility.minCartValue}</p> : null}
                                                {c.eligibility.applicableCategories?.length ? <p>• Categories: {c.eligibility.applicableCategories.join(", ")}</p> : null}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

            </div>
        </motion.div>
      </div>
    );
}