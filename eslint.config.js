import js from "@eslint/js";
import pluginQuery from "@tanstack/eslint-plugin-query";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config([
  globalIgnores(["dist", "src/types/supabase.type.ts"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      ...pluginQuery.configs["flat/recommended"],
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/array-type": ["error", { default: "generic" }],
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: ["./tsconfig.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
]);
