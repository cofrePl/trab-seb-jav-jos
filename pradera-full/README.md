# Pradera Full — Instrucciones y arquitectura

Este repositorio contiene un scaffold completo para **pradera-full** con frontend (React + TypeScript + Tailwind) y backend (Node.js + Express + TypeScript) usando **PostgreSQL** con **Prisma** como ORM.

Contenido importante:
- `backend/` — API con autenticación JWT, Prisma schema y seeder.
- `frontend/` — SPA React con AuthContext, rutas y componentes mínimos.

Flujo de autenticación (resumen):
- El usuario se registra o el administrador inicial es creado por el seeder (`prisma/seed.ts`).
- `POST /api/auth/login` recibe `{ email, password }`.
- Si las credenciales son válidas, el backend devuelve `{ token, user }`.
- El frontend almacena el `token` en `localStorage` y añade el header `Authorization: Bearer <token>` en todas las peticiones mediante `axios`.
- Rutas privadas en backend deben validar el token con el middleware `ensureAuth` (ya incluido en `src/middleware/auth.ts`).

Relación de roles y permisos (modelo y concepto):
- `ADMIN`: acceso completo a todas las operaciones (crear/editar/eliminar usuarios, proyectos, materiales, solicitudes, etc.).
- `JEFE_PROYECTO`: puede crear y administrar `Cuadrillas` dentro de su proyecto/s; permisos clave:
  - Crear cuadrilla
  - Seleccionar trabajadores
  - Definir roles por trabajador dentro de la cuadrilla (líder / operario especializado / asistente / seguridad)
  - Asignar cuadrilla a un `Project`
  - Cambiar roles y reasignar trabajadores entre cuadrillas
  - Cambiar estado de un trabajador (activo/suspendido/reasignado)
  - Notificar (esto es funcionalidad a implementar: el backend proporciona los endpoints para actualizar estados y el frontend debe emitir notificaciones a los afectados)
- `LIDER_CUADRILLA`: lidera la cuadrilla, puede actualizar bitácoras (logs) y reportar consumos/incidentes.
- `TRABAJADOR`: acceso mínimo para ver sus asignaciones, reporte de partes y ver solicitudes de materiales.

Cómo se modela en la base de datos (Prisma):
- `User` - tabla de usuarios con `role` (enum Role).
- `Project` - proyectos con FK `jefeId` apuntando a `User`.
- `Worker` - datos de trabajadores (persona física, equivalente a "mascota" en tu analogía).
- `Crew` - cuadrillas, FK a `Project`.
- `CrewWorker` - tabla pivote entre `Crew` y `Worker` con `role` (rol dentro de la cuadrilla) y `fecha_asignacion`.
- `Log` - bitácoras con referencia a `Crew`, `Project` y `responsable` (User que registró la entrada).
- `Material` - inventario.
- `MaterialRequest` - solicitudes con estados `PENDIENTE`, `ASIGNADO`, `AGOTADO`, `COMPLETADO`.

Setup rápido (backend):
1. Ir a `backend/`.
2. Copiar `.env.example` a `.env` y configurar `DATABASE_URL` y `JWT_SECRET`.
3. `npm install`.
4. `npx prisma generate` o `npm run prisma:generate`.
5. `npm run prisma:migrate` para crear tablas (Prisma te pedirá confirmar).
6. `npm run prisma:seed` para crear administrador inicial.
7. `npm run dev` para iniciar el servidor en `PORT`.

Setup rápido (frontend):
1. Ir a `frontend/`.
2. `npm install`.
3. (Opcional) crear `.env` con `VITE_API_URL=http://localhost:4000/api`.
4. `npm run dev`.

Endpoints base:
- `POST /api/auth/register` — crear usuario (Admin debería crear otros usuarios en producción).
- `POST /api/auth/login` — login -> devuelve token.

Notas finales y próximos pasos sugeridos:
- Implementar endpoints y controladores adicionales (projects, crews, workers, materials, materialRequests, logs). He incluido el Prisma schema completo y la base para controllers/routes; puedes expandir cada controlador siguiendo el patrón de `authController`.
- Añadir validaciones más robustas, manejo de roles (middleware para autorizar por rol), tests y UI para las operaciones solicitadas.
