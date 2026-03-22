# Wobblite

Put your licensed files here (same names):

- **`Wobblite-Regular.woff2`** (preferred for web)
- **`Wobblite-Regular.ttf`** (fallback if you don’t have WOFF2)

The app loads them via `@font-face` in `app/globals.css` (URLs `/font/wobblite-font/...`). The hero uses the Tailwind class **`font-wobblite`**.

If you use different filenames, update the `src:` lines in `app/globals.css` to match.

See `iFonts-License.txt` for licensing.
