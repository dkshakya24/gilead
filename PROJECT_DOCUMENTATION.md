# Gilead AI Chatbot - Project Documentation

## 1. Project Overview

### Purpose

The Gilead AI Chatbot is an enterprise-grade AI-powered conversational interface designed for Gilead Sciences. It provides intelligent chat capabilities with real-time streaming responses, document citations, and advanced reasoning features. The application serves as a knowledge assistant for internal users, offering contextual information retrieval and interactive Q&A functionality.

### Key Features

- **Real-time Chat Interface**: WebSocket-based streaming chat with live response generation
- **Authentication & Authorization**: NextAuth.js integration with OKTA SSO and role-based access control
- **Advanced AI Reasoning**: Configurable reasoning levels (High/Medium/Low) for response quality
- **Document Citations**: Source tracking and citation display for AI responses
- **Chat History Management**: Persistent chat sessions with edit/delete capabilities
- **Admin Panel**: User management interface for administrators
- **Responsive Design**: Mobile-first responsive UI with dark/light theme support
- **Retry Mechanism**: Message retry functionality with reason tracking
- **Annotations System**: Feedback and annotation capabilities for chat interactions

### Target Users

- Gilead Sciences employees and authorized personnel
- Researchers and knowledge workers requiring AI-assisted information retrieval
- Administrators managing user access and system oversight

### Tech Stack Summary

- **Framework**: Next.js 14.1.3 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.4.1 with shadcn/ui components
- **State Management**: Zustand 5.0.5
- **Authentication**: NextAuth.js 5.0.0-beta.28 with OKTA integration
- **Real-time Communication**: WebSocket API
- **UI Components**: Radix UI primitives, Material-UI components
- **Charts & Visualization**: Chart.js, Plotly.js, React-Plotly.js
- **Database**: AWS DynamoDB (via AWS SDK)
- **Deployment**: Vercel (inferred from dependencies)
- **Analytics**: Vercel Analytics

## 2. Folder Structure and Code Organization

### Custom Folder Structure

```
├── app/                          # Next.js App Router directory
│   ├── (auth)/                   # Route groups for authentication
│   ├── admin/                    # Admin panel routes
│   ├── api/                      # API routes
│   ├── arc/                      # Main chat application routes
│   │   └── (chat)/              # Chat-specific route group
│   ├── login/                    # Authentication pages
│   ├── signup/                   # User registration
│   └── utils/                    # Utility API endpoints
├── components/                   # Reusable React components
│   ├── admin/                    # Admin-specific components
│   ├── gilead/                   # Gilead-branded components
│   ├── messages-component/       # Chat message components
│   └── ui/                       # Base UI components (shadcn/ui)
├── lib/                          # Utility libraries and configurations
│   ├── chat/                     # Chat-related actions and utilities
│   ├── hooks/                    # Custom React hooks
│   ├── services/                 # External service integrations
│   └── store/                    # State management (Zustand stores)
└── public/                       # Static assets and images
```

### Design Principles

- **Atomic Design**: Components are organized from basic UI elements to complex compositions
- **Feature-based Organization**: Related functionality grouped together (admin, chat, auth)
- **Separation of Concerns**: Clear separation between UI components, business logic, and data management
- **Route Groups**: Next.js route groups for logical organization without affecting URL structure

## 3. Setup & Installation Guide

### Prerequisites

- **Node.js**: Version 18.x or higher
- **Package Manager**: npm, yarn, or pnpm
- **Environment**: macOS, Linux, or Windows

### Environment Setup

1. **Clone the repository**

```bash
git clone <repository-url>
cd gilead-ai-chatbot
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Environment configuration**
   Copy the environment variables and configure as needed (see Environment Variables section)

### Local Development

```bash
# Start development server
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will be available at `http://localhost:3000`

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm run start
```

### Additional Scripts

```bash
# Linting
npm run lint
npm run lint:fix

# Type checking
npm run type-check

# Code formatting
npm run format:write
npm run format:check

# Clean build artifacts
npm run clean
```

### Ports and URLs

- **Development**: `http://localhost:3000`
- **Production**: Port 3000 (configurable via `-p` flag)

## 4. Environment Variables

### Required Variables

```env
# Authentication
AUTH_SECRET=<your-auth-secret>
NEXTAUTH_URL=http://localhost:3000

# OKTA Configuration
NEXT_PUBLIC_OKTA_CLIENT_ID=<okta-client-id>
NEXT_PUBLIC_OKTA_CLIENT_SECRET=<okta-client-secret>
NEXT_PUBLIC_OKTA_ISSUER=<okta-issuer-url>

# API Endpoints
NEXT_PUBLIC_API_URL=<main-api-endpoint>
NEXT_PUBLIC_FEEDBACK_API=<feedback-api-endpoint>
NEXT_PUBLIC_SUGGESTION_API=<suggestion-api-endpoint>
NEXT_PUBLIC_WEBSOCKET=<websocket-endpoint>

# Project Configuration
NEXT_PUBLIC_PROJECT_NAME=gilead
```

### Variable Descriptions

- `AUTH_SECRET`: Secret key for NextAuth.js session encryption
- `NEXTAUTH_URL`: Base URL for authentication callbacks
- `NEXT_PUBLIC_OKTA_*`: OKTA SSO configuration parameters
- `NEXT_PUBLIC_API_URL`: Main backend API endpoint for chat functionality
- `NEXT_PUBLIC_FEEDBACK_API`: API endpoint for user feedback and annotations
- `NEXT_PUBLIC_SUGGESTION_API`: API endpoint for chat suggestions
- `NEXT_PUBLIC_WEBSOCKET`: WebSocket endpoint for real-time chat streaming

### Security Notes

- All API keys and secrets should be stored securely
- Use different values for development, staging, and production environments
- Never commit sensitive credentials to version control

## 5. Deployment Documentation

### Deployment Method

The application is designed for **Vercel deployment** based on:

- Vercel-specific dependencies (`@vercel/analytics`, `@vercel/kv`, `@vercel/og`)
- Next.js optimization for Vercel platform
- Environment variable configuration compatible with Vercel

### Deployment Steps

1. **Connect Repository**: Link GitHub repository to Vercel
2. **Environment Variables**: Configure all required environment variables in Vercel dashboard
3. **Build Settings**: Vercel automatically detects Next.js configuration
4. **Domain Configuration**: Set up custom domain if required

### CI/CD Pipeline

- **Automatic Deployments**: Triggered on push to main branch
- **Preview Deployments**: Created for pull requests
- **Build Optimization**: Vercel's Edge Network for global distribution

### Secrets Management

- Environment variables managed through Vercel dashboard
- Sensitive credentials stored securely in Vercel's environment system
- No secrets stored in repository

## 6. Testing & QA

### Testing Framework

The project uses Jest and React Testing Library for comprehensive testing:

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests in CI environment
npm run test:ci
```

### Testing Structure

```
├── __tests__/                   # Test directory
│   ├── integration/            # Integration tests
│   │   ├── auth.test.tsx       # Authentication tests
│   │   ├── chat.test.tsx       # Chat functionality tests
│   │   ├── routing.test.tsx    # Routing and navigation tests
│   │   └── websocket.test.tsx  # WebSocket communication tests
│   ├── types/                  # Type definitions for tests
│   └── utils/                  # Test utilities and helpers
│       └── test-utils.tsx      # Common test utilities
├── jest.config.js              # Jest configuration
└── jest.setup.js              # Jest setup and mocks
```

### Integration Testing

The project includes comprehensive integration tests covering key application features:

1. **Authentication Integration Tests**:

   - Login form validation and submission
   - Authentication success/failure handling
   - Session management
   - Protected route access

2. **Chat Integration Tests**:

   - Chat interface rendering
   - Message input and submission
   - Message display and formatting
   - Loading states during streaming

3. **Routing Integration Tests**:

   - Route protection and redirection
   - Authentication-based routing
   - Page layout integration
   - Session management across routes

4. **WebSocket Integration Tests**:
   - WebSocket connection establishment
   - Real-time message sending and receiving
   - Streaming message handling
   - Error handling and reconnection

### Test Utilities

The project includes robust test utilities in `__tests__/utils/test-utils.tsx`:

- Custom render function with providers
- Mock session and user data creation
- Mock API responses for consistent testing
- WebSocket mocking utilities
- Test environment setup helpers

### Jest Configuration

The Jest configuration in `jest.config.js` includes:

- Coverage thresholds (70% for branches, functions, lines, and statements)
- Custom module mapping for Next.js compatibility
- Transform patterns for handling dependencies
- Test matching patterns for comprehensive test discovery

### Quality Assurance

- **ESLint**: Configured with Next.js and Prettier rules
- **TypeScript**: Strict type checking enabled
- **Prettier**: Code formatting standards
- **Jest**: Comprehensive test suite with coverage reporting
- **Pre-commit Hooks**: Recommended for code quality

## 7. API Integration

### HTTP Client

- **Primary**: Native `fetch` API for HTTP requests
- **WebSocket**: Native WebSocket API for real-time communication

### API Endpoints

- **Main API**: Chat functionality and user management
- **Feedback API**: User feedback and annotations
- **Suggestion API**: Chat suggestions and recommendations
- **WebSocket**: Real-time chat streaming

### Authentication Flow

1. **OKTA SSO**: Primary authentication method
2. **NextAuth.js**: Session management and JWT handling
3. **Middleware**: Route protection and authentication checks

### Request/Response Patterns

- RESTful API design
- JSON payload format
- Error handling with try-catch blocks
- Loading states and user feedback

## 8. State Management

### Primary State Management: Zustand

- **Global Store**: `lib/store/useStore.ts`
- **WebSocket Store**: `lib/store/websocket-store.ts`

### State Structure

```typescript
interface AppState {
  isStreaming: boolean
  reasoning: 'High' | 'Medium' | 'Low'
  chatMessages: ChatMessage[]
  chatId: string
  selectedUrls: string[]
}
```

### Local State

- React `useState` for component-specific state
- Custom hooks for reusable stateful logic
- Context API for theme management (via next-themes)

### Performance Considerations

- Zustand provides minimal re-renders
- State normalization for chat messages
- Efficient WebSocket message handling

## 9. Routing Strategy

### Next.js App Router (v13+)

- **File-based Routing**: Automatic route generation
- **Route Groups**: Logical organization with `(group)` syntax
- **Dynamic Routes**: `[id]` for chat sessions
- **Nested Layouts**: Hierarchical layout system

### Route Structure

```
/                           # Landing page (redirects to /arc)
/login                      # Authentication
/signup                     # User registration
/arc                        # Main chat interface
/arc/chat/[id]             # Specific chat session
/admin/users               # User management (admin only)
```

### Protected Routes

- **Middleware**: `middleware.ts` handles route protection
- **Authentication Check**: Redirects unauthenticated users to login
- **Role-based Access**: Admin routes restricted by user role

## 10. Styling Guidelines

### CSS Framework: Tailwind CSS

- **Version**: 3.4.1
- **Configuration**: Custom theme with Gilead branding
- **Plugins**: Typography, animations, and custom utilities

### Design System

- **Component Library**: shadcn/ui with Radix UI primitives
- **Color Palette**: Custom HSL color system with dark/light mode
- **Typography**: Geist Sans and Geist Mono fonts
- **Responsive Design**: Mobile-first approach with custom breakpoints

### Styling Conventions

- **Utility-first**: Tailwind CSS classes for styling
- **Component Variants**: Class Variance Authority (CVA) for component variations
- **CSS Variables**: HSL color system for theme consistency
- **Animation**: Tailwind CSS animations with custom keyframes

### Theme System

- **Light/Dark Mode**: Automatic theme switching
- **CSS Variables**: Dynamic color system
- **Theme Provider**: next-themes integration

## 11. Authentication & Authorization

### Authentication Provider: NextAuth.js

- **Version**: 5.0.0-beta.28
- **Primary Provider**: OKTA OAuth2
- **Fallback**: Credentials provider for development

### Session Strategy

- **JWT Tokens**: Stateless authentication
- **Session Callbacks**: Custom user data injection
- **Role Management**: User roles stored in session

### Authorization Levels

- **User**: Standard chat access
- **Admin**: User management capabilities
- **Route Protection**: Middleware-based access control

### Security Features

- **CSRF Protection**: Built-in NextAuth.js security
- **Secure Cookies**: HTTPOnly and Secure flags
- **Session Validation**: Automatic token refresh

## 12. Third-party Services & Integrations

### Analytics & Monitoring

- **Vercel Analytics**: Performance and usage tracking
- **Console Logging**: Development debugging

### External APIs

- **AWS Services**: DynamoDB for data storage
- **OKTA**: Identity and access management
- **WebSocket API**: Real-time chat functionality

### UI Libraries

- **Material-UI**: Data grid and advanced components
- **Radix UI**: Accessible primitive components
- **Lucide React**: Icon library
- **React Icons**: Additional icon sets

### Visualization

- **Chart.js**: Chart rendering
- **Plotly.js**: Advanced data visualization
- **D3.js**: Data manipulation utilities

## 13. Versioning & Branching

### Recommended Git Strategy

- **Main Branch**: Production-ready code
- **Development Branch**: Integration branch for features
- **Feature Branches**: Individual feature development
- **Hotfix Branches**: Critical production fixes

### Code Quality Tools

- **ESLint**: Code linting with Next.js configuration
- **Prettier**: Code formatting
- **TypeScript**: Static type checking
- **Husky**: Git hooks for pre-commit checks (recommended)

### Release Management

- **Semantic Versioning**: Recommended for releases
- **Conventional Commits**: Structured commit messages
- **Automated Deployments**: Vercel integration

## 14. Contributing Guidelines

### Development Workflow

1. **Fork/Clone**: Repository setup
2. **Branch Creation**: Feature-specific branches
3. **Development**: Local development with hot reload
4. **Testing**: Manual testing and code review
5. **Pull Request**: Code review process

### Code Standards

- **TypeScript**: Strict type checking required
- **ESLint**: Linting rules must pass
- **Prettier**: Code formatting standards
- **Component Structure**: Consistent file organization

### Review Process

- **Peer Review**: Required for all changes
- **Testing**: Manual testing of new features
- **Documentation**: Update documentation for significant changes

## 15. Access & Credentials

### Repository Access

- **GitHub**: Repository hosting and version control
- **Vercel**: Deployment platform and hosting

### Environment Access

- **Development**: Local environment setup
- **Staging**: Vercel preview deployments
- **Production**: Vercel production deployment

### Required Credentials

- **OKTA Configuration**: SSO setup and management
- **AWS Access**: DynamoDB and API Gateway
- **Vercel Account**: Deployment and analytics access
- **Environment Variables**: Secure credential management

### Security Considerations

- **Principle of Least Privilege**: Minimal required access
- **Credential Rotation**: Regular password and key updates
- **Access Auditing**: Regular review of user permissions
- **Secure Storage**: Never store credentials in code

---

## Additional Notes

### Performance Optimizations

- **Next.js Optimizations**: Automatic code splitting and optimization
- **Image Optimization**: Next.js Image component
- **Bundle Analysis**: Built-in bundle analyzer
- **Caching**: Vercel Edge Network caching

### Accessibility

- **Radix UI**: Accessible component primitives
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: ARIA labels and semantic HTML
- **Color Contrast**: WCAG compliant color schemes

### Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Mobile Support**: iOS Safari, Chrome Mobile
- **Progressive Enhancement**: Graceful degradation for older browsers

This documentation provides a comprehensive overview of the Gilead AI Chatbot project. For specific implementation details, refer to the source code and inline comments.
