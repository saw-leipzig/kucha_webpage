// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: false,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'error',
    'space-in-parens': 'error',
    'space-before-function-paren':'error',
    'no-multi-spaces':'error',
    'semi':'error',
    'space-before-blocks':'error',
    'key-spacing':'error',
    'arrow-spacing':'error',
    'block-spacing':'error',
    'comma-dangle':'error',
    'no-multiple-empty-lines':'error',
    'padded-blocks':'error',
    'eol-last':'error',
    'quotes':'error',
    'allowEmptyReject':'off',
    'no-undef':'off',

    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
}
