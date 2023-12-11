module.exports = {
    env: {
        browser: true,
    },
    parserOptions: {
        ecmaVersion: 6
    },
    rules: {
        'prefer-arrow-callback': 'error' // disallow lambda expressions
    },
};
