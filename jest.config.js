module.exports = {
  clearMocks: true,
  passWithNoTests: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/**/*.test.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  }
};
