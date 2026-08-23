"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ActionLink } from "@/components/ui/Button";
import { Pin } from "@/components/art/Icons";
import { mapsEmbed, mapsLink } from "@/lib/maps";

type Place = { readonly mapsQuery: string; readonly mapsUrl: string | null };

/**
 * Botón a Google Maps y, opcionalmente, un mapa incrustado que solo se carga
 * cuando la persona lo pide: así ninguna visita paga el coste de un iframe de
 * terceros sin haberlo querido.
 */
export function MapPanel({ place, label }: { place: Place; label: string }) {
  const [showMap, setShowMap] = useState(false);

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <ActionLink href={mapsLink(place)} variant="outline">
          <Pin className="h-4 w-4 text-gold-deep" />
          Ver en Google Maps
        </ActionLink>
        <button
          type="button"
          onClick={() => setShowMap((v) => !v)}
          aria-expanded={showMap}
          className="font-sans text-[0.62rem] tracking-[0.24em] text-ink-faint uppercase underline-offset-4 transition-colors hover:text-ink hover:underline"
        >
          {showMap ? "Ocultar mapa" : "Ver el mapa aquí"}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {showMap && (
          <motion.div
            key="map"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="w-full overflow-hidden"
          >
            <div className="overflow-hidden rounded-2xl border border-white/70 shadow-[var(--shadow-soft)]">
              <iframe
                title={"Mapa de " + label}
                src={mapsEmbed(place)}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-56 w-full border-0 sm:h-64"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
