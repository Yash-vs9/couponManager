"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Mail, ArrowRight, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setError(""); // Clear error when user types
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate network delay for a realistic feel
    await new Promise((resolve) => setTimeout(resolve, 800));

    // --- HARDCODED SEED DATA CHECK ---
    // As per requirements for deployment access
    if (
      credentials.email === "hire-me@anshumat.org" &&
      credentials.password === "HireMe@2025!"
    ) {
      // Save Auth Token (Simulated)
      if (typeof window !== "undefined") {
        localStorage.setItem("isAuthenticated", "true");
        // Set a cookie as well for potential server-side middleware
        document.cookie = "auth_token=demo-access-token; path=/; max-age=86400"; 
      }
      router.push("/"); // Redirect to Dashboard
    } else {
      setError("Invalid credentials. Access denied.");
      setIsLoading(false);
    }
  };

  const inputClass = "w-full bg-gray-950/50 border border-gray-800 text-gray-100 text-sm rounded-lg focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 block p-3 pl-10 transition-all duration-200 placeholder-gray-600";

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-800 shadow-2xl">
          <CardHeader className="text-center space-y-2 pb-2 pt-8">
            <div className="mx-auto w-12 h-12 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-900/20 mb-4">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
              Admin Access
            </CardTitle>
            <CardDescription className="text-gray-500">
              Enter your authorized credentials to continue.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8 pt-6">
            <form onSubmit={handleLogin} className="space-y-6">
              
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Mail className="w-4 h-4 text-gray-500" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={credentials.email}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="name@company.com"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock className="w-4 h-4 text-gray-500" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 flex items-center gap-2 text-red-400 text-sm"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </motion.div>
              )}

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-semibold shadow-lg shadow-cyan-900/20 rounded-xl transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying...
                  </>
                ) : (
                  <>
                    Sign In 
                  </>
                )}
              </Button>

              <div className="text-center">
                 <p className="text-xs text-gray-600 mt-4">
                   Protected System • Authorized Personnel Only
                 </p>
              </div>

            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}