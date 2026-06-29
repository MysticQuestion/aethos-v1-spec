# Mystic Sage / Aethos Design System

## Direction

The platform should feel timely, timeless, intelligent, minimal, grounded, and culturally graceful. The visual language is noir, smoke, graphite, bone, and restrained accent color. It should suggest black ink on rice paper, smoke in negative space, calligraphic restraint, martial discipline, editorial seriousness, and spiritual warmth without costume or cliché.

Do not use generic New Age styling, fake parchment, excessive purple/gold gradients, cartoon occult icons, neon glow, cluttered cards, or theatrical copy.

## Design tokens

### Color

| Token | Value | Use |
| --- | --- | --- |
| `--color-bg` | `#050505` | App background |
| `--color-surface` | `#101010` | Page sections and cards |
| `--color-surface-elevated` | `#171717` | Modals, active cards, sidebars |
| `--color-border` | `#2a2a2a` | Thin matte borders |
| `--color-text` | `#f4f1ea` | Primary text |
| `--color-text-secondary` | `#b8b8b8` | Secondary text |
| `--color-muted` | `#777777` | Metadata and disabled text |
| `--color-smoke` | `rgba(216, 211, 199, 0.12)` | Texture and dividers |
| `--color-accent` | `#b89b5e` | Muted brass accent, sparingly |
| `--color-cinnabar` | `#8f1d1d` | Deep red accent, sparingly |
| `--color-success` | `#7f9488` | Muted green-grey success |
| `--color-danger` | `#a3524f` | Restrained error/danger |

### CSS starter

```css
:root {
  color-scheme: dark;
  --color-bg: #050505;
  --color-surface: #101010;
  --color-surface-elevated: #171717;
  --color-border: #2a2a2a;
  --color-text: #f4f1ea;
  --color-text-secondary: #b8b8b8;
  --color-muted: #777777;
  --color-smoke: rgba(216, 211, 199, 0.12);
  --color-accent: #b89b5e;
  --color-cinnabar: #8f1d1d;
  --color-success: #7f9488;
  --color-danger: #a3524f;
  --radius-card: 14px;
  --radius-control: 10px;
  --shadow-matte: 0 18px 60px rgba(0, 0, 0, 0.32);
}
```

## Typography

- Sans: Inter, IBM Plex Sans, Geist, or similar.
- Serif: use only for major editorial headings if it adds dignity; keep it restrained.
- Mono: IBM Plex Mono or JetBrains Mono for schemas, methodology, and technical metadata.
- Body copy must prioritize readability: 16–18px base, generous line-height, short paragraphs.
- Avoid excessive tracking on long text.

## Layout

- Use disciplined grids and generous whitespace.
- Cards should feel editorial and matte, not ornamental.
- Prefer thin borders and subtle shadows over glow.
- Use fewer icons, larger content hierarchy, and clearer metadata.
- Keep max text widths comfortable for reading.
- Mobile layouts must reduce columns cleanly and keep CTA order logical.

## Components to standardize

- Page shell.
- Section header.
- Editorial card.
- Resource card.
- Workshop card.
- Tool status badge.
- Empty state.
- Disclaimer / boundary note.
- Form field and form section.
- Aethos app sidebar/top navigation.
- Payload preview / code block.

## Status badges

Use short, honest labels:

- Available
- Engine wired
- Tool prototype
- Research phase
- Requires backend
- In development
- Reference only
- Published

Style badges as low-contrast matte pills with accessible text contrast. Do not use glowing badges.

## Iconography

Use lucide or equivalent line icons sparingly. Prefer structural icons: compass, archive, ledger, map, timeline, book, signal, profile, scale, and restrained eye. Avoid sparkles, cartoon moons, excessive stars, and decorative occult clutter.

## Motion

- Subtle fade/slide only.
- Respect `prefers-reduced-motion`.
- No perpetual animations.
- Tarot can retain card reveal motion, but it should be refined and reduced-motion aware.

## Accessibility requirements

- WCAG AA contrast for text and controls.
- Visible focus states.
- Keyboard-accessible navigation and forms.
- Semantic headings.
- Alt text for meaningful images.
- Avoid color-only status communication.
- Form errors must be text-readable and connected to fields.
