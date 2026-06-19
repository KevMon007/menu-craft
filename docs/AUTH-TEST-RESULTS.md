# Resultados de Pruebas de Autenticación — Postman

**Proyecto:** MenuCraft SaaS  
**Tester:** Kevin  
**Fecha:** Junio 2026  
**Objetivo:** Validar los endpoints de autenticación (`POST /api/auth/register` y `POST /api/auth/login`).

---

## Configuración Previa

- **URL base:** `http://localhost:3000`
- **Content-Type:** `application/json`
- **Entorno Postman:** `MenuCraft MVP`

---

## Casos de Prueba

### TC-01: Register con datos válidos

| Campo | Valor |
|-------|-------|
| **Endpoint** | `POST /api/auth/register` |
| **Cuerpo** | `{ "nombre_restaurante": "Tacos El Kevin", "slug": "tacos-el-kevin", "nombre_usuario": "Kevin", "email": "kevin@tacos.com", "password": "Pass1234" }` |

**Resultado esperado:**
- Status: `201 Created`
- Cuerpo: `{ "message": "Restaurante y administrador creados exitosamente", "slug": "tacos-el-kevin" }`

**Resultado real:** (Kevin llena aquí después de probar)

```
Status:
Response body:
```

**¿Pasa?** [ ] Sí [ ] No

---

### TC-02: Register con email duplicado

| Campo | Valor |
|-------|-------|
| **Endpoint** | `POST /api/auth/register` |
| **Cuerpo** | `{ "nombre_restaurante": "Otro Restaurante", "slug": "otro-slug", "nombre_usuario": "Admin", "email": "kevin@tacos.com", "password": "Pass1234" }` |

*Nota: mismo email que TC-01.*

**Resultado esperado:**
- Status: `409 Conflict`
- Cuerpo: `{ "error": "El email ya está registrado" }`

**Resultado real:** (Kevin llena aquí después de probar)

```
Status:
Response body:
```

**¿Pasa?** [ ] Sí [ ] No

---

### TC-03: Login correcto

| Campo | Valor |
|-------|-------|
| **Endpoint** | `POST /api/auth/login` |
| **Cuerpo** | `{ "email": "kevin@tacos.com", "password": "Pass1234" }` |

**Resultado esperado:**
- Status: `200 OK`
- Cuerpo: `{ "message": "Login exitoso", "usuario": { "id": <número>, "nombre": "Kevin", "email": "kevin@tacos.com", "rol": "admin", "restaurante_id": <número>, "nombre_restaurante": "Tacos El Kevin", "slug": "tacos-el-kevin" } }`
- Cookie `token` httpVisible establecida

**Resultado real:** (Kevin llena aquí después de probar)

```
Status:
Response body:
Cookie presente?   [ ] Sí [ ] No
```

**¿Pasa?** [ ] Sí [ ] No

---

### TC-04: Login con contraseña incorrecta

| Campo | Valor |
|-------|-------|
| **Endpoint** | `POST /api/auth/login` |
| **Cuerpo** | `{ "email": "kevin@tacos.com", "password": "WrongPassword99" }` |

**Resultado esperado:**
- Status: `401 Unauthorized`
- Cuerpo: `{ "error": "Credenciales inválidas" }`

**Resultado real:** (Kevin llena aquí después de probar)

```
Status:
Response body:
```

**¿Pasa?** [ ] Sí [ ] No

---

## Resumen

| TC | Descripción | Status Esperado | Status Real | ¿Pasa? |
|----|------------|----------------|-------------|--------|
| 01 | Register con datos válidos | 201 | | |
| 02 | Register con email duplicado | 409 | | |
| 03 | Login correcto | 200 | | |
| 04 | Login con contraseña incorrecta | 401 | | |

**Observaciones adicionales:** (Kevin escribe aquí cualquier nota relevante)

---

*Documento generado el —.*
