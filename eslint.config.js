import prettier from 'eslint-config-prettier';
import js from '@eslint/js';
import { includeIgnoreFile } from '@eslint/compat';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import { fileURLToPath } from 'node:url';
const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: [
      'node_modules/',
      'build/',
      'dist/',
      'public/',
      '.svelte-kit/',
      '.vscode/' // If using test coverage reports
    ]
  },
  includeIgnoreFile(gitignorePath),
  js.configs.recommended,
  ...svelte.configs['flat/recommended'],
  prettier,
  ...svelte.configs['flat/prettier'],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },
  {
    rules: {
      // Warn specifically on console.log usage
      'no-restricted-syntax': [
        'warn',
        {
          selector: "MemberExpression[object.name='console'][property.name='log']",
          message: 'Avoid using console.log in production code.'
        }
      ]
    }
  }
];
