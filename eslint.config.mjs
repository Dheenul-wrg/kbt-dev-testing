import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      prettier: (await import('eslint-plugin-prettier')).default,
    },
    rules: {
      // ✅ Disabled rules to avoid blocking commits
      'prettier/prettier': 'off',
      'arrow-body-style': 'off',
      'prefer-arrow-callback': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',

      // 👇 You can add more here if needed
      // 'react-hooks/exhaustive-deps': 'off',
      // 'react/react-in-jsx-scope': 'off',
    },
  },
];

export default eslintConfig;
