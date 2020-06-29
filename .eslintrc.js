module.exports = {
  root: true,
  plugins: ['html', 'prettier'],
  extends: ['prettier'],
  rules: {
    'no-unused-vars': 'warn',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'prettier/prettier': 'warn',
  },
  parserOptions: {
    ecmaVersion: 2020,
  },
}
