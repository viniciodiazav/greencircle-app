# 🖥️ Módulo PC / Desktop (Green Circle Desktop & Operations)

Arquitectura reservada para la **fase operativa de escritorio** del centro de recolección y reciclaje Green Circle.

---

## 🎯 Propósito y Visión Arquitectónica

Mientras que la experiencia móvil está orientada a la consulta pública de clientes y la administración ágil desde smartphones, el módulo de PC está concebido para estaciones de trabajo fijas dentro del centro de acopio físico.

---

## 📋 Alcance y Funcionalidades Planificadas:

1. **Integración con Báscula Industrial / Camionera:**
   * Lectura en tiempo real del puerto serial / USB / TCP de la báscula de pesaje.
   * Registro automatizado de peso bruto, peso tara y peso neto de material acopiado.
2. **Generación e Impresión de Tickets de Entrega:**
   * Emisión instantánea de comprobantes de pesaje físicos para clientes y recolectores.
   * Detalle desglosado por material entregado, kilogramos netos y precio vigente calculado.
3. **Caja y Liquidación de Pagos:**
   * Módulo de arqueo de caja y emisión de pagos en efectivo o transferencia.
   * Conciliación automática entre peso neto recibido y efectivo liquidado.
4. **Control de Inventario Masivo y Salidas:**
   * Registro de fletes de venta (embarques de cartón compactado o material prensado).
   * Cálculo de mermas y balance de masa en bodega.
5. **Dashboard Analítico de Escritorio:**
   * Gráficas de volumen semanal/mensual, tendencias de precios de compra vs venta y margen operativo.

---

## 📍 Estado Actual

Actualmente el componente [`PcDashboardPage.jsx`](file:///home/lvdiazav/Documents/Projects/GreenCircleApp/frontend/src/pc/pages/PcDashboardPage.jsx) sirve como base y placeholder desacoplado accesible en la ruta `/pc`, permitiendo que el desarrollo del ecosistema móvil y la API backend continúen sin interferencias ni acoplamientos innecesarios.
