/**
 * Fuente única de verdad de la boda.
 *
 * Todo el texto, las fechas y las ubicaciones que se ven en la invitación salen
 * de aquí. Para cambiar cualquier cosa de la experiencia pública no hace falta
 * tocar un solo componente: se edita este archivo.
 */

const bride = "Johana";
const groom = "Emmanuel";

export const wedding = {
  couple: {
    bride,
    groom,
    /**
     * El orden en que se nombran en TODA la invitación: primero la novia.
     * Toda la experiencia lee `first` y `second`, así que para invertirlo
     * basta con cambiar estas dos líneas y las iniciales de abajo.
     */
    first: bride,
    second: groom,
    initials: { first: "J", second: "E" },
  },

  /**
   * 6 de noviembre de 2026, 6:00 PM, hora de Colombia (UTC-5).
   * El offset es explícito para que la cuenta regresiva sea correcta
   * sin importar la zona horaria del dispositivo del invitado.
   */
  date: {
    iso: "2026-11-06T18:00:00-05:00",
    day: "06",
    month: "Noviembre",
    year: "2026",
    weekday: "Viernes",
    time: "6:00 PM",
  },

  ceremony: {
    title: "Ceremonia",
    place: "Parroquia La Inmaculada",
    neighborhood: "La Floresta",
    address: "Carrera 86 #46-37",
    time: "6:00 PM",
    /**
     * Consulta que se envía a Google Maps. Si más adelante quieres apuntar a un
     * punto exacto, reemplaza `mapsUrl` por el enlace corto que te da Google
     * Maps (Compartir → Copiar vínculo) y todo lo demás sigue funcionando.
     */
    mapsQuery:
      "Parroquia La Inmaculada La Floresta, Carrera 86 #46-37, Medellín, Antioquia, Colombia",
    mapsUrl: null as string | null,
  },

  reception: {
    title: "Recepción",
    place: "Los Almendros",
    address: "Calle 33 #74E-129",
    mapsQuery: "Calle 33 #74E-129, Los Almendros, Medellín, Antioquia, Colombia",
    mapsUrl: null as string | null,
  },

  city: "Medellín, Antioquia",

  /** Textos narrativos de la experiencia. */
  copy: {
    envelope: {
      eyebrow: "Nuestra historia está por comenzar",
      hint: "Toca para abrir",
      cta: "Abrir invitación",
    },
    story:
      "La historia comienza cuando dos personas que ni soñaban conocerse terminan encontrándose en el instante menos esperado, pero en el momento indicado.",
    blessing: "Con la bendición de Dios y de nuestras familias",
    verse: {
      text: "Así que ya no son dos, sino uno solo.",
      reference: "Mateo 19:6",
    },
    dressCode: {
      eyebrow: "Para acompañarnos",
      title: "Código de vestimenta",
      level: "Formal",
      /** La regla que de verdad hay que comunicar, dicha con cariño. */
      note: "Se reserva el color blanco para la novia.",
      warm: "Unos zapatos con los que te sientas bien para bailar.",
    },
    gift: {
      intro:
        "Tu presencia es el mejor regalo que nos puedes dar en este día. Pero si quieres tener un detalle con nosotros y contribuir al comienzo de nuestra historia, será bienvenido.",
      title: "Lluvia de sobres",
      note: "Habrá un lugar dispuesto para ello durante la recepción.",
    },
    rsvp: {
      title: "¡Te esperamos!",
      subtitle: "Confirma tu asistencia",
      cta: "Confirmar asistencia",
      deadlineNote: "Agradecemos tu respuesta antes del 6 de octubre de 2026.",
    },
    closing: "Gracias por ser parte de nuestra historia.",
  },

  /**
   * Música de fondo. Empieza a sonar en el momento en que se abre el sobre
   * —ese toque es el gesto de usuario que los navegadores exigen— y entra con
   * un fundido suave. Siempre se puede silenciar con el control de abajo.
   *
   * Para cambiarla: deja tu archivo en `public/music/` y pon aquí su ruta.
   * Con `src` en `null` el control desaparece y no suena nada.
   */
  music: {
    src: "/music/perfect-violin.mp3",
    title: "Perfect",
    artist: "Ed Sheeran · versión para violín",
    /** Volumen final del fundido de entrada, de 0 a 1. */
    volume: 0.3,
  },

  seo: {
    title: bride + " & " + groom + " — Nuestra historia",
    description:
      "Dos caminos que se encontraron en el momento indicado. Acompáñanos el 6 de noviembre de 2026 a celebrar nuestro matrimonio.",
    url: "https://johanayemmanuel.vercel.app",
  },
} as const;

export type Wedding = typeof wedding;
