"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE_SILK, inViewOnce } from "@/lib/motion";

/**
 * Revelado base al entrar en pantalla: opacidad y un pequeño desplazamiento.
 *
 * Deliberadamente sin desenfoque. Este componente se usa una veintena de veces
 * por página y un `filter` obliga al navegador a reservar una capa de
 * composición por elemento —además de quedarse pegado como `blur(0px)` cuando
 * la animación termina—, que es de las cosas que más se notan en un teléfono
 * modesto. El desenfoque queda reservado para los tres o cuatro momentos
 * grandes de la invitación, donde sí aporta.
 */
export function Reveal({
  children,
  delay = 0,
  y = 26,
  className = "",
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "li" | "span" | "p";
}) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={inViewOnce}
      transition={{ duration: 1.05, ease: EASE_SILK, delay }}
    >
      {children}
    </Tag>
  );
}
