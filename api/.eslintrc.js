module.exports = {
  "extends": [
    "airbnb-base",
    "prettier",
  ],
  "env" : {
    "es6": true,
    "node": true
  },
  "parserOptions": {
    "ecmaVersion": 9,
  },
  "plugins": [
    "import",
    "prettier",
  ],
  "rules": {
    "prettier/prettier": [
      "error",
      {
        "trailingComma": "es5",
        "singleQuote": true,
        "printWidth": 100,
      }
    ]
  }
}