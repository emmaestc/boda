"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Scene } from "@/components/invitation/Scene";
import { Rings } from "@/components/art/Rings";
import { Divider } from "@/components/art/Icons";
import { EASE_SILK } from "@/lib/motion";
import { wedding } from "@/lib/config/wedding";

/**
 * El encuentro. Los anillos llegan de lados opuestos y se entrelazan; el "&"
 * nace de esa unión y los nombres se revelan desde el centro. Es el punto
 * donde los dos hilos de luz de la página se vuelven uno solo.
 */
export function Names() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.45 });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Parallax muy contenido: profundidad sin marear.
  const ringsY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const namesY = useTransform(scrollYProgress, [0, 1], [16, -16]);
  // La ilustración del fondo se mueve menos que todo lo demás: es la capa
  // más lejana y así se nota la profundidad.
  const fotoY = useTransform(scrollYProgress, [0, 1], [70, -70]);

  const name = (text: string, from: number, delay: number) => (
    <motion.span
      className="block font-serif text-[2.6rem] leading-none font-light tracking-[0.16em] text-ink uppercase sm:text-[3.6rem] sm:tracking-[0.2em]"
      initial={{ opacity: 0, x: from, filter: "blur(8px)" }}
      animate={
        inView
          ? { opacity: 1, x: 0, filter: "blur(0px)", transitionEnd: { filter: "none" } }
          : {}
      }
      transition={{ duration: 1.5, ease: EASE_SILK, delay }}
    >
      {text}
    </motion.span>
  );

  return (
    <Scene id="novios">
      {/*
        La pareja, muy desenfocada y detrás de todo: se percibe como una
        presencia cálida más que como una fotografía, así que no compite con
        los nombres ni le quita legibilidad a nada. La máscara radial disuelve
        los bordes para que no se note el recuadro.
      */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-[1] flex items-center justify-center"
        style={{ y: fotoY }}
        initial={{ opacity: 0, scale: 1.08 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 2.4, ease: EASE_SILK, delay: 0.3 }}
      >
        <div
          className="h-[min(78vw,26rem)] w-[min(78vw,26rem)] bg-[url('/images/novios.jpg')] bg-cover bg-center opacity-[0.22] blur-[7px] saturate-[0.85]"
          style={{
            maskImage: "radial-gradient(circle at 50% 45%, #000 32%, transparent 72%)",
            WebkitMaskImage: "radial-gradient(circle at 50% 45%, #000 32%, transparent 72%)",
          }}
        />
      </motion.div>

      <div ref={ref} className="relative flex w-full flex-col items-center">
        <motion.div style={{ y: ringsY }} className="w-52 sm:w-64">
          <Rings active={inView} className="w-full" />
        </motion.div>

        <motion.h2
          style={{ y: namesY }}
          className="mt-6 flex flex-col items-center gap-2"
        >
          {name(wedding.couple.first, -70, 1.55)}

          {/* La tinta del ampersand cursivo mide 0,775 del cuerpo de la
              fuente; a este tamaño queda un 25 % más alto que las mayúsculas
              serif, que es justo la proporción que pide la composición. */}
          <motion.span
            className="font-script text-gilded animate-shimmer my-1 block text-5xl leading-[0.8] sm:my-2 sm:text-6xl"
            initial={{ opacity: 0, scale: 0.4, filter: "blur(12px)" }}
            animate={
              inView
                ? { opacity: 1, scale: 1, filter: "blur(0px)", transitionEnd: { filter: "none" } }
                : {}
            }
            transition={{ duration: 1.3, ease: EASE_SILK, delay: 1.35 }}
          >
            &amp;
          </motion.span>

          {name(wedding.couple.second, 70, 1.7)}
        </motion.h2>

        <motion.div
          className="mt-10 flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease: EASE_SILK, delay: 2.2 }}
        >
          <Divider className="w-44 text-gold" />
          <p className="max-w-xs font-serif text-base leading-relaxed text-ink-soft italic">
            &ldquo;{wedding.copy.verse.text}&rdquo;
          </p>
          <span className="font-sans text-[0.88rem] tracking-[0.34em] text-ink-faint uppercase">
            {wedding.copy.verse.reference}
          </span>
        </motion.div>
      </div>
    </Scene>
  );
}
