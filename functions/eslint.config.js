import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,ts}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    plugins: {
      import: importPlugin,
    },
    rules: {
      'quotes': ['error', 'double'],
      'import/no-unresolved': 'off',
      'indent': ['error', 2],
    },
    ignores: [
      'lib/**/*',
      'generated/**/*',
    ],
  },
];
