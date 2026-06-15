# Estructura de Ramas - MenuCraft SaaS

## Introducción

Este documento describe la estructura de ramas (branching strategy) utilizada en el proyecto MenuCraft SaaS. Seguimos una estrategia **Git Flow** adaptada para el equipo.

---

## Estrategia de Ramificación (Git Flow)

```
main (Producción)
 └─ develop (Integración)
     ├─ feature/backend-base
     ├─ feature/frontend-base
     ├─ feature/qa-docs
     ├─ feature/ci-config
     └─ feature/setup-repo
```

---

## Ramas Principales

### 1. **main**
- **Propósito:** Rama de producción estable
- **Quién puede hacer merge:** Solo Product Owner / Tech Lead mediante Pull Request
- **Política:** Solo se aceptan merges desde `develop` o `release/*`
- **Etiquetas:** Se crean tags de versión (v1.0.0, v1.1.0, etc.)
- **Protección:** Si es posible, proteger con requerimiento de aprobación

### 2. **develop**
- **Propósito:** Rama de integración y desarrollo
- **Quién puede hacer merge:** Tech Lead / Senior Dev mediante Pull Request
- **Política:** Se integran las features completadas
- **Ciclo de vida:** Permanente, siempre disponible

---

## Ramas de Features Activas

| Rama | Descripción | Estado | Responsable | Inicio |
|------|-------------|--------|------------|--------|
| `feature/setup-repo` | Configuración inicial del repositorio y GitFlow | Completada | KevMon007 | - |
| `feature/backend-base` | Configuración base de Express + Docker para backend | Completada | - | - |
| `feature/ci-config` | EditorConfig, Prettier y GitHub Actions pipeline | Completada | - | - |
| `feature/frontend-base` | Inicialización Vite + Tailwind CSS | Completada | - | - |
| `feature/qa-docs` | Plan de pruebas y colección Postman | En Progreso | - | 2026-06-14 |

---

## Convenciones de Nombres de Rama

### Ramas de Feature
```
feature/{descripcion-corta}
```
Ejemplos:
- `feature/backend-base`
- `feature/frontend-base`
- `feature/user-authentication`
- `feature/product-crud`

### Ramas de Bugfix
```
bugfix/{numero-issue}-{descripcion}
```
Ejemplos:
- `bugfix/123-login-error`
- `bugfix/456-menu-loading`

### Ramas de Release
```
release/{version}
```
Ejemplos:
- `release/1.0.0`
- `release/1.1.0`

### Ramas de Hotfix
```
hotfix/{version}-{descripcion}
```
Ejemplos:
- `hotfix/1.0.1-security-patch`

---

## Flujo de Trabajo Estándar

### 1. Crear una Nueva Feature

```bash
# Actualizar develop
git checkout develop
git pull origin develop

# Crear rama de feature
git checkout -b feature/nombre-feature

# Trabajar en la feature
# ... hacer commits ...

# Hacer push
git push -u origin feature/nombre-feature
```

### 2. Solicitar Merge (Pull Request)

1. Abrir Pull Request en GitHub
2. Base: `develop`
3. Compare: `feature/nombre-feature`
4. Asignar reviewers
5. Validar que los checks pasen (CI/CD)
6. Esperar aprobación mínima de 1 reviewer

### 3. Hacer Merge

```bash
# Después de aprobación
git checkout develop
git pull origin develop
git merge --no-ff feature/nombre-feature
git push origin develop

# Opcionalmente, eliminar rama remota
git push origin --delete feature/nombre-feature
```

---

## Política de Pull Requests

### Requisitos para Merge

- ✓ Mínimo 1 aprobación de code review
- ✓ Todos los checks CI/CD pasados (tests, linters)
- ✓ Rama actualizada con `develop` (no conflicts)
- ✓ Descripción clara del cambio
- ✓ Vinculación a issues (si aplica)

### Estructura de PR

```markdown
## Descripción
Breve descripción de qué cambia y por qué

## Tipo de Cambio
- [ ] Bugfix
- [ ] Feature
- [ ] Refactor
- [ ] Documentación

## Cómo Testearlo
Pasos específicos para reproducir o verificar

## Checklist
- [ ] Mi código sigue los estándares del proyecto
- [ ] He revisado mis propios cambios
- [ ] He agregado comentarios donde es necesario
- [ ] He actualizado la documentación
- [ ] No hay warnings nuevos
```

---

## Ramas Remotas Actuales

```
origin/main                         → Producción
origin/develop                      → Integración principal
origin/feature/backend-base         → Backend configurado
origin/feature/frontend-base        → Frontend configurado
origin/feature/qa-docs              → Documentación QA
origin/feature/ci-config            → CI/CD pipeline
origin/feature/setup-repo           → Setup inicial
```

---

## Flujo de Release (cuando esté listo MVP)

```bash
# 1. Crear rama de release
git checkout -b release/1.0.0 develop

# 2. Preparar release (versión, changelog, etc.)
# ... editar archivos ...
git commit -am "Bump version to 1.0.0"

# 3. Hacer merge a main
git checkout main
git merge --no-ff release/1.0.0 -m "Release 1.0.0"
git tag -a v1.0.0 -m "Version 1.0.0"

# 4. Hacer merge de vuelta a develop
git checkout develop
git merge --no-ff release/1.0.0 -m "Merge release 1.0.0"

# 5. Eliminar rama de release
git branch -d release/1.0.0
git push origin main develop --tags
```

---

## Política de Commits

### Formato de Mensaje de Commit

```
<tipo>: <descripción corta>

<descripción detallada opcional>

Closes #<número-issue> (si aplica)
```

### Tipos de Commit

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Cambios de formato (no afectan lógica)
- `refactor:` Refactorización de código
- `test:` Agregar o actualizar tests
- `chore:` Cambios en build, dependencias, etc.

### Ejemplos

```
feat: agregar endpoint para crear platillos

Implementa POST /api/products con validación de datos
y autenticación JWT requerida.

Closes #123

---

fix: corregir error en validación de precio negativo

Closes #456

---

docs: agregar guía de branching al proyecto
```

---

## Protección de Ramas en GitHub

Se recomienda configurar las siguientes reglas de protección:

### Para `main`
- ✓ Requiere pull request review antes de merge
- ✓ Dismiss stale PR reviews cuando hay nuevos commits
- ✓ Requiere que los checks pasen antes de merge
- ✓ Requiere que las ramas estén actualizadas
- ✓ Incluir administradores en restricciones

### Para `develop`
- ✓ Requiere pull request review antes de merge
- ✓ Requiere que los checks pasen antes de merge
- ✓ Requiere que las ramas estén actualizadas

---

## Equipo y Responsabilidades

| Rol | Responsabilidad | Aprobación |
|-----|----------------|-----------|
| **Tech Lead** | Revisar PRs a develop, decidir releases | Si |
| **Senior Dev** | Code review, validar arquitectura | Si |
| **Backend Dev** | Desarrollo backend, PRs a feature | No |
| **Frontend Dev** | Desarrollo frontend, PRs a feature | No |
| **QA Tester** | Validar cambios, encontrar bugs | Consulta |

---

## Resolución de Conflictos

Si existe conflicto de merge:

```bash
# 1. Actualizar la rama de feature
git fetch origin
git merge origin/develop

# 2. Resolver conflictos manualmente
# ... editar archivos con conflictos ...

# 3. Marcar como resueltos
git add .
git commit -m "Merge: resolver conflictos con develop"
git push origin feature/nombre

# 4. Re-solicitar review del PR
```

---

## Comandos Útiles

```bash
# Ver todas las ramas locales y remotas
git branch -a

# Ver ramas mergeadas a develop
git branch -a --merged develop

# Ver ramas que aún no se han mergeado
git branch -a --no-merged develop

# Eliminar rama local
git branch -d nombre-rama

# Eliminar rama remota
git push origin --delete nombre-rama

# Cambiar nombre de rama
git branch -m nombre-antiguo nombre-nuevo

# Ver historial de commits de una rama
git log --oneline origin/nombre-rama
```

---

## Flujo Visual de Ramas Actual (Junio 2026)

```
          feature/setup-repo
               ↓
              main ← release candidate
              ↑
              |
    feature/backend-base ← mergeado
              ↓
           develop ← integración
            /  |  \
           /   |   \
   feature/ feature/ feature/
   qa-docs ci-config frontend-base
```

---

## Notas Importantes

1. **Nunca hagan push directamente a `main` o `develop`**
   - Siempre usar Pull Requests

2. **Mantener ramas de feature actualizadas**
   - Hacer `git merge origin/develop` frecuentemente

3. **Eliminar ramas cuando estén mergeadas**
   - Mantener limpio el repositorio

4. **Escribir buenos mensajes de commit**
   - Facilita el entendimiento del historial

5. **Revisar código antes de merge**
   - Mantener calidad de código

6. **Respetar la estructura GitFlow**
   - No crear ramas aleatorias

---

## Recursos Adicionales

- [Git Flow Cheatsheet](https://danielkummer.github.io/git-flow-cheatsheet/)
- [GitHub Flow Guide](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

**Última actualización:** 14 Junio 2026  
**Responsable:** Equipo de Desarrollo MenuCraft
