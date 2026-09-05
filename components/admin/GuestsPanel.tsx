"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { GuestDialog, type GuestDraftForm } from "./GuestDialog";
import {
  actualizarInvitado,
  cambiarEstado,
  crearInvitado,
  eliminarInvitado,
  regenerarCodigo,
  type ActionResult,
} from "@/app/consola/actions";
import {
  CONFIRMATION_STATUS,
  DIET_LABEL,
  STATUS_LABEL,
  type ConfirmationStatus,
  type Guest,
} from "@/lib/guests/types";
import { formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Filter = "todos" | ConfirmationStatus;

const FILTERS: Array<{ key: Filter; label: string }> = [
  { key: "todos", label: "Todos" },
  { key: "confirmado", label: "Confirmados" },
  { key: "pendiente", label: "Pendientes" },
  { key: "no_asiste", label: "No asisten" },
];

const STATUS_STYLE: Record<ConfirmationStatus, string> = {
  confirmado: "bg-[#eaf1e8] text-[#5c7f59] border-[#cddfc9]",
  pendiente: "bg-[#faf3e2] text-[#8d7331] border-[#ecdcb6]",
  no_asiste: "bg-[#f7ecec] text-[#94595a] border-[#e8d2d2]",
};

function StatusBadge({ estado }: { estado: ConfirmationStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 font-sans text-[0.75rem] tracking-[0.14em] uppercase",
        STATUS_STYLE[estado],
      )}
    >
      {STATUS_LABEL[estado]}
    </span>
  );
}

function ActionLink({
  children,
  onClick,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "font-sans text-[0.78rem] tracking-[0.16em] uppercase underline-offset-4 transition-colors hover:underline",
        danger ? "text-[#b4483f]" : "text-ink-faint hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}

export function GuestsPanel({ guests, baseUrl }: { guests: Guest[]; baseUrl: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [filter, setFilter] = useState<Filter>("todos");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Guest | null>(null);
  const [error, setError] = useState<string | null>(null);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return guests.filter((g) => {
      const matchesFilter = filter === "todos" || g.estado_confirmacion === filter;
      const matchesQuery =
        !needle ||
        g.nombre.toLowerCase().includes(needle) ||
        (g.grupo ?? "").toLowerCase().includes(needle) ||
        g.codigo_invitacion.toLowerCase().includes(needle) ||
        g.nombres_asistentes.some((n) => n.toLowerCase().includes(needle));
      return matchesFilter && matchesQuery;
    });
  }, [guests, filter, query]);

  const linkFor = (guest: Guest) => baseUrl + "/i/" + guest.codigo_invitacion;

  function run(action: () => Promise<ActionResult>) {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setDialogOpen(false);
      setConfirmDelete(null);
      router.refresh();
    });
  }

  async function copyLink(guest: Guest) {
    const link = linkFor(guest);
    try {
      await navigator.clipboard.writeText(link);
      setCopied(guest.id);
      window.setTimeout(() => setCopied(null), 1800);
    } catch {
      window.prompt("Copia el enlace:", link);
    }
  }

  /**
   * Abre WhatsApp con el mensaje ya escrito y deja elegir el contacto ahí
   * mismo. Sin número: no lo guardamos, y el selector de contactos de
   * WhatsApp es más cómodo que teclearlo.
   */
  function whatsappLink(guest: Guest): string {
    const text =
      "Hola " +
      guest.nombre.split(" ")[0] +
      ", con mucha alegría te compartimos nuestra invitación de matrimonio: " +
      linkFor(guest);
    return "https://wa.me/?text=" + encodeURIComponent(text);
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Barra de herramientas */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={cn(
                "min-h-9 rounded-full border px-4 font-sans text-[0.78rem] tracking-[0.18em] uppercase transition-colors",
                filter === f.key
                  ? "border-ink bg-ink text-porcelain"
                  : "border-powder bg-white/70 text-ink-soft hover:border-gold",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre, acompañante, grupo o código"
            className="min-h-9 w-full min-w-56 flex-1 rounded-full border border-powder bg-white/80 px-4 font-sans text-xs text-ink outline-none focus:border-gold sm:w-auto"
          />
          <a
            href="/consola/export"
            className="min-h-9 rounded-full border border-powder bg-white/70 px-4 py-2 font-sans text-[0.78rem] tracking-[0.18em] text-ink-soft uppercase transition-colors hover:border-gold"
          >
            Exportar
          </a>
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setError(null);
              setDialogOpen(true);
            }}
            className="min-h-9 rounded-full bg-gold-deep px-4 font-sans text-[0.78rem] tracking-[0.18em] text-white uppercase transition-colors hover:bg-[#856a35]"
          >
            Nuevo invitado
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="font-sans text-xs text-[#b4483f]">
          {error}
        </p>
      )}

      {/* Encabezado de columnas, solo en pantallas anchas */}
      <div className="hidden grid-cols-[minmax(0,2.2fr)_auto_auto_minmax(0,1.4fr)_minmax(0,1.2fr)] gap-4 px-5 pb-1 lg:grid">
        {["Invitado", "Estado", "Asisten", "Restricción", "Respondió"].map((h) => (
          <span
            key={h}
            className="font-sans text-[0.88rem] tracking-[0.24em] text-ink-faint uppercase"
          >
            {h}
          </span>
        ))}
      </div>

      <ul className="flex flex-col gap-2.5">
        {visible.length === 0 && (
          <li className="glass-card rounded-2xl px-6 py-10 text-center font-sans text-sm text-ink-faint">
            {guests.length === 0
              ? "Todavía no hay invitados. Crea el primero para generar su enlace."
              : "Ningún invitado coincide con la búsqueda."}
          </li>
        )}

        {visible.map((guest) => {
          const isOpen = expanded === guest.id;
          return (
            <li key={guest.id} className="glass-card overflow-hidden rounded-2xl">
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : guest.id)}
                aria-expanded={isOpen}
                className="grid w-full grid-cols-1 gap-2 px-5 py-4 text-left lg:grid-cols-[minmax(0,2.2fr)_auto_auto_minmax(0,1.4fr)_minmax(0,1.2fr)] lg:items-center lg:gap-4"
              >
                <span className="flex flex-col gap-0.5">
                  <span className="font-serif text-lg leading-tight font-light text-ink">
                    {guest.nombre}
                  </span>
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-1 font-sans text-[0.8rem] tracking-[0.1em] text-ink-faint">
                    <span>
                      {guest.grupo ? guest.grupo + " · " : ""}
                      {guest.codigo_invitacion}
                    </span>
                    {/* Sin ella no habría forma de ver, desde la lista, por qué
                        a este invitado no se le pidieron nombres. */}
                    {guest.cupo_fijo && (
                      <span className="rounded-full border border-gold/40 bg-gold-light/25 px-2 py-0.5 text-[0.7rem] tracking-[0.14em] text-gold-text uppercase">
                        Cupo fijo
                      </span>
                    )}
                  </span>
                </span>

                <span className="flex items-center gap-3 lg:contents">
                  <StatusBadge estado={guest.estado_confirmacion} />
                  <span className="font-sans text-sm tabular-nums text-ink-soft">
                    {guest.cantidad_asistentes}
                    <span className="text-ink-faint">/{guest.cantidad_personas_permitidas}</span>
                  </span>
                </span>

                <span className="font-sans text-xs text-ink-soft">
                  {guest.restriccion_alimentaria === "ninguna"
                    ? "—"
                    : DIET_LABEL[guest.restriccion_alimentaria] +
                      (guest.restriccion_detalle ? ": " + guest.restriccion_detalle : "")}
                </span>

                <span className="font-sans text-xs text-ink-faint">
                  {formatDateTime(guest.fecha_confirmacion)}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="overflow-hidden border-t border-powder/50"
                  >
                    <div className="flex flex-col gap-4 px-5 py-4">
                      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <div className="col-span-2">
                          <dt className="font-sans text-[0.86rem] tracking-[0.2em] text-ink-faint uppercase">
                            Quiénes vienen
                          </dt>
                          <dd className="font-sans text-xs text-ink-soft">
                            {guest.nombres_asistentes.length > 0
                              ? guest.nombres_asistentes.join(" · ")
                              : "—"}
                          </dd>
                        </div>
                        <div>
                          <dt className="font-sans text-[0.86rem] tracking-[0.2em] text-ink-faint uppercase">
                            Aperturas
                          </dt>
                          <dd className="font-sans text-xs text-ink-soft">
                            {guest.aperturas}
                            {guest.primera_apertura_at
                              ? " · " + formatDateTime(guest.primera_apertura_at)
                              : ""}
                          </dd>
                        </div>
                        <div className="col-span-2">
                          <dt className="font-sans text-[0.86rem] tracking-[0.2em] text-ink-faint uppercase">
                            Mensaje
                          </dt>
                          <dd className="font-sans text-xs leading-relaxed text-ink-soft">
                            {guest.comentario || "—"}
                          </dd>
                        </div>
                      </dl>

                      <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5">
                        <ActionLink onClick={() => copyLink(guest)}>
                          {copied === guest.id ? "¡Copiado!" : "Copiar enlace"}
                        </ActionLink>

                        <a
                          href={whatsappLink(guest)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-sans text-[0.78rem] tracking-[0.16em] text-ink-faint uppercase underline-offset-4 hover:text-ink hover:underline"
                        >
                          Enviar por WhatsApp
                        </a>

                        <a
                          href={linkFor(guest)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-sans text-[0.78rem] tracking-[0.16em] text-ink-faint uppercase underline-offset-4 hover:text-ink hover:underline"
                        >
                          Abrir invitación
                        </a>

                        <ActionLink
                          onClick={() => {
                            setEditing(guest);
                            setError(null);
                            setDialogOpen(true);
                          }}
                        >
                          Editar
                        </ActionLink>

                        <ActionLink onClick={() => run(() => regenerarCodigo(guest.id))}>
                          Nuevo código
                        </ActionLink>

                        {confirmDelete === guest.id ? (
                          <span className="flex items-center gap-3">
                            <ActionLink danger onClick={() => run(() => eliminarInvitado(guest.id))}>
                              Confirmar borrado
                            </ActionLink>
                            <ActionLink onClick={() => setConfirmDelete(null)}>Cancelar</ActionLink>
                          </span>
                        ) : (
                          <ActionLink danger onClick={() => setConfirmDelete(guest.id)}>
                            Eliminar
                          </ActionLink>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 border-t border-powder/50 pt-3">
                        <span className="font-sans text-[0.86rem] tracking-[0.2em] text-ink-faint uppercase">
                          Marcar como
                        </span>
                        {CONFIRMATION_STATUS.map((estado) => (
                          <button
                            key={estado}
                            type="button"
                            disabled={pending || guest.estado_confirmacion === estado}
                            onClick={() =>
                              run(() =>
                                cambiarEstado(guest.id, {
                                  estado,
                                  cantidad:
                                    estado === "confirmado"
                                      ? Math.max(1, guest.cantidad_asistentes)
                                      : 0,
                                }),
                              )
                            }
                            className="rounded-full border border-powder px-3 py-1 font-sans text-[0.88rem] tracking-[0.14em] text-ink-soft uppercase transition-colors hover:border-gold disabled:opacity-35"
                          >
                            {STATUS_LABEL[estado]}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>

      <GuestDialog
        open={dialogOpen}
        guest={editing}
        pending={pending}
        error={error}
        onClose={() => setDialogOpen(false)}
        onSubmit={(draft: GuestDraftForm) =>
          run(() =>
            editing ? actualizarInvitado(editing.id, draft) : crearInvitado(draft),
          )
        }
      />
    </div>
  );
}
