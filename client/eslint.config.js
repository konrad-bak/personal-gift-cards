import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import pluginPrettier from 'eslint-plugin-prettier';

export default tseslint.config(
  {
    ignores: ['dist'],
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      parser: tseslint.parser,
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
    plugins: {
      react: react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      prettier: pluginPrettier,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      'plugin:react/recommended',
      'plugin:react/jsx-runtime',
    ],
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'prettier/prettier': 'error',
    },
    ignores: ['dist'],
  },
  prettier
);
