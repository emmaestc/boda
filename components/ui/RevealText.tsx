"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE_SILK, inViewOnce } from "@/lib/motion";

/**
 * Revelado palabra por palabra. Cada palabra sube desde detrás de una máscara,
 * de manera que el texto parece escribirse en la página en lugar de aparecer.
 * El texto completo queda accesible para lectores de pantalla en un único
 * nodo; las palabras animadas se ocultan de la accesibilidad.
 */
export function RevealText({
  text,
  className = "",
  wordClassName = "",
  delay = 0,
  stagger = 0.055,
  as: Tag = "p",
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  as?: "p" | "h1" | "h2" | "h3" | "blockquote";
}) {
  const reduced = useReducedMotion();
  const words = text.split(" ");

  if (reduced) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden
        className="inline"
        initial="hidden"
        whileInView="show"
        viewport={inViewOnce}
        variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
      >
        {words.map((word, i) => (
          <span
            key={word + i}
            className="inline-block overflow-hidden align-bottom pb-[0.12em]"
          >
            <motion.span
              className={"inline-block whitespace-pre " + wordClassName}
              variants={{
                hidden: { y: "110%", opacity: 0, rotate: 2 },
                show: {
                  y: "0%",
                  opacity: 1,
                  rotate: 0,
                  transition: { duration: 0.95, ease: EASE_SILK },
                },
              }}
            >
              {word}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
