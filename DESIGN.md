---
name: Spatial Convention System
colors:
  surface: '#121315'
  surface-dim: '#121315'
  surface-bright: '#38393b'
  surface-container-lowest: '#0d0e10'
  surface-container-low: '#1b1c1e'
  surface-container: '#1f2022'
  surface-container-high: '#292a2c'
  surface-container-highest: '#343537'
  on-surface: '#e3e2e4'
  on-surface-variant: '#b9cacb'
  inverse-surface: '#e3e2e4'
  inverse-on-surface: '#303032'
  outline: '#849495'
  outline-variant: '#3b494b'
  surface-tint: '#00dbe9'
  primary: '#dbfcff'
  on-primary: '#00363a'
  primary-container: '#00f0ff'
  on-primary-container: '#006970'
  inverse-primary: '#006970'
  secondary: '#d1bcff'
  on-secondary: '#3c0090'
  secondary-container: '#7000ff'
  on-secondary-container: '#ddcdff'
  tertiary: '#fff5de'
  on-tertiary: '#3b2f00'
  tertiary-container: '#fed639'
  on-tertiary-container: '#715d00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#7df4ff'
  primary-fixed-dim: '#00dbe9'
  on-primary-fixed: '#002022'
  on-primary-fixed-variant: '#004f54'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#d1bcff'
  on-secondary-fixed: '#23005b'
  on-secondary-fixed-variant: '#5700c9'
  tertiary-fixed: '#ffe179'
  tertiary-fixed-dim: '#eac324'
  on-tertiary-fixed: '#231b00'
  on-tertiary-fixed-variant: '#554500'
  background: '#121315'
  on-background: '#e3e2e4'
  surface-variant: '#343537'
  surface-dark: '#121315'
  surface-light: '#F8F9FA'
  status-low: '#00C853'
  status-moderate: '#FFD600'
  status-high: '#FF3D00'
  security-alert: '#FF0033'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-lg:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
---

# VX Web: International Spatial Convention Experience Platform - Master Specification

## 1. Project Vision
VX Web is an immersive spatial experience platform designed for large-scale international conventions (like KINTEX). It transcends simple informational websites to act as a "Spatial Navigation & Experience Management Platform," prioritizing intuitive UX for global visitors, elderly accessibility, and real-time operational stability.

## 2. Design System: "Spatial Convention System"
The visual identity is defined by a high-fidelity, futuristic aesthetic that balances premium immersion with functional clarity.

### Visual Language
- **Themes**: Dual-theme architecture (Dark/Light).
  - **Dark Mode**: Deep surfaces (#121315), glassmorphism effects, and glowing primary accents for high immersion.
  - **Light Mode**: High-contrast typography, soft shadows, and clean neutral tones for outdoor legibility.
- **Typography**: GEIST (Modern, technical, highly legible).
- **Geometry**: Roundness (8px), consistent 4-8px spacing scale.
- **Interactions**: Subtle scale transitions, backdrop blurs (30-40px), and smooth theme toggling.

## 3. Core Screen Architectures

### A. Discovery & Navigation (User-Facing)
1. **Home (Dashboard)**: Immersive hero section, real-time "Spatial Hub" highlights (Live Keynotes, Lounge status), and "Master the Grid" indoor positioning teaser.
2. **Interactive Map**: Multi-floor (1F-3F) spatial grid with category filtering (Exhibition, Dining, Info), route visualization, and "Popular Spaces" sidebar.
3. **Space Directory**: Card-based browsing with real-time congestion indicators (Low/Moderate/High), distance sorting, and quick "Route" CTAs.
4. **Space Detail**: Cinematic hero imagery, accessibility info (Braille, Induction Loop), 360 viewer entry, and "Nearby Spaces" recommendations.
5. **Route Guide**: Step-by-step turn instructions, estimated walk time, accessibility-first routing options, and target destination preview.
6. **Viewer 360**: Full-screen immersive panorama with spatial hotspots (Info, Navigation nodes), "Next Space" transitions, and VR mode support.

### B. Feedback & Status Systems
- **Arrival Success**: Confirmed check-in with upcoming event details and capacity status.
- **Booking Confirmed**: Dual-pane status showing pod reservation details and a secure "Digital Pass" (QR).
- **Access Restricted**: High-visibility security clearance warning with "Nearest Assistance" routing.
- **Connection Error**: "Connection Unstable" state with offline map fallback and GPS status.

### C. Management & Personalization
1. **Admin Dashboard**: Command center with real-time telemetry (Visitors, QR scan rates, System Health), live congestion heatmaps, and system-wide alerts.
2. **Settings**: Centralized control for Visual Theme (Dark/Light/System), Offline Caching, Accessibility (High Contrast, Text Scaling, Voice Guidance), and Region/Language (English, Korean, Japanese, Chinese).

## 4. Functional Requirements
- **Spatial Intelligence**: Real-time indoor positioning with centimeter accuracy.
- **Global Accessibility**: Multi-language support and specialized accessibility controls for elderly and disabled visitors.
- **Field Stability**: Offline caching and data mode management for unreliable convention Wi-Fi environments.
- **Glassmorphism UI**: Consistent use of semi-transparent layers to maintain spatial depth.