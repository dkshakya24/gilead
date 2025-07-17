const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './'
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@/auth$': '<rootDir>/auth.ts'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(rehype-raw|unified|bail|is-plain-obj|trough|vfile|vfile-message|unist-util-.*|mdast-util-.*|micromark|decode-named-character-reference|character-entities|property-information|hast-util-.*|space-separated-tokens|comma-separated-tokens|remark-.*|rehype-.*|zwitch|longest-streak|markdown-table|ccount|next-auth|@auth)/)'
  ],
  moduleDirectories: ['node_modules', '<rootDir>'],
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  testMatch: [
    '<rootDir>/__tests__/**/*.{test,spec}.{js,jsx,ts,tsx}',
    '<rootDir>/**/*.{test,spec}.{js,jsx,ts,tsx}'
  ]
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
