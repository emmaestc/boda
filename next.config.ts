import type { NextConfig } from "next";

/**
 * Cabeceras de seguridad. La invitación no carga scripts de terceros, así que
 * la CSP puede ser estricta; solo se abren Google Fonts (las sirve Next desde
 * el propio dominio, pero el preconnect queda permitido) y los iframes de
 * Google Maps, que son la única incrustación externa de la experiencia.
 */
const isDev = process.env.NODE_ENV === "development";

const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "media-src 'self'",
  "connect-src 'self'",
  "frame-src https://maps.google.com https://www.google.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // En desarrollo la CSP se omite: el recargado en caliente de Next
          // necesita `eval` y un WebSocket, y bloquearlos solo rompe las
          // herramientas locales sin aportar seguridad ninguna.
          ...(isDev ? [] : [{ key: "Content-Security-Policy", value: csp }]),
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
      {
        // Las invitaciones personales y la consola nunca deben indexarse.
        source: "/i/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }],
      },
      {
        source: "/consola/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }],
      },
    ];
  },
};

export default nextConfig;
