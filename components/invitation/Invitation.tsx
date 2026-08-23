"use client";

import { useEffect, useRef, useState } from "react";
import { Atmosphere } from "./Atmosphere";
import { Ambient, PetalBurst } from "./Ambient";
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
          <p className="mt-4 font-sans text-[0.85rem] tracking-[0.3em] text-ink-faint uppercase">
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
  const [celebrando, setCelebrando] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const { playing, start: startMusic, toggle: toggleMusic } = useBackgroundMusic();

  const handleOpen = () => {
    setOpened(true);
    setCelebrando(true);
    window.setTimeout(() => setPreludeGone(true), 1100);
    // La lluvia de celebración dura lo que dura la alegría del momento.
    window.setTimeout(() => setCelebrando(false), 9000);
  };

  // El navegador recuerda dónde estaba el scroll al recargar. En una historia
  // que empieza con un sobre cerrado, eso significa aparecer a mitad del
  // relato: se desactiva.
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    const body = document.body;

    if (!opened) {
      /*
       * Bloqueo con `position: fixed` en lugar de `overflow: hidden`.
       * En Safari de iOS el `overflow` del body no impide de verdad el
       * desplazamiento, y de ahí venía que al abrir el sobre la historia
       * apareciera empezada. Fijar el cuerpo sí lo impide, y además —a
       * diferencia de bloquear el gesto táctil— deja intacto el pellizco
       * para acercar.
       */
      body.style.position = "fixed";
      body.style.top = "0";
      body.style.left = "0";
      body.style.right = "0";
      body.style.width = "100%";
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }

    body.style.position = "";
    body.style.top = "";
    body.style.left = "";
    body.style.right = "";
    body.style.width = "";

    /*
     * Y al soltarlo, arriba del todo. Se insiste tres veces a propósito: al
     * instante, tras el reflujo del navegador y una vez que el velo termina
     * de desaparecer, porque cada uno de esos momentos puede recolocar el
     * scroll por su cuenta.
     */
    const alInicio = () => window.scrollTo({ top: 0, behavior: "instant" });
    alInicio();
    const t1 = window.setTimeout(alInicio, 0);
    const t2 = window.setTimeout(alInicio, 180);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
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
      {celebrando && <PetalBurst />}
      <MusicToggle visible={opened} playing={playing} onToggle={toggleMusic} />

      <main ref={mainRef} inert={!opened} className="clip-x relative">
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
