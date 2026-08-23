import "server-only";
import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: Buffer,
  keylen: number,
  options: { N: number; r: number; p: number },
) => Promise<Buffer>;

/** Parámetros de scrypt: coste alto para una contraseña que se teclea a mano. */
const N = 16384;
const R = 8;
const P = 1;
const KEYLEN = 32;

/**
 * Formato del hash: `scrypt:N:r:p:sal:clave`, con sal y clave en base64url.
 *
 * Se usan dos puntos como separador y base64url a propósito. El formato
 * habitual (PHC) separa con `$`, pero los cargadores de archivos `.env`
 * —incluido el de Next— expanden `$NOMBRE` como si fuera una variable, y eso
 * se come medio hash sin avisar. Con `:` y base64url el valor sobrevive
 * intacto tanto en `.env.local` como en el panel de Vercel.
 */
const PREFIX = "scrypt:";

/** Genera el valor de `CONSOLE_PASSWORD_HASH`. */
export async function hashPassword(plain: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await scryptAsync(plain, salt, KEYLEN, { N, r: R, p: P });
  return [PREFIX + N, R, P, salt.toString("base64url"), key.toString("base64url")].join(":");
}

/** Comparación en tiempo constante: no filtra información por la duración. */
function constantTimeEquals(a: Buffer, b: Buffer): boolean {
  if (a.length !== b.length) {
    // Se compara igualmente contra sí mismo para no acortar el tiempo.
    timingSafeEqual(a, a);
    return false;
  }
  return timingSafeEqual(a, b);
}

/** Comparación de cadenas en tiempo constante (para el nombre de usuario). */
export function safeEquals(a: string, b: string): boolean {
  return constantTimeEquals(Buffer.from(a, "utf8"), Buffer.from(b, "utf8"));
}

/**
 * Verifica la contraseña contra el hash configurado. Si lo que hay guardado no
 * es un hash, se trata como texto plano: es el respaldo para desarrollo local,
 * y aun así la comparación sigue siendo de tiempo constante.
 */
export async function verifyPassword(plain: string, stored: string): Promise<boolean> {
  if (stored.startsWith(PREFIX)) {
    const [, n, r, p, saltEncoded, keyEncoded] = stored.split(":");
    const salt = Buffer.from(saltEncoded ?? "", "base64url");
    const expected = Buffer.from(keyEncoded ?? "", "base64url");
    if (!salt.length || !expected.length) return false;

    const candidate = await scryptAsync(plain, salt, expected.length, {
      N: Number(n) || N,
      r: Number(r) || R,
      p: Number(p) || P,
    });
    return constantTimeEquals(candidate, expected);
  }

  return constantTimeEquals(Buffer.from(plain, "utf8"), Buffer.from(stored, "utf8"));
}
