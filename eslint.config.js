import js from "@eslint/js";
import jsxA11y from "eslint-plugin-jsx-a11y";
import react from "eslint-plugin-react";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "app/frontend/routes.d.ts",
      "app/frontend/routes.js",
      "coverage/**",
      "docs/**",
      "node_modules/**",
      "public/**",
      "tmp/**",
      "vendor/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  react.configs.flat.recommended,
  react.configs.flat["jsx-runtime"],
  jsxA11y.flatConfigs.recommended,
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ["eslint.config.js"],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/member-ordering": [
        "error",
        { default: { memberTypes: ["signature", "field", "method"], order: "alphabetically" } },
      ],
      "@typescript-eslint/naming-convention": [
        "error",
        {
          format: ["PascalCase"],
          prefix: ["is"],
          selector: ["parameter", "typeProperty", "variable"],
          types: ["boolean"],
        },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-floating-promises": "error",
      eqeqeq: "error",
      "no-console": "error",
      "no-var": "error",
      "no-void": "error",
      "react/button-has-type": "error",
      "react/jsx-sort-props": ["error", { ignoreCase: true }],
    },
    settings: {
      react: { version: "detect" },
    },
  },
  {
    extends: [tseslint.configs.disableTypeChecked],
    files: ["eslint.config.js"],
  },
);
