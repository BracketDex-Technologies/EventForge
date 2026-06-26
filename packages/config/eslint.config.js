// @ts-check
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";

/**
 * Shared ESLint 9 flat-config base.
 *
 * Apps extend this by spreading `...base` and appending framework-specific
 * plugins (e.g. `@next/next`, `@nestjs`).  Prettier must come last to
 * disable formatting rules that conflict.
 *
 * @type {import("eslint").Linter.Config[]}
 */
const base = [
  ...tseslint.configs.recommended,
  prettierConfig,
  {
    rules: {
      // --- TypeScript best-practices ---
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-empty-interface": "off",
      "@typescript-eslint/no-explicit-any": "warn",

      // --- General code quality ---
      "eqeqeq": ["error", "always", { null: "ignore" }],
      "no-console": "warn",
      "curly": ["error", "all"],
    },
  },
  {
    ignores: ["**/tailwind-preset.ts"],
  },
];

export default base;
