# Organization Management

This document describes the Organization Management feature for Super Admins in the Polyclinic application.

## Overview

The Organization Management system allows Super Admins to manage multiple organizations (tenants) in a multi-tenant SaaS architecture. Each organization represents a separate clinic or healthcare facility that can use the application.

## Features

### 1. Organization Model

- **Fields:**
  - `id`: Unique identifier
  - `name`: Organization name
  - `domain`: Unique domain identifier (used for multi-tenancy)
  - `logoUrl`: Optional logo URL
  - `status`: Active/Inactive status
  - `subscriptionId`: Optional subscription identifier
  - `createdAt`: Creation timestamp
  - `updatedAt`: Last update timestamp
  - `createdBy`: User who created the organization
  - `updatedBy`: User who last updated the organization

### 2. API Endpoints

All endpoints are restricted to users with `superadmin` role:

#### GET `/api/v1/superadmin/organizations`

- Lists all organizations
- Returns organizations sorted by creation date (newest first)

#### POST `/api/v1/superadmin/organizations`

- Creates a new organization
- Required fields: `name`, `domain`
- Optional fields: `logoUrl`, `status`
- Validates domain uniqueness

#### GET `/api/v1/superadmin/organizations/:id`

- Retrieves a specific organization by ID

#### PUT `/api/v1/superadmin/organizations/:id`

- Updates an existing organization
- Validates domain uniqueness if domain is being changed

#### DELETE `/api/v1/superadmin/organizations/:id`

- Deletes an organization

#### PATCH `/api/v1/superadmin/organizations/:id/status`

- Toggles organization status between active/inactive

### 3. Dashboard UI

The Super Admin dashboard includes:

- **Organization List**: Displays all organizations with key information
- **Create Organization**: Modal form to create new organizations
- **Edit Organization**: Modal form to update existing organizations
- **Delete Organization**: Confirmation dialog for deletion
- **Status Toggle**: Quick toggle to activate/deactivate organizations

### 4. Access Control

- **Role-based Access**: Only users with `superadmin` role can access organization management
- **UI Filtering**: Organization menu item only appears for superadmin users
- **API Protection**: All endpoints validate superadmin role before processing requests

## Usage

### For Super Admins

1. **Access**: Navigate to `/dashboard/organizations` (only visible to superadmin users)
2. **Create**: Click "Create Organization" button and fill in the required fields
3. **Edit**: Click "Edit" button on any organization card
4. **Delete**: Click "Delete" button and confirm the action
5. **Toggle Status**: Click "Activate" or "Deactivate" button to change organization status

### API Usage

```typescript
// Example API calls
const organizations = await fetch('/api/v1/superadmin/organizations');
const newOrg = await fetch('/api/v1/superadmin/organizations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'New Clinic',
    domain: 'newclinic.com',
    status: 'active',
  }),
});
```

## Multi-tenancy Support

The organization system is designed to support multi-tenancy:

- Each organization has a unique domain identifier
- The domain can be used for subdomain routing (e.g., `clinic1.app.com`, `clinic2.app.com`)
- Organizations can be activated/deactivated independently
- Future enhancements can include organization-specific configurations

## Security Considerations

- All endpoints require superadmin authentication
- Domain validation prevents duplicate domains
- Input validation on all fields
- Proper error handling and user feedback
- Audit trail with createdBy/updatedBy fields

## Future Enhancements

- Organization-specific user management
- Organization settings and configurations
- Billing and subscription management
- Organization analytics and reporting
- Custom branding per organization
- Organization-specific feature flags
