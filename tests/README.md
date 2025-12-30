# Testing Infrastructure

This directory contains tests for the FruitfulPlanet application.

## Test Structure

```
tests/
├── unit/          # Unit tests (individual functions/components)
├── integration/   # Integration tests (multiple components together)
├── e2e/          # End-to-end tests (full user flows)
└── setup.ts      # Test setup and configuration
```

## Running Tests

```bash
# Run all tests
pnpm test

# Run specific test suite
pnpm test unit
pnpm test integration
pnpm test e2e

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run specific test file
pnpm test path/to/test.test.ts
```

## Writing Tests

### Unit Tests

Unit tests focus on testing individual functions or components in isolation.

```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from '../src/utils';

describe('myFunction', () => {
  it('should return expected value', () => {
    const result = myFunction(input);
    expect(result).toBe(expected);
  });
});
```

### Integration Tests

Integration tests verify that multiple components work together correctly.

```typescript
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../server';

describe('API Integration', () => {
  it('should create and retrieve user', async () => {
    const response = await request(app).post('/api/users').send({ email: 'test@example.com' });

    expect(response.status).toBe(201);
  });
});
```

### E2E Tests

End-to-end tests simulate real user interactions using Playwright.

```typescript
import { test, expect } from '@playwright/test';

test('user can log in', async ({ page }) => {
  await page.goto('http://localhost:5000');
  await page.fill('[name="email"]', 'user@example.com');
  await page.fill('[name="password"]', 'password');
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL('/dashboard');
});
```

## Test Coverage

Aim for:

- **Unit Tests**: 80%+ coverage
- **Integration Tests**: Critical paths
- **E2E Tests**: Key user flows

View coverage report:

```bash
pnpm test:coverage
open coverage/index.html
```

## Best Practices

1. **Test behavior, not implementation**
2. **Keep tests simple and focused**
3. **Use descriptive test names**
4. **Arrange, Act, Assert (AAA) pattern**
5. **Mock external dependencies**
6. **Clean up after tests**
7. **Make tests deterministic**
8. **Test edge cases**

## Continuous Integration

Tests run automatically on:

- Pull requests
- Pushes to main/develop
- Before deployment

## Troubleshooting

### Tests Failing Locally

1. Ensure dependencies are installed: `pnpm install`
2. Check test database is running
3. Clear test database: `pnpm run db:test:reset`
4. Check environment variables

### Flaky Tests

1. Add proper waits for async operations
2. Use test timeouts appropriately
3. Ensure test isolation
4. Check for race conditions

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://testingjavascript.com/)
