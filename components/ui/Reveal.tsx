"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE_SILK, inViewOnce } from "@/lib/motion";

/**
 * Revelado base al entrar en pantalla. Acepta un desplazamiento y un retardo
 * para componer profundidad entre elementos de una misma escena.
 */
export function Reveal({
  children,
  delay = 0,
  y = 26,
  blur = 6,
  className = "",
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  blur?: number;
  className?: string;
  as?: "div" | "section" | "li" | "span" | "p";
}) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y, filter: "blur(" + blur + "px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={inViewOnce}
      transition={{ duration: 1.1, ease: EASE_SILK, delay }}
    >
      {children}
    </Tag>
  );
}
