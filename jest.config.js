module.exports = {
  preset: 'ts-jest',
  roots: ["<rootDir>/tests/"],
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      diagnostics: false
    }
  }
};
