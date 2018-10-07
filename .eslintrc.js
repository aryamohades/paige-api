module.exports = {
  'env': {
      'es6': true,
      'node': true
  },
  'globals': {
    'window': true,
    'document': true,
    'browser': true,
    'Node': true
  },
  'plugins': ['node'],
  'extends': ['airbnb-base', 'plugin:node/recommended'],
  'rules': {
    'no-mixed-operators': 0,
    'no-bitwise': 0,
    'vars-on-top': 0,
    'arrow-body-style': 0,
    'comma-dangle': ['error', 'never'],
    'no-unused-vars': ['error', { 'argsIgnorePattern': 'next' }],
    'no-plusplus': 0,
    'space-before-function-paren': 0,
    'prefer-destructuring': 0,
    'class-methods-use-this': 0,
    'no-use-before-define': 0,
    'no-param-reassign': 0,
    'no-shadow': 0,
    'func-names': 0,
    'prefer-template': 0,
    'consistent-return': 0,
    'object-shorthand': 0,
    'arrow-parens': 0
  }
};
