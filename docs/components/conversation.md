# Conversation surface

Three components that only make sense together, in the same thread: the message stream, the audio player, and the composer.

## Message

```
.message-stream
  .message-day > span          "Hoje" — sticks to the top while scrolling
  p.message-event              the system speaking, not a person
  article.message [.message-out]
    .message-bubble
      p.message-text
      footer.message-foot
        .message-author  .message-time  svg.message-receipt
    .message-actions           reactions, outside the bubble
```

**A system event is not a message.** "Marcos Carneiro assumiu o atendimento" has no author, no receipt, and should not be announced as speech. That is why it is a `<p class="message-event">` while a message is an `<article>` — the distinction lives in the markup, not only in the styling.

### Two decisions worth knowing

**The bubble is capped at `min(60ch, 78%)`.** A reading measure, not the column width: a 120-character line is tiring even when it fits. Measured in an 824px stream, the widest bubble sat at 208px — its natural width, well under the 643px ceiling.

**`overflow-wrap: anywhere` on the text.** A pasted URL with no spaces would otherwise push the bubble past its own maximum.

### Classes

| Class | Role |
|-------|------|
| `.message-stream` | The thread. Vertical rhythm lives here, not on each message |
| `.message-day` | Sticky date marker |
| `.message-event` | System event, with a rule on each side |
| `.message` / `.message-out` | Incoming (left) / outgoing (right) |
| `.message-bubble` | The bubble itself |
| `.message-text` | Body copy |
| `.message-foot` | Author, time, receipt |
| `.message-receipt` / `-read` | Delivery state |
| `.message-actions` | Reactions, aligned to the bubble's side |

The receipt differs first in **shape** — one tick against two, chosen in the SVG — and only then in color. Colour alone would not survive a colour-blind reader.

---

## Audio player

**It starts from a native `<audio controls>`.** Without JavaScript the browser's own player is visible and the audio still plays. A player that needs a script to make sound turns a voice message into nothing.

```html
<div class="audio-player" data-audio-player>
  <audio class="audio-native" src="…" controls preload="metadata"></audio>

  <button class="audio-play" type="button" aria-label="Reproduzir">…</button>
  <div class="audio-body">
    <div class="audio-wave">
      <span class="audio-bar" style="--level: .4"></span>
      …
    </div>
    <div class="audio-meta">
      <time class="audio-time">0:04</time>
      <button class="audio-rate" type="button">1×</button>
    </div>
  </div>
</div>
```

Load `resultx-design-system/audio-player` and the script removes `controls`, hides the native element and reveals this interface.

### The waveform is data, not decoration

Each bar's height comes from `--level` (0 to 1), computed by whatever produced the audio. The DS draws the wave; it does not invent it. A 12% floor keeps a silent bar from vanishing entirely.

| API | Effect |
|-----|--------|
| `ResultXAudioPlayer.init(root)` | Enhance every `[data-audio-player]` |
| `ResultXAudioPlayer.play(el)` / `.pause(el)` | Transport |
| `ResultXAudioPlayer.seek(el, seconds)` | Jump to a position |

Dispatches `audioplaystate` with `detail: { playing }`.

### Behaviour

- The wave is a `slider`: focusable, `←`/`→` seek ±5s, `Home`/`End` jump to the ends, Space toggles play. `aria-valuetext` announces "0:02 de 0:04" rather than a raw number.
- Clicking anywhere on the wave seeks to that point.
- Rate cycles 1× → 1.5× → 2×.
- **Only one player sounds at a time.** Starting one pauses the others — two voice messages at once is not a feature.
- Nothing is persisted; there is nothing worth remembering between visits.

---

## Composer

```html
<div class="composer" data-composer>
  <div class="composer-tools">
    <button class="composer-tool" type="button" aria-label="Anexar">…</button>
  </div>
  <div class="composer-row">
    <label class="sr-only" for="msg">Mensagem</label>
    <textarea class="composer-input" id="msg" rows="1" placeholder="Mensagem…"></textarea>
    <button class="composer-send" type="button" aria-label="Gravar áudio">…</button>
  </div>
</div>
```

Not `.form-textarea`: that one is a form field with its own border, an 88px minimum and vertical resize. Here the border belongs to the whole bar — `:focus-within` lights it up — and the height follows the content.

### What this component deliberately does not do

Enter-to-send, Shift+Enter for a newline, `/` for quick replies, `@` to mention. That is **product policy**, not a visual system decision — a support inbox and a comment box want different answers. A test fails if a `keydown` handler ever appears in `dist/composer.js`.

### Growth

`field-sizing: content` does the work where the browser supports it; `dist/composer.js` covers the rest and attaches nothing at all when the native property exists. The ceiling is `calc(var(--leading-normal) * 6em)` — six lines, expressed in lines so it follows the brand's type scale instead of a pixel guess.

Measured in Chrome, which has `field-sizing` natively, so the CSS alone did it: 36px empty → 75px at three lines → 117px at ten lines, capped → back to 36px when cleared.

| API | Effect |
|-----|--------|
| `ResultXComposer.init(root)` | Enhance every `[data-composer]` |
| `ResultXComposer.resize(input)` | Recompute one field |
| `ResultXComposer.clear(input)` | Empty it and collapse it |
| `ResultXComposer.supportsNative` | Whether the browser handles growth itself |

---

## Accessibility across the three

- Give every icon-only button an `aria-label`; the icon itself is `aria-hidden`.
- Play and record buttons are 44px. WCAG 2.2 SC 2.5.8 asks for 24px.
- The composer's `<textarea>` needs a label — use `.sr-only` when the placeholder is the only visible text. A placeholder is not a label.
- Everything works from the keyboard; the pointer is never the only route.
- All three honour `prefers-reduced-motion`.

## See also

- [split-pane.md](split-pane.md) · [disclosure.md](disclosure.md) · [segmented.md](segmented.md) · [list-item.md](list-item.md)
- [navigation.md](navigation.md) — the rail these screens sit beside
- `demos/inbox-panel.html` — all nine components in one screen
