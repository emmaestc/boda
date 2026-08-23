"use client";

import { useEffect, useRef, useState } from "react";
import { Atmosphere } from "./Atmosphere";
import { Ambient } from "./Ambient";
import { LightThread } from "./LightThread";
import { MusicToggle, ScrollHint, ScrollProgress } from "./Chrome";
import { Scene, Eyebrow } from "./Scene";
import { Reveal } from "@/components/ui/Reveal";
import { Prelude } from "./scenes/Prelude";
import { Story } from "./scenes/Story";
import { Names } from "./scenes/Names";
import { DateScene } from "./scenes/DateScene";
import { Ceremony, Reception } from "./scenes/Venues";
import { Gift } from "./scenes/Gift";
import { RsvpScene } from "./scenes/RsvpScene";
import { Closing } from "./scenes/Closing";
import { Divider } from "@/components/art/Icons";
import { useBackgroundMusic } from "@/hooks/useBackgroundMusic";
import { wedding } from "@/lib/config/wedding";
import type { PublicGuest } from "@/lib/guests/types";

/** Saludo nominal: solo existe cuando la invitación es de alguien concreto. */
function Greeting({ name, cupo }: { name: string; cupo: number }) {
  return (
    <Scene tall={false} className="pb-4 pt-28">
      <Reveal>
        <Eyebrow>Con toda nuestra alegría, invitamos a</Eyebrow>
      </Reveal>
      <Reveal delay={0.15}>
        <p className="mt-5 font-script text-4xl leading-tight text-ink text-balance sm:text-5xl">
          {name}
        </p>
      </Reveal>
      <Reveal delay={0.3}>
        <Divider className="mt-6 w-36 text-gold" />
      </Reveal>
      {cupo > 1 && (
        <Reveal delay={0.4}>
          <p className="mt-4 font-sans text-[0.6rem] tracking-[0.3em] text-ink-faint uppercase">
            {cupo} lugares reservados
          </p>
        </Reveal>
      )}
    </Scene>
  );
}

/**
 * Orquestador de la experiencia pública.
 *
 * El relato ya está montado detrás del preludio, pero permanece inerte y sin
 * scroll hasta que la persona abre el sobre. Así la primera pantalla nunca
 * compite con el resto de la página, y el navegador puede ir preparando todo
 * lo que viene mientras tanto.
 */
export function Invitation({ guest }: { guest: PublicGuest | null }) {
  // `opened` libera el scroll; `preludeGone` desmonta el velo una vez que ha
  // terminado de disolverse. Separarlos evita que la historia aparezca de
  // golpe justo cuando el sobre todavía se está abriendo.
  const [opened, setOpened] = useState(false);
  const [preludeGone, setPreludeGone] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const { playing, start: startMusic, toggle: toggleMusic } = useBackgroundMusic();

  const handleOpen = () => {
    setOpened(true);
    window.setTimeout(() => setPreludeGone(true), 1100);
  };

  useEffect(() => {
    if (opened) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);
    return () => {
      document.body.style.overflow = "";
    };
  }, [opened]);

  return (
    <>
      <Atmosphere />
      <Ambient />
      {opened && (
        <>
          <ScrollProgress />
          <ScrollHint />
        </>
      )}
      <MusicToggle visible={opened} playing={playing} onToggle={toggleMusic} />

      <main ref={mainRef} inert={!opened} className="relative">
        {/* Único h1 de la página: la experiencia es visual, pero un lector de
            pantalla y un buscador necesitan saber de qué trata en una línea. */}
        <h1 className="sr-only">
          {wedding.couple.first} y {wedding.couple.second} se casan el{" "}
          {wedding.date.day} de {wedding.date.month} de {wedding.date.year} en{" "}
          {wedding.ceremony.place}, {wedding.city}
        </h1>
        <LightThread target={mainRef} />
        {guest && <Greeting name={guest.nombre} cupo={guest.cupo} />}
        <Story />
        <Names />
        <DateScene />
        <Ceremony />
        <Reception />
        <Gift />
        <RsvpScene guest={guest} />
        <Closing />
      </main>

      {!preludeGone && (
        <Prelude
          guestName={guest?.nombre ?? null}
          onBegin={startMusic}
          onOpen={handleOpen}
        />
      )}
    </>
  );
}
