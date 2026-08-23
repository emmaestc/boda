import "server-only";

/**
 * Acceso a la configuración sensible. Todo se lee de forma perezosa para que
 * un despliegue con una variable olvidada falle con un mensaje claro en la
 * petición concreta que la necesita, y no con un error opaco al construir.
 *
 * El `import "server-only"` de arriba hace que el build falle de inmediato si
 * alguien importa este archivo desde un componente de cliente. Es la barrera
 * que impide que una clave secreta acabe en el navegador por descuido.
 */

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      "Falta la variable de entorno " + name + ". Revisa tu archivo .env.local o la configuración en Vercel.",
    );
  }
  return value;
}

export const env = {
  get supabaseUrl() {
    return required("NEXT_PUBLIC_SUPABASE_URL");
  },
  get supabaseSecretKey() {
    // Se acepta el nombre nuevo y el histórico de Supabase.
    return (
      process.env.SUPABASE_SECRET_KEY ??
      process.env.SUPABASE_SERVICE_ROLE_KEY ??
      required("SUPABASE_SECRET_KEY")
    );
  },
  get consoleUsername() {
    return required("CONSOLE_USERNAME");
  },
  /** Hash scrypt de la contraseña, si está configurado. */
  get consolePasswordHash() {
    return process.env.CONSOLE_PASSWORD_HASH ?? null;
  },
  /** Contraseña en claro: solo como respaldo para desarrollo local. */
  get consolePassword() {
    return process.env.CONSOLE_PASSWORD ?? null;
  },
  get sessionSecret() {
    return required("SESSION_SECRET");
  },
};
