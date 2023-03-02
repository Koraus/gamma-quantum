module.exports = {
    env: { browser: true, es2022: true },
    plugins: [
        "@typescript-eslint",
        // "react", 
    ],
    overrides: [],
    parser: "@typescript-eslint/parser",
    parserOptions: { 
        ecmaVersion: "latest",
    },
    extends: [
        "eslint:recommended",
        // "plugin:react/recommended",
        // "plugin:react/jsx-runtime",
        "plugin:@typescript-eslint/recommended",
    ],
    rules: {
        "indent": ["warn", 4, { "SwitchCase": 1 }],
        // "linebreak-style": ["warn", "unix"], // enforced by git
        "quotes": ["warn", "double"],
        "semi": ["warn", "always"],
        "max-nested-callbacks": ["warn", 2],
        "max-len": ["warn", 80, {
            "ignorePattern": "^import\\s.+\\sfrom\\s.+;$",
        }],
        "comma-dangle": ["warn", "always-multiline"],
    },
};
