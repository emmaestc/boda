# Johana & Emmanuel — invitación de matrimonio

Invitación digital interactiva para el matrimonio de Johana y Emmanuel, el
**6 de noviembre de 2026** en Medellín, con enlaces personalizados por invitado,
confirmación de asistencia y una consola privada de administración.

- **Invitación pública:** `/`
- **Invitación personal:** `/i/<código>`
- **Consola:** `/consola`

---

## Índice

1. [Cómo instalar](#1-cómo-instalar)
2. [Cómo configurar Supabase](#2-cómo-configurar-supabase)
3. [Variables de entorno](#3-variables-de-entorno)
4. [Cómo crear las tablas](#4-cómo-crear-las-tablas)
5. [Cómo ejecutarlo en tu computador](#5-cómo-ejecutarlo-en-tu-computador)
6. [Cómo agregar invitados](#6-cómo-agregar-invitados)
7. [Cómo entrar a la consola](#7-cómo-entrar-a-la-consola)
8. [Cómo publicarlo en Vercel](#8-cómo-publicarlo-en-vercel)
9. [Cómo cambiar los textos](#9-cómo-cambiar-los-textos)
10. [Cómo cambiar las imágenes](#10-cómo-cambiar-las-imágenes)
11. [Cómo cambiar la música](#11-cómo-cambiar-la-música)
12. [Cómo cambiar las credenciales](#12-cómo-cambiar-las-credenciales)
13. [Cómo está construido](#13-cómo-está-construido)

---

## 1. Cómo instalar

Necesitas **Node.js 20 o superior**. Comprueba tu versión con `node -v`.

```bash
npm install
```

## 2. Cómo configurar Supabase

El proyecto ya está conectado al proyecto de Supabase `rzvxkonbmadcdypffoka`.
Si algún día necesitas crear uno nuevo:

1. Entra en [supabase.com](https://supabase.com) y crea un proyecto.
2. Ve a **Project Settings → API** y copia:
   - la **URL** del proyecto,
   - la clave **publishable** (o `anon`),
   - la clave **secret** (o `service_role`).
3. Pon esos tres valores en tu `.env.local` (ver el punto siguiente).
4. Ejecuta el esquema de la base de datos (punto 4).

> **La clave secreta nunca debe llevar el prefijo `NEXT_PUBLIC_`.** Ese prefijo
> hace que Next la incruste en el JavaScript que descarga el navegador, y quien
> la tenga puede leer y borrar toda la lista de invitados.

## 3. Variables de entorno

Copia `.env.example` como `.env.local` y rellénalo:

```bash
cp .env.example .env.local
```

| Variable | Para qué sirve |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Dirección del proyecto de Supabase. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave pública. No da acceso a nada por sí sola. |
| `SUPABASE_SECRET_KEY` | Clave secreta. **Solo servidor.** |
| `CONSOLE_USERNAME` | Usuario de la consola (`eestrada`). |
| `CONSOLE_PASSWORD_HASH` | Hash scrypt de la contraseña (ver punto 12). |
| `CONSOLE_PASSWORD` | Alternativa en texto plano, solo para desarrollo. |
| `SESSION_SECRET` | Cadena aleatoria que firma la cookie de sesión. |
| `NEXT_PUBLIC_SITE_URL` | Opcional. La usa el script de invitados para armar los enlaces. |

`.env.local` está en `.gitignore`: nunca se sube al repositorio.

## 4. Cómo crear las tablas

Todo el esquema está en [`supabase/schema.sql`](supabase/schema.sql). Es
**idempotente**: puedes ejecutarlo las veces que quieras sin romper nada ni
perder datos.

1. Abre tu proyecto en Supabase → **SQL Editor** → **New query**.
2. Pega el contenido completo de `supabase/schema.sql`.
3. Pulsa **Run**.

Crea la tabla `guests`, el historial `rsvp_eventos`, la tabla de límites
`rate_limits`, la vista de estadísticas `guest_stats` y deja Row Level Security
activo sin políticas públicas.

## 5. Cómo ejecutarlo en tu computador

```bash
npm run dev
```

Y abre <http://localhost:3000>.

Otros comandos útiles:

```bash
npm run build
```

```bash
npm run typecheck
```

## 6. Cómo agregar invitados

**Desde la consola (lo más cómodo):** entra a `/consola`, pulsa
**Nuevo invitado**, escribe el nombre y cuántos lugares le reservas. El enlace
personal se genera solo; luego usa **Copiar enlace** o **Enviar por WhatsApp**.

**Desde la terminal, uno a uno:**

```bash
npm run nuevo-invitado -- "María Restrepo" 2
```

**Desde la terminal, una lista completa:** crea un archivo `invitados.txt` con
una línea por invitado (`Nombre; lugares; teléfono; grupo` — todo menos el
nombre es opcional):

```
Familia Restrepo Gómez; 4; 573001112233; Familia de la novia
Carlos Andrés Mejía; 1
Tía Beatriz; 2; ; Familia del novio
```

Y ejecútalo:

```bash
npm run nuevo-invitado -- --archivo invitados.txt
```

Imprime el enlace de cada invitación creada.

## 7. Cómo entrar a la consola

Ve a `/consola`. No hay ningún enlace hacia allí desde la invitación, y la ruta
está excluida de los buscadores.

- **Usuario:** `eestrada`
- **Contraseña:** la que configuraste (en desarrollo, `emmanuel`)

Dentro puedes ver el resumen, filtrar por estado, buscar, crear, editar y
eliminar invitados, cambiar un estado a mano (útil para quien confirme por
WhatsApp), generar un código nuevo y exportar todo a CSV.

La sesión dura 8 horas y se cierra con **Salir**.

## 8. Cómo publicarlo en Vercel

1. Sube el proyecto a un repositorio de GitHub.
2. En [vercel.com](https://vercel.com) → **Add New → Project** → importa el
   repositorio. Vercel detecta Next.js solo.
3. En **Environment Variables**, añade **todas** las de tu `.env.local`.
   Cópialas tal cual, sin comillas.
4. **Deploy**.
5. Cuando tengas el dominio definitivo, actualiza `seo.url` en
   [`lib/config/wedding.ts`](lib/config/wedding.ts) para que las vistas previas
   al compartir el enlace apunten al sitio correcto.

## 9. Cómo cambiar los textos

**Todo** el texto visible de la invitación está en un solo archivo:
[`lib/config/wedding.ts`](lib/config/wedding.ts). Nombres, fecha, horas,
direcciones, el relato, la frase del regalo, el versículo, los mensajes de la
confirmación y los datos para compartir.

**El orden de los nombres** también sale de ahí. Toda la experiencia lee
`couple.first` y `couple.second`, que ahora son la novia y el novio en ese
orden; para invertirlo se cambian esas dos líneas y las iniciales del
monograma, y cambia en las nueve escenas, la consola, el calendario y la imagen
para compartir a la vez.

No hace falta tocar ningún componente. Cambia el archivo, guarda, y la página se
actualiza sola.

Para cambiar el punto exacto de un mapa, pon el enlace de Google Maps
(Compartir → Copiar vínculo) en `ceremony.mapsUrl` o `reception.mapsUrl`. Si
están en `null`, se usa la búsqueda por dirección.

## 10. Cómo cambiar las imágenes

La invitación **no usa fotografías**: todo lo que ves —anillos, sobre, iglesia,
paloma, copas, flores, monograma— son dibujos vectoriales propios que viven en
[`components/art/`](components/art). Pesan casi nada y se ven nítidos en
cualquier pantalla.

- **Colores:** el bloque `@theme` al principio de
  [`app/globals.css`](app/globals.css).
- **Imagen al compartir el enlace:** se genera sola en
  [`app/opengraph-image.tsx`](app/opengraph-image.tsx). Si prefieres una imagen
  propia, borra ese archivo y deja un `opengraph-image.png` (1200×630) en
  `app/`.
- **Icono de la pestaña:** [`app/icon.svg`](app/icon.svg).
- **Si más adelante quieres fotos reales:** ponlas en `public/images/` y
  úsalas con el componente `<Image>` de Next dentro de la escena que prefieras.

## 11. Cómo cambiar la música

Ahora suena **"Eres mi sueño" de Fonseca** (`public/music/eres-mi-sueno.mp3`).

La canción **arranca en el momento en que se toca el sobre** y entra con un
fundido de tres segundos y medio, así que se abre paso mientras el sobre se
abre en lugar de irrumpir de golpe. Ese toque es, además, el gesto de usuario
que los navegadores exigen para permitir audio: por eso no empieza antes.
Siempre se puede silenciar con el control de abajo a la izquierda.

Para cambiarla:

1. Copia tu archivo (`.mp3` o `.m4a`) en `public/music/`. Usa un nombre sin
   espacios ni tildes.
2. Ajusta el bloque en `lib/config/wedding.ts`:

```ts
music: {
  src: "/music/eres-mi-sueno.mp3",
  title: "Eres mi sueño",
  artist: "Fonseca",
  volume: 0.3,
}
```

`volume` es el volumen final del fundido, de 0 a 1. Con `src` en `null` no
suena nada y el control desaparece.

**Sobre el peso:** el archivo actual son 4,5 MB. La página solo descarga unos
kilobytes al abrirse (`preload="metadata"`); la canción entera se pide al tocar
el sobre. Si quieres que pese menos, puedes recomprimirla a 128 kbps o recortar
los primeros dos o tres minutos.

**Sobre los derechos:** es una canción comercial. Para una invitación privada
que se comparte por enlace no hay problema, pero por eso mismo conviene no
promocionar el enlace públicamente.

## 12. Cómo cambiar las credenciales

Genera el hash de la contraseña nueva:

```bash
npm run hash-password -- "tu-contraseña-nueva"
```

Copia la línea `CONSOLE_PASSWORD_HASH=...` que imprime, pégala en `.env.local` y
en las variables de entorno de Vercel, y vuelve a desplegar.

Para cambiar el usuario, edita `CONSOLE_USERNAME`.

Si cambias `SESSION_SECRET`, todas las sesiones abiertas se cierran de
inmediato: es la forma rápida de expulsar a cualquiera que estuviera dentro.

> La contraseña en claro no se guarda en ningún sitio. Ni siquiera el panel de
> Vercel la conoce: solo guarda el hash.

## 13. Cómo está construido

```
app/
  page.tsx                  Invitación pública (sin confirmación)
  i/[codigo]/page.tsx       Invitación personal
  consola/login/            Acceso al panel
  consola/(panel)/          Panel protegido y exportación CSV
  actions/rsvp.ts           Server action de confirmación
components/
  invitation/               Escenas del relato y ambientación
  art/                      Ilustraciones SVG originales
  rsvp/                     Flujo de confirmación
  admin/                    Consola
  ui/                       Piezas reutilizables
lib/
  config/wedding.ts         Todos los datos y textos
  guests/                   Tipos, validación, códigos y acceso a datos
  auth/                     Sesión, contraseñas y límite de intentos
  supabase/server.ts        Cliente de servidor
supabase/schema.sql         Esquema de la base de datos
```

Hay una explicación más detallada de las decisiones de diseño y seguridad en
[`docs/ARQUITECTURA.md`](docs/ARQUITECTURA.md).

**Lo esencial en una frase:** el navegador nunca habla con Supabase. Todo pasa
por el servidor, la base de datos tiene Row Level Security activo sin políticas
públicas, y un código de invitación solo puede consultarse a sí mismo.
