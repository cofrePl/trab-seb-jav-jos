# SIGEC - Sistema Integral de Gestión de Cuadrillas
## Documentación de Requerimientos

---

## 1. REQUERIMIENTOS FUNCIONALES (RF)

### Módulo: Gestión de Proyectos

| ID | Nombre | Descripción | Prioridad | Estado |
|----|----|-----------|-----------|--------|
| RF-001 | Registrar antecedentes del proyecto | El sistema debe permitir ingresar información completa del proyecto: nombre, tipo, complejidad, fechas de inicio y término, y características técnicas | Alta | ✅ Implementado |
| RF-002 | Seleccionar tipo de proyecto | El sistema debe permitir seleccionar el tipo de obra o edificación entre categorías predefinidas | Alta | ✅ Implementado |
| RF-003 | Ingresar características del proyecto | El sistema debe permitir ingresar múltiples características específicas del proyecto | Media | 🔄 Pendiente |
| RF-004 | Generar planificación del proyecto | El sistema debe generar automáticamente la planificación considerando fechas de inicio y término | Alta | 🔄 Pendiente |

### Módulo: Gestión de Trabajadores

| ID | Nombre | Descripción | Prioridad | Estado |
|----|----|-----------|-----------|--------|
| RF-005 | Buscar trabajadores por especialidad | El sistema debe permitir buscar trabajadores filtrando por especialidad técnica | Alta | ✅ Implementado |
| RF-006 | Consultar disponibilidad de trabajadores | El sistema debe permitir visualizar en tiempo real la disponibilidad de los trabajadores | Alta | ✅ Implementado |
| RF-007 | Buscar por certificaciones | El sistema debe permitir filtrar trabajadores por certificaciones vigentes | Media | 🔄 Pendiente |
| RF-008 | Visualizar experiencia laboral | El sistema debe mostrar la experiencia previa de los trabajadores | Media | 🔄 Pendiente |
| RF-009 | Registrar competencias y certificaciones | El sistema debe permitir registrar competencias o certificaciones de trabajadores | Media | 🔄 Pendiente |

### Módulo: Gestión de Cuadrillas

| ID | Nombre | Descripción | Prioridad | Estado |
|----|----|-----------|-----------|--------|
| RF-010 | Crear cuadrilla | El sistema debe permitir crear cuadrillas de trabajo con identificador único | Alta | ✅ Implementado |
| RF-011 | Definir roles dentro de la cuadrilla | El sistema debe permitir definir roles (líder, operario especializado, asistente, seguridad) | Alta | ✅ Implementado |
| RF-012 | Asignar trabajadores a cuadrilla | El sistema debe permitir asignar trabajadores según experiencia y competencias | Alta | ✅ Implementado |
| RF-013 | Designar trabajadores a roles específicos | El sistema debe permitir asignar trabajadores a roles específicos validando compatibilidad | Alta | ✅ Implementado |
| RF-014 | Asignar cuadrilla a proyecto | El sistema debe permitir vincular cuadrillas con proyectos específicos activos | Alta | ✅ Implementado |
| RF-015 | Definir zona de trabajo | El sistema debe permitir definir la zona o área de trabajo asignada a cada cuadrilla | Media | 🔄 Pendiente |
| RF-016 | Asignar tareas prioritarias | El sistema debe permitir asignar tareas prioritarias a los miembros de una cuadrilla | Alta | 🔄 Pendiente |
| RF-017 | Definir plazos y objetivos | El sistema debe permitir definir plazos y objetivos diarios o semanales por cuadrilla | Alta | 🔄 Pendiente |
| RF-018 | Modificar roles de trabajadores | El sistema debe permitir cambiar roles de trabajadores dentro de una cuadrilla activa | Alta | 🔄 Pendiente |
| RF-019 | Transferir trabajadores entre cuadrillas | El sistema debe permitir transferir trabajadores entre cuadrillas | Alta | 🔄 Pendiente |
| RF-020 | Asignar trabajadores adicionales | El sistema debe permitir asignar trabajadores adicionales a cuadrillas cuando se requiera | Media | 🔄 Pendiente |
| RF-021 | Cambiar estado de trabajadores | El sistema debe permitir actualizar el estado de disponibilidad de los trabajadores | Alta | 🔄 Pendiente |
| RF-022 | Notificar cambios de cuadrilla | El sistema debe notificar automáticamente sobre cambios en cuadrillas | Alta | 🔄 Pendiente |

### Módulo: Comunicación

| ID | Nombre | Descripción | Prioridad | Estado |
|----|----|-----------|-----------|--------|
| RF-023 | Enviar mensajes grupales e individuales | El sistema debe permitir enviar mensajes a grupos de usuarios o individuales | Media | 🔄 Pendiente |
| RF-024 | Recepcionar solicitudes de trabajadores | El sistema debe permitir recibir solicitudes enviadas por trabajadores | Alta | 🔄 Pendiente |
| RF-025 | Recibir avisos de incidentes | El sistema debe permitir recibir notificaciones de incidentes reportados | Alta | 🔄 Pendiente |

### Módulo: Seguimiento y Reportes

| ID | Nombre | Descripción | Prioridad | Estado |
|----|----|-----------|-----------|--------|
| RF-026 | Visualizar avance en línea de tiempo | El sistema debe mostrar el avance del proyecto en línea de tiempo visual | Alta | 🔄 Pendiente |
| RF-027 | Revisar incidentes presentados | El sistema debe permitir revisar el historial de incidentes reportados | Alta | 🔄 Pendiente |
| RF-028 | Ver porcentaje de avance | El sistema debe calcular y mostrar el porcentaje de avance del proyecto | Alta | 🔄 Pendiente |

### Módulo: Bitácora

| ID | Nombre | Descripción | Prioridad | Estado |
|----|----|-----------|-----------|--------|
| RF-029 | Crear bitácora de proyecto | El sistema debe permitir crear registros de bitácora diarios | Alta | 🔄 Pendiente |
| RF-030 | Registrar tareas desarrolladas | El sistema debe permitir registrar tareas con su estado actual | Alta | 🔄 Pendiente |
| RF-031 | Registrar incidentes | El sistema debe permitir registrar incidentes con descripción y severidad | Alta | 🔄 Pendiente |
| RF-032 | Registrar consumo de materiales | El sistema debe permitir registrar el consumo de materiales utilizado | Alta | 🔄 Pendiente |
| RF-033 | Registrar tiempos de trabajo | El sistema debe permitir registrar los tiempos de trabajo individuales | Media | 🔄 Pendiente |
| RF-034 | Registrar observaciones sobre trabajadores | El sistema debe permitir ingresar observaciones sobre desempeño | Media | 🔄 Pendiente |
| RF-035 | Registrar estado de tareas y herramientas | El sistema debe permitir registrar estado de tareas, herramientas y materiales | Media | 🔄 Pendiente |

### Módulo: Gestión de Inventario

| ID | Nombre | Descripción | Prioridad | Estado |
|----|----|-----------|-----------|--------|
| RF-036 | Buscar materiales en inventario | El sistema debe permitir buscar materiales disponibles en inventario | Alta | ✅ Implementado |
| RF-037 | Mostrar stock de materiales | El sistema debe mostrar el stock actual con alertas visuales | Alta | ✅ Implementado |
| RF-038 | Solicitar materiales con bajo stock | El sistema debe permitir generar solicitudes de reposición | Alta | 🔄 Pendiente |
| RF-039 | Registrar ingresos y salidas de materiales | El sistema debe registrar movimientos de inventario | Alta | 🔄 Pendiente |

### Módulo: Vistas de Trabajador

| ID | Nombre | Descripción | Prioridad | Estado |
|----|----|-----------|-----------|--------|
| RF-040 | Visualizar proyectos asignados | El sistema debe mostrar proyectos en los que está asignado el trabajador | Alta | 🔄 Pendiente |
| RF-041 | Visualizar tareas asignadas | El sistema debe mostrar tareas asignadas con descripción y prioridad | Alta | 🔄 Pendiente |
| RF-042 | Visualizar tiempo asignado a tareas | El sistema debe mostrar tiempo estimado para cada tarea | Media | 🔄 Pendiente |
| RF-043 | Visualizar avance personal | El sistema debe permitir al trabajador visualizar su avance personal | Alta | 🔄 Pendiente |
| RF-044 | Enviar solicitudes de trabajo | El sistema debe permitir al trabajador enviar solicitudes formales | Media | 🔄 Pendiente |
| RF-045 | Comunicarse con colegas | El sistema debe permitir comunicación entre trabajadores del mismo proyecto | Media | 🔄 Pendiente |

---

## 2. REQUERIMIENTOS NO FUNCIONALES (RNF)

### Usabilidad

| ID | Nombre | Descripción | Prioridad |
|----|--------|-----------|-----------|
| RNF-001 | Interfaz comprensible | Interfaz intuitiva sin requerir capacitación extensa | Alta |
| RNF-002 | Navegación intuitiva | Máximo 3 clics para funciones frecuentes | Alta |
| RNF-012 | Diseño responsivo | Adaptable a desktop, tablet y smartphone | Alta |
| RNF-017 | Accesibilidad | Cumplimiento de estándares WCAG 2.1 nivel AA | Media |

### Seguridad

| ID | Nombre | Descripción | Prioridad |
|----|--------|-----------|-----------|
| RNF-003 | Control de acceso por rol | Implementar RBAC (Jefe, Líder, Trabajador) | Alta |
| RNF-004 | Seguridad de acceso | Autenticación obligatoria con tokens JWT | Alta |
| RNF-014 | Cifrado de datos sensibles | Contraseñas con bcrypt, datos con AES-256 | Alta |
| RNF-015 | Comunicación segura | HTTPS/TLS 1.3 obligatorio | Alta |

### Calidad de Datos

| ID | Nombre | Descripción | Prioridad |
|----|--------|-----------|-----------|
| RNF-005 | Validación de datos | Validar obligatorios y formatos correctos | Alta |
| RNF-006 | Prevención de inconsistencias | Evitar asignaciones duplicadas de trabajadores | Alta |

### Rendimiento y Disponibilidad

| ID | Nombre | Descripción | Prioridad |
|----|--------|-----------|-----------|
| RNF-007 | Persistencia de datos | Base de datos con respaldos automáticos | Alta |
| RNF-009 | Tiempo de respuesta | < 2 segundos por operación común | Alta |
| RNF-010 | Capacidad concurrente | Mínimo 50 usuarios simultáneos | Media |
| RNF-013 | Disponibilidad del sistema | 99% uptime durante horario laboral | Media |

### Portabilidad

| ID | Nombre | Descripción | Prioridad |
|----|--------|-----------|-----------|
| RNF-011 | Compatibilidad navegadores | Chrome, Firefox, Safari, Edge | Alta |

### Auditoría

| ID | Nombre | Descripción | Prioridad |
|----|--------|-----------|-----------|
| RNF-016 | Registro de auditoría | Log de operaciones críticas | Media |

---

## 3. HISTORIAS DE USUARIO

### HU001: Crear y Planificar Proyectos
**Como** Jefe de Proyecto  
**Quiero** registrar información completa de un nuevo proyecto  
**Para que** el sistema genere automáticamente la planificación y se visualice el avance

**Criterios de Aceptación:**
- ✅ Puedo ingresar nombre, tipo, complejidad, fechas
- ✅ El sistema valida que la fecha de término sea posterior a la de inicio
- ✅ Se genera automáticamente una línea de tiempo con hitos
- ✅ El proyecto aparece en mi listado de proyectos activos

### HU002: Buscar Trabajadores Adecuados
**Como** Jefe de Proyecto  
**Quiero** buscar trabajadores por especialidad, certificaciones y disponibilidad  
**Para que** pueda asignarlos correctamente a cuadrillas según requisitos del proyecto

**Criterios de Aceptación:**
- ✅ Puedo filtrar por especialidad
- ✅ Puedo filtrar por certificaciones vigentes
- ✅ Veo disponibilidad actual (disponible, asignado, en licencia)
- ✅ Veo historial de proyectos anteriores y calificaciones

### HU003: Formar Cuadrillas Balanceadas
**Como** Jefe de Proyecto  
**Quiero** crear cuadrillas asignando trabajadores con roles específicos  
**Para que** garantizar un equipo balanceado y competente

**Criterios de Aceptación:**
- ✅ Puedo crear una cuadrilla con un líder obligatorio
- ✅ Puedo asignar roles específicos (líder, operarios, especialistas, seguridad)
- ✅ El sistema valida que cada rol tenga las competencias necesarias
- ✅ La cuadrilla se vincula automáticamente al proyecto

### HU004: Actualizar Cuadrillas Dinámicamente
**Como** Jefe de Proyecto  
**Quiero** reasignar trabajadores, cambiar roles y transferir entre cuadrillas  
**Para que** adaptar el equipo ante situaciones imprevistas

**Criterios de Aceptación:**
- ✅ Puedo cambiar roles de trabajadores sin disolver la cuadrilla
- ✅ Puedo transferir trabajadores entre cuadrillas
- ✅ Todos los afectados son notificados automáticamente
- ✅ Se registra en auditoría el motivo del cambio

### HU005: Comunicación Integral
**Como** Jefe de Proyecto / Líder de Cuadrilla  
**Quiero** un sistema de mensajería y notificaciones centralizado  
**Para que** coordinar equipos y resolver incidentes rápidamente

**Criterios de Aceptación:**
- ✅ Puedo enviar mensajes individuales y grupales
- ✅ Recibo notificaciones de incidentes reportados
- ✅ Recibo solicitudes de materiales de trabajadores
- ✅ Las notificaciones automáticas se envían ante cambios críticos

### HU006: Monitorear Avance de Proyectos
**Como** Jefe de Proyecto  
**Quiero** visualizar el avance mediante líneas de tiempo, porcentajes y reportes  
**Para que** tomar decisiones informadas sobre el estado de los proyectos

**Criterios de Aceptación:**
- ✅ Veo una línea de tiempo con hitos del proyecto
- ✅ Veo el porcentaje de avance general calculado automáticamente
- ✅ Puedo revisar el historial de incidentes por proyecto
- ✅ Puedo descargar reportes en PDF/Excel

### HU007: Registrar Bitácora Diaria
**Como** Líder de Cuadrilla  
**Quiero** registrar diariamente actividades, tiempos, incidentes y materiales consumidos  
**Para que** mantener trazabilidad completa y facilitar reportes

**Criterios de Aceptación:**
- ✅ Puedo registrar tareas desarrolladas con su estado
- ✅ Puedo reportar incidentes con severidad
- ✅ Puedo registrar consumo de materiales
- ✅ Puedo registrar tiempos de trabajo por trabajador
- ✅ Puedo guardar como borrador y completar después

### HU008: Gestionar Inventario
**Como** Líder de Cuadrilla / Jefe de Proyecto  
**Quiero** controlar stock de materiales y solicitar reposiciones  
**Para que** garantizar disponibilidad de recursos sin paros de obra

**Criterios de Aceptación:**
- ✅ Veo stock actual de materiales con alertas visuales
- ✅ Puedo solicitar reposición cuando stock es bajo
- ✅ Se registra automáticamente entrada/salida de materiales
- ✅ Recibo alerta cuando stock alcanza nivel crítico

### HU009: Visualizar Mis Proyectos y Tareas
**Como** Trabajador  
**Quiero** ver los proyectos en los que estoy asignado y mis tareas del día  
**Para que** entender mis responsabilidades y cómo contribuyo al proyecto

**Criterios de Aceptación:**
- ✅ Veo listado de proyectos asignados
- ✅ Veo tareas diarias con prioridad y descripción
- ✅ Veo tiempo estimado para cada tarea
- ✅ Veo mi avance personal en el proyecto

### HU010: Comunicar Necesidades
**Como** Trabajador  
**Quiero** enviar solicitudes de materiales, herramientas, apoyo o permisos personales  
**Para que** el lider de cuadrilla pueda gestionar mis necesidades

**Criterios de Aceptación:**
- ✅ Puedo crear solicitud especificando tipo y urgencia
- ✅ Recibo notificación cuando la solicitud es respondida
- ✅ Puedo ver el estado de mis solicitudes anteriores

