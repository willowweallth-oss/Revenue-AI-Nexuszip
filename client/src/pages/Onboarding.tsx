import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import logoImg from "@assets/svg_1772778640623.PNG";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Sparkles, Shield, Zap, Layout } from "lucide-react";

const BackgroundParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-blue-500/30 rounded-full"
          initial={{ 
            x: Math.random() * 100 + "%", 
            y: Math.random() * 100 + "%",
            opacity: Math.random() * 0.5
          }}
          animate={{
            y: [null, "-100%"],
            opacity: [0, 0.5, 0]
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1)_0%,transparent_50%)]" />
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="flex flex-col items-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors group"
  >
    <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400 mb-4 group-hover:scale-110 transition-transform">
      <Icon size={24} />
    </div>
    <h3 className="text-white font-semibold mb-2">{title}</h3>
    <p className="text-slate-400 text-sm">{description}</p>
  </motion.div>
);

export default function Onboarding() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen w-full bg-[#030712] flex flex-col items-center justify-center relative overflow-hidden font-sans selection:bg-blue-500/30">
      <BackgroundParticles />
      {/* Decorative Light Trails */}
      <div className="absolute top-0 left-1/4 w-px h-64 bg-gradient-to-b from-transparent via-blue-500/20 to-transparent" />
      <div className="absolute bottom-0 right-1/4 w-px h-64 bg-gradient-to-t from-transparent via-blue-500/20 to-transparent" />
      <main className="relative z-10 w-full max-w-6xl px-6 py-12 flex flex-col items-center font-normal bg-[transparent] text-center text-[16px] text-[#fafafa]">
        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 100,
            damping: 15
          }}
          className="relative mb-12"
        >
          <motion.div
            animate={{ 
              boxShadow: [
                "0 0 20px rgba(59,130,246,0.2)",
                "0 0 40px rgba(59,130,246,0.4)",
                "0 0 20px rgba(59,130,246,0.2)"
              ]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="rounded-full p-1 bg-gradient-to-br from-blue-400 to-blue-600"
          >
            <div className="bg-[#030712] rounded-full p-4">
              <img 
                src={logoImg} 
                alt="Flowtari Logo" 
                className="h-24 w-24 md:h-32 md:w-32 object-contain"
              />
            </div>
          </motion.div>
          
          {/* Subtle glow behind logo */}
          <div className="absolute inset-0 bg-blue-500/20 blur-3xl -z-10 rounded-full" />
        </motion.div>

        {/* Content Section */}
        <div className="text-center space-y-6 mb-16 max-w-3xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-white"
          >
            Maximize Your Revenue with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              Flowtari
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto font-medium"
          >
            The all-in-one platform for automated revenue operations and real-time AI insights. 
            Scale your business with intelligence that never sleeps.
          </motion.p>
        </div>

        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 mb-20 w-full max-w-md"
        >
          <Button 
            onClick={() => setLocation("/login")}
            className="group flex-1 h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Get Started
            <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button 
            variant="outline"
            onClick={() => setLocation("/login")}
            className="flex-1 h-14 bg-transparent border-2 border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/50 rounded-2xl font-bold text-lg transition-all"
          >
            Sign In
          </Button>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
          <FeatureCard 
            icon={Zap}
            title="Real-time Automation"
            description="Automate repetitive revenue tasks and focus on strategic growth."
            delay={0.5}
          />
          <FeatureCard 
            icon={Sparkles}
            title="AI-Powered Insights"
            description="Predictive analytics that identify new revenue opportunities instantly."
            delay={0.6}
          />
          <FeatureCard 
            icon={Shield}
            title="Enterprise Grade"
            description="Secure, compliant, and built for teams that demand excellence."
            delay={0.7}
          />
        </div>
      </main>
      {/* Subtle Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 text-slate-500 text-sm font-medium tracking-wide"
      >
        © 2026 FLOWTARI AI • REVENUE OPERATING SYSTEM
      </motion.footer>
    </div>
  );
}
