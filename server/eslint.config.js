import pluginJs from '@eslint/js';
import globals from 'globals';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: {
      globals: {
        ...globals.node, // Use Node.js globals
      },
      parserOptions: {
        ecmaVersion: 'latest', // or the desired ECMAScript version
      },
    },
    env: {
      node: true, // Specify Node.js environment
      es6: true, // Specify ES6 environment
    },
  },
  pluginJs.configs.recommended,
];
