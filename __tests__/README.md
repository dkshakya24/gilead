# Integration Testing Setup for Gilead Project

This directory contains comprehensive integration tests for the Gilead project using React Testing Library and Jest.

## 🧪 Testing Stack

- **Jest** - Test runner and assertion library
- **React Testing Library** - Component testing utilities
- **@testing-library/user-event** - User interaction simulation
- **@testing-library/jest-dom** - Custom Jest matchers for DOM testing

## 📁 Test Structure

```
__tests__/
├── integration/           # Integration tests for main functionality
│   ├── auth.test.tsx     # Authentication flow tests
│   ├── chat.test.tsx     # Chat functionality tests
│   ├── routing.test.tsx  # Routing and navigation tests
│   └── websocket.test.tsx # WebSocket integration tests
├── utils/
│   └── test-utils.tsx    # Common test utilities and helpers
└── README.md             # This file
```

## 🚀 Running Tests

### Install Dependencies

```bash
npm install
# or
pnpm install
```

### Run All Tests

```bash
npm test
# or
pnpm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
# or
pnpm test:watch
```

### Run Tests with Coverage

```bash
npm run test:coverage
# or
pnpm test:coverage
```

### Run Tests in CI Mode

```bash
npm run test:ci
# or
pnpm test:ci
```

## 📋 Test Coverage

### 1. Authentication Integration Tests (`auth.test.tsx`)

**What it tests:**

- Login form rendering and validation
- Form input handling and state management
- Authentication success and error scenarios
- Loading states during form submission
- Login page layout and user experience

**Key scenarios:**

- ✅ Form renders with all required fields
- ✅ Input validation prevents empty submissions
- ✅ Form handles user input correctly
- ✅ Loading state during authentication
- ✅ Success and error message handling
- ✅ Complete login page layout

### 2. Chat Integration Tests (`chat.test.tsx`)

**What it tests:**

- Chat interface rendering and functionality
- Message sending and receiving
- Real-time message display
- Streaming state management
- WebSocket integration

**Key scenarios:**

- ✅ Chat interface renders correctly
- ✅ Message input and submission works
- ✅ Messages display properly
- ✅ Loading states during streaming
- ✅ WebSocket connection status handling
- ✅ Chat panel and prompt form functionality

### 3. Routing Integration Tests (`routing.test.tsx`)

**What it tests:**

- Page routing and navigation
- Authentication-based redirects
- Session management
- Protected route access

**Key scenarios:**

- ✅ Root path redirects to /arc
- ✅ Protected routes require authentication
- ✅ Unauthenticated users redirected to login
- ✅ Session handling for different user roles
- ✅ Page layouts render correctly

### 4. WebSocket Integration Tests (`websocket.test.tsx`)

**What it tests:**

- WebSocket connection establishment
- Real-time message communication
- Connection status management
- Error handling and recovery

**Key scenarios:**

- ✅ WebSocket connection on component mount
- ✅ Connection status changes handled
- ✅ Message sending through WebSocket
- ✅ Real-time message updates
- ✅ Streaming message handling
- ✅ Error handling for connection failures

## 🛠️ Test Utilities

### `test-utils.tsx`

Provides common testing utilities:

- **`createMockSession()`** - Creates mock user sessions
- **`createMockChatMessage()`** - Creates mock chat messages
- **`mockApiResponses`** - Predefined API response mocks
- **Custom render function** - Enhanced render with providers

### Mock Setup

The testing environment includes comprehensive mocks for:

- **Next.js Router** - Navigation and routing
- **WebSocket** - Real-time communication
- **localStorage/sessionStorage** - Browser storage
- **Next.js Image** - Image component
- **IntersectionObserver** - Scroll detection
- **ResizeObserver** - Element resizing
- **Fetch API** - HTTP requests

## 📊 Coverage Requirements

The test suite aims for:

- **70% branch coverage**
- **70% function coverage**
- **70% line coverage**
- **70% statement coverage**

## 🔧 Configuration Files

### Jest Configuration (`jest.config.js`)

- Next.js integration
- JSDOM environment
- Path mapping for `@/` imports
- Coverage collection settings
- Test file patterns

### Jest Setup (`jest.setup.js`)

- Testing Library DOM matchers
- Global mocks and polyfills
- Console warning suppression
- Browser API mocks

### TypeScript Test Config (`tsconfig.test.json`)

- Jest and Testing Library types
- Test file inclusion
- Module resolution settings

## 🎯 Best Practices

### Writing Tests

1. **Use descriptive test names** that explain the scenario
2. **Test user behavior** rather than implementation details
3. **Use data-testid sparingly** - prefer semantic queries
4. **Mock external dependencies** to isolate components
5. **Test error states** and edge cases

### Test Organization

1. **Group related tests** using `describe` blocks
2. **Use beforeEach** for common setup
3. **Clean up mocks** after each test
4. **Follow AAA pattern** (Arrange, Act, Assert)

### Mocking Strategy

1. **Mock at the boundary** - external APIs, WebSocket, etc.
2. **Use realistic mock data** that matches real responses
3. **Test both success and failure scenarios**
4. **Verify mock calls** to ensure correct integration

## 🐛 Debugging Tests

### Common Issues

1. **Module resolution errors** - Check `tsconfig.test.json`
2. **Mock not working** - Ensure mocks are in `jest.setup.js`
3. **Async test failures** - Use `waitFor` for async operations
4. **Component not rendering** - Check for missing providers

### Debug Commands

```bash
# Run specific test file
npm test auth.test.tsx

# Run tests with verbose output
npm test -- --verbose

# Run tests with coverage for specific file
npm test -- --coverage --collectCoverageFrom="components/login-form.tsx"
```

## 📈 Continuous Integration

The test suite is configured for CI environments:

- **Coverage reporting** for quality gates
- **Fail fast** on test failures
- **Parallel execution** for faster builds
- **Artifact collection** for test results

## 🔄 Maintenance

### Adding New Tests

1. Create test file in appropriate directory
2. Follow existing naming conventions
3. Add comprehensive test coverage
4. Update this README if needed

### Updating Mocks

1. Update mocks in `jest.setup.js`
2. Ensure mocks match real API responses
3. Test mock behavior in isolation
4. Update test utilities if needed

### Performance

- Keep tests focused and fast
- Use `jest.isolateModules()` for heavy components
- Mock expensive operations
- Use `beforeAll` for one-time setup
