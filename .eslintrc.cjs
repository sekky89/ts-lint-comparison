module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 'latest',
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json', './tsconfig.app.json', './tsconfig.node.json'],
  },
  plugins: ['react', '@typescript-eslint', 'import', 'unused-imports'],
  ignorePatterns: ['*.js', '**/dist/**', '**/apizod.ts'],
  rules: {
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'warn',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],
    'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
    'import/extensions': [
      'error',
      'ignorePackages',
      { js: 'never', jsx: 'never', ts: 'never', tsx: 'never' },
    ],
    'import/prefer-default-export': 'off',
    'react/function-component-definition': ['error', { namedComponents: 'arrow-function' }],
    'sort-imports': ['error', { ignoreCase: true, ignoreDeclarationSort: true }],
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
        'newlines-between': 'always',
        pathGroupsExcludedImportTypes: ['builtin'],
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/vite.config.ts',
          '**/*.test.{js,ts,jsx,tsx}',
          '**/*.spec.{js,ts,jsx,tsx}',
        ],
      },
    ],
    '@typescript-eslint/consistent-type-imports': 'error',
    'react/require-default-props': 'off',
  },
  settings: {
    'import/resolver': {
      typescript: { alwaysTryTypes: true, project: ['./tsconfig.app.json'] },
      node: { extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts'] },
    },
  },
  overrides: [
    {
      files: ['src/ng-examples/12-no-restricted-exports-ng.tsx'],
      rules: {
        'no-restricted-exports': ['error', { restrictDefaultExports: { direct: true } }],
      },
    },
    {
      files: ['src/ng-examples/08-remaining-core-ng.tsx'],
      rules: {
        'no-irregular-whitespace': ['error', { skipStrings: false }],
        'prefer-destructuring': ['error', { object: true, array: true }],
      },
    },
    {
      files: ['src/ng-examples/01-typescript-eslint-ng.tsx'],
      rules: {
        '@typescript-eslint/prefer-as-const': 'error',
      },
    },
    {
      files: ['src/ng-examples/03-core-js-best-practices-ng.tsx'],
      rules: {
        'no-labels': 'off',
        'no-extra-label': 'error',
      },
    },
    {
      files: ['src/ng-examples/sort-imports-ng.tsx'],
      rules: {
        'sort-imports': ['error', { ignoreCase: true, ignoreDeclarationSort: false }],
      },
    },
    {
      files: ['src/ng-examples/export-not-last.tsx'],
      rules: {
        'import/exports-last': 'error',
      },
    },
  ],
};
