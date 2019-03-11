module.exports = {
  "extends": [
    "airbnb",
    "plugin:react/recommended",  // adds plugin react and react's default rules
    "plugin:import/errors",  // adds plugin import and default error conditions
    "plugin:import/react",   // adds import exension rules
    "prettier",  // turn off eslint formatting rules to prefer prettier's
    "prettier/react",  // ditto with react rules
  ],
  "env" : {
    "browser": true,
    "es6": true,
    "node": true
  },
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaVersion": 6,
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true,
      "jsx": true
    },
    "sourceType": "module",
  },
  "plugins": [
    "import",
    "prettier",
    "react",
  ],
  "rules": {
    "react/prefer-stateless-function": "off",
    "arrow-parens": "off",
    "space-before-function-paren": "off",
    "no-underscore-dangle": "off",
    "react/jsx-filename-extension": [
      1,
      { "extensions": [".js", ".jsx"] }
    ],
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
