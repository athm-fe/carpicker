module.exports = {
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module",
  },
  "extends": "eslint:recommended",
  "globals": {
    "chai": false,
    "auto": true
  },
  "env": {
    "node": true,
    "es6": true,
    "amd": true,
    "mocha": true,
    "browser": true
  },
  "rules": {
    "no-console": "off"
  }
};
