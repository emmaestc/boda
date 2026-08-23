"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const base =
  "relative inline-flex min-h-12 items-center justify-center gap-2.5 overflow-hidden rounded-full px-7 py-3.5 " +
  "font-sans text-[0.72rem] font-medium tracking-[0.24em] uppercase transition-colors duration-500 " +
  "disabled:pointer-events-none disabled:opacity-45";

const variants = {
  /** Acción principal: fondo tinta con brillo dorado que la recorre. */
  solid:
    "bg-ink text-porcelain shadow-[0_16px_40px_-22px_rgba(36,56,79,0.85)] hover:bg-[#1b2c3f]",
  /** Acción secundaria sobre vidrio. */
  outline:
    "border border-gold/50 bg-white/55 text-ink backdrop-blur-sm hover:border-gold hover:bg-white/80",
  /** Terciaria, casi sin peso visual. */
  ghost: "text-ink-soft hover:text-ink",
} as const;

type Variant = keyof typeof variants;

/** Destello que cruza el botón al pasar el cursor o al enfocarlo. */
function Sheen() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(100deg,transparent,rgba(233,216,176,0.45),transparent)] transition-transform duration-[900ms] ease-out group-hover:translate-x-full group-focus-visible:translate-x-full"
    />
  );
}

export function ActionButton({
  children,
  variant = "solid",
  className,
  ...props
}: {
  children: ReactNode;
  variant?: Variant;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.975 }}
      transition={{ type: "spring", stiffness: 340, damping: 24 }}
      className={cn("group", base, variants[variant], className)}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      <Sheen />
      <span className="relative flex items-center gap-2.5">{children}</span>
    </motion.button>
  );
}

export function ActionLink({
  children,
  href,
  variant = "outline",
  className,
  external = true,
}: {
  children: ReactNode;
  href: string;
  variant?: Variant;
  className?: string;
  external?: boolean;
}) {
  return (
    <motion.a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.975 }}
      transition={{ type: "spring", stiffness: 340, damping: 24 }}
      className={cn("group", base, variants[variant], className)}
    >
      <Sheen />
      <span className="relative flex items-center gap-2.5">{children}</span>
    </motion.a>
  );
}
