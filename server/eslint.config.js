import pluginJs from '@eslint/js';
import globals from 'globals';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2022, // or the desired ECMAScript version
      },
      parserOptions: {
        ecmaVersion: 'latest',
      },
    },
  },
  pluginJs.configs.recommended,
];
