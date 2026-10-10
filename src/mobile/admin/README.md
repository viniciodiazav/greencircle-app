# 📱 Panel Administrativo Móvil (Green Circle Mobile Admin)

Módulo privado y exclusivo para la administración del centro de acopio y reciclaje **Green Circle** desde smartphones y tablets autorizados.

---

## 🔒 Acceso y Seguridad de Ruta

* **Ruta Secreta de Acceso:** `http://localhost:5173/gAca26vd8` (definida en `appConfig.js` como `ADMIN_SLUG = 'gAca26vd8'`).
* **Gesto Secreto de Entrada (Easter Egg):** En la aplicación pública de clientes, si un administrador pulsa **5 veces consecutivas** sobre el título **"Green Circle"** en la cabecera y acto seguido pulsa el botón **"Actualizar"**, el sistema lo redirige de inmediato al login de administración sin necesidad de teclear la URL manualmente. Incluye micro-vibración háptica de confirmación en móviles compatibles.
* **Honeypot / Redirección Silenciosa:** Cualquier intento de acceder o sondear rutas típicas como `/admin` o `/login` redirige automáticamente y sin mensajes a la vista pública de clientes (`/`), imposibilitando el descubrimiento por fuerza bruta.
* **Sesión Segura (JWT):** Inicio de sesión con credenciales de administrador (`usuario` y `password`), emitiendo un Bearer Token JWT almacenado en `sessionStorage` (`gc_token` y `gc_user`). Si el token expira o es inválido, redirige limpiamente a la pantalla de login privado.

---

## 🗂️ Módulos y Funcionalidades Implementadas

### 1. Menú de Navegación Lateral (`AdminDrawer.jsx`)
* Menú deslizable tipo cajón (drawer) accesible mediante el botón de hamburguesa en la cabecera.
* Muestra el perfil del administrador autenticado (`@admin`).
* Permite alternar instantáneamente entre los 4 módulos operativos activos sin recargar la página.
* Respeta áreas seguras de pantalla (`safe-area-inset-top` y `safe-area-inset-bottom`) y bloquea el desplazamiento del fondo mientras permanece abierto.
* Botón de cierre de sesión con limpieza inmediata del token.

---

### 2. Catálogo de Materiales (`MaterialAdminItem.jsx`, `NuevoMaterialModal.jsx`, `EditarPreciosModal.jsx`)
* **Listado de Materiales:** Tarjetas limpias con nombre, código algorítmico, precios de compra y venta vigentes (con punto decimal `$X.XX / kg`).
* **Switch Deslizable de Activación / Desactivación:**
  * Componente interactivo tipo interruptor deslizante iOS/Material (verde esmeralda activo / gris inactivo).
  * Diálogo modal de confirmación rápida (`ToggleActivoModal.jsx`) que valida que el material cuente con precios válidos antes de permitir su activación.
* **Alta de Material con Triple Validación de Seguridad (`NuevoMaterialModal.jsx`):**
  Dado que el nombre y código de un material son **100% inmutables** en la base de datos por integridad relacional, el formulario implementa 2 pasos y triple validación estricta:
  1. *Paso 1: Ficha técnica:* Captura de nombre, precio inicial de compra y precio inicial de venta (con `inputMode="decimal"`).
  2. *Paso 2: Triple Validación Obligatoria:*
     - Verificación 1: Ficha técnica y advertencia de inmutabilidad en base de datos.
     - Verificación 2: Tres casillas de verificación obligatorias (ortografía confirmada, comprensión de inmutabilidad y precios verificados).
     - Verificación 3: Confirmación por teclado escribiendo exactamente el nombre del material para desbloquear el botón de guardado.
  * Al crearse, el material nace automáticamente en estado inactivo hasta su aprobación.
* **Actualización de Precios Vigentes (`EditarPreciosModal.jsx`):**
  * Modificación de precio de compra y precio de venta.
  * Al guardarse, PostgreSQL audita el cambio cerrando el periodo anterior y creando una nueva tupla en el historial (SCD Tipo 2).

---

### 3. Gestión de Sucursales (`SucursalAdminItem.jsx`, `SucursalFormModal.jsx`, `EliminarSucursalModal.jsx`)
* Gestión integral de los centros de acopio físicos (nombre y enlace URL de Google Maps).
* Creación y edición con teclado optimizado (`inputMode="url"`).
* Eliminación física con confirmación explícita (única entidad del sistema con soporte para `DELETE`).

---

### 4. Auditoría e Histórico de Precios (`HistoricoModuloView.jsx`, `HistoricoLineChart.jsx`, `HistoricoCard.jsx`)
Módulos dedicados para **Historial de Precios de Compra** e **Historial de Precios de Venta**:
* **Carga Inicial Inteligente:** Presenta por defecto los últimos **10 registros** para optimizar el rendimiento y consumo de datos móviles.
* **Selector de Cantidad de Registros (`CambiarLimiteModal.jsx`):** Modal con accesos rápidos (10, 25, 50, 100) o número personalizado (hasta 500 registros) que consulta dinámicamente la API con `?limit=N`.
* **Búsqueda Reactiva:** Filtrado instantáneo por ID de auditoría (`1-2026`), código o nombre del material, con botón `✕` para limpiar la búsqueda.
* **Alternador de Visualización (Lista vs Gráfica de Líneas):**
  * **Modo Lista (`HistoricoCard.jsx`):** Tarjetas con ID fiscal consecutivo, código, nombre, precio asentado, badge de estado (`Vigente actual` vs `Cerrado`) y fechas exactas de inicio y fin de vigencia.
  * **Modo Gráfica de Líneas (`HistoricoLineChart.jsx`):**
    - Gráfica vectorial SVG interactiva y responsiva (sin librerías externas pesadas).
    - Cronología visual de izquierda a derecha (antiguo $\rightarrow$ reciente).
    - Tarjetas de resumen con **Precio Mínimo**, **Precio Máximo** y **Precio Vigente Actual**.
    - Filtro por material mediante píldoras horizontales cuando existen múltiples materiales en los registros.
    - Área sombreada bajo la curva con gradiente corporativo esmeralda.
    - Interacción táctil en móvil: al tocar cualquier punto, despliega una tarjeta flotante con el material, precio asentado, vigencia y fechas exactas de auditoría.
