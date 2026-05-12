module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'no-loops', 'unused-imports', 'eslint-comments', 'header'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    // Comentários
    'no-inline-comments': 'error', 
    'no-warning-comments': ['error', { terms: ['todo', 'fixme', 'xxx'], location: 'anywhere' }],
    'spaced-comment': ['error', 'never'], // Proíbe comentários de bloco e JSDoc
    'eslint-comments/no-use': 'error',
    // Importações
    'no-unused-vars': 'error',
    'unused-imports/no-unused-imports': 'error',
    'no-restricted-imports': [
      'error',
      {
        patterns: ['*.*'],
        paths: [{ name: '*', importNames: ['*'] }],
      },
    ],
    // Tamanho de métodos e arquivos
    'max-lines': ['error', 300],
    'max-lines-per-function': ['error', 30],
    'max-len': ['error', { code: 140 }],
    // Estilo de código
    'brace-style': ['error', '1tbs', { allowSingleLine: false }],
    'curly': ['error', 'all'],
    'no-empty': ['error', { allowEmptyCatch: false }],
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    'comma-dangle': ['error', 'always-multiline'],
    'semi': ['error', 'always'],
    'quotes': ['error', 'double', { avoidEscape: true }],
    'no-multi-spaces': 'error',
    'no-multiple-empty-lines': ['error', { max: 1 }],
    'eol-last': ['error', 'always'],
    'no-tabs': ['error'],
    // Visibilidade e modificadores
    '@typescript-eslint/explicit-member-accessibility': ['error', { accessibility: 'no-public' }],
    '@typescript-eslint/member-ordering': 'error',
    // Outras regras
    'no-multiple-empty-lines': ['error', { max: 1 }],
    'no-multi-assign': 'error',
    'no-duplicate-imports': 'error',
    'no-useless-constructor': 'error',
    'no-underscore-dangle': 'error',
    'no-console': 'warn',
    'no-debugger': 'error',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  ignorePatterns: ['dist', 'build', 'node_modules'],
};
