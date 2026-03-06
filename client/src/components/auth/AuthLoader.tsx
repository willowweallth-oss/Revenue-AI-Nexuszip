import { motion } from "framer-motion";
import logoImg from "@assets/svg_1772778640623.PNG";

export function AuthLoader() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-[10px]">
      <div className="relative flex items-center justify-center">
        {/* Spinning Ring */}
        <motion.div
          className="w-24 h-24 rounded-full border-4 border-transparent"
          style={{
            background: "conic-gradient(from 0deg, #3b82f6, #06b6d4, transparent)",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "destination-out",
            maskComposite: "exclude",
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Pulsing Logo */}
        <motion.div
          className="absolute flex items-center justify-center"
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{
            scale: [0.8, 1.1, 0.8],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <img
            src={logoImg}
            alt="Flowtari Logo"
            className="w-12 h-12 object-contain filter drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]"
          />
        </motion.div>
      </div>
    </div>
  );
}
