# Colors

Color tokens for the ResultX App Design System. All colors are theme-aware, switching between dark (teal accent) and light (blue accent) palettes via the `data-theme` attribute on `<html>`.

Dark is the default theme. When no `data-theme` is set, the system falls back to `prefers-color-scheme`, defaulting to dark if the OS has no preference.

---

## Backgrounds

| Token | Dark Value | Light Value | Usage |
|-------|-----------|-------------|-------|
| `--bg-base` | `#0B0E14` | `#FFFFFF` | Page background, root canvas |
| `--bg-surface-1` | `#111620` | `#F8FAFB` | Cards, primary containers |
| `--bg-surface-2` | `#161B26` | `#F0F3F5` | Nested panels, secondary containers |
| `--bg-surface-3` | `#1C2333` | `#E8ECF0` | Tertiary surfaces, table rows |
| `--bg-overlay` | `rgba(11, 14, 20, 0.85)` | `rgba(0, 0, 0, 0.5)` | Modal/dialog backdrop |

### Sidebar Backgrounds

| Token | Dark Value | Light Value | Usage |
|-------|-----------|-------------|-------|
| `--sidebar-bg` | `#080B12` | `#0F1A2E` | Sidebar base background |
| `--sidebar-bg-hover` | `#0F1420` | `#162240` | Sidebar item hover state |
| `--sidebar-active-bg` | `rgba(45, 212, 191, 0.15)` | `#1D4ED8` | Active sidebar item highlight |

> **Note:** The sidebar stays dark in light theme to maintain contrast and hierarchy.

---

## Borders

| Token | Dark Value | Light Value | Usage |
|-------|-----------|-------------|-------|
| `--border-subtle` | `#1E2736` | `#E8ECF0` | Dividers, subtle separators |
| `--border-default` | `#2A3444` | `#D1D9E0` | Card borders, input borders |
| `--border-strong` | `#3D4A5C` | `#B0BAC5` | Emphasized borders, focus rings |
| `--border-accent` | `rgba(45, 212, 191, 0.20)` | `rgba(29, 78, 216, 0.25)` | Accent-colored borders, active states |

### Sidebar Borders

| Token | Dark Value | Light Value | Usage |
|-------|-----------|-------------|-------|
| `--sidebar-divider` | `rgba(255, 255, 255, 0.06)` | `rgba(255, 255, 255, 0.08)` | Sidebar section dividers |

---

## Text

| Token | Dark Value | Light Value | Usage |
|-------|-----------|-------------|-------|
| `--text-primary` | `#E6EDF3` | `#0F1729` | Headings, primary body text |
| `--text-secondary` | `#8B949E` | `#586069` | Descriptions, secondary labels |
| `--text-muted` | `#6E7681` | `#8B949E` | Placeholders, disabled text, timestamps |
| `--text-inverse` | `#0B0E14` | `#FFFFFF` | Text on accent-colored backgrounds |
| `--text-on-color` | `#FFFFFF` | `#FFFFFF` | Text on any colored background (theme-independent) |

### Sidebar Text

| Token | Dark Value | Light Value | Usage |
|-------|-----------|-------------|-------|
| `--sidebar-text` | `rgba(255, 255, 255, 0.50)` | `rgba(255, 255, 255, 0.65)` | Inactive sidebar labels |
| `--sidebar-text-active` | `#2DD4BF` | `#FFFFFF` | Active sidebar item label |
| `--sidebar-text-bright` | `#FFFFFF` | `#FFFFFF` | Sidebar org name, user name |

---

## Accent

| Token | Dark Value | Light Value | Usage |
|-------|-----------|-------------|-------|
| `--accent-primary` | `#2DD4BF` | `#1D4ED8` | Primary actions, links, active indicators |
| `--accent-primary-hover` | `#5EEAD4` | `#1E40AF` | Hover state for primary accent |
| `--accent-primary-muted` | `rgba(45, 212, 191, 0.15)` | `rgba(29, 78, 216, 0.12)` | Subtle accent backgrounds (badges, tags) |
| `--accent-secondary` | `#C49A3C` | `#C49A3C` | Gold accent, premium indicators |

> **Design note:** Dark theme uses teal (`#2DD4BF`) as primary accent. Light theme uses blue (`#1D4ED8`). The secondary accent (gold) is the same in both themes.

---

## Semantic

| Token | Dark Value | Light Value | Usage |
|-------|-----------|-------------|-------|
| `--color-success` | `#22C55E` | `#16A34A` | Success messages, positive indicators |
| `--color-success-bg` | `rgba(34, 197, 94, 0.12)` | `rgba(22, 163, 74, 0.12)` | Success background (alerts, badges) |
| `--color-warning` | `#F59E0B` | `#D97706` | Warnings, caution indicators |
| `--color-warning-bg` | `rgba(245, 158, 11, 0.12)` | `rgba(217, 119, 6, 0.12)` | Warning background |
| `--color-error` | `#EF4444` | `#DC2626` | Errors, destructive actions |
| `--color-error-bg` | `rgba(239, 68, 68, 0.12)` | `rgba(220, 38, 38, 0.12)` | Error background |
| `--color-info` | `#3B82F6` | `#2563EB` | Informational messages |
| `--color-info-bg` | `rgba(59, 130, 246, 0.12)` | `rgba(37, 99, 235, 0.12)` | Info background |

> Light theme semantic colors use darker shades (600-700 range) for better contrast on white backgrounds.

---

## Theory Colors (Assessment-Specific)

These tokens identify each psychological theory in the Electia assessment platform. Each theory has a foreground color and a translucent background.

| Token | Dark Value | Light Value | Usage |
|-------|-----------|-------------|-------|
| `--theory-mbti` | `#22D3EE` | `#0891B2` | MBTI theory label, icon |
| `--theory-mbti-bg` | `rgba(34, 211, 238, 0.15)` | `rgba(8, 145, 178, 0.15)` | MBTI badge/chip background |
| `--theory-enneagram` | `#A78BFA` | `#7C3AED` | Enneagram theory label, icon |
| `--theory-enneagram-bg` | `rgba(167, 139, 250, 0.15)` | `rgba(124, 58, 237, 0.15)` | Enneagram badge/chip background |
| `--theory-bigfive` | `#60A5FA` | `#2563EB` | Big Five theory label, icon |
| `--theory-bigfive-bg` | `rgba(96, 165, 250, 0.15)` | `rgba(37, 99, 235, 0.15)` | Big Five badge/chip background |
| `--theory-disc` | `#FB923C` | `#EA580C` | DISC theory label, icon |
| `--theory-disc-bg` | `rgba(251, 146, 60, 0.15)` | `rgba(234, 88, 12, 0.15)` | DISC badge/chip background |
| `--theory-lesenne` | `#F472B6` | `#DB2777` | Le Senne theory label, icon |
| `--theory-lesenne-bg` | `rgba(244, 114, 182, 0.15)` | `rgba(219, 39, 119, 0.15)` | Le Senne badge/chip background |
| `--theory-jung` | `#FBBF24` | `#D97706` | Jung theory label, icon |
| `--theory-jung-bg` | `rgba(251, 191, 36, 0.15)` | `rgba(217, 119, 6, 0.15)` | Jung badge/chip background |

---

## DISC Dimensions

Each DISC dimension has a dedicated color for charts, badges, and dimension indicators.

| Token | Dark Value | Light Value | Dimension |
|-------|-----------|-------------|-----------|
| `--disc-d` | `#EF4444` | `#DC2626` | **D**ominance (red) |
| `--disc-i` | `#F59E0B` | `#D97706` | **I**nfluence (amber) |
| `--disc-s` | `#22C55E` | `#16A34A` | **S**teadiness (green) |
| `--disc-c` | `#3B82F6` | `#2563EB` | **C**onscientiousness (blue) |

---

## MBTI Axes

Each MBTI preference axis has a dedicated color for radar charts, bars, and type breakdowns.

| Token | Dark Value | Light Value | Axis |
|-------|-----------|-------------|------|
| `--mbti-ei` | `#F59E0B` | `#D97706` | **E**xtraversion / **I**ntroversion (amber) |
| `--mbti-sn` | `#6366F1` | `#4F46E5` | **S**ensing / i**N**tuition (indigo) |
| `--mbti-tf` | `#0EA5E9` | `#0284C7` | **T**hinking / **F**eeling (sky blue) |
| `--mbti-jp` | `#10B981` | `#059669` | **J**udging / **P**erceiving (emerald) |

---

## Big Five Dimensions

Each Big Five (OCEAN) factor has a dedicated color for visualization and reporting.

| Token | Dark Value | Light Value | Factor |
|-------|-----------|-------------|--------|
| `--bigfive-o` | `#6366F1` | `#4F46E5` | **O**penness (indigo) |
| `--bigfive-c` | `#0EA5E9` | `#0284C7` | **C**onscientiousness (sky blue) |
| `--bigfive-e` | `#F59E0B` | `#D97706` | **E**xtraversion (amber) |
| `--bigfive-a` | `#10B981` | `#059669` | **A**greeableness (emerald) |
| `--bigfive-n` | `#EF4444` | `#DC2626` | **N**euroticism (red) |

---

## Chart Colors

| Token | Dark Value | Light Value | Usage |
|-------|-----------|-------------|-------|
| `--chart-gradient-start` | `rgba(45, 212, 191, 0.25)` | `rgba(29, 78, 216, 0.25)` | Area chart gradient top |
| `--chart-gradient-end` | `rgba(45, 212, 191, 0.02)` | `rgba(29, 78, 216, 0.02)` | Area chart gradient bottom |
| `--chart-line` | `#2DD4BF` | `#1D4ED8` | Line chart stroke |
| `--chart-grid` | `#1E2736` | `#E8ECF0` | Chart grid lines |

---

## Usage Guidelines

### Do

- Use `--bg-surface-1` through `--bg-surface-3` to create visual depth hierarchy.
- Pair semantic colors with their `-bg` variant for alerts and status indicators.
- Use `--text-on-color` for any text placed directly on a colored (non-surface) background.
- Use theory/DISC/MBTI/Big Five tokens exclusively for their designated assessment contexts.

### Don't

- Don't hardcode hex values. Always reference the token.
- Don't use dark-theme values in light theme or vice versa; the tokens handle switching automatically.
- Don't use `--accent-primary` for semantic meaning (success, error, etc.) -- use the semantic tokens.
- Don't mix theory colors across different assessment frameworks (e.g., DISC colors for MBTI axes).
