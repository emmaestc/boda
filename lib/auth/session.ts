import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import { env } from "@/lib/env";

const COOKIE_NAME = "consola_sesion";
const MAX_AGE_SECONDS = 60 * 60 * 8; // una jornada de trabajo
const ISSUER = "invitacion-ej";

function signingKey(): Uint8Array {
  return new TextEncoder().encode(env.sessionSecret);
}

/**
 * Sesión del panel: un JWT firmado guardado en una cookie `httpOnly`.
 *
 * Al ir firmada, el navegador no puede fabricarla ni modificarla; al ser
 * `httpOnly`, ningún script de la página puede leerla. Como el panel tiene un
 * único usuario, no hace falta ni sesión en base de datos ni proveedor externo.
 */
export async function createSession(usuario: string): Promise<void> {
  const token = await new SignJWT({ u: usuario })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(ISSUER)
    .setSubject("consola")
    .setExpirationTime(Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS)
    .sign(signingKey());

  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

export async function getSession(): Promise<{ usuario: string } | null> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, signingKey(), {
      issuer: ISSUER,
      subject: "consola",
    });
    const usuario = typeof payload.u === "string" ? payload.u : null;
    return usuario ? { usuario } : null;
  } catch {
    return null;
  }
}

/**
 * Puerta de entrada al panel. Se llama tanto en el layout como al principio de
 * cada server action: comprobarlo en un solo sitio dejaría una puerta abierta
 * si alguien invocase la acción directamente.
 */
export async function requireSession(): Promise<{ usuario: string }> {
  const session = await getSession();
  if (!session) redirect("/consola/login");
  return session;
}
