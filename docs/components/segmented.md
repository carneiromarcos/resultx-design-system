# Segmented control

Pick **one** value out of a few, with all the options visible at once. "Humano / Agente / Observar".

## Not tabs, and not a toggle

| Component | What it does |
|-----------|--------------|
| `.tabs` | Switches the **view**. The content below changes |
| `.toggle` | Flips one thing on or off. Binary |
| `.segmented` | Sets a **value** among N. Nothing else on screen has to change |

They look alike and they promise different things to a screen reader. Using tabs for a value is how a user ends up hearing "tab, 1 of 3" for something that is not a tab.

## No JavaScript

A native group of `<input type="radio">` already gives you arrow-key navigation, selection with Space, focus management, form participation, and the announcement "Humano, radio button, 1 of 3, selected". There is no `dist/segmented.js`, and a test fails if one ever appears — that would mean somebody reimplemented in JavaScript what the browser hands over for free.

Measured in Chrome: pressing `←` twice moved the selection `observar → agente → humano` with no script loaded. Tabbing into the group lands on **one** radio, and the next Tab leaves the group entirely — the roving tab stop is the browser's, not ours.

## Component Anatomy

```
fieldset.segmented [.segmented-stacked] [.segmented-sm|-lg] [.segmented-block]
  legend.segmented-legend | legend.sr-only
  label.segmented-option
    input[type=radio]        (visually clipped, never display:none)
    svg.segmented-icon       (aria-hidden)
    span.segmented-label
```

## Markup

```html
<fieldset class="segmented segmented-stacked segmented-block">
  <legend class="sr-only">Modo de atendimento</legend>

  <label class="segmented-option">
    <input type="radio" name="modo" value="humano" checked>
    <svg class="segmented-icon" aria-hidden="true">…</svg>
    <span class="segmented-label">Humano</span>
  </label>
  …
</fieldset>
```

Every `<input>` in the group needs the same `name` — that is what makes it a group in the first place, and what makes the arrow keys work.

Use `.segmented-legend` when the label should be visible, and `.sr-only` when the surrounding block already shows a heading — a `.disclosure-label`, for instance.

## Classes

| Class | Role |
|-------|------|
| `.segmented` | The `<fieldset>`. Equal columns, recessed surface |
| `.segmented-legend` | Visible group label |
| `.segmented-option` | The `<label>` wrapping one radio. `min-height: 44px` |
| `.segmented-icon` | 16×16, decorative |
| `.segmented-label` | Text. Truncates instead of wrapping |
| `.segmented-stacked` | Icon above the label — fits more text per column |
| `.segmented-sm` / `.segmented-lg` | 32px / 52px |
| `.segmented-block` | Fill the available width |
| `.segmented-chips` | Loose pills that wrap, instead of one joined bar |
| `.form-label-eyebrow` | The same label rule as `.segmented-legend`, for a `<label>` on a `<select>` |

### `.segmented-chips`

The base bar uses `grid-auto-columns: 1fr`, which gives every option the same width and keeps them on one line. That is right for `Day / Week / Month` and unworkable for a group of labels of very different lengths — it would either squeeze the short ones or overflow the box.

`.segmented-chips` changes the container and the frame, nothing else:

| | Base bar | `.segmented-chips` |
|---|---|---|
| layout | `grid`, equal columns, one line | `flex`, `flex-wrap: wrap` |
| frame | border + recessed surface on the **group** | border + surface on **each chip** |
| chip shape | `var(--radius-md)` | `var(--radius-full)` |

**It is the same machine in another shape, not a second component.** The native radio, the `:has()` states, the 44px target and the focus ring are all inherited from `.segmented-option`. A test asserts there is exactly **one** `:has(input[type="radio"]:checked)` block in the file — a second one would be the duplication already paid for twice, with `.btn-icon` in Wave 2 and `.layout-list-item` in Wave 3.

## How the state is read

`:has()` reads the radio's state from inside the label, which is what lets the whole control react with no script:

```css
.segmented-option:has(input[type="radio"]:checked) { … }
```

The variants are declared **before** the states on purpose: the state selectors carry `:has()` and are more specific. Reversed, a size variant would win and the selected option would stop standing out. A test asserts the order.

## Tokens

| Token | Used for |
|-------|----------|
| `--bg-surface-2` / `--bg-surface-3` | Track, hover |
| `--border-subtle` / `--border-accent` | Track border, selected border |
| `--accent-primary-muted` / `--accent-primary-text` | Selected fill and label |
| `--focus-ring-width` / `--focus-ring-color` | Focus |

The selected label uses `--accent-primary-text` rather than `--accent-primary`, so a brand whose accent is too dark to read as text still gets a legible selected state. See [../brand-bridge.md](../brand-bridge.md).

## Accessibility

- Role, group semantics, arrow keys and the single tab stop come from the native radio group.
- The radio is clipped, never `display: none` — that would remove it from the keyboard and from the accessibility tree, which is the whole reason to use it.
- Options are 44px tall. WCAG 2.2 SC 2.5.8 asks for 24px.
- Mark the icon `aria-hidden="true"`; the label already names the option.
- The selected state carries **weight and border** alongside color, so it does not rest on hue alone.
- Verified accessibility tree: `group "Modo de atendimento"` containing `radio "Humano" [checked]`, `radio "Agente"`, `radio "Observar"`.

## See also

- [list-item.md](list-item.md) · [disclosure.md](disclosure.md) · [split-pane.md](split-pane.md)
- `demos/inbox-panel.html`
