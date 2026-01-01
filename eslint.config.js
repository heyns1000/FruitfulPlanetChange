import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '*.config.js',
      '*.config.ts',
      'run-audit.js',
      'run-enhanced-audit.js',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        // Node.js globals
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        Buffer: 'readonly',
        global: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'warn',
      'no-var': 'error',
    },
  },
  {
    // Allow console.log in CLI scripts and seed files
    files: [
      'server/**/*seed*.ts',
      'server/**/*-seed*.ts',
      'server/**/*seeder*.ts',
      'server/**/update-*.ts',
      'server/**/verify-*.ts',
      'server/**/execute-*.ts',
      'server/**/complete-*.ts',
      'server/**/comprehensive-*.ts',
      'server/**/global-*.ts',
      'server/**/activate-*.ts',
      'server/**/ensure-*.ts',
      'server/**/final-*.ts',
      'server/**/enhanced-*.ts',
      'server/**/*audit*.ts',
      'server/**/live-*.ts',
      'scripts/**/*.ts',
    ],
    rules: {
      'no-console': 'off',
    },
  },
];
