"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { EASE_SILK } from "@/lib/motion";
import type { GuestStats } from "@/lib/guests/types";

/** Cuenta ascendente breve. No depende de rAF, así que nunca queda a medias. */
function useCountUp(target: number, duration = 700) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (target === 0) return;
    const start = Date.now();
    const id = window.setInterval(() => {
      const t = Math.min((Date.now() - start) / duration, 1);
      // Salida suave: rápido al principio, se posa al final.
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t >= 1) window.clearInterval(id);
    }, 40);
    return () => window.clearInterval(id);
  }, [target, duration]);

  return value;
}

function StatCard({
  label,
  value,
  tone,
  delay,
}: {
  label: string;
  value: number;
  tone: string;
  delay: number;
}) {
  const shown = useCountUp(value);
  return (
    <motion.div
      className="glass-card flex flex-col items-center gap-1.5 rounded-2xl px-4 py-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE_SILK, delay }}
    >
      <span className="font-serif text-4xl leading-none font-light tabular-nums" style={{ color: tone }}>
        {shown}
      </span>
      <span className="text-center font-sans text-[0.55rem] leading-tight tracking-[0.22em] text-ink-faint uppercase">
        {label}
      </span>
    </motion.div>
  );
}

const TONES = {
  confirmado: "#7c9e7a",
  pendiente: "#c6a867",
  no_asiste: "#b98b8b",
  ink: "#24384f",
};

/** Anillo de proporciones. Sustituye a una gráfica de barras corporativa. */
function Donut({ stats }: { stats: GuestStats }) {
  const total = Math.max(stats.total, 1);
  const radius = 52;
  const circumference = 2 * Math.PI * radius;

  const segments = [
    { key: "confirmado", value: stats.confirmados, color: TONES.confirmado, label: "Confirmados" },
    { key: "pendiente", value: stats.pendientes, color: TONES.pendiente, label: "Pendientes" },
    { key: "no_asiste", value: stats.no_asisten, color: TONES.no_asiste, label: "No asisten" },
  ];

  let offset = 0;

  return (
    <div className="glass-card flex flex-col items-center gap-5 rounded-2xl px-6 py-7 sm:flex-row sm:gap-8">
      <div className="relative h-36 w-36 shrink-0">
        <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
          <circle cx="64" cy="64" r={radius} fill="none" stroke="#e6edf5" strokeWidth="11" />
          {segments.map((segment, i) => {
            const length = (segment.value / total) * circumference;
            const dash = offset;
            offset += length;
            return (
              <motion.circle
                key={segment.key}
                cx="64"
                cy="64"
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth="11"
                strokeLinecap="butt"
                strokeDasharray={length + " " + (circumference - length)}
                initial={{ strokeDashoffset: -dash, opacity: 0 }}
                animate={{ strokeDashoffset: -dash, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.12 }}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-serif text-3xl font-light text-ink tabular-nums">
            {stats.personas_confirmadas}
          </span>
          <span className="font-sans text-[0.5rem] tracking-[0.2em] text-ink-faint uppercase">
            personas
          </span>
        </div>
      </div>

      <ul className="flex w-full flex-col gap-2.5">
        {segments.map((segment) => (
          <li key={segment.key} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2.5">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: segment.color }}
              />
              <span className="font-sans text-xs text-ink-soft">{segment.label}</span>
            </span>
            <span className="font-sans text-sm tabular-nums text-ink">{segment.value}</span>
          </li>
        ))}
        <li className="mt-1 flex items-center justify-between gap-4 border-t border-powder/60 pt-2.5">
          <span className="font-sans text-xs text-ink-faint">
            Abrieron y no respondieron
          </span>
          <span className="font-sans text-sm tabular-nums text-ink-soft">
            {stats.abiertas_sin_responder}
          </span>
        </li>
      </ul>
    </div>
  );
}

export function StatsPanel({ stats }: { stats: GuestStats }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Invitaciones" value={stats.total} tone={TONES.ink} delay={0} />
        <StatCard label="Confirmados" value={stats.confirmados} tone={TONES.confirmado} delay={0.08} />
        <StatCard label="Pendientes" value={stats.pendientes} tone={TONES.pendiente} delay={0.16} />
        <StatCard label="No asisten" value={stats.no_asisten} tone={TONES.no_asiste} delay={0.24} />
      </div>
      <Donut stats={stats} />
    </div>
  );
}
