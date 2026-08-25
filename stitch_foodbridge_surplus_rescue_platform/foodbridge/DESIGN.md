---
name: FoodBridge
colors:
  surface: '#f8f9ff'
  surface-dim: '#d0dbed'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dee9fc'
  surface-container-highest: '#d9e3f6'
  on-surface: '#121c2a'
  on-surface-variant: '#3e4a3d'
  inverse-surface: '#27313f'
  inverse-on-surface: '#eaf1ff'
  outline: '#6e7b6c'
  outline-variant: '#bdcaba'
  surface-tint: '#006e2d'
  primary: '#006b2c'
  on-primary: '#ffffff'
  primary-container: '#00873a'
  on-primary-container: '#f7fff2'
  inverse-primary: '#62df7d'
  secondary: '#0058be'
  on-secondary: '#ffffff'
  secondary-container: '#2170e4'
  on-secondary-container: '#fefcff'
  tertiary: '#825100'
  on-tertiary: '#ffffff'
  tertiary-container: '#a36700'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#7ffc97'
  primary-fixed-dim: '#62df7d'
  on-primary-fixed: '#002109'
  on-primary-fixed-variant: '#005320'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#f8f9ff'
  on-background: '#121c2a'
  surface-variant: '#d9e3f6'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.25'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
---

## Brand & Style

The design system is engineered for a professional surplus platform that bridges the gap between food donors and rescuers. The brand personality is rooted in **efficiency, trust, and ecological responsibility**. 

Drawing inspiration from the "Safe" visual identity, the style utilizes a **systematic, Inter-focused layout** that prioritizes clarity over decorative elements. It blends the structural integrity of Corporate Modernism with the airy lightness of premium SaaS platforms. The emotional response is one of calm reliability—moving surplus food should feel as seamless as a financial transaction. Key characteristics include generous whitespace, high-legibility typography, and a "utilitarian-premium" aesthetic that ensures the mission (saving food) remains the central focus.

## Colors

The palette is anchored by a **Soft Green (#16A34A)**, representing freshness and sustainability. This primary color is used strategically for action-oriented elements and brand markers to maintain its impact.

- **Primary:** Soft Green for the main brand identity and successful states.
- **Secondary/Status:** Blue (#3B82F6) denotes "Requested" items, providing a clear functional distinction from the primary green.
- **Attention:** Amber (#F59E0B) and Red (#EF4444) are reserved for "Expiring Soon" or critical alerts.
- **Neutrals:** Deep Slate (#1F2937) provides high-contrast legibility for typography, while the background stays light and airy with an off-white Slate-50 (#F9FAFB) to reduce eye strain and emphasize card boundaries.

## Typography

This design system utilizes **Inter** exclusively to achieve a neutral, systematic, and utilitarian feel. The typographic scale is designed for high-density information environments.

Headlines use tighter letter-spacing and heavier weights to create a strong visual hierarchy against the spacious layout. Body text is optimized for readability with a 1.5x to 1.6x line height. For smaller labels and status chips, a medium-to-semibold weight is employed to ensure accessibility even at 12px or 14px sizes. Mobile headline adjustments ensure that the platform remains professional and readable on smaller devices without excessive text wrapping.

## Layout & Spacing

The layout philosophy follows a **systematic fluid grid** with a maximum container width of 1280px. A base 4px rhythm dictates all spatial relationships, ensuring mathematical harmony across the UI.

- **Desktop:** A 12-column grid with 24px gutters. Content is centered with generous side margins to create an "institutional" feel.
- **Tablet:** 8-column grid with 24px gutters.
- **Mobile:** 4-column grid with 16px margins.
- **Whitespace:** Spacing between sections should be aggressive (48px+) to maintain the "Minimal and Clean" aesthetic, allowing individual donation cards to breathe and stand out.

## Elevation & Depth

Depth is handled through **ambient shadows and tonal layering**, avoiding harsh borders where possible. 

1.  **Low Elevation (Cards):** Used for primary content. A soft, highly-diffused shadow with 4% opacity (Color: #1F2937) ensures cards feel nested but distinct from the background.
2.  **Medium Elevation (Dropdowns/Popovers):** A slightly more defined shadow with a 12px blur, used for interactive floating elements.
3.  **High Elevation (Modals):** Utilizes **Glassmorphism**. Modals feature a `backdrop-filter: blur(12px)` and a semi-transparent white background (`rgba(255, 255, 255, 0.8)`). This keeps the user context visible while providing the necessary focus for the overlay.

## Shapes

The shape language is defined by a **16px standard radius (roundedness level 2)**. This specific curvature creates a friendly, approachable atmosphere while maintaining a professional "App-like" structure.

- **Standard Cards:** 16px (1rem).
- **Small Elements (Inputs/Buttons):** 12px (0.75rem) or fully rounded (pill) for specific call-to-actions.
- **Large Containers:** 24px (1.5rem) for main dashboard sections to create a "container within a container" look.

## Components

### Buttons
- **Primary:** Solid `#16A34A` with white text. High-contrast, 12px or pill-shaped rounding.
- **Secondary:** White background with a subtle border (`#E5E7EB`) and `#1F2937` text.
- **Sizing:** Large padding (12px 24px) for a premium, touch-friendly feel.

### Cards
- White background, 16px radius, and the low-elevation ambient shadow.
- Inner padding should be consistent at 24px (lg).

### Status Chips
- Small, uppercase labels with a 10% opacity background of their respective status color (e.g., "Available" uses a light green background with dark green text).

### Input Fields
- Minimalist style: A simple 1px border (`#E5E7EB`) that transitions to the primary green on focus. 
- Background should be pure white to pop against the `#F9FAFB` page background.

### Lists
- Clean, unbordered lists with 1px horizontal dividers. Use "ghost" hover states (light gray background) to indicate interactivity without visual clutter.

### Modals
- Centralized with glassmorphism backgrounds. Borders should be extremely subtle or non-existent, relying on the backdrop blur for separation.