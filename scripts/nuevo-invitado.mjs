#!/usr/bin/env node
/**
 * Crea invitados desde la terminal, sin abrir la consola.
 *
 *   npm run nuevo-invitado -- "María Restrepo" 2
 *   npm run nuevo-invitado -- --archivo invitados.txt
 *
 * El archivo debe tener una línea por invitado con el formato:
 *   Nombre completo; lugares; teléfono; grupo
 * (todo salvo el nombre es opcional)
 *
 * Imprime el enlace personal de cada invitación creada.
 */
import { readFileSync } from "node:fs";
import { randomInt } from "node:crypto";

const ALPHABET = "ABCDEFGHJKMNPQRSTVWXYZ23456789";

function code() {
  let out = "";
  for (let i = 0; i < 10; i += 1) out += ALPHABET[randomInt(ALPHABET.length)];
  return out;
}

function readEnv() {
  const env = {};
  try {
    for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
      const match = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
      if (match) env[match[1]] = match[2];
    }
  } catch {
    // Puede venir del entorno del sistema.
  }
  return { ...env, ...process.env };
}

const env = readEnv();
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SECRET_KEY ?? env.SUPABASE_SERVICE_ROLE_KEY;
const site = env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

if (!url || !key) {
  console.error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SECRET_KEY en .env.local");
  process.exit(1);
}

/** [{ nombre, lugares, telefono, grupo }] */
function parseArgs() {
  const args = process.argv.slice(2);

  if (args[0] === "--archivo") {
    const path = args[1];
    if (!path) {
      console.error("Indica la ruta del archivo: npm run nuevo-invitado -- --archivo lista.txt");
      process.exit(1);
    }
    return readFileSync(path, "utf8")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => {
        const [nombre, lugares, telefono, grupo] = line.split(";").map((p) => (p ?? "").trim());
        return {
          nombre,
          lugares: Number(lugares) || 1,
          telefono: telefono || null,
          grupo: grupo || null,
        };
      });
  }

  const [nombre, lugares, telefono, grupo] = args;
  if (!nombre) {
    console.error('Uso: npm run nuevo-invitado -- "Nombre Apellido" 2');
    process.exit(1);
  }
  return [
    {
      nombre,
      lugares: Number(lugares) || 1,
      telefono: telefono || null,
      grupo: grupo || null,
    },
  ];
}

const invitados = parseArgs();

for (const invitado of invitados) {
  const codigo = code();
  const response = await fetch(url + "/rest/v1/guests", {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: "Bearer " + key,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      nombre: invitado.nombre,
      codigo_invitacion: codigo,
      cantidad_personas_permitidas: invitado.lugares,
      telefono: invitado.telefono,
      grupo: invitado.grupo,
    }),
  });

  if (!response.ok) {
    console.error("✗ " + invitado.nombre + " → " + (await response.text()));
    continue;
  }

  console.log("✓ " + invitado.nombre + "  (" + invitado.lugares + ")  " + site + "/i/" + codigo);
}
