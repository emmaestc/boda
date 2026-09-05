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
      deadlineNote: "Agradecemos tu respuesta antes del 10 de octubre de 2026.",
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
    src: "/music/eres-mi-sueno.mp3",
    title: "Eres mi sueño",
    artist: "Fonseca",
    /**
     * Volumen final del fundido de entrada, de 0 a 1.
     *
     * Este número va atado a la canción concreta, no es un ajuste general:
     * cada máster viene grabado a una sonoridad distinta. Medido sobre el
     * archivo, este tema tiene un RMS de -12,8 dBFS, unos 5,6 dB por encima
     * de la versión para violín que había antes, y además roza el clipping
     * (pico +0,8 dBFS). Con el 0,3 de entonces sonaría bastante más fuerte,
     * no igual. En 0,11 queda unos 3 dB por debajo de aquel nivel, que es
     * donde la música acompaña la lectura en vez de taparla.
     *
     * Si algún día cambias la canción, vuelve a mirar este valor.
     */
    volume: 0.11,
  },

  seo: {
    title: bride + " & " + groom + " — Nuestra historia",
    description:
      "Dos caminos que se encontraron en el momento indicado. Acompáñanos el 6 de noviembre de 2026 a celebrar nuestro matrimonio.",
    /**
     * Dominio público. De aquí salen `og:image` y `og:url`, que son las que
     * lee WhatsApp para dibujar la tarjeta del enlace, más el sitemap.
     *
     * Estuvo apuntando a "johanayemmanuel.vercel.app", sin guiones, que no
     * existe: WhatsApp pedía la imagen, recibía un 404 y por eso la vista
     * previa salía solo con texto. Como el enlace que se comparte sí era
     * correcto —la consola lo arma con el host real de la petición— el fallo
     * no se veía por ninguna otra parte.
     *
     * Va por variable de entorno para que un dominio propio no obligue a
     * tocar código: basta con poner NEXT_PUBLIC_SITE_URL en Vercel.
     */
    url: (process.env.NEXT_PUBLIC_SITE_URL || "https://johana-y-emmanuel.vercel.app")
      .replace(/\/+$/, ""),
  },
} as const;
