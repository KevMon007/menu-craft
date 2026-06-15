# Plan de Pruebas - MVP MenuCraft SaaS

## Documento de Estrategia de Testing

**Proyecto:** MenuCraft SaaS  
**Versión:** MVP  
**Fecha:** Junio 2026  
**Objetivo:** Validar que un restaurante pueda registrarse, crear su menú digital y que los comensales accedan a través de QR.

---

## 1. Alcance de las Pruebas

### Funcionalidades a Probar

#### 1.1 Backend - Autenticación (JWT)
- Registro de nuevo restaurante (POST `/api/auth/register`)
- Inicio de sesión con credenciales válidas (POST `/api/auth/login`)
- Rechazo de login con credenciales inválidas
- Token JWT válido y con expiración correcta
- Protección de rutas privadas (middleware de autenticación)

#### 1.2 Backend - Gestión de Platillos (Admin)
- Crear nuevo platillo (POST `/api/products`)
- Editar platillo existente (PUT `/api/products/:id`)
- Cambiar disponibilidad de platillo a "Agotado" (PUT `/api/products/:id`)
- Cambiar disponibilidad de platillo a "Disponible" (PUT `/api/products/:id`)
- Eliminar platillo (DELETE `/api/products/:id`)
- Validación de datos: precio positivo, campos obligatorios no vacíos

#### 1.3 Backend - Vista Pública del Menú
- Obtener menú completo por restaurante (GET `/api/menu/:restaurant_id`)
- Menú organizado por categorías
- Platillos mostrados reflejan estado actual de disponibilidad
- Acceso sin autenticación (público)

#### 1.4 Frontend - Panel de Administración
- Interfaz de registro de restaurante
- Interfaz de login de restaurante
- Formulario de creación de platillo (nombre, descripción, precio, foto, categoría)
- Tabla/lista de platillos existentes
- Botón de edición de platillo
- Switch de disponibilidad "Disponible/Agotado"
- Botón de eliminación de platillo
- Confirmación antes de eliminar

#### 1.5 Frontend - Vista del Menú QR (Comensal)
- Responsividad en dispositivos móviles
- Carga rápida del menú
- Platillos organizados por categorías
- Visualización clara de platillos agotados
- Interfaz limpia e intuitiva
- Generación de código QR funcional
- Código QR apunta a URL correcta

#### 1.6 Seguridad
- Validación de entrada (Zod o validadores nativos)
- Prevención de inyección de datos
- JWT válido requerido para acciones privadas
- No se puede acceder a platillos de otro restaurante desde el panel admin

---

## 2. Estrategia de Testing

### 2.1 Pruebas de API (Backend)

**Herramienta:** Postman

**Casos de Prueba:**

| Endpoint | Método | Caso de Éxito | Caso de Error | Responsable |
|----------|--------|---------------|---------------|------------|
| `/api/auth/register` | POST | Restaurante creado con datos válidos | Email duplicado, datos incompletos | Backend Dev |
| `/api/auth/login` | POST | JWT generado correctamente | Credenciales inválidas | Backend Dev |
| `/api/products` | POST | Platillo creado | Precio inválido, campos vacíos, sin JWT | Backend Dev |
| `/api/products/:id` | PUT | Platillo actualizado | ID inexistente, datos inválidos | Backend Dev |
| `/api/products/:id` | DELETE | Platillo eliminado | ID inexistente, sin JWT | Backend Dev |
| `/api/menu/:restaurant_id` | GET | Menú retornado con categorías | Restaurant ID inválido | Backend Dev |

**Colección Postman a crear:**
```
MenuCraft MVP Tests/
├── Auth/
│   ├── Register - Success
│   ├── Register - Duplicate Email
│   ├── Login - Success
│   └── Login - Invalid Credentials
├── Products Admin/
│   ├── Create Product - Success
│   ├── Create Product - Invalid Price
│   ├── Update Product Availability
│   ├── Delete Product
│   └── Edit Product
└── Public Menu/
    ├── Get Menu by Restaurant - Success
    └── Get Menu - Invalid Restaurant ID
```

---

### 2.2 Pruebas de UX/UI - Panel Admin

**Herramienta:** Testing Manual + Navegadores (Chrome, Firefox)

**Navegadores Testeados:** Chrome (última versión), Firefox (última versión)

**Casos de Prueba:**

| Funcionalidad | QA Tester | Criterio de Aceptación |
|---------------|-----------|----------------------|
| Flujo de Registro | QA | Formulario accesible, validación de email, redirección a login |
| Flujo de Login | QA | Token guardado, redirección a dashboard |
| Crear Platillo | QA | Formulario valida campos, foto se sube, platillo aparece en tabla |
| Editar Platillo | QA | Datos prellenados, cambios se guardan, tabla se actualiza |
| Switch Disponibilidad | QA | Cambio inmediato, visual claro (Disponible/Agotado) |
| Eliminar Platillo | QA | Confirmación de eliminación, platillo desaparece de tabla |
| Organización por Categorías | QA | Categorías creadas correctamente, platillos agrupados |
| Responsividad | QA | Interfaz funciona en pantalla de 1366x768px (desktop estándar) |

---

### 2.3 Pruebas de UX/UI - Menú QR (Comensal)

**Herramienta:** Testing Manual en dispositivo móvil real

**Dispositivos a Probar:**
- iPhone (último modelo disponible) - Safari
- Dispositivo Android - Chrome

**Casos de Prueba:**

| Funcionalidad | QA Tester | Criterio de Aceptación |
|---------------|-----------|----------------------|
| Escaneo de Código QR | QA | Código QR legible, abre menú correcto |
| Acceso a URL directa | QA | URL `menucraft.com/menu/:id` carga menú correctamente |
| Carga de Página | QA | Menú carga en < 2 segundos |
| Visualización de Categorías | QA | Categorías organizadas, nombres legibles |
| Visualización de Platillos | QA | Fotos cargan, nombre, descripción y precio visibles |
| Estado de Disponibilidad | QA | Platillos agotados marcados visualmente (ej: opacidad, tachado) |
| Responsividad Mobile | QA | Interfaz se adapta a pantallas de 375px a 768px |
| Fuente Legible | QA | Tamaño de fuente mínimo 16px para texto |
| Velocidad de Scroll | QA | Scroll fluido sin lag |
| Actualización en Tiempo Real | QA | Al refrescar, cambios de disponibilidad se reflejan |

---

### 2.4 Pruebas de Integración

**Herramienta:** Testing Manual

**Flujo End-to-End - Escenario Happy Path:**

1. **Como Dueño de Restaurante:**
   - Registrarse en la plataforma
   - Login
   - Crear 3 categorías (Entradas, Fuertes, Bebidas)
   - Crear 5 platillos en total
   - Cambiar uno a "Agotado"
   - Generar código QR

2. **Como Comensal:**
   - Escanear código QR
   - Ver menú con 5 platillos
   - Ver 1 platillo marcado como "Agotado"
   - Refrescar página y verificar que cambios persisten

**Responsable:** QA Tester + Backend Dev

---

### 2.5 Pruebas de Validación de Datos

**Validaciones a Verificar (Postman + Manual):**

| Validación | Entrada Inválida | Resultado Esperado | Responsable |
|-----------|-----------------|-------------------|------------|
| Precio positivo | -50, 0, "abc" | Error 400 Bad Request | Backend Dev |
| Nombre no vacío | "", null | Error 400 Bad Request | Backend Dev |
| Email válido | "notanemail", "", null | Error 400 Bad Request | Backend Dev |
| Descripción opcional | (vacío) | Aceptado | Backend Dev |
| Foto válida | Archivo > 5MB | Error o redimensionamiento | Backend Dev |

---

## 3. Responsables de Testing

| Rol | Responsable | Tareas |
|-----|------------|--------|
| **Backend Developer** | [Nombre] | Pruebas de API en Postman, validaciones de datos, autenticación JWT |
| **Frontend Developer** | [Nombre] | Pruebas de UI panel admin, responsividad, integración con API |
| **QA Tester** | [Nombre] | Pruebas manuales UX en mobile, flujo end-to-end, casos de error |
| **Product Owner** | [Nombre] | Validación de criterios de aceptación, experiencia general |

---

## 4. Criterios de Aceptación (Definición de Listo)

El MVP se considera **LISTO PARA PRODUCCIÓN** cuando:

- Todos los endpoints de API responden correctamente (casos éxito y error)
- Autenticación JWT funciona y protege rutas privadas
- Validaciones de datos funcionan en backend y frontend
- Panel admin es funcional en Chrome y Firefox
- Menú QR carga en < 2 segundos en dispositivo móvil
- Código QR es legible y apunta a URL correcta
- Flujo end-to-end completo funciona sin errores
- No hay información sensible expuesta (tokens, credenciales)
- Disponibilidad de platillos se refleja correctamente en tiempo real

---

## 5. Cronograma de Pruebas

| Fase | Fecha Estimada | Duración | Responsable |
|------|----------------|----------|------------|
| Pruebas Unitarias Backend | Sprint 1 | 2 días | Backend Dev |
| Pruebas de API (Postman) | Sprint 2 | 1 día | Backend Dev |
| Pruebas de UI Admin | Sprint 2 | 1.5 días | Frontend Dev + QA |
| Pruebas de UX Mobile | Sprint 3 | 1.5 días | QA Tester |
| Pruebas de Integración E2E | Sprint 3 | 1 día | QA + Product Owner |
| **Total Estimado** | - | **~7 días** | - |

---

## 6. Riesgos Identificados y Mitigación

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|------------|--------|-----------|
| Retrasos en disponibilidad real-time | Media | Alto | WebSockets en Sprint 2 si es necesario |
| Problemas de CORS en producción | Media | Medio | Probar en ambiente similar a producción |
| Carga lenta de imágenes | Baja | Medio | Optimizar imágenes, lazy loading |
| JWT expirado sin notificación | Baja | Bajo | Mensaje de sesión expirada en frontend |
| Código QR no legible | Muy Baja | Alto | Probar con 5+ lectores QR diferentes |

---

## 7. Herramientas Requeridas

| Herramienta | Propósito | Costo |
|-----------|----------|-------|
| Postman | Pruebas de API | Gratuito |
| Chrome DevTools | Depuración frontend | Gratuito |
| Dispositivo móvil real (iPhone/Android) | Testing de responsividad | Ya disponible |
| QR Code Reader App | Validar código QR | Gratuito (app móvil) |

---

## 8. Matriz de Trazabilidad (Requerimientos → Tests)

| Requerimiento | Endpoint/Feature | Test ID | Estado |
|--------------|-----------------|---------|--------|
| Registro de restaurante | POST `/api/auth/register` | T-001 | Pendiente |
| Login restaurante | POST `/api/auth/login` | T-002 | Pendiente |
| CRUD de platillos | POST/PUT/DELETE `/api/products` | T-003 to T-005 | Pendiente |
| Menú público | GET `/api/menu/:id` | T-006 | Pendiente |
| Disponibilidad en tiempo real | PUT `/api/products/:id` + Frontend | T-007 | Pendiente |
| UX responsiva mobile | Frontend View | T-008 | Pendiente |
| Código QR funcional | Frontend + Backend | T-009 | Pendiente |

---

## 9. Checklist Final de Testing

- [ ] Backend: Todos los endpoints retornan status HTTP correcto
- [ ] Backend: Validaciones rechazan datos inválidos
- [ ] Backend: JWT protege rutas privadas
- [ ] Frontend Admin: Formularios funcionan sin errores
- [ ] Frontend Admin: Cambios se guardan y reflejan en tabla
- [ ] Frontend Mobile: Menú carga rápido
- [ ] Frontend Mobile: Platillos agotados están marcados
- [ ] Frontend Mobile: Responsive en 375px a 768px
- [ ] QR: Código es legible y abre menú correcto
- [ ] Seguridad: No hay tokens expuestos en consola
- [ ] Seguridad: No se pueden ver platillos de otros restaurantes
- [ ] Performance: Menú carga en < 2 segundos
- [ ] UX: Interfaz es intuitiva (sin documentación adicional)
- [ ] Documentación: Colección Postman comentada y lista

---

