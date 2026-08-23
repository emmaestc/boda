"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { wedding } from "@/lib/config/wedding";

const TARGET_VOLUME = wedding.music.volume;
const FADE_IN_MS = 3500;
const FADE_OUT_MS = 700;
const STEP_MS = 50;

/**
 * Música de fondo.
 *
 * La reproducción arranca en el mismo instante en que se toca el sobre: ese
 * toque es el gesto de usuario que los navegadores exigen para dejar sonar
 * audio, y aprovecharlo ahí evita tanto el bloqueo del navegador como la
 * descortesía de que la música empiece sola nada más abrir el enlace.
 *
 * El elemento de audio se crea en ese momento y no antes, así que quien nunca
 * abre el sobre no descarga un solo byte de la canción. Entra con un fundido de
 * volumen para que se abra paso mientras el sobre se abre, en lugar de
 * irrumpir de golpe.
 */
export function useBackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<number | null>(null);
  const [playing, setPlaying] = useState(false);

  const stopFade = useCallback(() => {
    if (fadeRef.current !== null) {
      window.clearInterval(fadeRef.current);
      fadeRef.current = null;
    }
  }, []);

  /** Lleva el volumen hasta `target` de forma gradual. */
  const fadeTo = useCallback(
    (target: number, duration: number, onDone?: () => void) => {
      const audio = audioRef.current;
      if (!audio) return;

      stopFade();
      const from = audio.volume;
      const started = Date.now();

      fadeRef.current = window.setInterval(() => {
        const t = Math.min((Date.now() - started) / duration, 1);
        audio.volume = Math.max(0, Math.min(1, from + (target - from) * t));
        if (t >= 1) {
          stopFade();
          onDone?.();
        }
      }, STEP_MS);
    },
    [stopFade],
  );

  /** Crea el elemento de audio la primera vez que hace falta. */
  const getAudio = useCallback((): HTMLAudioElement | null => {
    if (!wedding.music.src) return null;
    if (!audioRef.current) {
      const audio = new Audio(wedding.music.src);
      audio.loop = true;
      audio.volume = 0;
      audioRef.current = audio;
    }
    return audioRef.current;
  }, []);

  const play = useCallback(
    (fadeMs: number) => {
      const audio = getAudio();
      if (!audio) return;

      audio.volume = 0;
      audio
        .play()
        .then(() => {
          setPlaying(true);
          fadeTo(TARGET_VOLUME, fadeMs);
        })
        .catch(() => {
          // Si el navegador lo impide, queda el control manual.
          setPlaying(false);
        });
    },
    [fadeTo, getAudio],
  );

  /**
   * Debe llamarse de forma síncrona dentro del manejador de un gesto real
   * (un clic o un toque). Si se aplaza, Safari en iOS puede rechazarlo.
   */
  const start = useCallback(() => {
    if (playing) return;
    play(FADE_IN_MS);
  }, [play, playing]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;

    if (playing && audio) {
      setPlaying(false);
      fadeTo(0, FADE_OUT_MS, () => audio.pause());
      return;
    }
    play(1200);
  }, [fadeTo, play, playing]);

  // Al abandonar la página, la música se calla.
  useEffect(() => {
    return () => {
      stopFade();
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, [stopFade]);

  return { playing, start, toggle };
}
