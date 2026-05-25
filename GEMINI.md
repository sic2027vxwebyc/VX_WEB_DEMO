# Project Mandates: VX Web Demo

## Core Requirements
- **Reference Implementation:** Design and functionality must follow the actual implementation in `/Users/youngchanlee/Downloads/stitch_vx_spatial_experience_hub` (HTML/CSS/JS/Vue structure).


## Always-On Engineering Skills

The following engineering modes are ALWAYS active for every task in this project.


### Mandatory Skills
- `/clean-code`: Keep code readable, consistent, modular, and maintainable.
- `/caveman`: Prefer the simplest working solution. Avoid over-engineering and unnecessary abstraction.
- `/pwa-development`: Always consider PWA lifecycle, offline behavior, service worker safety, cache strategy, and mobile constraints.
- `/docker-expert`: Always consider Docker lifecycle, container constraints, and deployment scenarios.
 



### Mandatory References
Before making architectural, UI, PWA, routing, testing, or folder-structure changes, always reference:

- `GEMINI.md`
- `DESIGN.md`
- `README.md`

### Mandatory Behaviors
- Preserve the existing UX flow unless explicitly asked to change it.
- Follow the reference implementation direction.
- Keep folder structure feature-oriented and easy to maintain.
- Fix all affected imports when files are moved.
- Remove dead code, unused imports, mock leftovers, and duplicate logic.
- Avoid barrel exports unless they clearly reduce complexity.
- Avoid circular dependencies.
- Use `@` alias consistently for source imports.
- Update `README.md` whenever folder structure, setup, testing, PWA behavior, or architecture changes.
- Run build/test/lint validation when relevant.
- Report remaining risks honestly instead of claiming production readiness prematurely.
- Prefer feature-based architecture over type-based architecture.
- Keep components small and lifecycle-safe.
- Always clean up listeners, EventSource, WebXR, and Three.js resources.
- Prefer separate frontend/backend containers over single-image architecture.
- Keep Docker services independently deployable.
- Use docker-compose for local orchestration and development consistency.
- Avoid mixing runtime responsibilities inside one container.
- Keep Dockerfiles minimal, cache-friendly, and production-safe.


### Optional Educational Skill

Use `add-educational-comments` selectively for complex architectural or lifecycle-critical code.

Recommended targets:
- Spatial Engine
- Three.js lifecycle
- PWA service worker
- SSE lifecycle
- i18n resolver
- complex stores
- asset loading pipeline

Avoid excessive educational comments in:
- simple UI components
- styling files
- trivial CRUD logic

Guidelines:
- Explain WHY, not only WHAT.
- Focus on lifecycle, architecture, async flow, cleanup, and performance reasoning.
- Keep comments maintainable and avoid comment bloat.
- Prefer educational comments only in files with high long-term maintenance cost.

## Testing Requirements

- Do not create fake or meaningless tests.
- Prefer behavior-based testing over snapshot-heavy testing.
- Test cleanup and lifecycle behavior for realtime features.
- Validate build/runtime after refactors.
- Add tests for stores, composables, router guards, and critical services.
- WebXR and device-specific features must include graceful fallback testing.
- PWA features must consider unsupported environments and stale cache scenarios.

## Frontend Engineering Stack

### Frontend Skills
- `/clean-code`
- `/caveman`
- `/pwa-development`
- `/docker-expert`

### Frontend Priorities
- lifecycle-safe UI
- maintainable feature structure
- PWA safety
- import consistency
- realtime cleanup
- mobile/browser constraints
- production-safe builds
- feature-oriented architecture
- maintainable folder structure
- safe lazy loading
- graceful degradation

### Frontend Runtime Safety
- **Always clean up:**
  - EventSource
  - listeners
  - intervals/timeouts
  - observers
  - Three.js resources
  - WebXR sessions

- **Prevent:**
  - stale rendering
  - duplicate realtime events
  - memory leaks
  - stale cache usage
  - unsafe async flows

## Backend Engineering Stack

### Backend Skills
- `/golang-pro`
- `/clean-code`
- `/caveman`
- `/pwa-development`
- `/docker-expert`

### Backend Priorities
- idiomatic Go architecture
- concurrency safety
- context propagation
- goroutine lifecycle management
- realtime-safe backend patterns
- feature-oriented package structure
- Docker production deployment
- race-condition prevention
- explicit dependency injection
- structured logging
- graceful shutdown
- scalable API/service design
- maintainable microservice boundaries

### Go Backend Safety Rules
- Never start unmanaged goroutines.
- Always propagate `context.Context`.
- Prevent goroutine leaks.
- Use timeouts for external I/O.
- Validate channel ownership before closing.
- Prefer composition over inheritance-like abstractions.
- Keep interfaces small and consumer-oriented.
- Prefer explicit dependency injection.
- Avoid hidden singleton patterns.
- Prefer feature-oriented package structures.
- Keep handlers/services/repositories clearly separated.
- Avoid giant shared util packages.
- Prefer structured logging.
- Keep Docker deployment production-safe and reproducible.

### Required Go Validation
Always run before production commits:

- `go test ./...`
- `go test -race ./...`
- `go vet ./...`
- `golangci-lint run`

### Preferred Go Architecture

#### Recommended Structure

```text
cmd/
internal/
pkg/
configs/
deployments/
docs/
scripts/
```

#### Recommended Separation

```text
handler → service → repository
```

#### Prefer
- small interfaces
- context-aware services
- explicit cleanup
- bounded concurrency
- observable async flows


## Language & i18n Policy
- **Primary Language (Korean):**
  - **UI Text:** All user-facing text must be translated to Korean. Do NOT expose English UI strings.
  - **Comments:** All code comments must be in Korean. Explain *why*, state control, and UX connection.
  - **Logs:** All log messages must be in Korean.
- **Locale Source of Truth (Master: ko):**
  - **Master Source:** `src/i18n/locales/ko` is the absolute Source of Truth for all i18n keys and structures.
  - **Mirroring:** All other locales (`en`, `es`, `ja`, `zh-TW`, etc.) MUST mirror the `ko` locale's file structure, key names, and namespace depth exactly.
  - **Translation Basis:** Translations must be based on the Korean meaning, optimized for international UX (concise and intuitive).
  - **Restricted Items:** Never translate route paths, query params, IDs, enums, or technical identifiers.
  - **Validation:** Compare all locales against `ko` to detect missing or redundant keys.
  - **Fallback:** `fallbackLocale` is always 'ko'. Do not rely on fallback to skip translations.

## Logging Standard
A specific `logger` utility must be used for tracing and debugging.

### Logger Implementation
```javascript
const isDev = import.meta.env.MODE === 'development'

export const logger = {
  info(scope, message, data = null) {
    if (isDev) {
      console.info(`[INFO][${scope}] ${message}`, data ?? '')
    }
  },

  warn(scope, message, data = null) {
    console.warn(`[WARN][${scope}] ${message}`, data ?? '')
  },

  error(scope, message, error = null) {
    console.error(`[ERROR][${scope}] ${message}`, error ?? '')
  },

  debug(scope, message, data = null) {
    if (isDev) {
      console.debug(`[DEBUG][${scope}] ${message}`, data ?? '')
    }
  }
}
```

### Logging Scope
Apply `logger` to the following events:
1. App initialization
2. Route transitions
3. Page mount/unmount
4. Data loading (Spaces, Assets, etc.)
5. 360 Viewer init/destroy
6. Search/Filter changes
7. Modal/Expand/Collapse interactions
8. Touch/Resize events
9. Errors and fallback handling

### Logging Principles
- Use component or feature name for `scope`.
- Include original error objects in `error` logs.
- Protect PII/sensitive data.
- Limit `debug/info` in production; keep `warn/error` visible.
- Prevent excessive repeated logs.

## Engineering Standards
- **Harness Engineering:** Use logs to trace flows and prevent issues like stale rendering, double-clicks, and async timing issues.
- **Visuals:** Ensure high visual quality and modern feel as per the reference implementation.

