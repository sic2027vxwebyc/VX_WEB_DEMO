# Project Mandates: VX Web Demo

## Core Requirements
- **Reference Implementation:** Design and functionality must follow the actual implementation in `/Users/youngchanlee/Downloads/stitch_vx_spatial_experience_hub` (HTML/CSS/JS/Vue structure).
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
