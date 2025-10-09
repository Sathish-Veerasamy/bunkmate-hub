# Store Architecture

This folder contains centralized data management for the application. Each store module handles data fetching, state management, and CRUD operations for a specific domain.

## Structure

```
store/
├── dealers.ts          # Dealer management
├── users.ts           # User management
├── events.ts          # Event management
├── subscriptions.ts   # Subscription management
└── notifications.ts   # Notification management
```

## Architecture Pattern

Each store module follows this pattern:

### 1. Type Definitions
```typescript
export type EntityType = {
  id: number;
  // ... other fields
};
```

### 2. Mock Data (Temporary)
```typescript
const initialEntities: EntityType[] = [
  // Mock data for development
];
```

### 3. API Layer
```typescript
export const entitiesAPI = {
  getAll: async () => Promise<EntityType[]>,
  getById: async (id: number) => Promise<EntityType>,
  create: async (entity) => Promise<EntityType>,
  update: async (id, entity) => Promise<EntityType>,
  delete: async (id) => Promise<void>,
};
```

### 4. Custom Hook
```typescript
export function useEntities() {
  const [entities, setEntities] = useState<EntityType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // CRUD operations
  // Fetch logic
  // Return state and methods
}
```

## Backend Integration Guide

When integrating with a backend, follow these steps:

### Step 1: Update API Functions
Replace the mock implementations in the API layer with actual API calls:

```typescript
// Before (Mock)
export const dealersAPI = {
  getAll: async (): Promise<Dealer[]> => {
    return Promise.resolve(initialDealers);
  },
};

// After (Real API)
export const dealersAPI = {
  getAll: async (): Promise<Dealer[]> => {
    const response = await fetch('/api/dealers');
    if (!response.ok) throw new Error('Failed to fetch dealers');
    return response.json();
  },
};
```

### Step 2: Add Environment Variables
Create a `.env` file with your API base URL:
```
VITE_API_BASE_URL=https://your-api.com/api
```

### Step 3: Update Imports
The components are already using the hooks, so no component changes needed!

```typescript
// Components already use hooks like this:
const { dealers, loading, error, addDealer } = useDealers();
```

### Step 4: Add Authentication
If your API requires authentication, add an auth header utility:

```typescript
// src/lib/api.ts
export const authFetch = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('authToken');
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};
```

## Current Components Using Stores

- **Dealers**: `src/components/dealers/DealersTable.tsx`, `src/pages/Dealers.tsx`
- **Users**: `src/pages/Users.tsx`
- **Events**: `src/pages/Events.tsx`
- **Subscriptions**: `src/pages/Subscriptions.tsx`
- **Notifications**: `src/components/Header.tsx`

## Benefits

✅ **Single Source of Truth**: All data management in one place  
✅ **Easy Backend Integration**: Just replace API functions  
✅ **Type Safety**: Full TypeScript support  
✅ **Reusable Hooks**: Use same data across multiple components  
✅ **Loading & Error States**: Built-in state management  
✅ **Maintainable**: Clear separation of concerns  

## Example: Adding a New Store

```typescript
// src/store/donations.ts
import { useState, useEffect } from \"react\";

export type Donation = {
  id: number;
  dealerId: number;
  amount: number;
  date: string;
  purpose: string;
};

const initialDonations: Donation[] = [];

export const donationsAPI = {
  getAll: async (): Promise<Donation[]> => {
    // TODO: Replace with API call
    return Promise.resolve(initialDonations);
  },
  // ... other CRUD methods
};

export function useDonations() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Implementation
  
  return { donations, loading, /* methods */ };
}
```

Then use in components:
```typescript
import { useDonations } from "@/store/donations";

function DonationsPage() {
  const { donations, loading } = useDonations();
  // Use the data
}
```
