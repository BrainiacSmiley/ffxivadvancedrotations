module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "plugin:prettier/recommended",
    "plugin:@intlify/vue-i18n/recommended",
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "@intlify/vue-i18n/no-dynamic-keys": "error",
    "@intlify/vue-i18n/no-unused-keys": [
      "error",
      {
        extensions: [".js", ".vue"],
      },
    ],
  },
  settings: {
    "vue-i18n": {
      localeDir: "@locales/*.{json,json5,yaml,yml}", // extension is glob formatting!

      // Specify the version of `vue-locales` you are using.
      // If not specified, the message will be parsed twice.
      messageSyntaxVersion: "^9.2.2",
    },
  },
};
