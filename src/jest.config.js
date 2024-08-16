const ignorePatterns = [
    '/node_modules/',
    'config.*.ts',
    '/tests/helpers/',
];
  
module.exports = {
    preset: 'ts-jest/presets/js-with-babel',
    testEnvironment: 'node',
    testPathIgnorePatterns: ignorePatterns,
    coveragePathIgnorePatterns: ignorePatterns,
    coverageThreshold: {
      global: {
        lines: 90,
      },
    },
    setupFilesAfterEnv: ['./tests/setup.ts'],
    verbose: true,
};