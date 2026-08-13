const config = {
  extends: ["stylelint-config-standard-scss", "stylelint-config-css-modules"],
  rules: {
    "selector-class-pattern": "^[a-z][a-zA-Z0-9]*$",
  },
};

export default config;
