import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  // The home page code is ported unchanged from the Vite app. Its shared phone
  // passes refs down on purpose, and its links do full page loads so the
  // GSAP/WebGL hero is torn down cleanly when leaving the page.
  {
    files: ["src/hero/**", "src/device/**", "src/life/**", "src/sections/**"],
    rules: {
      "react-hooks/refs": "off",
      "@next/next/no-html-link-for-pages": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    ".next-*/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
