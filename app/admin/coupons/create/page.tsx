"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { saveCoupon, Coupon } from "@/app/utils/couponManager";
import { Tag, Users, Calendar, CheckCircle2 } from "lucide-react";

export default function CreateCouponPage() {
  const [form, setForm] = useState<Partial<Coupon>>({
    code: "",
    description: "",
    discountType: "FLAT",
    discountValue: 0,
    maxDiscountAmount: 0,
    startDate: "",
    endDate: "",
    usageLimitPerUser: 1,
    eligibility: {
      allowedUserTiers: [],
      minLifetimeSpend: 0,
      minOrdersPlaced: 0,
      firstOrderOnly: false,
      allowedCountries: [],
      minCartValue: 0,
      applicableCategories: [],
      excludedCategories: [],
      minItemsCount: 0,
    },
  });

  // Helper for comma-separated inputs
  const handleArrayInput = (value: string, key: string) => {
    const array = value.split(",").map(s => s.trim()).filter(s => s !== "");
    setForm(prev => ({
      ...prev,
      eligibility: { ...prev.eligibility!, [key]: array }
    }));
  };

  const handleEligibilityChange = (key: string, value: any) => {
    setForm(prev => ({
      ...prev,
      eligibility: { ...prev.eligibility!, [key]: value }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code) return;
    saveCoupon(form as Coupon);
    alert(`Coupon ${form.code} Created & Saved!`);
  };

  // Reusable Input Wrapper for consistency
  const InputGroup = ({ label, subLabel, children }: { label: string, subLabel?: string, children: React.ReactNode }) => (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-300 tracking-wide">{label}</label>
      {children}
      {subLabel && <p className="text-[10px] text-gray-500 uppercase font-mono">{subLabel}</p>}
    </div>
  );

  const inputClass = "w-full bg-gray-950/50 border border-gray-800 text-gray-100 text-sm rounded-lg focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 block p-2.5 transition-all duration-200 placeholder-gray-600";

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <Card className="bg-gray-900/80 backdrop-blur-md border-gray-800 shadow-2xl overflow-hidden">
          
          {/* Header Section */}
          <div className="border-b border-gray-800 bg-gray-900/50 p-8">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
              Create New Coupon
            </h1>
            <p className="text-gray-400 mt-2">Configure discount rules and eligibility criteria.</p>
          </div>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-10">
              
              {/* Section 1: General Info & Validity */}
              <section className="space-y-6">
                <div className="flex items-center gap-2 text-cyan-400 mb-4">
                  <Tag className="w-5 h-5" />
                  <h3 className="text-lg font-semibold uppercase tracking-wider">Core Details</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputGroup label="Coupon Code" subLabel="Unique identifier (e.g. SAVE20)">
                    <input 
                      type="text" 
                      value={form.code} 
                      onChange={e => setForm({...form, code: e.target.value.toUpperCase()})} 
                      className={`${inputClass} font-mono font-bold tracking-wider text-cyan-300`}
                      placeholder="WELCOME100" 
                      required 
                    />
                  </InputGroup>
                  <InputGroup label="Description">
                    <input 
                      type="text" 
                      value={form.description} 
                      onChange={e => setForm({...form, description: e.target.value})} 
                      className={inputClass} 
                      placeholder="Summer Sale Discount" 
                    />
                  </InputGroup>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <InputGroup label="Discount Type">
                    <select 
                      value={form.discountType} 
                      onChange={e => setForm({...form, discountType: e.target.value as any})} 
                      className={inputClass}
                    >
                      <option value="FLAT">Flat Amount (₹)</option>
                      <option value="PERCENT">Percentage (%)</option>
                    </select>
                  </InputGroup>

                  <InputGroup label="Discount Value">
                    <div className="relative">
                      <input 
                        type="number" 
                        value={form.discountValue} 
                        onChange={e => setForm({...form, discountValue: Number(e.target.value)})} 
                        className={`${inputClass} pl-8`} 
                        required 
                      />
                      <span className="absolute left-3 top-2.5 text-gray-500 text-sm font-bold">
                        {form.discountType === 'FLAT' ? '₹' : '%'}
                      </span>
                    </div>
                  </InputGroup>

                  <InputGroup label="Max Discount Cap" subLabel={form.discountType === "FLAT" ? "Not applicable for Flat" : "Optional limit"}>
                     <div className="relative">
                      <input 
                        type="number" 
                        disabled={form.discountType === "FLAT"}
                        value={form.maxDiscountAmount} 
                        onChange={e => setForm({...form, maxDiscountAmount: Number(e.target.value)})} 
                        className={`${inputClass} pl-8 disabled:opacity-50 disabled:cursor-not-allowed`} 
                      />
                      <span className="absolute left-3 top-2.5 text-gray-500 text-sm">₹</span>
                    </div>
                  </InputGroup>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputGroup label="Start Date">
                    <input type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} className={inputClass} required />
                  </InputGroup>
                  <InputGroup label="End Date">
                    <input type="date" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} className={inputClass} required />
                  </InputGroup>
                </div>
              </section>

              <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

              {/* Section 2: Eligibility Rules */}
              <section className="space-y-6">
                 <div className="flex items-center gap-2 text-cyan-400 mb-4">
                  <Users className="w-5 h-5" />
                  <h3 className="text-lg font-semibold uppercase tracking-wider">Eligibility Rules</h3>
                </div>

                <div className="p-6 bg-gray-950/30 border border-gray-800 rounded-xl space-y-6">
                  
                  {/* User & Location */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputGroup label="Allowed User Tiers" subLabel="Comma separated (e.g. NEW, GOLD)">
                      <input type="text" onChange={e => handleArrayInput(e.target.value, "allowedUserTiers")} className={inputClass} placeholder="ALL" />
                    </InputGroup>
                    <InputGroup label="Allowed Countries" subLabel="ISO Codes (e.g. IN, US)">
                      <input type="text" onChange={e => handleArrayInput(e.target.value, "allowedCountries")} className={inputClass} placeholder="Global" />
                    </InputGroup>
                  </div>

                  {/* Numerical Constraints */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <InputGroup label="Min Lifetime Spend">
                      <input type="number" placeholder="0" onChange={e => handleEligibilityChange("minLifetimeSpend", Number(e.target.value))} className={inputClass} />
                    </InputGroup>
                    <InputGroup label="Min Orders Placed">
                      <input type="number" placeholder="0" onChange={e => handleEligibilityChange("minOrdersPlaced", Number(e.target.value))} className={inputClass} />
                    </InputGroup>
                     <InputGroup label="Min Cart Value">
                      <input type="number" placeholder="0" onChange={e => handleEligibilityChange("minCartValue", Number(e.target.value))} className={inputClass} />
                    </InputGroup>
                     <InputGroup label="Min Items Count">
                      <input type="number" placeholder="0" onChange={e => handleEligibilityChange("minItemsCount", Number(e.target.value))} className={inputClass} />
                    </InputGroup>
                  </div>

                  {/* Categories */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputGroup label="Applicable Categories" subLabel="At least one required">
                      <input type="text" onChange={e => handleArrayInput(e.target.value, "applicableCategories")} className={inputClass} placeholder="electronics, fashion" />
                    </InputGroup>
                    <InputGroup label="Excluded Categories" subLabel="Cart must NOT contain">
                      <input type="text" onChange={e => handleArrayInput(e.target.value, "excludedCategories")} className={inputClass} placeholder="clearance, gift-cards" />
                    </InputGroup>
                  </div>
                  
                   {/* Checkbox Toggle */}
                  <div className="flex items-center space-x-3 p-4 bg-cyan-950/20 border border-cyan-900/30 rounded-lg">
                    <input 
                      type="checkbox" 
                      id="firstOrder"
                      onChange={e => handleEligibilityChange("firstOrderOnly", e.target.checked)} 
                      className="w-5 h-5 rounded border-gray-600 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-gray-900 bg-gray-800" 
                    />
                    <label htmlFor="firstOrder" className="text-sm font-medium text-cyan-100 cursor-pointer select-none">
                      Limit to First Order Only
                    </label>
                  </div>
                </div>
              </section>

              <Button type="submit" className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white shadow-lg shadow-cyan-900/20 rounded-xl transition-all duration-300 transform hover:scale-[1.01]">
                Create & Activate Coupon
              </Button>

            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}