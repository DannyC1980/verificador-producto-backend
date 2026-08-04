# Verificador de Producto — versión con backend (Netlify)

Este paquete convierte el artefacto en una app web real: mientras el archivo
`index.html` original solo tenía valores incrustados, esta versión además
lee y guarda en un backend (Netlify Functions + Netlify Blobs) para que las
configuraciones queden grabadas de verdad — sin depender de que yo las
incruste manualmente cada vez.

**Qué incluye:**
- `index.html` — el artefacto, con las llamadas al backend ya integradas.
- `netlify/functions/mtart.js` — guarda/lee/borra el JSON de cada Tipo de Material.
- `netlify/functions/domain-lookup.js` — guarda/lee la Lista de Valores.
- `netlify.toml`, `package.json` — configuración del sitio.

**Importante:** si abres `index.html` haciendo doble clic (file://), la app
sigue funcionando igual que antes con los valores incrustados — el backend
solo se activa cuando el sitio está desplegado en Netlify y se abre por URL.

## Pasos para desplegar (una sola vez)

1. Ve a [app.netlify.com](https://app.netlify.com) e inicia sesión con la
   cuenta que ya usan para sus proyectos.
2. **Add new site → Deploy manually** (arrastrar carpeta) — arrastra esta
   carpeta completa (`netlify-app`) al recuadro de subida.
   - Alternativa recomendada a futuro: subir esta carpeta a un repositorio
     de GitHub y conectarlo en **Add new site → Import from Git**, así cada
     vez que se actualice el código el sitio se redespliega solo.
3. Netlify detecta `netlify.toml` y despliega automáticamente las dos
   funciones bajo `/api/mtart` y `/api/domain-lookup`. No hay que crear
   ninguna base de datos: usan **Netlify Blobs**, que viene incluido en el
   sitio sin configuración adicional.
4. Cuando termine el despliegue, Netlify te da una URL
   (algo como `https://tu-sitio.netlify.app`). Esa es la dirección que
   comparten con el equipo — ya no es necesario enviar el archivo `.html`.

## Cómo se usa después de desplegado

- Al abrir la URL, la app carga primero los valores incrustados (por si el
  backend tarda o falla) y luego se sincroniza sola con lo que haya en el
  servidor.
- Cuando importas un JSON por Tipo de Material (o la Lista de Valores) desde
  Customizing, además de aplicarse en pantalla se guarda en el servidor —
  verás un segundo aviso ("✓ Guardado en el servidor"). A partir de ahí,
  cualquiera que abra esa misma URL lo verá ya cargado, sin volver a
  importar nada.
- Quitar una configuración de un Tipo de Material también la borra del
  servidor.

## Límites y costos

- Netlify Blobs está incluido en el plan gratuito de Netlify para este
  volumen de datos (decenas de JSON de pocos KB cada uno) — no hay
  necesidad de plan pago por esto.
- Si en el futuro quieren que solo ciertas personas puedan modificar la
  configuración (y otras solo puedan consultar/verificar), eso requeriría
  agregar autenticación — no está incluido en esta primera versión.
