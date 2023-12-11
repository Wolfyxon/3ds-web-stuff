module.exports = {
    env: {
        browser: true,
    },
    parserOptions: {
        ecmaVersion: 6
    },
    rules: {
        'func-style': ['error', 'declaration'], // disallow lambda expressions
        'prefer-const': 'error', // Force const for variables that never change
        'no-restricted-syntax': [
            'error',
            {
                selector: 'VariableDeclaration[kind="let"]',
                message: '"let" is not supported on the 3DS browser.',
            },
        ],
    },
};
