module.exports = {
  parser: '@babel/eslint-parser',
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  plugins: ['react', 'react-hooks'],
  rules: {
    'no-unused-vars': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'semi': ['error', 'always'],
  },
};
