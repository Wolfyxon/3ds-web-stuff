module.exports = {
    env: {
        browser: true,
    },
    parserOptions: {
        ecmaVersion: 5
    },
    rules: {
        'no-var': 'error', // disallow let
        'prefer-arrow-callback': 'error' // disallow lambda expressions
    },
};
