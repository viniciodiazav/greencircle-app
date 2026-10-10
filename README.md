# 🌿 Green Circle App — Frontend Móvil & Web

Interfaz web moderna, reactiva y orientada a dispositivos móviles desarrollada con **React 19**, **Vite**, **Tailwind CSS** y **React Router**, con soporte para instalación nativa como **PWA (Progressive Web App)**.

---

## 📱 1. Características Principales de la Aplicación

### A. Vista Pública de Clientes (`/`)
1. **Pila de Materiales Activos (`MaterialCard.jsx`):**
   * Tarjetas minimalistas verticales que muestran el nombre del material y el **precio de compra por kilo** (`$X.XX / kg`).
   * Separación decimal estricta por punto (`.`).
   * Respuesta táctil suave al toque (`active:scale-[0.99]`).
2. **Sucursales Discretas (`SucursalesChips.jsx`):**
   * Carrusel horizontal de botones/píldoras en el encabezado con los nombres de los centros de acopio.
   * Al pulsar sobre una sucursal, abre la ubicación directa en Google Maps en una pestaña nueva.
3. **Aviso Operativo Sutil (`NoticeBanner.jsx`):**
   * Mensaje en tono naranja corporativo: *"Todos los precios están sujetos a revisión"*.
4. **Buscador Reactivo (`SearchInput.jsx`):**
   * Filtrado en tiempo real por nombre de material, con botón táctil `✕` para vaciar el texto en un toque.
5. **Doble Sistema de Sincronización:**
   * **Automático:** Sondeo silencioso en segundo plano cada **30 segundos** sin interrumpir al usuario.
   * **Manual:** Botón **"Actualizar"** en la cabecera con micro-rotación animada para forzar la consulta inmediata.

### B. Panel Administrativo Móvil (`/gAca26vd8`)
1. **Ruta Secreta y Trampas Honeypot:**
   * La interfaz administrativa no reside en `/admin` ni `/login`. Utiliza una ruta de caracteres aleatorios: `/gAca26vd8`.
   * Cualquier petición a `/admin` o `/login` es redirigida inmediatamente a la vista pública (`/`).
2. **Menú de Hamburguesa (`AdminDrawer.jsx`):**
   * Cajón lateral deslizable con soporte de áreas seguras (notch y barra de inicio), ficha del usuario y navegación entre módulos sin recarga.
3. **Catálogo de Materiales:**
   * **Triple Validación de Inmutabilidad** al crear nuevos materiales (ficha técnica, checkboxes de confirmación y confirmación escrita).
   * Interruptor tipo switch para activar/desactivar materiales con validación previa de precios.
   * Actualización de precios vigentes de compra y venta con auditoría automática SCD Tipo 2 en base de datos.
4. **Gestión de Sucursales:**
   * Altas, modificaciones de URL y eliminación definitiva.
5. **Módulos de Históricos de Precios:**
   * Visualización por defecto de los últimos 10 registros, configurable dinámicamente mediante selector numérico (hasta 500 registros).
   * **Alternador Lista / Gráfica:**
     - **Lista:** Tarjetas detalladas con ID consecutivo fiscal, precios, estados y periodos de vigencia.
     - **Gráfica de Líneas (`HistoricoLineChart.jsx`):** Gráfica SVG interactiva con cronología temporal, filtro por material, métricas de precio mínimo, máximo y vigente, área bajo la curva y tooltip táctil al presionar cada punto.

### C. Experiencia Nativa Móvil (PWA)
* **Instalable en Pantalla de Inicio:** Al pulsar *"Agregar a pantalla de inicio"* en iOS o *"Instalar"* en Android, la app se abre en modo standalone pantalla completa (sin barras de navegador ni pestañas).
* **Assets e Iconos PWA:**
  * `manifest.webmanifest`: Configuración de colores (`#064e3b`), orientación vertical y display standalone.
  * Iconos generados en `public/`: `apple-touch-icon.png` (180x180), `icon-192.png`, `icon-512.png` e `icon-maskable-512.png`.
  * `favicon.svg`: Emblema vectorial oficial de Green Circle.
* **Respeto a Áreas Seguras (Safe Area Insets):** Encabezados, menús y modales contemplan `env(safe-area-inset-top)` y `env(safe-area-inset-bottom)` para no quedar ocultos detrás del notch de la cámara ni la barra de gestos de iPhone/Android.
* **Sensación Táctil Nativa:**
  * Micro-escalado dinámico (`active:scale-95` / `active:scale-[0.98]`).
  * Sin recuadro gris de toque (`-webkit-tap-highlight-color: transparent`).
  * Sin selección involuntaria de texto en la interfaz (`user-select: none`).
  * Bloqueo automático de scroll del fondo al abrir modales o el menú lateral.
  * Teclados virtuales específicos (`inputMode="decimal"` para precios, `inputMode="numeric"` para cantidades, `inputMode="url"` para enlaces).

---

## 🏗️ 2. Arquitectura de Carpetas

```
frontend/
├── public/                       # Assets estáticos y PWA
│   ├── favicon.svg               # Icono vectorial SVG oficial
│   ├── apple-touch-icon.png      # Icono para pantalla de inicio iOS (180x180)
│   ├── icon-192.png              # Icono PWA Android (192x192)
│   ├── icon-512.png              # Icono PWA Android (512x512)
│   ├── icon-maskable-512.png     # Icono adaptativo con safe zone
│   └── manifest.webmanifest      # Manifiesto PWA de instalación
│
├── src/
│   ├── shared/                   # 🌐 Capa transversal compartida
│   │   ├── api/                  # Clientes HTTP (client.js, publico.js, admin.js, auth.js)
│   │   └── constants/            # Parámetros globales y rutas (appConfig.js)
│   │
│   ├── mobile/                   # 📱 MÓDULO MÓVIL
│   │   ├── publico/              # Vista pública de clientes
│   │   │   ├── components/       # Header, SucursalesChips, NoticeBanner, SearchInput, MaterialCard, MaterialesStack
│   │   │   ├── hooks/            # useCatalogoPublico.js (auto-polling 30s, filtrado y actualización manual)
│   │   │   └── pages/            # CatalogoPublicoPage.jsx
│   │   └── admin/                # 🔒 Panel administrativo móvil
│   │       ├── components/       # AdminHeader, AdminDrawer
│   │       │   ├── Materiales/   # MaterialAdminItem, NuevoMaterialModal, EditarPreciosModal, ToggleActivoModal
│   │       │   ├── Sucursales/   # SucursalAdminItem, SucursalFormModal, EliminarSucursalModal
│   │       │   └── Historicos/   # HistoricoModuloView, HistoricoCard, HistoricoLineChart, CambiarLimiteModal
│   │       ├── hooks/            # useAdminAuth.js, useAdminData.js
│   │       └── pages/            # AdminLoginPage.jsx, AdminDashboardPage.jsx, AdminMobilePage.jsx
│   │
│   ├── pc/                       # 🖥️ MÓDULO PC / DESKTOP (Estación de Trabajo)
│   │   ├── README.md             # Documentación de la fase operativa (báscula, tickets, caja)
│   │   └── pages/                # PcDashboardPage.jsx
│   │
│   ├── routes/                   # 🚦 Enrutamiento principal
│   │   └── AppRouter.jsx         # Rutas '/', '/gAca26vd8', '/pc' y trampas honeypot
│   │
│   ├── index.css                 # Estilos globales, safe-areas y keyframes de animación nativa
│   ├── App.jsx                   # Orquestador raíz
│   └── main.jsx                  # Entrada React DOM
│
├── index.html                    # HTML con meta tags PWA y links de iconos
└── package.json                  # Dependencias y scripts
```

---

## 🚀 3. ¿Cómo levantar el Frontend en Desarrollo?

Desde la carpeta `frontend/`:

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar el servidor de desarrollo Vite
npm run dev
```

O desde la raíz del proyecto:
```bash
npm --prefix frontend run dev
```

El servidor estará disponible en: **[http://localhost:5173](http://localhost:5173)**.

* **Vista Pública:** [http://localhost:5173/](http://localhost:5173/)
* **Panel Administrativo:** [http://localhost:5173/gAca26vd8](http://localhost:5173/gAca26vd8)
* **Acceso Secreto (Easter Egg):** Pulsa 5 veces en **"Green Circle"** en la cabecera y luego pulsa **"Actualizar"** para entrar directamente al login administrativo sin escribir la URL.
* **Credenciales de Administrador:** Usuario: `admin` (o `admin@admin`) | Contraseña: `admin@admin` (o `admin`) — Administrador: **Vinicio Díaz**

---

## 📦 4. Compilación para Producción

Para compilar y empaquetar la aplicación:

```bash
npm --prefix frontend run build
```

Los artefactos optimizados se generarán en `frontend/dist/`, listos para ser servidos por Nginx, Cloudflare Pages o montados directamente como archivos estáticos en FastAPI.
