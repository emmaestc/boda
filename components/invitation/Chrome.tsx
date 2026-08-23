"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { wedding } from "@/lib/config/wedding";

/** Filete de progreso en el borde derecho: orienta sin estorbar. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.4 });

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed right-0 top-0 z-30 h-full w-px origin-top bg-[linear-gradient(180deg,#c7dbee,#e9d8b0,#c6a867)]"
      style={{ scaleY }}
    />
  );
}

/** Invitación a bajar. Desaparece para siempre al primer gesto de scroll. */
export function ScrollHint() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 60) setVisible(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="pointer-events-none fixed bottom-7 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-2"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12, transition: { duration: 0.5 } }}
          transition={{ delay: 1.4, duration: 1 }}
        >
          <span className="font-sans text-[0.88rem] tracking-[0.34em] text-ink-faint uppercase">
            Desliza
          </span>
          <motion.span
            className="block h-9 w-px bg-[linear-gradient(180deg,transparent,#9dbcda)]"
            animate={{ scaleY: [0.4, 1, 0.4], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "top" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Control de música, puramente visual: quien reproduce y silencia es
 * `useBackgroundMusic`, porque el audio tiene que arrancar en el mismo gesto
 * que abre el sobre y ese gesto ocurre fuera de este componente.
 */
export function MusicToggle({
  visible,
  playing,
  onToggle,
}: {
  visible: boolean;
  playing: boolean;
  onToggle: () => void;
}) {
  if (!wedding.music.src) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-5 left-5 z-40"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <button
            type="button"
            onClick={onToggle}
            aria-pressed={playing}
            aria-label={
              playing
                ? "Silenciar " + wedding.music.title
                : "Reproducir " + wedding.music.title
            }
            title={wedding.music.title + " — " + wedding.music.artist}
            className="group flex h-11 items-center gap-2.5 rounded-full border border-gold/35 bg-white/70 px-4 backdrop-blur-md transition-colors hover:border-gold hover:bg-white/90"
          >
            <span className="flex h-4 items-end gap-[3px]" aria-hidden>
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="w-[2px] rounded-full bg-gold-deep"
                  animate={playing ? { height: [5, 14, 7, 12, 5] } : { height: 5 }}
                  transition={
                    playing
                      ? { duration: 1.4, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }
                      : { duration: 0.3 }
                  }
                />
              ))}
            </span>
            <span className="font-sans text-[0.88rem] tracking-[0.3em] text-ink-soft uppercase">
              {playing ? "Sonando" : "Música"}
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
