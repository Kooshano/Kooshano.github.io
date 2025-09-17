Fix: theme toggle and quantum canvas

- Removed duplicate theme code blocks that re-declared `themeToggle`, `applyTheme`, and `swapThemeImages`, which caused a script parse error and broke dark/light toggling.
- Removed leftover "Modal Preview" logic that referenced non-existent `modalOverlay`/`modalCloseBtn`/`modalBody` elements, which threw runtime errors.
- Consolidated theme detection into one robust block (respects `prefers-color-scheme`, `localStorage`, updates icons with `data-src-dark`/`data-src-light`).
- Made the quantum background read theme from `data-theme` with a safe fallback to system preference (no undefined variables).

Result: Dark/Light mode toggle works, images swap correctly, and the quantum particle background renders again.