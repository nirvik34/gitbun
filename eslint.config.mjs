import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        ignores: ['dist/', 'node_modules/', 'frontend/', 'docs/', 'eslint.config.mjs', 'vitest.config.ts'],
    },
    {
        languageOptions: {
            parserOptions: {
                project: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'warn',
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': ['error'],
        },
    },
);
