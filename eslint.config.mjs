import { defineConfig, globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import react from "eslint-plugin-react";
import jsxA11Y from "eslint-plugin-jsx-a11y";
import _import from "eslint-plugin-import";
import { fixupPluginRules } from "@eslint/compat";
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

export default defineConfig([globalIgnores([
    "**/node_modules/",
    "**/bower_components/",
    "**/.next/",
    "**/out/",
    "**/build/",
    "**/dist/",
    "**/*.min.js",
    "**/*.bundle.js",
    "**/.cache/",
    "**/.eslintcache",
    "**/.tsbuildinfo",
    "**/coverage/",
    "**/.nyc_output/",
    "**/*.log",
    "**/npm-debug.log*",
    "**/yarn-debug.log*",
    "**/yarn-error.log*",
    "**/lerna-debug.log*",
    "**/.env",
    "**/.env.local",
    "**/.env.development.local",
    "**/.env.test.local",
    "**/.env.production.local",
    "**/.vscode/",
    "**/.idea/",
    "**/*.swp",
    "**/*.swo",
    "**/*~",
    "**/.DS_Store",
    "**/Thumbs.db",
    "public/sw.js",
    "public/workbox-*.js",
    "**/*.d.ts",
    "**/storybook-static/",
    "**/jest.config.js",
    "**/jest.setup.js",
    "!**/next.config.js",
    "!**/tailwind.config.js",
    "**/scripts/",
    "**/*.md",
    "!**/README.md",
]), {
    extends: [
        ...nextCoreWebVitals,
        ...compat.extends("plugin:@typescript-eslint/recommended"),
        ...compat.extends("plugin:react/recommended"),
        ...compat.extends("plugin:jsx-a11y/recommended"),
        ...compat.extends("prettier")
    ],

    plugins: {
        "@typescript-eslint": typescriptEslint,
        react,
        "jsx-a11y": jsxA11Y,
        import: fixupPluginRules(_import),
    },

    languageOptions: {
        parser: tsParser,
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

        "import/resolver": {
            typescript: {
                alwaysTryTypes: true,
                project: "./tsconfig.json",
            },

            node: {
                extensions: [".js", ".jsx", ".ts", ".tsx"],
            },
        },

        "import/parsers": {
            "@typescript-eslint/parser": [".ts", ".tsx"],
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

        "import/order": ["warn", {
            groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
            "newlines-between": "always",

            alphabetize: {
                order: "asc",
                caseInsensitive: true,
            },
        }],

        "import/no-unresolved": "off",

        "no-console": ["warn", {
            allow: ["warn", "error"],
        }],
    },
}, {
    files: ["**/*.ts", "**/*.tsx"],

    languageOptions: {
        ecmaVersion: 5,
        sourceType: "script",

        parserOptions: {
            project: "./tsconfig.json",
        },
    },
}]);