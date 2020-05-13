module.exports = {
    setupFilesAfterEnv: [
        '<rootDir>/src/setup-test.js'
    ],
    moduleNameMapper: {
        '^.+\\.(css|less|scss)$': 'babel-jest'
    }
};
