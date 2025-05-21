import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'
import react from 'eslint-plugin-react'
import reactNative from 'eslint-plugin-react-native'
import prettier from 'eslint-plugin-prettier'

export default [
    {
        files: ['src/**/*.{ts,tsx,js,jsx}'],
        ignores: ['node_modules', 'dist'],
        languageOptions: {
            parser: tsparser,
            ecmaVersion: 'latest',
            sourceType: 'module',
        },
        plugins: {
            '@typescript-eslint': tseslint,
            react,
            'react-native': reactNative,
            prettier,
        },
        rules: {
            ...tseslint.configs.recommended.rules,
            'prettier/prettier': 'error',
            'react/react-in-jsx-scope': 'off',
            'react-native/no-inline-styles': 'off',
        },
    },
]
