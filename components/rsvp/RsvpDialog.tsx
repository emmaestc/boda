"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ActionButton } from "@/components/ui/Button";
import { Divider, Heart } from "@/components/art/Icons";
import { Monogram } from "@/components/art/Monogram";
import { EASE_SILK } from "@/lib/motion";
import { DIET, DIET_LABEL, type Diet, type PublicGuest } from "@/lib/guests/types";
import { submitRsvp } from "@/app/actions/rsvp";
import { cn } from "@/lib/utils";

type Answer = {
  attending: boolean | null;
  count: number;
  /** Un nombre por asistente, en el mismo orden en que se muestran. */
  nombres: string[];
  diet: Diet;
  dietDetail: string;
  message: string;
};

type Step = "asistencia" | "cuantos" | "acompanantes" | "dieta" | "mensaje";

/**
 * Ajusta la lista de nombres al número de asistentes elegido, conservando lo
 * ya escrito. La primera casilla llega con el nombre de la invitación puesto:
 * casi siempre es correcto y ahorra escribirlo.
 */
function ajustarNombres(actuales: string[], total: number, primero: string): string[] {
  const siguientes = actuales.slice(0, total);
  while (siguientes.length < total) {
    siguientes.push(siguientes.length === 0 ? primero : "");
  }
  return siguientes;
}

/** Pequeño estallido de corazones al confirmar. Dura poco y no se repite. */
function Burst() {
  const reduced = useReducedMotion();
  if (reduced) return null;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 14 }, (_, i) => {
        const angle = (i / 14) * Math.PI * 2;
        const distance = 120 + (i % 4) * 46;
        return (
          <motion.span
            key={i}
            className="absolute left-1/2 top-1/2 text-gold"
            initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
            animate={{
              x: Math.cos(angle) * distance,
              y: Math.sin(angle) * distance - 40,
              scale: [0, 1, 0.85],
              opacity: [0, 1, 0],
            }}
            transition={{ duration: 1.8 + (i % 3) * 0.35, ease: "easeOut", delay: i * 0.035 }}
          >
            <Heart className="h-4 w-4" />
          </motion.span>
        );
      })}
    </div>
  );
}

function StepShell({
  step,
  title,
  hint,
  children,
}: {
  step: string;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      key={step}
      className="flex w-full flex-col items-center gap-6"
      initial={{ opacity: 0, x: 42, filter: "blur(6px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
      exit={{ opacity: 0, x: -42, filter: "blur(6px)", position: "absolute" }}
      transition={{ duration: 0.6, ease: EASE_SILK }}
    >
      <div className="flex flex-col items-center gap-2">
        <h3 className="font-serif text-2xl leading-snug font-light text-ink text-balance sm:text-3xl">
          {title}
        </h3>
        {hint && <p className="max-w-xs font-sans text-[0.95rem] text-ink-faint">{hint}</p>}
      </div>
      {children}
    </motion.div>
  );
}

/** Botón de opción grande, cómodo para el pulgar. */
function Choice({
  active,
  onClick,
  children,
  className,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className={cn(
        "min-h-14 w-full rounded-2xl border px-5 py-4 text-left font-sans text-base transition-colors",
        active
          ? "border-gold bg-gold-light/35 text-ink shadow-[0_10px_30px_-20px_rgba(198,168,103,0.9)]"
          : "border-powder/70 bg-white/70 text-ink-soft hover:border-gold/60 hover:bg-white",
        className,
      )}
    >
      {children}
    </motion.button>
  );
}

export function RsvpDialog({
  guest,
  open,
  onClose,
}: {
  guest: PublicGuest;
  open: boolean;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [answer, setAnswer] = useState<Answer>({
    attending: guest.estado === "pendiente" ? null : guest.estado === "confirmado",
    count: guest.asistentes || Math.min(1, guest.cupo),
    nombres: guest.nombres.length ? guest.nombres : [guest.nombre],
    diet: guest.restriccion,
    dietDetail: guest.restriccionDetalle ?? "",
    message: guest.comentario ?? "",
  });
  const [step, setStep] = useState(0);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // Bloqueo de scroll y cierre con Escape mientras el diálogo está abierto.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const stepsForYes: Step[] = ["asistencia", "cuantos", "acompanantes", "dieta", "mensaje"];
  const stepsForNo: Step[] = ["asistencia", "mensaje"];
  const steps = answer.attending === false ? stepsForNo : stepsForYes;

  const asistentes = guest.cupo <= 1 ? 1 : answer.count;
  const visibleSteps = steps.filter((s) => {
    // Con un solo cupo no tiene sentido preguntar cuántos vendrán.
    if (s === "cuantos") return guest.cupo > 1;
    // Ni pedir nombres si viene una sola persona: ya sabemos quién es.
    if (s === "acompanantes") return asistentes > 1;
    return true;
  });
  const current = visibleSteps[Math.min(step, visibleSteps.length - 1)];

  /** Cambia el número de asistentes y reajusta las casillas de nombres. */
  const setCount = (valor: number) =>
    setAnswer((a) => {
      const total = Math.min(Math.max(valor, 1), guest.cupo);
      return { ...a, count: total, nombres: ajustarNombres(a.nombres, total, guest.nombre) };
    });

  const next = () => setStep((s) => Math.min(s + 1, visibleSteps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  async function send() {
    setPending(true);
    setError(null);
    const result = await submitRsvp({
      codigo: guest.codigo,
      asiste: answer.attending === true,
      cantidad: answer.attending === true ? asistentes : 0,
      nombres:
        answer.attending === true && asistentes > 1
          ? answer.nombres.slice(0, asistentes).map((n) => n.trim())
          : [],
      restriccion: answer.attending === true ? answer.diet : "ninguna",
      restriccion_detalle: answer.diet === "otra" ? answer.dietDetail : null,
      comentario: answer.message.trim() || null,
    });
    setPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setDone(true);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <button
            type="button"
            aria-label="Cerrar"
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-ink/35 backdrop-blur-sm"
          />

          <motion.div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label="Confirmación de asistencia"
            className="glass-card relative max-h-[92svh] w-full max-w-lg overflow-y-auto rounded-t-[2rem] bg-porcelain/95 px-6 pb-10 pt-8 outline-none sm:rounded-[2rem] sm:px-10"
            initial={{ y: 60, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.6, ease: EASE_SILK }}
          >
            <div className="mx-auto mb-6 h-1 w-12 rounded-full bg-powder sm:hidden" />

            {done ? (
              <div className="relative flex flex-col items-center gap-5 py-6 text-center">
                <Burst />
                <Monogram size={72} />
                <h3 className="font-script text-4xl text-gold-deep">
                  {answer.attending ? "¡Qué felicidad!" : "Te vamos a extrañar"}
                </h3>
                <Divider className="w-36 text-gold" />
                <p className="max-w-sm font-serif text-lg leading-relaxed font-light text-ink-soft italic">
                  {answer.attending
                    ? "Gracias por confirmar, " +
                      guest.nombre.split(" ")[0] +
                      ". Guardamos un lugar para ti y no vemos la hora de celebrar juntos."
                    : "Gracias por avisarnos con cariño. Vas a estar en nuestros pensamientos y en nuestras oraciones ese día."}
                </p>
                <ActionButton variant="outline" onClick={onClose} className="mt-2">
                  Volver a la invitación
                </ActionButton>
              </div>
            ) : (
              <>
                <div className="mb-7 flex flex-col items-center gap-2 text-center">
                  <p className="font-sans text-[0.88rem] tracking-[0.38em] text-ink-faint uppercase">
                    Confirmación
                  </p>
                  <p className="font-script text-2xl text-ink">{guest.nombre}</p>
                </div>

                <div className="relative flex min-h-[19rem] w-full items-start">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {current === "asistencia" && (
                      <StepShell step="asistencia" title="¿Nos acompañas en este día?">
                        <div className="flex w-full flex-col gap-3">
                          <Choice
                            active={answer.attending === true}
                            onClick={() => {
                              setAnswer((a) => ({ ...a, attending: true }));
                              setStep(1);
                            }}
                          >
                            <span className="flex items-center gap-3">
                              <span className="text-lg">❤️</span>
                              <span className="font-medium tracking-wide">Sí, allí estaré</span>
                            </span>
                          </Choice>
                          <Choice
                            active={answer.attending === false}
                            onClick={() => {
                              setAnswer((a) => ({ ...a, attending: false }));
                              setStep(1);
                            }}
                          >
                            <span className="flex items-center gap-3">
                              <span className="text-lg">😢</span>
                              <span className="font-medium tracking-wide">
                                No podré acompañarlos
                              </span>
                            </span>
                          </Choice>
                        </div>
                        {guest.cupo > 1 && (
                          <p className="font-sans text-[0.95rem] text-ink-faint">
                            Tienes {guest.cupo} lugares reservados.
                          </p>
                        )}
                      </StepShell>
                    )}

                    {current === "cuantos" && (
                      <StepShell
                        step="cuantos"
                        title="¿Cuántos vendrán?"
                        hint={"Tu invitación incluye hasta " + guest.cupo + " personas."}
                      >
                        <div className="flex items-center gap-6">
                          <button
                            type="button"
                            aria-label="Quitar una persona"
                            onClick={() => setCount(answer.count - 1)}
                            className="grid h-12 w-12 place-items-center rounded-full border border-powder text-xl text-ink-soft transition-colors hover:border-gold hover:text-ink"
                          >
                            −
                          </button>
                          <div className="relative h-16 w-16 overflow-hidden">
                            <AnimatePresence mode="popLayout" initial={false}>
                              <motion.span
                                key={answer.count}
                                className="absolute inset-0 grid place-items-center font-serif text-5xl font-light text-ink"
                                initial={{ y: 24, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -24, opacity: 0 }}
                                transition={{ duration: 0.35, ease: EASE_SILK }}
                              >
                                {answer.count}
                              </motion.span>
                            </AnimatePresence>
                          </div>
                          <button
                            type="button"
                            aria-label="Agregar una persona"
                            onClick={() => setCount(answer.count + 1)}
                            className="grid h-12 w-12 place-items-center rounded-full border border-powder text-xl text-ink-soft transition-colors hover:border-gold hover:text-ink"
                          >
                            +
                          </button>
                        </div>
                        <ActionButton onClick={next}>Continuar</ActionButton>
                      </StepShell>
                    )}

                    {current === "acompanantes" && (
                      <StepShell
                        step="acompanantes"
                        title="¿Quiénes vienen?"
                        hint="Nos ayuda a preparar las mesas y la tarjeta de cada puesto."
                      >
                        <div className="flex w-full flex-col gap-2.5">
                          {Array.from({ length: asistentes }, (_, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <span
                                aria-hidden
                                className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-powder font-serif text-base text-ink-faint"
                              >
                                {i + 1}
                              </span>
                              <input
                                type="text"
                                maxLength={120}
                                autoComplete="off"
                                value={answer.nombres[i] ?? ""}
                                aria-label={"Nombre de la persona " + (i + 1)}
                                placeholder={i === 0 ? "Nombre y apellido" : "Acompañante"}
                                onChange={(e) => {
                                  const valor = e.target.value;
                                  setAnswer((a) => {
                                    const nombres = ajustarNombres(
                                      a.nombres,
                                      asistentes,
                                      guest.nombre,
                                    );
                                    nombres[i] = valor;
                                    return { ...a, nombres };
                                  });
                                }}
                                className="min-h-11 w-full rounded-xl border border-powder bg-white/80 px-4 font-sans text-base text-ink outline-none placeholder:text-ink-faint focus:border-gold"
                              />
                            </div>
                          ))}
                        </div>
                        <ActionButton onClick={next}>Continuar</ActionButton>
                      </StepShell>
                    )}

                    {current === "dieta" && (
                      <StepShell
                        step="dieta"
                        title="¿Tienes alguna restricción alimentaria?"
                        hint="Así podemos cuidar cada detalle de la cena."
                      >
                        <div className="grid w-full grid-cols-2 gap-3">
                          {DIET.map((d) => (
                            <Choice
                              key={d}
                              active={answer.diet === d}
                              onClick={() => setAnswer((a) => ({ ...a, diet: d }))}
                              className="text-center"
                            >
                              {DIET_LABEL[d]}
                            </Choice>
                          ))}
                        </div>
                        <AnimatePresence>
                          {answer.diet === "otra" && (
                            <motion.input
                              key="detail"
                              type="text"
                              maxLength={120}
                              value={answer.dietDetail}
                              onChange={(e) =>
                                setAnswer((a) => ({ ...a, dietDetail: e.target.value }))
                              }
                              placeholder="Cuéntanos cuál"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="w-full rounded-xl border border-powder bg-white/80 px-4 py-3 font-sans text-base text-ink outline-none placeholder:text-ink-faint focus:border-gold"
                            />
                          )}
                        </AnimatePresence>
                        <ActionButton onClick={next}>Continuar</ActionButton>
                      </StepShell>
                    )}

                    {current === "mensaje" && (
                      <StepShell
                        step="mensaje"
                        title={
                          answer.attending
                            ? "¿Quieres dejarnos un mensaje?"
                            : "¿Quieres dejarnos unas palabras?"
                        }
                        hint="Opcional, pero lo vamos a leer todo."
                      >
                        <textarea
                          rows={4}
                          maxLength={500}
                          value={answer.message}
                          onChange={(e) => setAnswer((a) => ({ ...a, message: e.target.value }))}
                          placeholder="Escribe aquí…"
                          className="w-full resize-none rounded-2xl border border-powder bg-white/80 px-4 py-3 font-sans text-base leading-relaxed text-ink outline-none placeholder:text-ink-faint focus:border-gold"
                        />
                        {error && (
                          <p role="alert" className="font-sans text-[0.95rem] text-[#b4483f]">
                            {error}
                          </p>
                        )}
                        <ActionButton onClick={send} disabled={pending}>
                          {pending ? "Enviando…" : "Enviar confirmación"}
                        </ActionButton>
                      </StepShell>
                    )}
                  </AnimatePresence>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={step === 0 ? onClose : back}
                    className="font-sans text-[0.86rem] tracking-[0.26em] text-ink-faint uppercase transition-colors hover:text-ink"
                  >
                    {step === 0 ? "Cerrar" : "Atrás"}
                  </button>
                  <div className="flex gap-1.5" aria-hidden>
                    {visibleSteps.map((s, i) => (
                      <span
                        key={s}
                        className={cn(
                          "h-1.5 rounded-full transition-all duration-500",
                          i === step ? "w-5 bg-gold" : "w-1.5 bg-powder",
                        )}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
