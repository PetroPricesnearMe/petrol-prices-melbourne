import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import jsxA11Y from "eslint-plugin-jsx-a11y";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default tseslint.config(
    js.configs.recommended,
    {
        ignores: [
            "**/node_modules/",
            "**/.next/",
            "**/out/",
            "**/build/",
            "**/dist/",
            "**/.cache/",
            "**/.eslintcache",
            "**/coverage/",
            "**/*.log",
            "**/.env*",
            "**/storybook-static/",
            "**/.storybook/**", // Ignore Storybook config
            "**/jest.config.js",
            "**/jest.setup.js",
            "**/scripts/",
            "**/*.md",
            "!**/README.md",
            "lib/**", // Ignore legacy lib/ directory outside src/
            "**/playwright-report/**", // Ignore Playwright test reports
            "**/test-results/**", // Ignore test results
            "**/next-env.d.ts", // Ignore Next.js auto-generated type file
        ],
    },
    ...compat.extends("next/core-web-vitals"),
    // JavaScript and JSX files
    {
        files: ["**/*.{js,jsx}"],
        plugins: {
            react,
            "jsx-a11y": jsxA11Y,
        },
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        settings: {
            react: {
                version: "detect",
            },
        },
        rules: {
            "react/react-in-jsx-scope": "off",
            "react/prop-types": "off",
            "no-console": ["warn", {
                allow: ["warn", "error"],
            }],
        },
    },
    // TypeScript and TSX files with type checking
    {
        files: ["**/*.{ts,tsx}"],
        extends: [...tseslint.configs.recommended],
        plugins: {
            react,
            "jsx-a11y": jsxA11Y,
        },
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
                project: "./tsconfig.json",
            },
        },
        settings: {
            react: {
                version: "detect",
            },
        },
        rules: {
            "react/react-in-jsx-scope": "off",
            "react/prop-types": "off",
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/no-unused-vars": ["error", {
                argsIgnorePattern: "^_",
                varsIgnorePattern: "^_",
            }],
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/consistent-type-imports": ["error", {
                prefer: "type-imports",
            }],
            "no-console": ["warn", {
                allow: ["warn", "error"],
            }],
        },
    },
);
