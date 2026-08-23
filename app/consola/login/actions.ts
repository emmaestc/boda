"use server";

import { redirect } from "next/navigation";
import { loginSchema } from "@/lib/guests/schemas";
import { safeEquals, verifyPassword } from "@/lib/auth/password";
import { createSession, destroySession } from "@/lib/auth/session";
import { requesterKey, withinRateLimit } from "@/lib/auth/rate-limit";
import { env } from "@/lib/env";

export type LoginState = { error: string | null };

/**
 * Acceso al panel.
 *
 * Tres cuidados deliberados: el contador de intentos vive en la base de datos
 * (ocho cada diez minutos, y si el contador falla se deniega en lugar de
 * permitir), las dos comprobaciones se ejecutan siempre —aunque la primera ya
 * haya fallado— para no revelar por el tiempo de respuesta si el usuario
 * existe, y el mensaje de error es el mismo en todos los casos.
 */
export async function iniciarSesion(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    usuario: formData.get("usuario"),
    clave: formData.get("clave"),
  });
  if (!parsed.success) {
    return { error: "Escribe tu usuario y tu contraseña." };
  }

  const allowed = await withinRateLimit(await requesterKey("consola-login"), 8, 600, {
    failOpen: false,
  });
  if (!allowed) {
    return { error: "Demasiados intentos seguidos. Vuelve a intentarlo en unos minutos." };
  }

  const stored = env.consolePasswordHash ?? env.consolePassword;
  if (!stored) {
    return { error: "El acceso todavía no está configurado en el servidor." };
  }

  const usuarioOk = safeEquals(parsed.data.usuario.toLowerCase(), env.consoleUsername.toLowerCase());
  const claveOk = await verifyPassword(parsed.data.clave, stored);

  if (!usuarioOk || !claveOk) {
    return { error: "Usuario o contraseña incorrectos." };
  }

  await createSession(env.consoleUsername);
  redirect("/consola");
}

export async function cerrarSesion(): Promise<void> {
  await destroySession();
  redirect("/consola/login");
}
