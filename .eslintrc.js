module.exports = {
    root: true,
    extends: ['eslint-config-airbnb-base', 'plugin:prettier/recommended'],
    parserOptions: {
        sourceType: 'script',
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 2018,
    },
    env: {
        browser: true,
        commonjs: true,
        node: true,
        es6: true,
    },
    settings: {
        react: {
            version: '>16.8',
        },
    },

    rules: {
        'no-console': 'off',
        'no-underscore-dangle': 'off',
        strict: ['error', 'global'],
    },
};
