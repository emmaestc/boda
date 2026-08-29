# Arquitectura y decisiones de diseño

Este documento explica **por qué** el proyecto está hecho así. El README explica
cómo usarlo.

---

## 1. El concepto: "el hilo de luz"

La invitación no es una pila de secciones: es una sola escena continua atravesada
por un hilo de luz que se dibuja con el scroll. Nacen **dos hilos separados**
—un camino y otro— que descienden, se buscan y **se funden en uno solo** justo a
la altura de la escena de los nombres. A partir de ahí ya hay un único trazo
hasta el final.

Es la metáfora del texto narrativo ("dos personas que ni soñaban conocerse…")
dibujada literalmente en la página, y es lo que hace que la experiencia se lea
como una pieza y no como una plantilla.

El fondo refuerza lo mismo: hay **un solo lienzo** cuya temperatura viaja con el
scroll (porcelana → azul → luz de vitral → dorado cálido → luz), no ocho fondos
distintos. Está en `components/invitation/Atmosphere.tsx`.

### Las escenas

| Escena | Archivo | Momento |
|---|---|---|
| Preludio | `scenes/Prelude.tsx` | Sobre con lacre; abrirlo es el gesto que empieza todo |
| La historia | `scenes/Story.tsx` | El relato, palabra a palabra, con botánica que se dibuja |
| Los nombres | `scenes/Names.tsx` | Anillos que se entrelazan; el "&" nace de la unión |
| La fecha | `scenes/DateScene.tsx` | 06 · Noviembre · 2026 y cuenta regresiva |
| Ceremonia | `scenes/Venues.tsx` | Luz de vitral, cruz discreta, paloma |
| Recepción | `scenes/Venues.tsx` | Giro a dorado, copas, luces |
| Vestimenta | `scenes/DressCode.tsx` | El código formal y la regla del blanco |
| Lluvia de sobres | `scenes/Gift.tsx` | Sobres cayendo; uno se abre al tocarlo |
| Confirmación | `scenes/RsvpScene.tsx` | Entrada al RSVP |
| Cierre | `scenes/Closing.tsx` | Monograma y bendición |

Ceremonia y recepción **comparten el mismo componente de tarjeta**: misma
retícula, misma tipografía, misma arquitectura. Lo único que cambia es la
temperatura de la luz y la ilustración — que es exactamente la diferencia que
hay entre una iglesia y una fiesta.

---

## 2. Seguridad: el navegador nunca habla con Supabase

Esta es la decisión estructural más importante.

No hay ningún cliente de Supabase en el código de cliente. Todo el acceso a
datos pasa por **server actions** y **route handlers** que usan la clave
secreta. Consecuencias:

- Las tablas tienen **Row Level Security activo y ninguna política**. Aunque
  alguien consiga la URL del proyecto y la clave pública, no puede leer una sola
  fila. Además se revocaron explícitamente los permisos de `anon` y
  `authenticated` sobre todas las tablas y la vista.
- La superficie pública es exactamente la que escribimos nosotros: dos funciones
  de servidor. No hay una API REST abierta que enumerar.
- Un invitado **no puede consultar a otros invitados**. La única llave es el
  código de su propio enlace, y la consulta devuelve solo su fila —sin el `id`
  de base de datos ni ningún dato ajeno (ver `PublicGuest` en
  `lib/guests/types.ts`).

### Otras capas

- **Códigos de invitación** de 10 caracteres sobre un alfabeto de 30 símbolos
  sin ambigüedades (sin `O`/`0`, sin `I`/`1`): ~5.9 × 10¹⁴ combinaciones.
  Generados con `crypto.randomInt`, no con `Math.random`.
- **Límite de peticiones en base de datos** (`check_rate_limit`). En Vercel cada
  petición puede caer en una instancia nueva, así que un contador en memoria no
  limita nada. La cuenta se hace en una sola sentencia atómica. 30 consultas de
  invitación y 15 confirmaciones cada 5 minutos por IP; 8 intentos de acceso al
  panel cada 10 minutos.
- **La IP se guarda como hash**, no en claro: sirve para contar sin almacenar
  datos personales.
- **Validación con Zod** en toda entrada, con limpieza de caracteres de control.
  Una server action es un endpoint público: cualquiera puede llamarla con lo que
  quiera.
- **Las reglas de negocio están también en la base de datos**: un `CHECK` impide
  que `cantidad_asistentes` supere el cupo, y otro impide un "confirmado" con
  cero asistentes. Ni un error de código podría guardar datos imposibles.
- **`import "server-only"`** en todos los módulos con secretos: si alguien los
  importa por descuido desde un componente de cliente, el build falla en lugar
  de publicar una clave.
- **Cabeceras de seguridad** en `next.config.ts` (CSP estricta, `nosniff`,
  `frame-ancestors 'none'`, `Referrer-Policy`) y `noindex` en `/i/*` y
  `/consola/*`, más `robots.txt`.
- **El nombre del invitado no aparece en los metadatos** de su página: si el
  enlace se previsualiza en una app de mensajería, no se filtra de quién es.

### La consola

- Contraseña guardada como **hash scrypt**, no en claro. Ni el panel de Vercel
  la conoce.
- Comparación en **tiempo constante**, y las dos comprobaciones (usuario y
  contraseña) se ejecutan siempre aunque la primera falle: si no, el tiempo de
  respuesta revelaría si el usuario existe.
- Sesión en **JWT firmado** dentro de una cookie `httpOnly` + `Secure` +
  `SameSite`, con 8 horas de vigencia.
- **La sesión se comprueba en dos sitios**: en el layout del panel y otra vez
  dentro de *cada* server action. Una acción de servidor es una URL a la que se
  puede llamar directamente; si la comprobación viviera solo en el layout,
  quedaría una puerta abierta.
- **No se usa middleware** a propósito. Un middleware es un único punto de fallo
  para la autorización —y ha tenido vulnerabilidades de bypass conocidas—;
  comprobar en el layout y en cada acción es más difícil de saltar.
- El CSV de exportación **escapa las fórmulas** (`=`, `+`, `-`, `@`): sin eso, un
  nombre que empiece por `=` se ejecutaría al abrir el archivo en Excel.

---

## 3. Rendimiento

- **Casi cero imágenes.** Salvo la ilustración de la pareja, todo es SVG:
  la botánica en acuarela, los anillos, el sobre y el monograma. La
  iconografía viene de `lucide-react` (ISC), que se sacude en el build y solo
  embarca los iconos usados.
- **Los filtros SVG de la botánica se rasterizan una sola vez.** Por eso el
  marco floral respira con `opacity` y no con `scale`: transformar un subárbol
  filtrado obliga a recalcular las 180 formas de cada ramo en cada fotograma,
  mientras que la opacidad la aplica el compositor sobre el mapa de bits ya
  hecho. En pantallas estrechas, además, cada ramo monta menos piezas.
- **Tres tipografías**, subconjunto latino, servidas desde el propio dominio por
  `next/font`. Sin peticiones a terceros y sin parpadeo.
- **Las partículas se animan con CSS**, no con JavaScript: corren en el
  compositor y no tocan el hilo principal. La cantidad se adapta al ancho de la
  pantalla y **se congelan cuando la pestaña deja de estar visible**.
- **La cuenta regresiva se detiene en segundo plano** y se pone al día al
  volver.
- **El mapa incrustado solo se carga si se pide.** Ninguna visita paga el coste
  de un iframe de terceros sin haberlo querido.
- Las páginas son **Server Components** que solo pasan datos ya serializados; el
  árbol de cliente empieza en el componente de la invitación, que es donde
  realmente hay interacción.

---

## 4. Tipografía

Tres familias y nada más: **Cormorant Garamond** para lo que se lee despacio,
**Jost** para lo práctico y **Great Vibes** reservada a cuatro momentos —el
"&" de los nombres, la firma del cierre, el "¡Te esperamos!" y el monograma—.
La cursiva llegó a estar en trece sitios; es preciosa y es justo la que peor
lee una persona mayor, así que ahora donde antes había caligrafía hay serif en
cursiva de imprenta o versalitas espaciadas, que sostienen la elegancia sin
pedir esfuerzo.

La escala se consolidó de diecisiete cuerpos distintos a diez, fundiendo los
que se diferenciaban en medio píxel: la variedad tiene que venir de la familia
y del interletraje, no de tener quince tamaños que nadie distingue. **Nada baja
de 15 px**, la base del documento es de 17 y los datos prácticos —direcciones y
horas— van a 21.

---

## 5. Accesibilidad

- `prefers-reduced-motion` produce una **versión estática completa**, no una
  versión mutilada: el mismo contenido, sin movimiento.
- El relato revelado palabra por palabra expone el **texto completo en un solo
  nodo** para lectores de pantalla; las palabras animadas van `aria-hidden`.
- Mientras el preludio está abierto, el resto de la página va marcada como
  `inert`: el teclado no puede navegar a contenido que aún no debe verse.
- Un único `h1` describe la boda en una línea para lectores de pantalla y
  buscadores.
- Áreas táctiles de 44–48 px como mínimo, foco visible en toda la interfaz y
  `Escape` para cerrar cualquier diálogo.

---

## 6. Detalles que puede que no se noten (y por eso importan)

- **El sobre viene con el nombre del invitado escrito.** Es lo primero que se
  ve, y hace que la invitación se sienta dirigida a esa persona.
- **Abrir el sobre desmonta el preludio con un temporizador**, no esperando a
  que termine la animación. Si alguien lo abre y cambia de aplicación, el
  navegador congela las animaciones — y con la otra estrategia se quedaría
  atrapado detrás del velo para siempre.
- **Se registra quién abre su invitación** (`aperturas`, `primera_apertura_at`).
  Saber quién ya la abrió y aún no responde es el dato más útil a dos semanas de
  la boda; la consola lo muestra como "abrieron y no respondieron".
- **Abrir una invitación no ensucia `updated_at`.** El disparador compara el
  contenido real e ignora los campos de telemetría.
- **El historial de respuestas se guarda.** Si alguien cambia de opinión, la
  respuesta anterior no se pierde.
- **Con un solo cupo no se pregunta cuántos vendrán.** El paso se salta.
- **El cupo se recorta contra la base de datos**, no contra lo que diga el
  navegador.
- **El formato del hash de contraseña usa `:` y base64url en lugar del `$`
  habitual.** Los cargadores de archivos `.env` —incluido el de Next— expanden
  `$NOMBRE` como si fuera una variable y se comen medio hash sin avisar.

---

## 7. Las flores

El marco floral (`components/invitation/FloralFrame.tsx`) va **fijo al
viewport**, no dentro del documento: enmarca la lectura como el paspartú de un
cuadro en lugar de desfilar por encima del texto. Tres decisiones lo hacen
seguro para el contenido, y están comprobadas midiendo el solape real entre
las cajas de texto y las de los ramos a trece alturas de scroll, en 375 px y
en 1280 px: **cero solapes**.

- Cada ramo lleva una máscara radial que lo disuelve hacia el centro, así que
  nunca hay un borde duro sobre una palabra.
- El tamaño se calcula con `vmin` y no con `vw`: en apaisado o en una pantalla
  muy ancha el ramo no se dispara. Van de 112 px en un teléfono a 292 px en
  escritorio, y cada esquina tiene su propia escala para que no parezca una
  plantilla.
- Los ramos asoman un poco fuera del borde, de modo que el peso visual queda
  en la esquina y la columna de lectura queda libre.

Sobre el realismo: no hay ni una fotografía, y sin embargo la clave no está
en el número de pétalos sino en cuatro cosas, todas en
`components/art/Botanical.tsx`:

1. **Sin contornos.** Una flor pintada no tiene línea alrededor, tiene masa
   de color. La primera versión dibujaba cada pétalo con su borde, y eso es
   exactamente lo que la delataba como vectorial.
2. **Estructura de valor.** Debajo de cada flor va una sombra difuminada que
   la asienta y dentro un degradado que va de claro en la punta a saturado en
   la base. Sin eso, una flor parece una pegatina por muchos pétalos que
   tenga.
3. **Bordes rotos y blandos.** `feTurbulence` + `feDisplacementMap` deforma el
   contorno de forma irregular y un desenfoque posterior lo ablanda, igual que
   el agua al correrse por el papel.
4. **Paleta corta.** Blanco con sombra azulada, crema del propio fondo y
   azules; el follaje también tira a azulado. Seis especies: rosa blanca, rosa
   crema, anémona, hortensia, delfinio y eucalipto.

La composición está pensada para el teléfono: a 130 píxeles una flor
protagonista clara se lee, y diez flores pequeñas se convierten en una mancha.
Por eso cada ramo tiene una principal y el resto acompaña, y en pantallas
estrechas se montan menos piezas.

---

## 8. La música

Arranca en el mismo manejador del toque que abre el sobre, no después. Es
deliberado: Safari en iOS exige que `play()` se llame dentro del propio gesto
del usuario, y aplazarlo aunque sea con un `setTimeout` puede bastar para que
lo rechace. Por eso `Prelude` recibe dos avisos distintos —`onBegin`, síncrono
en el toque, y `onOpen`, cuando el sobre ya se abrió— en lugar de uno solo.

Entra con un fundido de volumen de 3,5 segundos para que la canción se abra
paso mientras el sobre se abre. El archivo se declara con `preload="metadata"`:
la visita descarga unos kilobytes al abrir la página y los 4,5 MB de la canción
solo se piden al tocar el sobre, con el margen de la animación de apertura para
llegar a tiempo.

---

## 9. Cosas que quedaron preparadas y no encendidas

- **Punto exacto en los mapas.** Ahora se busca por dirección completa, que es
  correcto y no inventa coordenadas. Cuando se confirme el sitio exacto, se pega
  el enlace de Google Maps en `mapsUrl` y no hay que tocar nada más.
- **Fotografías.** La invitación está diseñada para funcionar sin ellas. Si más
  adelante se quieren añadir, encajan de forma natural entre el relato y los
  nombres.
