import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import logoImg from "@assets/svg_1772778640623.PNG";
import { motion } from "framer-motion";

export default function Onboarding() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center p-4 text-white overflow-hidden">
      {/* Radial Gradient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15)_0%,transparent_70%)] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-center text-center max-w-2xl"
      >
        {/* Logo with Pulse Effect */}
        <motion.div
          animate={{ 
            scale: [1, 1.02, 1],
            opacity: [0.9, 1, 0.9]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
          className="mb-8"
        >
          <img 
            src={logoImg} 
            alt="Flowtari Logo" 
            className="h-48 w-48 object-contain drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]"
          />
        </motion.div>

        <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
          Maximize Your Revenue with Flowtari
        </h1>
        
        <p className="text-[#94a3b8] text-lg md:text-xl mb-12 max-w-lg leading-relaxed">
          The all-in-one platform for automated revenue operations and real-time AI insights.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
          <Button 
            onClick={() => setLocation("/login")}
            className="flex-1 h-12 bg-[#3b82f6] hover:bg-[#3b82f6]/90 text-white rounded-xl font-semibold text-lg transition-all"
          >
            Get Started
          </Button>
          <Button 
            variant="outline"
            onClick={() => setLocation("/login")}
            className="flex-1 h-12 bg-transparent border-[#3b82f6] text-[#3b82f6] hover:bg-[#3b82f6]/10 rounded-xl font-semibold text-lg transition-all"
          >
            Sign In
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
