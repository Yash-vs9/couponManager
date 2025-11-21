"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { saveCoupon, Coupon } from "@/app/utils/couponManager";
import { Tag, Users, Loader2 } from "lucide-react";

// --- FIX 1: Define components OUTSIDE the main function to prevent focus loss ---
const InputGroup = ({ label, subLabel, children }: { label: string, subLabel?: string, children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <label className="text-sm font-medium text-gray-300 tracking-wide">{label}</label>
    {children}
    {subLabel && <p className="text-[10px] text-gray-500 uppercase font-mono">{subLabel}</p>}
  </div>
);

export default function CreateCouponPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- FIX 2: Use a "UI State" that stores strings for CSV fields ---
  // This prevents the "comma disappearing" bug while typing.
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "FLAT",
    discountValue: 0,
    maxDiscountAmount: 0,
    startDate: "",
    endDate: "",
    usageLimitPerUser: 1,
    // Eligibility fields as Strings (mapped to arrays later)
    allowedUserTiers: "",     
    allowedCountries: "",     
    minLifetimeSpend: 0,
    minOrdersPlaced: 0,
    firstOrderOnly: false,
    minCartValue: 0,
    minItemsCount: 0,
    applicableCategories: "", 
    excludedCategories: "",   
  });

  const handleChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code) return;
    
    setIsSubmitting(true);

    // --- FIX 3: Convert Strings to Arrays only ON SUBMIT ---
    const payload: Coupon = {
      code: formData.code.toUpperCase(),
      description: formData.description,
      discountType: formData.discountType as "FLAT" | "PERCENT",
      discountValue: formData.discountValue,
      maxDiscountAmount: formData.maxDiscountAmount,
      startDate: formData.startDate,
      endDate: formData.endDate,
      usageLimitPerUser: formData.usageLimitPerUser,
      eligibility: {
        allowedUserTiers: splitCsv(formData.allowedUserTiers),
        allowedCountries: splitCsv(formData.allowedCountries),
        applicableCategories: splitCsv(formData.applicableCategories),
        excludedCategories: splitCsv(formData.excludedCategories),
        minLifetimeSpend: formData.minLifetimeSpend,
        minOrdersPlaced: formData.minOrdersPlaced,
        firstOrderOnly: formData.firstOrderOnly,
        minCartValue: formData.minCartValue,
        minItemsCount: formData.minItemsCount,
      },
    };

    try {
      await saveCoupon(payload);
      alert(`Coupon ${payload.code} Saved Successfully!`);
      // Optional: Reset form or redirect
    } catch (error: any) {
      alert("Error saving coupon: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to convert "a, b, c" -> ["a", "b", "c"]
  const splitCsv = (str: string) => str.split(",").map(s => s.trim()).filter(s => s !== "");

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
          
          <div className="border-b border-gray-800 bg-gray-900/50 p-8">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
              Create New Coupon
            </h1>
            <p className="text-gray-400 mt-2">Configure discount rules and eligibility criteria.</p>
          </div>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-10">
              
              {/* Section 1: Core Details */}
              <section className="space-y-6">
                <div className="flex items-center gap-2 text-cyan-400 mb-4">
                  <Tag className="w-5 h-5" />
                  <h3 className="text-lg font-semibold uppercase tracking-wider">Core Details</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputGroup label="Coupon Code" subLabel="Unique identifier">
                    <input 
                      type="text" 
                      value={formData.code} 
                      onChange={e => handleChange("code", e.target.value)}
                      className={`${inputClass} font-mono font-bold tracking-wider text-cyan-300 uppercase`}
                      placeholder="WELCOME100" 
                      required 
                    />
                  </InputGroup>
                  <InputGroup label="Description">
                    <input 
                      type="text" 
                      value={formData.description} 
                      onChange={e => handleChange("description", e.target.value)} 
                      className={inputClass} 
                      placeholder="Summer Sale Discount" 
                    />
                  </InputGroup>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <InputGroup label="Discount Type">
                    <select 
                      value={formData.discountType} 
                      onChange={e => handleChange("discountType", e.target.value)} 
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
                        value={formData.discountValue} 
                        onChange={e => handleChange("discountValue", Number(e.target.value))} 
                        className={`${inputClass} pl-8`} 
                        required 
                      />
                      <span className="absolute left-3 top-2.5 text-gray-500 text-sm font-bold">
                        {formData.discountType === 'FLAT' ? '₹' : '%'}
                      </span>
                    </div>
                  </InputGroup>

                  <InputGroup label="Max Discount Cap" subLabel="Optional for %">
                     <div className="relative">
                      <input 
                        type="number" 
                        disabled={formData.discountType === "FLAT"}
                        value={formData.maxDiscountAmount} 
                        onChange={e => handleChange("maxDiscountAmount", Number(e.target.value))} 
                        className={`${inputClass} pl-8 disabled:opacity-50`} 
                      />
                      <span className="absolute left-3 top-2.5 text-gray-500 text-sm">₹</span>
                    </div>
                  </InputGroup>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputGroup label="Start Date">
                    <input 
                        type="date" 
                        value={formData.startDate} 
                        onChange={e => handleChange("startDate", e.target.value)} 
                        className={inputClass} 
                        required 
                    />
                  </InputGroup>
                  <InputGroup label="End Date">
                    <input 
                        type="date" 
                        value={formData.endDate} 
                        onChange={e => handleChange("endDate", e.target.value)} 
                        className={inputClass} 
                        required 
                    />
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputGroup label="Allowed User Tiers" subLabel="Comma separated (e.g. NEW, GOLD)">
                      <input 
                        type="text" 
                        value={formData.allowedUserTiers}
                        onChange={e => handleChange("allowedUserTiers", e.target.value)} 
                        className={inputClass} 
                        placeholder="ALL" 
                      />
                    </InputGroup>
                    <InputGroup label="Allowed Countries" subLabel="ISO Codes (e.g. IN, US)">
                      <input 
                        type="text" 
                        value={formData.allowedCountries}
                        onChange={e => handleChange("allowedCountries", e.target.value)} 
                        className={inputClass} 
                        placeholder="Global" 
                      />
                    </InputGroup>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <InputGroup label="Min Spend">
                      <input type="number" value={formData.minLifetimeSpend} onChange={e => handleChange("minLifetimeSpend", Number(e.target.value))} className={inputClass} />
                    </InputGroup>
                    <InputGroup label="Min Orders">
                      <input type="number" value={formData.minOrdersPlaced} onChange={e => handleChange("minOrdersPlaced", Number(e.target.value))} className={inputClass} />
                    </InputGroup>
                     <InputGroup label="Min Cart Value">
                      <input type="number" value={formData.minCartValue} onChange={e => handleChange("minCartValue", Number(e.target.value))} className={inputClass} />
                    </InputGroup>
                     <InputGroup label="Min Items">
                      <input type="number" value={formData.minItemsCount} onChange={e => handleChange("minItemsCount", Number(e.target.value))} className={inputClass} />
                    </InputGroup>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputGroup label="Applicable Categories" subLabel="At least one required">
                      <input 
                        type="text" 
                        value={formData.applicableCategories}
                        onChange={e => handleChange("applicableCategories", e.target.value)} 
                        className={inputClass} 
                        placeholder="electronics, fashion" 
                      />
                    </InputGroup>
                    <InputGroup label="Excluded Categories" subLabel="Cart must NOT contain">
                      <input 
                        type="text" 
                        value={formData.excludedCategories}
                        onChange={e => handleChange("excludedCategories", e.target.value)} 
                        className={inputClass} 
                        placeholder="clearance, books" 
                      />
                    </InputGroup>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 bg-cyan-950/20 border border-cyan-900/30 rounded-lg">
                    <input 
                      type="checkbox" 
                      id="firstOrder"
                      checked={formData.firstOrderOnly}
                      onChange={e => handleChange("firstOrderOnly", e.target.checked)} 
                      className="w-5 h-5 rounded border-gray-600 text-cyan-500 focus:ring-cyan-500 bg-gray-800" 
                    />
                    <label htmlFor="firstOrder" className="text-sm font-medium text-cyan-100 cursor-pointer select-none">
                      Limit to First Order Only
                    </label>
                  </div>
                </div>
              </section>

              <Button type="submit" disabled={isSubmitting} className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white shadow-lg shadow-cyan-900/20 rounded-xl transition-all duration-300 transform hover:scale-[1.01]">
                {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}
                {isSubmitting ? "Saving..." : "Create & Activate Coupon"}
              </Button>

            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}