import eslintjs from '@eslint/js';
import { includeIgnoreFile } from '@eslint/compat';
import globals from 'globals';
import typescriptEslint from 'typescript-eslint';
import * as path from 'path';
import { fileURLToPath } from 'url';
import prettier from 'eslint-config-prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
    includeIgnoreFile(path.resolve(__dirname, '.gitignore')),
    eslintjs.configs.recommended,
    ...typescriptEslint.configs.strictTypeChecked,
    ...typescriptEslint.configs.stylisticTypeChecked,
    prettier,
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ComponentFramework: true,
            },
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: 'module',
                projectService: true,
                tsconfigRootDir: __dirname,
            },
        },

        rules: {
            '@typescript-eslint/restrict-template-expressions': [
                'error',
                {
                    allowNumber: true,
                    allowRegExp: true,
                },
            ],
            '@typescript-eslint/no-empty-object-type': [
                'error',
                {
                    allowInterfaces: 'always',
                },
            ],
        },
    },
];
