import { defineConfig, presetWind4 } from "unocss";

// Starlight owns the global base/reset layer, so we explicitly DISABLE
// presetWind4's reset to avoid clobbering Starlight's typography. UnoCSS here
// only provides atomic utilities for our own components (landing page, cards).
export default defineConfig({
  presets: [
    presetWind4({
      preflights: { reset: false },
    }),
  ],
  theme: {
    colors: {
      // Mirror the Starlight CSS variables so utilities stay theme-aware
      // in both light and dark mode. See src/styles/theme.css.
      brand: {
        DEFAULT: "var(--edb-brand)",
        soft: "var(--edb-brand-soft)",
      },
      warm: {
        DEFAULT: "var(--edb-warm)",
        soft: "var(--edb-warm-soft)",
      },
    },
  },
  shortcuts: {
    // Repeated bundles used across the landing page and custom components.
    "edb-surface":
      "rounded-xl border border-[var(--sl-color-gray-5)] bg-[var(--sl-color-black)] p-5",
  },
});
