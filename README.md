# Femuix · Web

One page de Femuix (reformas de vivienda en Barcelona), hecha con [Astro](https://astro.build).

## Comandos

| Comando           | Acción                                   |
| ----------------- | ---------------------------------------- |
| `npm install`     | Instala dependencias                     |
| `npm run dev`     | Servidor local en `http://localhost:4321` |
| `npm run build`   | Genera la web estática en `dist/`        |
| `npm run preview` | Previsualiza la build                    |

## Estructura

```
src/
├── data/site.ts        ← textos, enlaces y contenido editable; url('/ruta') da la dirección
│                         de una página respetando la carpeta de GitHub Pages
├── styles/global.css   ← paleta 60/30/10, tipografía y animaciones base
├── scripts/motion.ts   ← scroll suave (Lenis), efectos ligados al scroll, contadores
├── env.d.ts            ← tipos globales (window.lenis)
├── layouts/Base.astro  ← <head>, SEO y animaciones de entrada
├── components/         ← una sección por componente
└── pages/index.astro   ← orden de las secciones
```

Los enlaces a otras páginas se escriben siempre con `url('/privacidad')` y no a mano: añade la
carpeta de publicación y la barra final, de modo que coinciden con la dirección canónica y la del
mapa del sitio (`sitemap.xml`) y no pasan por una redirección. La página 404 lleva `noindex`.

## Paleta

| Uso  | Color     | Dónde                                                                 |
| ---- | --------- | --------------------------------------------------------------------- |
| 60 % | `#FFFFFF` | Blanco: fondo, cabecera y espacio en blanco                           |
| 30 % | `#A4BCC2` | Bruma (color del símbolo): secciones de apoyo y bloques de fondo      |
| 10 % | `#1D3C34` | Verde pino, solo en detalles: botones, números, filetes, iconos, pie  |

**Texto:** negro `#111111` en títulos y párrafos, gris carbón para el secundario (`#4A4A4A`
sobre blanco, `#2E2E2E` sobre bruma). Todo por encima de 4,5:1.

Variables en `global.css`: `--bg` (60 %), `--band` (30 %), `--ink` (10 %), `--text` y `--muted`.

### Los tres verdes del símbolo (modo White)

| Verde | Color | Dónde |
| --- | --- | --- |
| Pino | `#1D3C34` | Botones, números, cinta de las fases, sello, portal y pie |
| Petróleo | `#487A7B` · profundo `#335F60` | Cursivas grandes de los titulares (4,8:1). El tono profundo, para la **banda del método** (texto blanco 7,1:1) y las etiquetas pequeñas |
| Bruma | `#A4BCC2` | Bandas del vídeo, sobre mí y formulario; cursiva de la cinta |

Se combinan en tres sitios: la **regla** de color (`--regla`: pino → petróleo → dorado) sobre cada
tarjeta de fase y el formulario, el **divisor** entre secciones blancas (`--divider`, un filete
que se desvanece) y el brillo de los bloques verdes, que vira del pino al petróleo
(`--deep-glow`). En Dark UI pasan a grises y dorado.

La banda del método usa el petróleo profundo `#335F60` y solo puede **oscurecerse** hacia el
pino, nunca aclararse: texto blanco 7,1:1 y cursivas en dorado claro `#EAD9B0` 5,1:1.

### Ritmo de la página

Las secciones alternan blanco, bruma, petróleo y pino para que la lectura tenga compás:

| Sección       | Fondo                                |
| ------------- | ------------------------------------ |
| Portada       | Blanco, con un bloque de bruma y un marco dorado tras la foto |
| Cinta         | **Pino**, fases en blanco y cursiva en bruma |
| Vídeo         | Bruma                                |
| ¿Te suena?    | Blanco                               |
| Método        | **Petróleo**, con las fases en tarjetas blancas |
| Cómo trabajo  | Blanco, con el portal sobre verde    |
| Testimonios   | Blanco                               |
| Sobre mí      | Bruma                                |
| Preguntas     | Blanco                               |
| Reto          | Blanco, con el formulario en bruma   |
| Pie           | Verde pino con brillo petróleo       |

Cuando dos secciones blancas van seguidas, las separa un filete en degradado con un pequeño
rombo dorado. Las bandas de bruma usan `.band` y la de petróleo `.band--teal` (solo en White).

### Escala del verde pino

| Token        | Color     | Uso                                                        |
| ------------ | --------- | ---------------------------------------------------------- |
| `--pine-950` | `#0E201B` | Sombras                                                    |
| `--pine-900` | `#152D27` | Fondo del reproductor de vídeo                             |
| `--pine-800` | `#1D3C34` | **Color de marca**: detalles, botones, pie                 |
| `--pine-700` | `#264A41` | Tarjetas en Dark UI                                        |
| `--pine-600` | `#375D53` | Marca de enlaces en Dark UI, degradados oscuros            |
| `--pine-500` | `#527A70` | Bordes de campos sobre blanco (≥3:1)                       |
| `--pine-400` | `#769E93` | Bordes de campos sobre verde                               |
| `--pine-200` | `#C9D9D5` | Texto secundario sobre verde                               |
| `--pine-100` | `#E1EAE8` | Enlaces sobre verde                                        |

## Modos White y Dark UI

- **White:** fondo blanco, bandas de bruma, texto negro y detalles en verde pino. Cabecera
  blanca con el logotipo en verde.
- **Dark UI «grafito y oro»:** negro puro, los grises del símbolo FEMUIX black 2 y el
  dorado, que le da la misma personalidad que en White. Sin verde ni bruma:

  | Uso  | Color     | Dónde                                                                  |
  | ---- | --------- | ---------------------------------------------------------------------- |
  | 60 % | `#000000` | Fondo y cabecera                                                       |
  | 30 % | `#1F2024` | Grafito: bandas, cinta de fases, sello, portal y pie, con un brillo del gris `#4B4E54` |
  | 10 % | `#4B4E54` / `#838182` | Grises del símbolo: bloque tras la foto, filetes, bordes, tarjetas |
  |      | `#DAC499` / `#B8955A` | Dorado: cursivas de los titulares, números, rombos, divisores, barra de progreso |
  |      | `#D0D3D4` / `#9EA2A2` | Texto secundario (sobre grafito, siempre `#D0D3D4`)        |

  Texto `#F5F5F5`. Botones principales (CTA) blancos con texto negro; al pasar el ratón se
  llenan de dorado. Las fases del método son tarjetas negras sobre la banda grafito.
  En todos los sitios va **FEMUIX black 2.svg** (texto blanco, símbolo `#4B4E54` / `#838182` /
  blanco): cabecera, pie, logotipo gigante, cinta, sello e intro. «FEMUIX Back 1.svg» (texto
  `#101820`) se reserva para fondos claros, porque sobre negro no se lee.
- El interruptor de la cabecera muestra las dos opciones, ☀ día y ☾ noche, y marca la activa
  con un círculo (verde en día, blanco en noche). Al cambiar, el nuevo modo se descubre en
  círculo desde la opción pulsada.
- La web abre siempre en **modo día**. Si el visitante elige el modo noche, se mantiene solo
  mientras navega por la web (sesión); al volver otro día, empieza de nuevo en día.
- Los colores de cada modo están en `:root` y `:root[data-theme='dark']` de `global.css`.
- `<Isotipo tone="auto">` (por defecto) muestra el símbolo verde en White y el negativo en Dark
  UI. El símbolo verde no se coloca nunca directamente sobre bruma, porque su pieza `#A4BCC2`
  desaparecería.

## Tipografía

- **Títulos:** Merriweather (en `src/fonts/`), peso ligero 300 con tamaño óptico variable. Está
  recortada a caracteres latinos (≈200 KB por estilo en lugar de 4,5 MB). Licencia OFL incluida.
- **Texto:** Inter Variable.

## Movimiento

Intro con el isotipo (una vez por sesión), titulares palabra a palabra, scroll suave, franja de
fases que se mueve con el scroll, sello que gira siempre despacio (y más rápido con el scroll), vídeo que crece con el scroll, frase que se ilumina, tarjetas del método apiladas,
portal en 3D, comparador antes/después, «Sobre mí» en tres tiempos (foto, firma y texto, con la cita
que se escribe y filetes que se dibujan) y logotipo gigante en el pie. Todo se desactiva si el
sistema pide reducir el movimiento.

Escala de movimiento (tokens en `global.css`): `--t-color` 0,4 s para colores y subrayados,
`--t-move` 0,6 s para microinteracciones, `--t-enter` 1,1 s para entradas y filetes que se dibujan,
`--t-media` 1,4 s para imágenes que se descubren. Todo entra subiendo, las imágenes se descubren de
abajo arriba y los filetes se dibujan de izquierda a derecha.

Apariciones (`.reveal`, `.split`, `.clip-reveal`, en `src/scripts/motion.ts`): salen en orden de
lectura y por tandas. Lo que ya se ve en la misma sección entra junto (rótulo, titular y
entradilla); un bloque con `data-reveal-unit` (tarjeta del método, cierre del pie) se presenta
entero y de arriba abajo; al final de la página aparece lo que quede pendiente, cada tanda espera a la anterior sin adelantarla nunca, y en un salto con el menú o
un giro rápido de rueda se espera a que la página se pare: lo que queda fuera aparece sin
animación. En el móvil (desplazamiento con el dedo) todo aparece en cuanto entra, también durante
el gesto. Al tocar un botón, un enlace con flecha o una pregunta, hace un instante la misma
animación que con el ratón (`.is-tapped`). Si un componente tiene
su propia `transition` en un elemento `.reveal`, la de entrada manda hasta que termina
(`.is-done`) y después vuelve la suya.

Acabados: grano de papel (en modo overlay, no altera el blanco), apariciones con desenfoque,
secciones verdes que se abren de tarjeta a ancho completo (`data-expand`), índice numerado en
las etiquetas de sección, texto que rueda en los botones, huecos de imagen con paspartú,
coordenadas de Barcelona en la portada y hora local en el pie.

## Móvil, tablet y escritorio

Revisada sin desplazamiento horizontal ni solapes a 320, 375, 414, 600, 768, 834, 1024, 1280,
1440 y 1920 px.

| Ancho          | Cabecera                                                    | Contenido                          |
| -------------- | ----------------------------------------------------------- | ---------------------------------- |
| > 1100 px      | Menú completo, interruptor día/noche y botón del reto       | Diseño a dos columnas              |
| 901–1100 px    | Botón de menú (tablet en horizontal)                        | Dos columnas                       |
| 561–900 px     | Botón de menú (tablet en vertical)                          | Una columna; foto de portada apaisada; «Sobre mí» a dos columnas |
| ≤ 560 px       | Logo, «Reto gratuito» y menú; el interruptor va dentro del menú | Una columna                    |

El menú (`Header.astro`) se cierra con Escape, al elegir una sección o al pasar a escritorio, y
mientras está abierto deja la página de detrás inactiva (`inert`) para que el foco no se pierda.

**Final de la página en el iPhone.** Chrome para iOS siempre rebota al llegar al final (no hace
caso de `overscroll-behavior`) y pinta de blanco el hueco que se abre bajo el pie, con lo que
parecía que la página seguía. En `global.css`, `body::before` es una capa fija del color del pie
que espera justo debajo de la pantalla: en el rebote sube con la página y rellena el hueco. No la
quites ni le pongas degradados (un color plano es lo que el móvil pinta al instante), y no le
quites `will-change: transform`: sin capa propia WebKit la pinta dentro de la página, cortada donde
acaba el documento, y en el hueco no aparece (fue lo que falló en el primer intento).

## Accesibilidad y usabilidad (WCAG 2.2 AA)

### Última auditoría

Se ha pasado axe-core con las reglas WCAG 2.0, 2.1 y 2.2 nivel AA más las de buenas prácticas,
en modo White y Dark UI: **0 incidencias**. Además, comprobaciones manuales:

| Comprobación | Resultado |
| --- | --- |
| Contraste real con las texturas y el grano apagados (axe no puede medirlo con ellos puestos) | 0 fallos; los casos de degradado se han medido en el peor tono |
| Orden de tabulación y foco visible | Lógico, sin trampas; todos los aros visibles |
| Foco no tapado por la cabecera fija (2.4.11) | La cabecera reaparece al recibir foco; `scroll-padding-top` compensa |
| Área de pulsación (2.5.8) | Todo ≥ 24 px; menú y pie ≥ 40 px |
| Reflujo a 320 px y zoom 400 % | Sin scroll horizontal |
| Espaciado de texto (1.4.12) | Sin recortes |
| Movimiento reducido, contraste alto, colores forzados | Respetados |
| Idioma, título, un solo `h1`, jerarquía de titulares, puntos de referencia | Correctos |

### Problemas encontrados y corregidos

1. **Cursivas invisibles en Dark UI** dentro de las bandas: heredaban el verde pino sobre
   `#101820` (1,5:1). Ahora usan el color de texto.
2. **Aro de foco invisible** en «Saltar al contenido» (verde sobre verde): ahora blanco.
3. **Objetivos pequeños:** enlaces del menú (24 px) y del pie (22 px) ahora de 40 a 50 px;
   casilla de privacidad de 20 a 24 px.
4. **Vídeo sin alternativa en texto** (1.2.1): descripción desplegable bajo el vídeo.
5. **Botones de «llamada» que llevaban al formulario:** mientras `llamadaUrl` no tenga una
   agenda real, pasan a «Escríbeme un email» (`llamada` en `src/data/site.ts`). Al rellenar la
   URL vuelven a ser llamadas, sin tocar nada más.
6. **Errores en burdeos** poco legibles sobre la bruma: oscurecidos (4,7:1).
7. Soporte de **`prefers-contrast: more`** y **`forced-colors`**.

### Pendiente (depende de ti, no del diseño)

- Texto de presentación de Andrea y «Te llevas» de las fases: se ven entre corchetes.
- Vídeo definitivo con subtítulos incrustados (`<track>`) y transcripción en `media.ts`.
- Imagen para compartir (`og:image`, 1200 × 630) y URL real de la agenda.
- Prueba con lector de pantalla real (VoiceOver o NVDA) antes de publicar.

### Reglas para seguir editando

- **Contraste (White UI):** el texto normal (menos de 24 px) va a **7:1** como mínimo y el
  grande a **4,5:1**, medidos en el tono más oscuro de cada degradado. Bordes de campos y
  botones ≥ 3:1. El texto pequeño en petróleo usa `--em-text` (o `--petrol-deep`), nunca `--petrol` ni `--em`; el bronce
  `--gold-deep` (4,8:1) es solo para cifras y cursivas grandes. Usa los tokens (`--ink`,
  `--muted`, `--line-ui`, `--error`, `--em`) en lugar de colores sueltos. Si añades un token
  dentro de `.band`, redefínelo también en `:root[data-theme='dark'] .band`.
- **Casi nada se mueve solo** (2.2.2): los efectos van ligados al scroll. La única animación
  infinita es el giro del sello de la portada, pedido así a propósito; no añadas más, y
  ponlas siempre dentro de `prefers-reduced-motion: no-preference`.
- **Titulares animados:** `SplitText` incluye el texto real oculto para lectores de pantalla;
  úsalo siempre en lugar de partir palabras a mano.
- **Foco visible:** nunca quites `outline` sin sustituirlo; sobre fondos verdes, aro blanco.
- **Formulario:** cada campo tiene su mensaje de error enlazado (`aria-describedby`) y el aviso
  de envío es una región `role="status"`.
- **Imágenes y vídeo:** `alt` descriptivo en las fotos; subtítulos y transcripción en el vídeo.
- **Para auditar:** neutraliza `body::after`, `.band::before` y los degradados antes de pasar
  axe, o devolverá «incompleto» en lugar de medir el contraste.
- La declaración está en `/accesibilidad`.

## Fotos y vídeo de muestra

Para ver cómo queda la web, hay fotos de Unsplash y un vídeo de Pexels (licencia de uso gratuita)
en portada, «Sobre mí», antes/después y vídeo. Están en `src/data/media.ts`:

- Para cambiar una foto, sustituye su `id` y su `alt` (el texto alternativo describe la imagen).
- Con `usarMuestras = false` vuelven los huecos reservados.
- Se cargan desde los servidores de Unsplash y Pexels, así que **son solo para la maqueta**: las
  fotos y el vídeo definitivos deben ser propios y guardarse en `/public`, sin terceros (la página
  de cookies dice que no hay servicios externos).
- El vídeo no se reproduce solo (WCAG 2.2.2): muestra su fotograma y arranca con el botón ▶. El
  definitivo debe llevar subtítulos incrustados.

## Pendiente de contenido real

- Foto principal, vídeo de 60–90 s, foto de Andrea y antes/después (`Placeholder`).
- Entregable de cada fase (`fases` en `site.ts`).
- Presentación de Andrea (`sobreMi.intro`).
- Testimonios reales (`testimonios`; mientras esté vacío se muestran huecos).
- Capturas reales del portal de cliente (hoy es una ilustración en `ComoTrabajo.astro`).
- URL del formulario de Systeme.io (`systemeFormAction`) y enlace de la llamada (`llamadaUrl`).
- Datos entre [corchetes] de `/aviso-legal`, `/privacidad` y `/cookies`, y revisión profesional
  de los textos legales y de la información de privacidad del formulario (`Reto.astro`).
