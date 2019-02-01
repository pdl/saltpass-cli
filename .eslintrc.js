module.exports = {
  'extends' : 'airbnb-base',
  'rules'   : {
    'indent'                : [ 'error', 2 ],
    'array-bracket-spacing' : [ 'error', 'always' ],
    'no-multi-spaces'       : [ 'off' ],
    'key-spacing'           : [ 'error', {
      multiLine  : { beforeColon: false, afterColon: true },
      singleLine : { beforeColon: false, afterColon: true },
      align      : { beforeColon: true,  afterColon: true, on: 'colon' }
    } ],
    'object-shorthand' : [ 'error', 'consistent' ],
    'comma-dangle'     : [ 'error', {
      arrays    : 'only-multiline',
      objects   : 'only-multiline',
      imports   : 'only-multiline',
      exports   : 'only-multiline',
      functions : 'ignore'
    } ],
  },
};