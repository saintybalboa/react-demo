module.exports = {
    setupFilesAfterEnv: [
        // Configuration file executed before tests at runtime.
        '<rootDir>/src/setup-test.js'
    ],
    moduleNameMapper: {
        // Stub out styles (sass imports) to prevent syntax errors.
        '^.+\\.(scss)$': 'babel-jest'
    }
};
