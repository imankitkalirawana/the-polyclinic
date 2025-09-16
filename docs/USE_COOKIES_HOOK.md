# useCookies Hook Documentation

## Overview

The `useCookies` hook is a custom React hook that provides access to server-side cookies in client-side components. It's built using React Context and allows you to access cookies that were set on the server side within your client components.

## Setup

### 1. Provider Setup

The `useCookies` hook requires the `CookiesProvider` to be set up in your app. This is already configured in the main `Providers` component:

```tsx
// app/providers.tsx
import { CookiesProvider } from '@/providers/cookies-provider';

export function Providers({ children, session, cookies }) {
  return (
    <SessionProvider session={session}>
      <CookiesProvider cookieStore={cookies}>{children}</CookiesProvider>
    </SessionProvider>
  );
}
```

### 2. Server-Side Cookie Collection

In your root layout, cookies are collected from the server and passed to the provider:

```tsx
// app/layout.tsx
import { cookies } from 'next/headers';

export default async function RootLayout({ children }) {
  const session = await auth();
  const cookie = await cookies();

  return (
    <html lang="en">
      <body>
        <Providers session={session} cookies={cookie.getAll()}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
```

## Usage

### Basic Usage

```tsx
'use client';

import { useCookies } from '@/providers/cookies-provider';

export default function MyComponent() {
  const cookies = useCookies();

  // Access a specific cookie
  const sessionToken = cookies['authjs.session-token'];

  return <div>Session Token: {sessionToken}</div>;
}
```

### Using with Constants

For better maintainability, use predefined constants for cookie names:

```tsx
'use client';

import { useCookies } from '@/providers/cookies-provider';
import { AUTHJS_SESSION_TOKEN } from '@/lib/constants';

export default function MyComponent() {
  const cookies = useCookies();

  const sessionToken = cookies[AUTHJS_SESSION_TOKEN];

  return <div>Session Token: {sessionToken}</div>;
}
```

### API Requests with Cookies

A common use case is including cookies in API requests:

```tsx
'use client';

import { useEffect } from 'react';
import axios from 'axios';
import { useCookies } from '@/providers/cookies-provider';
import { AUTHJS_SESSION_TOKEN } from '@/lib/constants';

export default function DashboardPage() {
  const cookies = useCookies();

  useEffect(() => {
    axios
      .get('https://api.example.com/data', {
        headers: {
          Authorization: `Bearer ${cookies[AUTHJS_SESSION_TOKEN]}`,
        },
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => console.error(err));
  }, [cookies]);

  return <div>Dashboard</div>;
}
```

### Conditional Rendering Based on Cookies

```tsx
'use client';

import { useCookies } from '@/providers/cookies-provider';
import { AUTHJS_SESSION_TOKEN } from '@/lib/constants';

export default function ProtectedComponent() {
  const cookies = useCookies();
  const isAuthenticated = !!cookies[AUTHJS_SESSION_TOKEN];

  if (!isAuthenticated) {
    return <div>Please log in to access this content.</div>;
  }

  return <div>Welcome! You are authenticated.</div>;
}
```

## API Reference

### useCookies()

Returns a `Record<string, string>` object containing all available cookies.

**Returns:**

- `Record<string, string>` - An object where keys are cookie names and values are cookie values

**Throws:**

- `Error` - If the hook is used outside of a `CookiesProvider`

### CookieItem Interface

```tsx
export interface CookieItem {
  name: string;
  value: string;
}
```

## Important Notes

### 1. Client-Side Only

This hook is designed for client-side components only. It uses the `'use client'` directive and React Context.

### 2. Server-Side Cookie Access

The hook provides access to cookies that were available on the server side when the page was rendered. It doesn't provide real-time access to cookies that might be set after the initial render.

### 3. Error Handling

Always ensure your component is wrapped in a `CookiesProvider`. The hook will throw an error if used outside of the provider context.

### 4. Cookie Availability

Only cookies that were present on the server side will be available through this hook. Cookies set purely on the client side won't be accessible.

## Common Patterns

### 1. Authentication Check

```tsx
const cookies = useCookies();
const isAuthenticated = !!cookies[AUTHJS_SESSION_TOKEN];
```

### 2. User Preferences

```tsx
const cookies = useCookies();
const theme = cookies['theme'] || 'light';
const language = cookies['language'] || 'en';
```

### 3. API Headers

```tsx
const cookies = useCookies();
const headers = {
  Authorization: `Bearer ${cookies[AUTHJS_SESSION_TOKEN]}`,
  'X-Custom-Header': cookies['custom-header'],
};
```

## Troubleshooting

### Error: "useCookies must be used within a CookiesProvider"

This error occurs when you try to use the `useCookies` hook outside of the `CookiesProvider`. Make sure your component is wrapped in the provider hierarchy.

### Cookie Not Found

If a cookie is not available, it will be `undefined`. Always check for existence before using:

```tsx
const cookies = useCookies();
const sessionToken = cookies[AUTHJS_SESSION_TOKEN];

if (sessionToken) {
  // Use the token
} else {
  // Handle missing token
}
```

### Hydration Issues

Since cookies are collected on the server side, there shouldn't be hydration mismatches. The hook provides the same cookies that were available during server-side rendering.
