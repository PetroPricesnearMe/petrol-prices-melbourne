# TypeScript Best Practices

> Comprehensive guide to TypeScript patterns and practices for long-term maintainability

## Table of Contents

- [Type System](#type-system)
- [Component Props](#component-props)
- [React Patterns](#react-patterns)
- [API Integration](#api-integration)
- [Error Handling](#error-handling)
- [Performance](#performance)
- [Testing](#testing)
- [Code Organization](#code-organization)

---

## Type System

### Prefer Interfaces Over Types

```typescript
// ✅ Good - Use interfaces for object shapes
interface User {
  id: string;
  name: string;
  email: string;
}

// ❌ Bad - Avoid types for simple objects
type User = {
  id: string;
  name: string;
  email: string;
};

// ✅ Good - Use types for unions, intersections, utilities
type Status = 'loading' | 'success' | 'error';
type UserWithTimestamp = User & { createdAt: Date };
```

### Avoid `any` - Use `unknown` or Proper Types

```typescript
// ❌ Bad
function processData(data: any) {
  return data.value;
}

// ✅ Good
function processData(data: unknown) {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return (data as { value: string }).value;
  }
  throw new Error('Invalid data format');
}

// ✅ Better
interface DataFormat {
  value: string;
}

function processData(data: DataFormat) {
  return data.value;
}
```

### Use Type Guards

```typescript
// Type guard function
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value &&
    'email' in value
  );
}

// Usage
function displayUser(data: unknown) {
  if (isUser(data)) {
    // TypeScript knows data is User here
    console.log(data.name);
  }
}
```

### Leverage Utility Types

```typescript
// Partial - make all properties optional
type PartialUser = Partial<User>;
// { id?: string; name?: string; email?: string; }

// Required - make all properties required
type RequiredUser = Required<PartialUser>;

// Pick - select specific properties
type UserName = Pick<User, 'name'>;
// { name: string; }

// Omit - exclude specific properties
type UserWithoutEmail = Omit<User, 'email'>;
// { id: string; name: string; }

// Record - create object type
type UserRoles = Record<string, User>;
// { [key: string]: User }

// NonNullable - remove null/undefined
type DefiniteUser = NonNullable<User | null>;
// User

// ReturnType - extract return type
type ApiResponse = ReturnType<typeof fetchUser>;

// Parameters - extract parameter types
type FetchParams = Parameters<typeof fetchUser>;
```

### Discriminated Unions for States

```typescript
// ✅ Good - Exhaustive type checking
type FetchState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

function handleState<T>(state: FetchState<T>) {
  switch (state.status) {
    case 'idle':
      return 'Ready to fetch';
    case 'loading':
      return 'Fetching...';
    case 'success':
      return `Data: ${state.data}`;
    case 'error':
      return `Error: ${state.error.message}`;
    default:
      // TypeScript ensures all cases are handled
      const exhaustive: never = state;
      return exhaustive;
  }
}
```

---

## Component Props

### Define Props with Interface

```typescript
// ✅ Good - Clear, exportable props
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  children,
}) => {
  // Implementation
};
```

### Extend Base Props

```typescript
// Base props interface
interface BaseProps {
  className?: string;
  testId?: string;
}

// Extend for specific components
interface ButtonProps extends BaseProps {
  variant?: 'primary' | 'secondary';
  onClick: () => void;
  children: React.ReactNode;
}
```

### Use Generics for Reusable Components

```typescript
// Generic component
interface SelectProps<T> {
  options: T[];
  value: T;
  onChange: (value: T) => void;
  getLabel: (item: T) => string;
  getValue: (item: T) => string;
}

export function Select<T>({
  options,
  value,
  onChange,
  getLabel,
  getValue,
}: SelectProps<T>) {
  return (
    <select
      value={getValue(value)}
      onChange={(e) => {
        const selected = options.find(
          (opt) => getValue(opt) === e.target.value
        );
        if (selected) onChange(selected);
      }}
    >
      {options.map((option) => (
        <option key={getValue(option)} value={getValue(option)}>
          {getLabel(option)}
        </option>
      ))}
    </select>
  );
}

// Usage with strong typing
interface User {
  id: number;
  name: string;
}

const users: User[] = [/* ... */];

<Select<User>
  options={users}
  value={selectedUser}
  onChange={setSelectedUser}
  getLabel={(user) => user.name}
  getValue={(user) => user.id.toString()}
/>
```

### Polymorphic Components

```typescript
// Allow component to render as different elements
type PolymorphicProps<E extends React.ElementType> = {
  as?: E;
} & Omit<React.ComponentPropsWithoutRef<E>, 'as'>;

export function Box<E extends React.ElementType = 'div'>({
  as,
  ...props
}: PolymorphicProps<E>) {
  const Component = as || 'div';
  return <Component {...props} />;
}

// Usage
<Box>Default div</Box>
<Box as="section">Section element</Box>
<Box as="button" onClick={() => {}}>Button element</Box>
```

---

## React Patterns

### Use Proper React Types

```typescript
// Functional component
const Component: React.FC<Props> = (props) => {
  return <div>{props.children}</div>;
};

// Event handlers
const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  event.preventDefault();
  // Handle click
};

const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const value = event.target.value;
  // Handle change
};

// Refs
const inputRef = useRef<HTMLInputElement>(null);
const divRef = useRef<HTMLDivElement>(null);

// State
const [user, setUser] = useState<User | null>(null);
const [count, setCount] = useState(0); // Type inferred

// Effect cleanup
useEffect(() => {
  const subscription = subscribe();

  return () => {
    subscription.unsubscribe();
  };
}, []);
```

### Custom Hooks with Proper Types

```typescript
// ✅ Good - Typed custom hook
interface UseUserOptions {
  suspense?: boolean;
  onError?: (error: Error) => void;
}

interface UseUserReturn {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

function useUser(id: string, options?: UseUserOptions): UseUserReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchUser(id);
      setUser(data);
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      options?.onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [id, options]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { user, isLoading, error, refetch };
}
```

### Context with Proper Types

```typescript
// Define context value type
interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

// Create context with undefined as default
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    const user = await api.login(email, password);
    setUser(user);
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  const value: AuthContextValue = {
    user,
    login,
    logout,
    isAuthenticated: user !== null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Typed hook
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

---

## API Integration

### Type API Responses

```typescript
// API response types
interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  };
}

// API functions with typed responses
async function getUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data: ApiResponse<User> = await response.json();
  return data.data;
}

async function getUsers(
  page: number = 1,
  pageSize: number = 20
): Promise<PaginatedResponse<User>> {
  const response = await fetch(
    `/api/users?page=${page}&pageSize=${pageSize}`
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}
```

### Type API Errors

```typescript
// Custom error classes
class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class ValidationError extends ApiError {
  constructor(
    message: string,
    public errors: Array<{ field: string; message: string }>
  ) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

// Type guards for errors
function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

// Error handling
try {
  await createUser(userData);
} catch (error) {
  if (isValidationError(error)) {
    // Handle validation errors
    error.errors.forEach((err) => {
      console.error(`${err.field}: ${err.message}`);
    });
  } else if (isApiError(error)) {
    // Handle API errors
    console.error(`API Error ${error.statusCode}: ${error.message}`);
  } else {
    // Handle unknown errors
    console.error('Unknown error:', error);
  }
}
```

---

## Error Handling

### Typed Error Boundaries

```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode | ((error: Error) => React.ReactNode);
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.props.onError?.(error, errorInfo);
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (typeof this.props.fallback === 'function') {
        return this.props.fallback(this.state.error);
      }
      return this.props.fallback || <div>Something went wrong</div>;
    }

    return this.props.children;
  }
}
```

---

## Performance

### Memoization with Proper Types

```typescript
// Memoized component
interface ExpensiveComponentProps {
  data: ComplexData;
  onUpdate: (id: string) => void;
}

const ExpensiveComponent = React.memo<ExpensiveComponentProps>(
  ({ data, onUpdate }) => {
    // Expensive rendering
    return <div>{/* ... */}</div>;
  },
  (prevProps, nextProps) => {
    // Custom comparison
    return prevProps.data.id === nextProps.data.id;
  }
);

// Memoized value
const expensiveValue = useMemo(() => {
  return complexCalculation(data);
}, [data]);

// Memoized callback
const handleClick = useCallback(
  (id: string) => {
    onUpdate(id);
  },
  [onUpdate]
);
```

---

## Testing

### Type Test Utilities

```typescript
// Test utilities with types
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Typed render helper
function renderWithProviders(
  ui: React.ReactElement,
  options?: {
    preloadedState?: PreloadedState;
    store?: Store;
  }
) {
  const store = options?.store || createTestStore(options?.preloadedState);

  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper }),
  };
}

// Typed test
describe('Button', () => {
  it('calls onClick when clicked', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    renderWithProviders(
      <Button onClick={handleClick}>Click me</Button>
    );

    const button = screen.getByRole('button', { name: /click me/i });
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

---

## Code Organization

### Barrel Exports

```typescript
// src/components/index.ts
export { Button } from './Button';
export type { ButtonProps } from './Button';
export { Input } from './Input';
export type { InputProps } from './Input';

// Usage
import { Button, Input } from '@/components';
import type { ButtonProps, InputProps } from '@/components';
```

### Path Aliases

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/components/*": ["src/components/*"],
      "@/lib/*": ["src/lib/*"],
      "@/types/*": ["src/types/*"],
      "@/utils/*": ["src/utils/*"]
    }
  }
}
```

---

## Quick Reference

### DO ✅

- Use `interface` for object shapes
- Use `type` for unions and utilities
- Provide explicit return types for public APIs
- Use strict TypeScript configuration
- Leverage type inference where obvious
- Use generics for reusable components
- Create custom type guards
- Document complex types with JSDoc

### DON'T ❌

- Use `any` (use `unknown` instead)
- Ignore TypeScript errors with `@ts-ignore`
- Over-annotate obvious types
- Create deeply nested generic types
- Use enums (prefer union types)
- Mutate readonly types
- Export types and values with same name

---

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Type Challenges](https://github.com/type-challenges/type-challenges)
- [Total TypeScript](https://www.totaltypescript.com/)

---

**Maintained by**: Development Team
**Last Updated**: October 22, 2025
**TypeScript Version**: 5.3+
