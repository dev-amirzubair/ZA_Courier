"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ParcelVisualProps {
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  weightKg: number;
  className?: string;
}

export function ParcelVisual({
  lengthCm,
  widthCm,
  heightCm,
  weightKg,
  className,
}: ParcelVisualProps) {
  const volume = Math.max(lengthCm * widthCm * heightCm, 1);
  const scale = Math.min(1.35, Math.max(0.7, Math.cbrt(volume) / 28));
  const depth = Math.min(28, Math.max(10, heightCm / 4));

  return (
    <div
      className={cn(
        "relative flex h-28 items-end justify-center rounded-xl bg-secondary/40 p-4",
        className,
      )}
      aria-hidden
    >
      <motion.div
        className="relative"
        animate={{
          scale,
          rotateX: 12,
          rotateY: -18,
        }}
        transition={{ type: "spring", stiffness: 220, damping: 22 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className="relative rounded-md border border-accent/40 bg-gradient-to-br from-accent/90 to-accent-2/70 shadow-[0_10px_30px_rgba(25,195,177,0.25)]"
          style={{
            width: `${Math.max(48, lengthCm * 1.1)}px`,
            height: `${Math.max(36, widthCm * 0.9)}px`,
          }}
        >
          <div
            className="absolute inset-y-0 right-0 w-3 rounded-r-md bg-primary/30"
            style={{ transform: `translateZ(${depth}px)` }}
          />
          <div className="absolute inset-x-2 top-1/2 h-px -translate-y-1/2 bg-white/35" />
          <div className="absolute inset-y-2 left-1/2 w-px -translate-x-1/2 bg-white/35" />
          <div className="absolute bottom-1.5 left-1.5 rounded bg-primary/70 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-white">
            {weightKg.toFixed(1)} kg
          </div>
        </div>
      </motion.div>
      <p className="absolute bottom-2 left-0 right-0 text-center text-[10px] uppercase tracking-[0.18em] text-accent-2/80">
        {Math.round(lengthCm)} × {Math.round(widthCm)} × {Math.round(heightCm)} cm
      </p>
    </div>
  );
}
