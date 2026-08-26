---
name: AgriMind Intelligence
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
  on-surface-variant: '#40493d'
  inverse-surface: '#27313f'
  inverse-on-surface: '#eaf1ff'
  outline: '#707a6c'
  outline-variant: '#bfcaba'
  surface-tint: '#1b6d24'
  primary: '#0d631b'
  on-primary: '#ffffff'
  primary-container: '#2e7d32'
  on-primary-container: '#cbffc2'
  inverse-primary: '#88d982'
  secondary: '#126d27'
  on-secondary: '#ffffff'
  secondary-container: '#9cf49c'
  on-secondary-container: '#19722b'
  tertiary: '#335f3a'
  on-tertiary: '#ffffff'
  tertiary-container: '#4b7850'
  on-tertiary-container: '#ccfecd'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#a3f69c'
  primary-fixed-dim: '#88d982'
  on-primary-fixed: '#002204'
  on-primary-fixed-variant: '#005312'
  secondary-fixed: '#9ff79f'
  secondary-fixed-dim: '#83da85'
  on-secondary-fixed: '#002105'
  on-secondary-fixed-variant: '#005318'
  tertiary-fixed: '#bdefbe'
  tertiary-fixed-dim: '#a2d3a4'
  on-tertiary-fixed: '#002109'
  on-tertiary-fixed-variant: '#24502c'
  background: '#f8f9ff'
  on-background: '#121c2a'
  surface-variant: '#d9e3f6'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
  title-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  code-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  gutter: 20px
  margin: 24px
---

## Brand & Style

The design system is rooted in **Modern Professionalism** with a focus on high-utility data visualization. It targets agricultural professionals and enterprise administrators who require precision and clarity to make high-stakes decisions. 

The aesthetic is **Minimalist and Functional**, prioritizing information density without sacrificing legibility. By utilizing a "Systematic-Natural" approach, the UI evokes feelings of growth and sustainability through its palette, while maintaining the rigorous structure of a financial or scientific SaaS. The design avoids all decorative flourishes, relying instead on purposeful whitespace, crisp alignment, and a strict adherence to a logic-driven hierarchy.

## Colors

This color palette is designed for prolonged professional use, reducing eye strain while highlighting critical data points.

- **Primary (#2E7D32):** Used for primary actions, active navigation states, and branding. It represents stability and deep-rooted expertise.
- **Secondary & Accent (#66BB6A, #A5D6A7):** Reserved for success states, growth indicators, and data visualization categories.
- **Neutral Hierarchy:** A range of grays from `#1F2937` (Text) to `#F7FAF7` (Background) ensures a clear distinction between content layers. 
- **Functional Border (#E5E7EB):** A subtle, low-contrast border is used to define workspace boundaries without adding visual noise.

## Typography

The design system utilizes **Inter** exclusively to leverage its exceptional legibility in data-heavy environments. 

- **Scale:** A tight typographic scale ensures that even complex dashboards remain organized. 
- **Weight:** Use `600` (Semi-Bold) for headers to create a clear visual anchor. 
- **Labels:** Small labels use uppercase with slight letter spacing (`0.05em`) to differentiate metadata from body content.
- **Numerical Data:** For tabular data and sensor readings, ensure the use of tabular num alignment (`tnum`) to keep columns aligned for quick comparison.

## Layout & Spacing

This design system employs a **12-column fluid grid** for the main content area, with a **Fixed Sidebar** for global navigation.

- **Grid Logic:** Use a 24px margin on mobile and 32px or 48px on desktop. Gutters are fixed at 20px to maintain density.
- **Sidebar:** A collapsed state (64px) and expanded state (240px) provide maximum screen real estate for data visualizations.
- **Spacing Rhythm:** All spacing must be a multiple of 4px. Use `md (16px)` for standard padding within cards and `lg (24px)` for section spacing.
- **Breakpoints:**
  - Mobile: < 640px (1-column stack)
  - Tablet: 640px - 1024px (2-column layout)
  - Desktop: > 1024px (12-column grid)

## Elevation & Depth

To maintain a "clean and professional" feel, this design system uses **Tonal Layering** and **Low-Contrast Outlines** rather than heavy shadows.

- **Surface Levels:** 
  - Level 0 (Background): `#F7FAF7`
  - Level 1 (Cards/Sidebar): `#FFFFFF` with a 1px border of `#E5E7EB`.
- **Shadows:** Use only one "Soft Shadow" for floating elements like dropdowns or modals. 
  - *Shadow Style:* `0 4px 12px rgba(0, 0, 0, 0.05)`.
- **Interactive States:** On hover, cards should not "lift" with shadows but rather shift the border color to `#66BB6A` to indicate focus without breaking the flat professional aesthetic.

## Shapes

The design system uses **Soft (0.25rem)** roundedness to maintain a precise, engineered appearance while subtly avoiding the harshness of sharp corners.

- **Components:** Buttons, Input fields, and small UI elements use `rounded-sm` (4px).
- **Containers:** Dashboard cards and modals use `rounded-lg` (8px).
- **Visuals:** Status dots and avatars are the only elements permitted to use `rounded-full` (circle).

## Components

### Navigation & Shell
- **Sidebar:** High-contrast background (White or very dark Primary). Icons should be 20px, stroke-based (2px weight), accompanied by `body-md` labels.
- **Top Navigation:** Contains breadcrumbs, global search (AI-powered), and user profile. 1px bottom border.

### Actions & Inputs
- **Buttons:** Primary buttons are solid `#2E7D32` with white text. Secondary buttons are outlined with `#E5E7EB` and primary-colored text. No gradients.
- **Input Fields:** 1px `#E5E7EB` border, changing to `#2E7D32` on focus. Labels sit 4px above the input.

### Data & Containers
- **Cards:** White background, 8px corner radius, 1px border. Use a "Header" area within the card for titles and action icons (like "expand" or "export").
- **Tables:** No vertical borders. Zebra striping is discouraged; use subtle 1px horizontal dividers instead. Headers are uppercase `label-md`.
- **AI Visualizations:** Charts should use the primary and secondary greens, with a neutral gray for historical/baseline data. Sparklines in tables provide quick trend analysis without clutter.

### Status Indicators
- **Success/Healthy:** `#66BB6A`
- **Warning/Alert:** `#F59E0B` (Amber)
- **Critical/Action Required:** `#EF4444` (Red)
- Status indicators should always pair a color with a text label or icon to ensure accessibility.