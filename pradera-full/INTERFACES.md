# SIGEC - Identificación de Interfaz

## 1. PRINCIPIOS DE DISEÑO

- ✅ Diseño Responsivo: Desktop, tablet, smartphone
- ✅ Consistencia Visual: Paleta de colores uniforme
- ✅ Jerarquía Clara: Elementos importantes destacados
- ✅ Feedback Inmediato: Confirmaciones visuales
- ✅ Accesibilidad: WCAG 2.1 AA
- ✅ Regla de 3 clics: Funciones principales accesibles rápidamente

---

## 2. PALETA DE COLORES

| Color | Hex | Uso |
|---|---|---|
| Azul Corporativo | #2563EB | Botones principales, headers |
| Verde Éxito | #10B981 | Acciones positivas, completadas |
| Rojo Alerta | #EF4444 | Errores, eliminaciones |
| Amarillo Advertencia | #F59E0B | Advertencias, pendientes |
| Fondo Principal | #FFFFFF | Fondos de contenido |
| Fondo Secundario | #F3F4F6 | Sidebar, áreas alternas |
| Texto Principal | #111827 | Contenido textual |
| Texto Secundario | #6B7280 | Subtítulos, ayuda |

---

## 3. TIPOGRAFÍA

- **Títulos principales (H1):** 32px, bold
- **Subtítulos (H2):** 24px, semibold
- **Títulos de sección (H3):** 20px, semibold
- **Texto normal:** 16px, regular
- **Texto pequeño:** 14px, regular
- **Botones:** 16px, medium

---

## 4. INTERFACES POR ROL

### 4.1 Dashboard Jefe de Proyecto

**Componentes principales:**
- Tarjetas de resumen (Proyectos Activos, Trabajadores Disponibles, Cuadrillas en Obra, Alertas)
- Gráfico de avance de proyectos
- Lista de proyectos recientes con avance
- Sección de alertas y notificaciones

**Navegación:**
- Dashboard → Proyectos → Trabajadores → Cuadrillas → Reportes → Mensajes

### 4.2 Dashboard Líder de Cuadrilla

**Componentes principales:**
- Mi Cuadrilla (6 trabajadores)
- Tareas del Día (8 tareas)
- Materiales en Alerta (2 materiales)
- Calendario semanal de objetivos
- Accesos rápidos: "Registrar Bitácora", "Ver Inventario", "Reportar Incidente"

**Navegación:**
- Dashboard → Bitácora → Inventario → Tareas → Comunicación

### 4.3 Dashboard Trabajador

**Componentes principales:**
- Mis Proyectos (proyectos asignados)
- Mis Tareas (tareas del día)
- Mi Cuadrilla (compañeros de equipo)
- Registro de Tiempo
- Mis Solicitudes

**Navegación:**
- Dashboard → Mis Proyectos → Mis Tareas → Comunicación

---

## 5. PANTALLAS CLAVE

### 5.1 Gestión de Proyectos
- Lista con tabla: Nombre, Tipo, Complejidad, Fechas, Avance, Acciones
- Botón "+ Nuevo Proyecto" (azul, destacado)
- Modal de creación con campos: Nombre, Tipo, Complejidad, Fechas, Características

### 5.2 Búsqueda de Trabajadores
- Barra de búsqueda
- Filtros: Especialidad, Certificaciones, Disponibilidad
- Grid de tarjetas con Foto, Nombre, Especialidad, Certificaciones, Disponibilidad

### 5.3 Formación de Cuadrillas
- Panel izquierdo: Lista de trabajadores disponibles (40%)
- Panel derecho: Asignación de roles, zonas, tareas (60%)
- Drag-and-drop entre paneles
- Indicadores visuales de "Balance de Habilidades"

### 5.4 Bitácora Diaria
- Secciones expandibles:
  1. Información General (fecha, clima, observaciones)
  2. Tareas Desarrolladas (lista con estado y progreso)
  3. Incidentes (agregar incidentes con severidad)
  4. Consumo de Materiales (tabla de materiales)
  5. Tiempos de Trabajo (tabla de trabajadores)
  6. Observaciones sobre Trabajadores (notas de desempeño)
  7. Estado de Herramientas (tabla de estado)
- Botones: "Guardar Borrador", "Guardar y Cerrar"

### 5.5 Gestión de Inventario
- Pestaña "Stock Actual": Tabla con Material, Stock, Indicador Visual, Acciones
- Pestaña "Solicitar Materiales": Formulario con Material, Cantidad, Justificación
- Pestaña "Historial": Tabla con Fecha, Material, Tipo, Cantidad, Motivo

### 5.6 Registro de Tiempo
- Pestañas: Día, Semana, Mes
- Tabla con Trabajador, Horas Trabajadas, Tipo de Horas
- Totales por día/semana/mes

### 5.7 Comunicación
- Sidebar izquierdo: Conversaciones (30%)
- Área principal: Chat (70%)
- Pestañas: Mensajes, Solicitudes, Incidentes

---

## 6. COMPONENTES COMUNES

### 6.1 Barra de Navegación Superior
- Logo (izquierda, clickeable al Dashboard)
- Título de sección (centro)
- Icono de notificaciones con badge (derecha)
- Avatar de usuario con menú (derecha)

### 6.2 Menú Lateral (Desktop)
- Iconos descriptivos con labels
- Indicador de sección activa
- Colapsable

### 6.3 Formularios
- Label arriba del campo
- Placeholder con ejemplo
- Borde gris, focus en azul
- Mensaje de error en rojo
- Icono de validación (check o X)

### 6.4 Tablas
- Headers fijos
- Filas alternadas (gris muy claro)
- Hover (azul muy claro)
- Acciones por fila (Ver, Editar, Eliminar)
- Paginación y ordenamiento

### 6.5 Modales
- Overlay oscuro
- Modal centrado con fade-in
- Header con título y X
- Footer con botones
- Cierre por Escape o clic fuera

### 6.6 Notificaciones Toast
- Posición: Esquina superior derecha
- Tipos: Éxito (verde), Error (rojo), Advertencia (amarillo), Info (azul)
- Auto-dismiss: 5 segundos

### 6.7 Badges
- Estados: Verde (Completado), Amarillo (Pendiente), Rojo (Crítico)
- Forma: Redondeada

### 6.8 Iconos
- Lucide Icons (outline style)
- Tamaños: 16px, 20px, 24px
- Uso consistente

---

## 7. FLUJOS DE NAVEGACIÓN

### Jefe de Proyecto
```
Dashboard → Proyectos → Crear Proyecto
                     ├→ Ver Proyecto → Ver Cuadrillas
                     ├→ Buscar Trabajadores → Asignar a Cuadrilla
                     └→ Ver Reportes

         → Trabajadores → Buscar → Ver Perfil

         → Comunicación → Mensajes / Solicitudes / Incidentes
```

### Líder de Cuadrilla
```
Dashboard → Bitácora → Registrar/Ver Entradas

         → Inventario → Stock Actual / Solicitar / Historial

         → Tareas → Tablero Kanban / Editar

         → Comunicación → Mensajes / Solicitudes
```

### Trabajador
```
Dashboard → Mis Proyectos → Ver Detalles → Mi Cuadrilla

         → Mis Tareas → Ver Detalles

         → Registro de Tiempo → Día/Semana/Mes

         → Comunicación → Mensajes / Enviar Solicitud
```

---

## 8. RESPONSIVIDAD

| Dispositivo | Rango | Cambios |
|---|---|---|
| Desktop | > 1024px | Layout completo con sidebar |
| Tablet | 768-1024px | Sidebar colapsable |
| Mobile | < 768px | Menú hamburguesa, vertical |

---

## 9. ACCESIBILIDAD

- ✅ Contraste mínimo 4.5:1
- ✅ Alt text en imágenes
- ✅ Labels asociados a inputs
- ✅ Aria labels en elementos sin texto
- ✅ Focus visible en navegación por teclado
- ✅ Tab order lógico

---

## 10. TRANSICIONES Y ANIMACIONES

- Fade-in: 300ms (modales, toasts)
- Slide: 300ms (menús, paneles)
- Hover: 150ms (botones, links)
- Loading spinners: Animación continua

