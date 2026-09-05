/** Estados posibles de una invitación. Coinciden con el enum de PostgreSQL. */
export const CONFIRMATION_STATUS = ["pendiente", "confirmado", "no_asiste"] as const;
export type ConfirmationStatus = (typeof CONFIRMATION_STATUS)[number];

/** Restricciones alimentarias ofrecidas en el formulario. */
export const DIET = ["ninguna", "vegetariano", "vegano", "otra"] as const;
export type Diet = (typeof DIET)[number];

export const STATUS_LABEL: Record<ConfirmationStatus, string> = {
  pendiente: "Pendiente",
  confirmado: "Confirmado",
  no_asiste: "No asiste",
};

export const DIET_LABEL: Record<Diet, string> = {
  ninguna: "Ninguna",
  vegetariano: "Vegetariano",
  vegano: "Vegano",
  otra: "Otra",
};

/**
 * La proyección que sí puede viajar al navegador.
 *
 * Deliberadamente NO incluye el `id` de la fila ni ningún dato de otras
 * invitaciones: el código de la URL solo puede describirse a sí mismo.
 */
export type PublicGuest = {
  nombre: string;
  codigo: string;
  cupo: number;
  /**
   * La invitación ya nombra a todo el grupo, así que no se pregunta cuántos
   * vienen ni se piden nombres: al confirmar cuentan los lugares reservados.
   */
  cupoFijo: boolean;
  estado: ConfirmationStatus;
  asistentes: number;
  /** Quiénes vienen, cuando la invitación cubre a más de una persona. */
  nombres: string[];
  restriccion: Diet;
  restriccionDetalle: string | null;
  comentario: string | null;
};

/** La fila completa, solo para el servidor y la consola. */
export type Guest = {
  id: string;
  nombre: string;
  codigo_invitacion: string;
  grupo: string | null;
  cantidad_personas_permitidas: number;
  cupo_fijo: boolean;
  estado_confirmacion: ConfirmationStatus;
  cantidad_asistentes: number;
  nombres_asistentes: string[];
  restriccion_alimentaria: Diet;
  restriccion_detalle: string | null;
  comentario: string | null;
  fecha_confirmacion: string | null;
  primera_apertura_at: string | null;
  aperturas: number;
  created_at: string;
  updated_at: string;
};

export type GuestStats = {
  total: number;
  confirmados: number;
  no_asisten: number;
  pendientes: number;
  personas_confirmadas: number;
  cupos_totales: number;
  abiertas_sin_responder: number;
};
