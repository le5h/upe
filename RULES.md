# Rules

## Commit format

```
short title: highlights

- Main feature one
- Main feature two
- Main feature three

Small changes: cleanup, renames, minor fixes.
```

Title is a concise summary. Features listed as bullet points. Trailing line summarizes small/incidental changes.

## Coding approach

- **Keep it simple** — prefer the clearest solution, not the cleverest. Flat structures over deep abstraction until there's a proven need.
- **Reuse existing code** — check for existing utilities, hooks, icons, and CSS tokens before adding something new. Duplication is only justified when the two cases are genuinely independent.
- **Write reusable** — when extracting a function, component, or style, make it general enough that the next similar need can use it without modification. Name it by what it does, not where it's used.
- **Follow atomic design** — atoms (smallest UI pieces), molecules (composed atoms), organisms (complex sections), pages. A file in `atoms/` must not import from `molecules/` or `organisms/`; `molecules/` may import from `atoms/` but not `organisms/`.
- **CSS before JS** — prefer CSS custom properties, utility classes, and existing design tokens (`--space-*`, `--fs-*`, `--radius-*`) over inline styles or JS-driven layout.
- **No comments** — code should be self-documenting. Only add a comment when the reason for a decision is non-obvious and can't be expressed in code.
