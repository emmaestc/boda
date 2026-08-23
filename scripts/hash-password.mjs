#!/usr/bin/env node
/**
 * Genera el valor de CONSOLE_PASSWORD_HASH.
 *
 *   npm run hash-password -- "mi contraseña"
 *
 * Copia la línea resultante en `.env.local` y en las variables de entorno de
 * Vercel. La contraseña en claro no se guarda en ningún sitio.
 */
import { randomBytes, scrypt } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

const password = process.argv[2];

if (!password) {
  console.error('Uso: npm run hash-password -- "tu-contraseña"');
  process.exit(1);
}

if (password.length < 8) {
  console.error("Usa al menos 8 caracteres. Esta contraseña protege la lista completa de invitados.");
  process.exit(1);
}

const N = 16384;
const r = 8;
const p = 1;

const salt = randomBytes(16);
const key = await scryptAsync(password, salt, 32, { N, r, p });

console.log("");
console.log("Pega esta línea en tu .env.local (y en Vercel):");
console.log("");
// Separadores con ":" y base64url: los cargadores de .env expanden "$NOMBRE"
// como variable y destruirían el hash a la mitad.
console.log(
  "CONSOLE_PASSWORD_HASH=" +
    ["scrypt", N, r, p, salt.toString("base64url"), key.toString("base64url")].join(":"),
);
console.log("");
