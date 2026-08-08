# ADR-0001 — Tokens are named by role, never by appearance

- **Status:** Proposed
- **Date:** 2026-08-07
- **Related:** [brand-bridge.md](../brand-bridge.md) — the mechanism this grammar governs

## What this ADR corrects about its own premise

The portfolio notes carried this as *"the canonical role-named foundation still needs to be written."* **It is already written.** Measured before proposing anything:

| Where | Tokens | Carrying a colour name |
|---|---:|---:|
| `tokens/tokens.css` — the foundation | 136 | **0** |
| `brands/*/tokens/*.css` | 533 | 99 |

The foundation is already 100% role-named. And inside `brands/`, the colour names are **accurate**: of the 84 that name a colour family and hold a hex, 74 match the actual hue. The 10 that "failed" were an artefact of my own hue bands (260–265° for purple, 36–38° for gold) — they are legitimately purple and gold. **No brand token lies.**

So the problem is not a missing foundation, and not the brand layer. It is at the **consumer boundary**, and there it is severe.

## Context — what is actually broken

Measured in the Electia dashboard **logged in, in production**, on 2026-08-07.

### The token that lies

```css
/* electia/src/app/globals.css:49 */
--accent-teal: #6f32b1;        /* hue 269° — purple */
--accent-teal-hover: #a55eea;  /* purple */
```

A token named *teal* holding *purple*. The brand migrated teal → purple on 2026-05-24 and renamed `--teal-*` → `--purple-*` **inside `brands/`** — but the consumer's own alias kept the old name and swapped the value underneath it.

This is not cosmetic. `globals.css` re-exports it through `@theme inline`, so the whole app writes utilities that say one thing and paint another:

```html
<div class="bg-accent-teal">   <!-- renders purple -->
```

**296 occurrences across 97 files**, plus 468 of `--accent-on-dark`.

### The role-named token that is ignored

At the same time, in the same page:

| Token | Value in production | Read by the app? |
|---|---|---|
| `--accent-primary` (role name, from the DS) | `#2dd4bf` — **teal**, the stale value | **no** — 0 references in app code |
| `--accent-teal` (appearance name, from the app) | `#6f32b1` — purple, correct | yes, everywhere |

A perfect inversion. The token named for its **role** holds the wrong value and nobody reads it; the token named for its **appearance** holds the right value, is read everywhere, and its name is false.

`--accent-primary-text` is worse: it resolves to `#2dd4bf`, identical to `--accent-primary`. Anything using it as ink on the accent fill would render invisible. It ships as a same-value default precisely so a bridge can override it — and no bridge is applied here.

### The bridge already solves this and is not imported

`brands/electia/tokens/ds-bridge.css` already sets `--accent-primary: #6f32b1` in all four theme scopes, with `--accent-primary-text: #c084fc` **measured** at 7.31:1. The consumer imports only:

```css
@import "resultx-design-system/tokens";
@import "resultx-design-system/components/data-cards";
```

The bridge line is missing. The mechanism was built, shipped in v2.3.0, and never wired.

## Decision

**A token's name states the job it does, never the colour it happens to be.**

1. **Foundation and bridge tokens are role-named.** `--accent-primary`, `--accent-primary-text`, `--sidebar-active-bg`, `--border-accent`. Already true; this ADR makes it binding rather than incidental.

2. **Appearance-named tokens are legal in exactly one place — `brands/*/tokens/tokens.css`** — as the brand's own palette (`--purple-600`, `--gold`). That layer describes pigment, and naming pigment after its colour is correct. It is the layer's *only* job.

3. **A consumer must not re-alias a brand colour under an appearance name.** `--accent-teal` in an app is the defect this ADR exists to prevent: it is the one place where a name can go stale without anything failing.

4. **The bridge is the only sanctioned path from brand to component.** A consumer imports the DS tokens, then its brand bridge. It does not hand-copy hex values into local aliases.

### Why the name matters more than the value

A wrong value gets caught — someone sees teal where purple belongs. A wrong *name* is caught by nobody: it renders correctly forever and misleads every person who reads the code afterwards. The migration of 2026-05-24 changed every value correctly and left the names behind; four months later the app still tells its own developers it is teal.

Role names also survive rebrands by construction. `--accent-primary` needed no edit when teal became purple. `--accent-teal` needed either a rename across 97 files, or a lie. It got the lie.

## What this costs

Honest sizing, so the decision is made with the bill visible:

| Work | Size |
|---|---|
| Import the bridge in Electia | **1 line** |
| Rename `accent-teal` → role name | 296 occurrences · 97 files |
| Rename `accent-on-dark` → role name | 468 occurrences |

The first is trivial and worth doing on its own. The other two are a migration, not an edit — and Electia is under a scope freeze.

**Recommended path — alias first, big-bang never.** The same tactic that retired `.layout-list-item` in the DS: keep the old name as an alias pointing at the new role token, so nothing breaks on day one, and let the old name die by attrition.

```css
/* electia/globals.css — transitional */
@import "resultx-design-system/tokens";
@import "resultx-design-system/brands/electia/bridge";   /* ← the missing line */

:root {
  /* Deprecated: kept so the 296 existing call sites keep working.
     New code uses --accent-primary. Delete when the count reaches 0. */
  --accent-teal: var(--accent-primary);
  --accent-teal-hover: var(--accent-primary-hover);
  --accent-teal-muted: var(--accent-primary-muted);
}
```

After that the rename is mechanical, file by file, with the occurrence count as the progress bar.

## Consequences

**Good**

- The next rebrand touches `brands/`, and nothing else.
- `--accent-primary-text` starts carrying its measured ink (7.31:1) instead of a same-value placeholder — the bridge build already refuses to emit anything below 4.5:1.
- Reading a token name becomes trustworthy again.

**Bad, and worth stating plainly**

- Adopting the bridge **changes pixels in production**. Anything resolving `--accent-primary` flips from teal to purple. That is a correction, not a regression — but it is visible, and Electia deploys straight to real users.
- The transitional alias means two names for one thing for a while. That is the price of not doing a 97-file big-bang under a scope freeze.
- This ADR does not fix the other three consumers. It states the grammar; adoption is per-product.

## Open, not decided here

- Whether `--accent-on-dark` (468 uses) is a role or an appearance name. It describes a *surface condition*, not a job — arguably it should be `--accent-primary-text`, which the bridge already provides. Needs its own pass.
- Whether the DS should **fail the build** when a consumer defines an appearance-named alias over a bridge token. Enforceable, but it would break the transitional alias above.

## Evidence

Every number here was measured on 2026-08-07, not estimated:

- Token counts — parsed from `tokens/tokens.css` and `brands/*/tokens/*.css`
- Hue verification — HSV conversion of every hex whose name states a colour family
- Production values — `getComputedStyle` in the logged-in dashboard at `electia.empregamais.me`
- Occurrence counts — `grep -r` over `electia/src`
