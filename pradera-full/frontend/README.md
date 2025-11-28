# Pradera Frontend

Instrucciones rápidas:

- Copiar `VITE_API_URL` en `.env` si el backend corre en otra URL (por ejemplo `VITE_API_URL=http://localhost:4000/api`).
- Instalar dependencias: `npm install`.
- Ejecutar en desarrollo: `npm run dev`.

Notas:
- El `AuthContext` guarda token en `localStorage` y añade `Authorization: Bearer <token>` automáticamente al cliente `axios`.
