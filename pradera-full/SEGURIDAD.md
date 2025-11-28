# SIGEC - Documentación de Seguridad

## 1. AUTENTICACIÓN Y AUTORIZACIÓN

### 1.1 Control de Acceso Basado en Roles (RBAC)

El sistema implementa tres roles principales con permisos específicos:

#### Jefe de Proyecto
- ✅ Crear/modificar/visualizar proyectos
- ✅ Crear cuadrillas y asignar trabajadores
- ✅ Ver todos los trabajadores
- ✅ Ver reportes y métricas de todos los proyectos
- ✅ Gestionar comunicación
- ❌ No puede registrar bitácora (solo Líder)
- ❌ No puede modificar inventario directamente

#### Líder de Cuadrilla
- ✅ Ver proyectos asignados
- ✅ Registrar bitácora diaria
- ✅ Gestionar inventario de su proyecto
- ✅ Ver solo trabajadores de su cuadrilla
- ✅ Registrar tiempos y solicitudes
- ❌ No puede crear proyectos
- ❌ No puede ver reportes globales

#### Trabajador
- ✅ Ver proyectos asignados
- ✅ Ver tareas personales
- ✅ Enviar solicitudes
- ✅ Comunicarse con colegas
- ❌ No puede crear proyectos
- ❌ No puede ver bitácoras
- ❌ No puede crear cuadrillas

### 1.2 Autenticación de Usuarios

**Contraseñas:**
- Mínimo 8 caracteres
- Combinación de mayúsculas, minúsculas, números y símbolos
- Hash bcrypt con mínimo 10 rounds
- Cambio obligatorio cada 90 días

**Sesiones:**
- Tokens JWT con expiración de 8 horas de inactividad
- Almacenamiento en httpOnly cookies
- Renovación automática al realizar actividad

**Intentos de acceso:**
- Máximo 5 intentos fallidos consecutivos
- Bloqueo de 30 minutos después del quinto intento
- Desbloqueo manual por administrador

---

## 2. PROTECCIÓN DE DATOS

### 2.1 Datos en Tránsito
- ✅ HTTPS/TLS 1.3 obligatorio
- ✅ Certificado SSL válido y actualizado
- ✅ HSTS habilitado (max-age=31536000)
- ✅ Rechazo automático de conexiones HTTP

### 2.2 Datos en Reposo
- ✅ Contraseñas: Hash bcrypt con salt único
- ✅ Datos sensibles: Encriptación AES-256
- ✅ Backups automáticos diarios (30 días de retención)
- ✅ Encriptación de backups con clave separada

### 2.3 Validación y Sanitización

**Inputs:**
- Validación de tipos de datos
- Rangos válidos (ej. fechas futuras)
- Longitudes máximas
- Protección contra inyección SQL (queries parametrizadas)

**Outputs:**
- Escape de caracteres especiales en HTML
- Content Security Policy headers
- Protección contra XSS

**Archivos:**
- Whitelist de extensiones permitidas
- Verificación de magic numbers
- Límite de tamaño 10MB

### 2.4 Protección CSRF
- ✅ Tokens CSRF únicos por sesión
- ✅ Validación en operaciones de modificación
- ✅ SameSite cookies configuradas

---

## 3. AUDITORÍA Y TRAZABILIDAD

### 3.1 Registro de Actividades

| Tipo de Evento | Retención |
|---|---|
| Accesos al sistema | 12 meses |
| Operaciones críticas | 24 meses |
| Cambios en datos sensibles | 24 meses |
| Errores del sistema | 6 meses |
| Intentos no autorizados | 12 meses |

**Operaciones críticas registradas:**
- Creación/modificación/eliminación de proyectos
- Formación/modificación de cuadrillas
- Cambios en asignaciones de trabajadores
- Modificaciones de inventario
- Cambios de roles o permisos

### 3.2 Trazabilidad de Cambios

Cada entidad mantiene:
- Historial de modificaciones
- Quién realizó el cambio
- Cuándo se realizó
- Qué valores anteriores/nuevos

---

## 4. HEADERS DE SEGURIDAD HTTP

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Content-Security-Policy: default-src 'self'
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

---

## 5. RATE LIMITING

- Máximo 100 requests por minuto por IP
- Máximo 5 intentos de login por minuto
- Respuestas retrasadas progresivamente ante intentos repetidos

---

## 6. CUMPLIMIENTO NORMATIVO

### Ley de Protección de Datos Personales (Chile - Ley 19.628)

- ✅ Consentimiento explícito para recolección de datos
- ✅ Derecho de acceso a datos almacenados
- ✅ Derecho de rectificación de datos
- ✅ Derecho de cancelación (con excepciones legales)
- ✅ Finalidad específica (solo gestión de proyectos)
- ✅ Minimización de datos recolectados

---

## 7. PLAN DE RESPUESTA A INCIDENTES

| Fase | Acciones | Tiempo |
|---|---|---|
| Identificación | Detectar y clasificar severidad | Inmediato |
| Contención | Aislar sistemas, bloquear accesos | < 1 hora |
| Erradicación | Eliminar causa raíz | < 24 horas |
| Recuperación | Restaurar servicios | < 48 horas |
| Notificación | Informar a usuarios afectados | < 72 horas |
| Análisis post-mortem | Implementar mejoras | < 1 semana |

**Clasificación de severidad:**
- Crítico: Acceso no autorizado, sistema comprometido
- Alto: Vulnerabilidad explotable, pérdida parcial de datos
- Medio: Intento bloqueado, vulnerabilidad descubierta
- Bajo: Falsa alarma, problema menor

---

## 8. BUENAS PRÁCTICAS DE DESARROLLO

1. ✅ Defensa en profundidad: Múltiples capas de seguridad
2. ✅ Fail securely: Denegar por defecto
3. ✅ Least privilege: Mínimos permisos necesarios
4. ✅ Separation of duties: Diferentes personas para roles críticos
5. ✅ Never trust user input: Validar siempre
6. ✅ Keep it simple: Código simple = menos errores
7. ✅ Security by design: Considerar desde el inicio
8. ✅ Regular updates: Mantener dependencias actualizadas

