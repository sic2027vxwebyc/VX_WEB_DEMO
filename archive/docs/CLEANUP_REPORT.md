# Cleanup Analysis Report

## Project State
- **Direction**: V2 Spatial Convention Runtime Platform
- **Action**: Safe isolation of legacy/redundant files to `UnUsed/` directory.

## KEEP (Core V2 Runtime)
- **src/main.js**: App Entry
- **src/App.vue**: Root Component
- **src/router/index.js**: Unified V2 Router
- **src/views/Home_v2.vue**: Main Home Experience
- **src/views/InteractiveMapLive.vue**: Real-time Spatial Map
- **src/views/Viewer360Live.vue**: Spatial 360 Intelligence
- **src/views/RouteGuideLive.vue**: Live Navigation Guide
- **src/views/EventScheduleLive.vue**: Interactive Timeline
- **src/views/NotificationHubLive.vue**: Real-time Notice Center
- **src/views/v2/stamp/**: Full Gamification Suite (Passport, Quest, Badge, Reward)
- **src/stores/**: All Pinia stores (Spaces, Operational, Events, Map, Gamification)
- **src/utils/**: Logger and i18nResolver

## MOVE TO UNUSED (Legacy/Experimental)
- **file**: `src/views/HomeView.vue`
  - **moved to**: `UnUsed/src/views/HomeView.vue`
  - **reason**: Replaced by `Home_v2.vue`
- **file**: `src/views/InteractiveMapView.vue`
  - **moved to**: `UnUsed/src/views/InteractiveMapView.vue`
  - **reason**: Replaced by `InteractiveMapLive.vue`
- **file**: `src/views/Viewer360View.vue`
  - **moved to**: `UnUsed/src/views/Viewer360View.vue`
  - **reason**: Replaced by `Viewer360Live.vue`
- **file**: `src/views/Viewer360_v2.vue`
  - **moved to**: `UnUsed/src/views/Viewer360_v2.vue`
  - **reason**: Legacy V2 draft, replaced by `Viewer360Live.vue`
- **file**: `src/views/RouteGuideView.vue`
  - **moved to**: `UnUsed/src/views/RouteGuideView.vue`
  - **reason**: Replaced by `RouteGuideLive.vue`
- **file**: `src/views/RouteGuide_v2.vue`
  - **moved to**: `UnUsed/src/views/RouteGuide_v2.vue`
  - **reason**: Legacy V2 draft, replaced by `RouteGuideLive.vue`
- **file**: `src/views/EventScheduleView.vue`
  - **moved to**: `UnUsed/src/views/EventScheduleView.vue`
  - **reason**: Replaced by `EventScheduleLive.vue`
- **file**: `src/views/NotificationHubView.vue`
  - **moved to**: `UnUsed/src/views/NotificationHubView.vue`
  - **reason**: Replaced by `NotificationHubLive.vue`

## VERIFICATION RESULTS
- **Build**: ✅ Success (`npm run build`)
- **i18n Consistency**: ✅ Success (`npm run i18n:check`)
- **Router Integrity**: ✅ All active routes point to valid files.
- **Rollback Path**: ✅ All files preserved in `UnUsed/` with original path structure.

---
**Report Generated**: 2026-05-16
**Status**: CLEANUP COMPLETE - STABLE
