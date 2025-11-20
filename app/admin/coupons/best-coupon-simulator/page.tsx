"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { findBestCoupon, UserContext, Cart, CartItem } from "@/app/utils/couponManager";
import { ShoppingCart, User, Calculator, Plus, Trash2, DollarSign, MapPin, Crown, History } from "lucide-react";

export default function BestCouponSimulatorPage() {
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

    const simulate = () => {
      const cart: Cart = { items: cartItems };
      const { coupon, discount } = findBestCoupon(user, cart);
      
      if (coupon) {
        setResult({
            success: true,
            text: `Best Coupon: ${coupon.code}`,
            log: `Applied '${coupon.description}' saving ₹${discount} (${coupon.discountType})`
        });
      } else {
        setResult({
            success: false,
            text: "No Coupon Found",
            log: "No active coupons matched the user eligibility or cart requirements."
        });
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
             className="w-full max-w-5xl"
        >
            <div className="mb-8 text-center md:text-left">
                 <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
                  Coupon Simulator
                </h1>
                <p className="text-gray-400 mt-2">Test your coupons against real-time scenarios.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Panel: User Context */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="bg-gray-900/80 backdrop-blur border-gray-800 h-full">
                        <CardContent className="p-6 space-y-6">
                            <div className="flex items-center gap-2 text-cyan-400 border-b border-gray-800 pb-4">
                                <User className="w-5 h-5" />
                                <h2 className="text-lg font-semibold">User Context</h2>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs uppercase text-gray-500 font-bold mb-1 block flex items-center gap-1"><Crown className="w-3 h-3"/> User Tier</label>
                                    <select className={inputClass} value={user.userTier} onChange={e => setUser({...user, userTier: e.target.value as any})}>
                                        <option value="NEW">NEW</option>
                                        <option value="REGULAR">REGULAR</option>
                                        <option value="GOLD">GOLD</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs uppercase text-gray-500 font-bold mb-1 block flex items-center gap-1"><MapPin className="w-3 h-3"/> Country Code</label>
                                    <input type="text" placeholder="e.g. IN, US" className={inputClass} value={user.country} onChange={e => setUser({...user, country: e.target.value})} />
                                </div>

                                <div>
                                    <label className="text-xs uppercase text-gray-500 font-bold mb-1 block flex items-center gap-1"><DollarSign className="w-3 h-3"/> Lifetime Spend</label>
                                    <input type="number" className={inputClass} value={user.lifetimeSpend} onChange={e => setUser({...user, lifetimeSpend: Number(e.target.value)})} />
                                </div>

                                 <div>
                                    <label className="text-xs uppercase text-gray-500 font-bold mb-1 block flex items-center gap-1"><History className="w-3 h-3"/> Past Orders</label>
                                    <input type="number" className={inputClass} value={user.ordersPlaced} onChange={e => setUser({...user, ordersPlaced: Number(e.target.value)})} />
                                </div>

                                <div className="pt-2">
                                    <label className="flex items-center space-x-3 p-3 bg-gray-950/50 border border-gray-800 rounded-lg cursor-pointer hover:border-cyan-500/50 transition-colors">
                                        <input type="checkbox" checked={user.isFirstOrder} onChange={e => setUser({...user, isFirstOrder: e.target.checked})} className="w-4 h-4 rounded border-gray-600 text-cyan-500 focus:ring-cyan-500 bg-gray-800" />
                                        <span className="text-sm text-gray-300 font-medium">First Time User?</span>
                                    </label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Panel: Cart & Results */}
                <div className="lg:col-span-8 space-y-6">
                    
                    {/* Cart Section */}
                    <Card className="bg-gray-900/80 backdrop-blur border-gray-800">
                        <CardContent className="p-6">
                             <div className="flex items-center justify-between text-cyan-400 border-b border-gray-800 pb-4 mb-6">
                                <div className="flex items-center gap-2">
                                    <ShoppingCart className="w-5 h-5" />
                                    <h2 className="text-lg font-semibold">Shopping Cart</h2>
                                </div>
                                <span className="text-gray-500 text-xs font-mono uppercase">Total Items: {cartItems.reduce((acc, i) => acc + i.quantity, 0)}</span>
                            </div>

                            {/* Add Item Row */}
                            <div className="flex flex-col md:flex-row gap-3 mb-6 bg-gray-950/30 p-4 rounded-xl border border-gray-800/50">
                                <input placeholder="Category (e.g. electronics)" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} className={`${inputClass} md:w-2/5`} />
                                <input type="number" placeholder="Price" value={newItem.unitPrice || ''} onChange={e => setNewItem({...newItem, unitPrice: Number(e.target.value)})} className={`${inputClass} md:w-1/4`} />
                                <input type="number" placeholder="Qty" value={newItem.quantity} onChange={e => setNewItem({...newItem, quantity: Number(e.target.value)})} className={`${inputClass} md:w-1/6`} />
                                <Button onClick={addItem}  className="bg-cyan-600 hover:bg-cyan-500 md:w-1/6 aspect-square md:aspect-auto h-10 w-full">
                                    <Plus className="w-5 h-5" />
                                </Button>
                            </div>

                            {/* Cart Items List */}
                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar mb-6">
                                {cartItems.length === 0 ? (
                                    <div className="text-center py-10 text-gray-600 border-2 border-dashed border-gray-800 rounded-xl">
                                        <ShoppingCart className="w-10 h-10 mx-auto mb-2 opacity-20" />
                                        <p>Cart is empty. Add items to begin.</p>
                                    </div>
                                ) : (
                                    cartItems.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-800/40 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors group">
                                            <div>
                                                <p className="font-medium text-gray-200">{item.category}</p>
                                                <p className="text-xs text-gray-500">Unit: ₹{item.unitPrice} x {item.quantity}</p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="font-mono text-cyan-300">₹{item.unitPrice * item.quantity}</span>
                                                <button onClick={() => removeItem(idx)} className="text-gray-600 hover:text-red-400 transition-colors p-1">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Total Footer */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                                <span className="text-gray-400 uppercase text-sm font-bold tracking-wider">Cart Total</span>
                                <span className="text-3xl font-bold text-white">₹{cartTotal}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action & Result */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Button 
                            onClick={simulate} 
                            disabled={cartItems.length === 0}
                            className="md:col-span-1 h-14  text-lg font-bold bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 shadow-lg shadow-cyan-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >

                            Calculate
                        </Button>

                        <div className={`md:col-span-2 p-4 rounded-xl border transition-all duration-300 ${
                            result 
                                ? result.success 
                                    ? "bg-teal-950/30 border-teal-500/50 shadow-[0_0_30px_-10px_rgba(20,184,166,0.3)]" 
                                    : "bg-red-950/30 border-red-500/50" 
                                : "bg-gray-900 border-gray-800 border-dashed"
                        }`}>
                            {result ? (
                                <div className="flex flex-col justify-center h-full">
                                    <h3 className={`text-xl font-bold ${result.success ? "text-teal-400" : "text-red-400"}`}>
                                        {result.text}
                                    </h3>
                                    <p className="text-sm text-gray-400 mt-1 font-mono">{result.log}</p>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-600 gap-2">
                                    <History className="w-4 h-4" />
                                    <span>Results will appear here...</span>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </motion.div>
      </div>
    );
}