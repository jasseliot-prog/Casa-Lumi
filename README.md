# Casa-Lumi — paquete inicial ampliable

Este paquete es una **primera versión funcional (MVP)** de Casa-Lumi. Incluye interfaz adaptable a móvil, personaje original de Lumi dibujado con CSS, navegación por habitaciones, acciones animadas sencillas, vestuario seleccionable, cuidado virtual de Lulú, calendario con eventos, notas, respaldo JSON y accesos a Spotify/YouTube.

## Cómo probarla en un teléfono Android
1. Descarga y descomprime el ZIP.
2. Crea un repositorio nuevo en GitHub llamado `Casa-Lumi`.
3. Sube el contenido de esta carpeta a la raíz del repositorio (index.html debe quedar en la raíz).
4. En GitHub abre **Settings → Pages**.
5. En **Build and deployment**, selecciona **Deploy from a branch**, rama `main`, carpeta `/ (root)` y guarda.
6. Espera a que GitHub Pages publique la dirección. Ábrela en Chrome Android.
7. En Chrome, menú ⋮ → **Añadir a pantalla principal** o **Instalar aplicación**.

Para probar en el ordenador basta abrir `index.html`, pero la instalación PWA y el service worker requieren HTTPS o localhost. GitHub Pages entrega HTTPS.

## Qué funciona en este paquete
- Departamento con siete espacios y selector de habitaciones.
- Lumi visible desde el inicio; personaje CSS con estados idle, caminar, sentarse, leer y descansar.
- Closet con conjuntos iniciales por temporada/ocasión.
- Lulú: acciones de agua, luz y compañía; valores e historial guardados localmente.
- Calendario mensual; agregar y borrar eventos con fecha, hora, categoría y notas.
- Notas locales.
- Exportar/importar respaldo JSON.
- Enlaces Spotify guardados y apertura de Spotify.
- Reproductor insertado de YouTube para enlaces de videos compatibles.
- PWA básica con caché offline de la app.

## Qué NO está terminado / requiere trabajo externo
- **IA real de Lumi:** no se incluye una IA simulada. Requiere un backend seguro y un proveedor de IA. La clave secreta nunca debe estar en `app.js`, `index.html` ni en un repositorio público.
- **Spotify avanzado:** el enlace guardado abre Spotify. Control de reproducción y cuentas requiere integración oficial Spotify OAuth, revisión de requisitos, y posiblemente cuenta/entorno compatible.
- **YouTube:** el reproductor oficial embebido puede no permitir ciertos videos o funciones; no se promete reproducción en segundo plano.
- **Notificaciones fiables cuando la app está cerrada:** requieren permisos y un sistema de notificaciones/push con backend; el calendario actual guarda eventos, pero no envía avisos.
- **Animaciones avanzadas:** el personaje inicial es CSS 2D. Caminar entre habitaciones está representado por estados sencillos; no es un juego 3D ni tiene navegación autónoma.
- **Sincronización entre dispositivos:** los datos se guardan en el almacenamiento local del navegador. Exporta un respaldo para moverlos; sincronización en nube requiere backend.

## Arquitectura ampliable
- `index.html`: estructura y pantallas.
- `styles.css`: tema visual, personaje y animaciones.
- `app.js`: módulos de estado y funciones.
- `manifest.webmanifest`: identidad PWA.
- `sw.js`: caché offline.
- `assets/`: iconos.

Mantener los datos y la lógica separados de la presentación. Al agregar funciones, usar módulos nuevos y versionar los respaldos. No reemplazar el proyecto entero para sumar una función.

## Seguridad y privacidad
No escribas contraseñas, tokens ni claves privadas en los archivos del sitio. No solicites contraseñas de Spotify o Google dentro de Casa-Lumi. Para integraciones, usar OAuth oficial y backend HTTPS. El proyecto no necesita tus credenciales para funcionar como MVP.

## Lista de pruebas antes de darlo por listo
- Abrir en Android Chrome y añadir a pantalla principal.
- Cambiar entre las siete habitaciones.
- Probar acciones de Lumi.
- Cambiar estación y conjunto.
- Regar, dar luz y acompañar a Lulú; cerrar y abrir y verificar persistencia.
- Crear dos eventos, navegar meses, borrar uno.
- Crear nota y borrarla.
- Exportar respaldo, borrar datos de prueba e importar respaldo.
- Probar un video público de YouTube que permita inserción.
- Probar el enlace de Spotify.
- Revisar que se vea bien en pantalla pequeña.

## Prompt de continuidad para Cony
Usa el archivo `PROMPT_PARA_CONY.txt`. Primero revisa todos los archivos existentes y conserva la estructura. No rehagas el proyecto desde cero. Antes de cambiar código, explica qué archivos modificarás y por qué. Implementa y prueba cada módulo por separado. No afirmes que IA, push notifications o Spotify OAuth están listos hasta conectarlos y probarlos de verdad.
