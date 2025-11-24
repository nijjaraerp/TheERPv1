# Nijjara ERP Theme Migration Report

## 1. Theme Specification (From `Proto.html`)

### 1.1 Brand & Typography
- **Primary Typeface:** `Cairo`, weights 300–700 for Arabic-first UI text.
- **Secondary Typeface:** `Share Tech Mono` for diagnostic overlays, boot logs, and system status readouts.
- **Font Usage Matrix:**
  - Headers & window titles: `Cairo` 600–700, letter-spacing: 0.5px.
  - Body copy: `Cairo` 400.
  - System console, audit logs, timers: `Share Tech Mono` 400.

### 1.2 Core Color Palette
| Token                      | Hex                         | Usage                       |
| -------------------------- | --------------------------- | --------------------------- |
| `--color-bg-dark-matter`   | `#07080D`                   | Global background, OS shell |
| `--color-bg-glass`         | `rgba(25, 28, 48, 0.6)`     | Glass panels, windows       |
| `--color-border-glass`     | `rgba(255, 255, 255, 0.15)` | Glass outlines              |
| `--color-text`             | `#E0E0E0`                   | Primary text                |
| `--color-text-muted`       | `#AAAAAA`                   | Secondary labels            |
| `--color-accent-primary`   | `#0078F0`                   | CTAs, toggle buttons        |
| `--color-accent-secondary` | `#00A0F0`                   | Hover/active states         |
| `--color-accent-red`       | `#D93030`                   | Critical buttons            |
| `--color-accent-green`     | `#30D970`                   | Success indicators          |

**Depth Tokens:**
- `--shadow-depth-md`: `0 5px 15px rgba(0,0,0,0.3)`
- `--shadow-depth-lg`: `0 10px 30px rgba(0,0,0,0.4)`

### 1.3 Layout & Structure
- **Viewport:** Full-screen immersive shell with hidden overflow.
- **Shell Layers:**
  1. `#holo-deck` radial gradient background.
  2. Particle grid overlay with `pulse` animation.
  3. Foreground components (status bar, dock, floating windows, FABs).
- **Interaction Zones:**
  - `#status-bar`: fixed top-left glass capsule for user + clock.
  - `#task-switcher`: auto-hide strip at top center.
  - `#neural-dock`: auto-hide bottom dock with module icons and layout controls.
  - `.app-window`: draggable/resizable content panes.
  - `.module-fab`: floating action button clusters per module.

### 1.4 Components & States
- **App Windows (`.app-window`):** Glassmorphic cards with header controls (min/max/close, FAB toggle). Support drag, resize, maximize/restore animations.
- **Dock Icons (`.dock-app`):** 70×70px rounded squares, scale + translate on hover, tooltip reveal.
- **Buttons:** Rounded 5–12px, accent gradients, hover lifts of 2–4px.
- **Forms & Tables:** Dark glass inputs, border glow on focus, thin scrollbars, hover rows lighten.
- **FAB:** Draggable node with radial spokes for quick actions, toggled per window.

### 1.5 Motion & Feedback
- **Boot Log:** Sequenced console entries with 100–400ms stagger.
- **Auto-hide Bars:** Dock and task switcher slide into view on hover (`transition: bottom/top 0.3s ease`).
- **Window Materialization:** `@keyframes materialize` scaling + rotateY effect.
- **Particles Pulse:** Slow 15s scaling opacity cycle for backdrop.
- **Toasts & Logs:** Fade/slide transitions within 200–300ms.

### 1.6 Responsiveness & Accessibility
- Maintains RTL direction.
- Responsive min widths for windows (300px) and dock (wrap friendly).
- High-contrast palette, focus outlines via accent glows, and pointer-state fallbacks.

---

Additional sections (implementation details, testing, and style guide) will be documented after code updates.
