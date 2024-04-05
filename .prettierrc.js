module.exports = {
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  printWidth: 120,
  useTabs: false,
  jsxSingleQuote: false,
  bracketSpacing: true,
  htmlWhitespaceSensitivity: "css",
  endOfLine: "crlf",
  trailingComma: "all",
  arrowParens: "avoid",
  overrides: [
    {
      files: ".prettierrc",
      options: {
        parser: "json"
      }
    }
  ]
}
