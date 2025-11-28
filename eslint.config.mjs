import typescriptEslint from "@typescript-eslint/eslint-plugin";
import react from "eslint-plugin-react";
import jsxA11Y from "eslint-plugin-jsx-a11y";
import tsParser from "@typescript-eslint/parser";
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

export default [
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
            "**/jest.config.js",
            "**/jest.setup.js",
            "**/scripts/",
            "**/*.md",
            "!**/README.md",
        ],
    },
    ...compat.extends("next/core-web-vitals"),
    {
        files: ["**/*.{js,jsx,ts,tsx}"],
        plugins: {
            "@typescript-eslint": typescriptEslint,
            react,
            "jsx-a11y": jsxA11Y,
        },
        languageOptions: {
            parser: tsParser,
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
];
