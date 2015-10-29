'use strict';
require('babel/register')(Object.assign({
  whitelist: [
    'es6.modules',
    'strict',
    'es6.parameters',
    'es6.spread',
    'es6.destructuring'
  ]
}, process.env.NODE_ENV === 'DEBUG'? { retainLines: true } : {}));

require('./run');