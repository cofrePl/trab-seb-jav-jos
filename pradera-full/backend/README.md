# Pradera Backend

Instrucciones rápidas:

- Copiar `.env.example` a `.env` y configurar `DATABASE_URL` y `JWT_SECRET`.
- Instalar dependencias: `npm install`.
- Generar cliente Prisma: `npm run prisma:generate`.
- Ejecutar migración (Prisma): `npm run prisma:migrate`.
- Ejecutar seeder: `npm run prisma:seed`.
- Ejecutar en desarrollo: `npm run dev`.

Autenticación:
- `/api/auth/register` POST {name,email,password,role}
- `/api/auth/login` POST {email,password} -> devuelve `token`

Protección: usa el header `Authorization: Bearer <token>` para rutas privadas.
