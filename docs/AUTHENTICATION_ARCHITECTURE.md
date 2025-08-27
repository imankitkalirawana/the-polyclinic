# Authentication Architecture

## Overview

This document describes the secure and synchronized authentication system implemented for The Polyclinic application. The architecture provides a unified, secure approach to user authentication with OTP-based verification.

## Architecture Components

### 1. Core Services

#### OTPManager (`lib/auth/otp-manager.ts`)

- **Purpose**: Centralized OTP generation, storage, and verification
- **Features**:
  - Secure 6-digit OTP generation
  - JWT token creation with 10-minute expiration
  - Database storage with attempt tracking (max 3 attempts)
  - Automatic cleanup of expired OTPs
  - Token verification with purpose validation

#### AuthService (`lib/auth/auth-service.ts`)

- **Purpose**: High-level authentication operations
- **Features**:
  - User registration with OTP verification
  - Password reset functionality
  - OTP sending and verification
  - Business logic validation
  - Error handling and response formatting

#### AuthEmailService (`lib/auth/email-service.ts`)

- **Purpose**: Email notifications for authentication events
- **Features**:
  - OTP delivery emails
  - Welcome emails for new registrations
  - Password reset confirmation emails
  - Organization-specific email subjects

#### Validation (`lib/auth/validation.ts`)

- **Purpose**: Request validation and response formatting
- **Features**:
  - Zod schema validation for all auth requests
  - Standardized error and success response formats
  - Type-safe request/response interfaces

### 2. API Routes

#### `/api/auth/send-otp` (POST)

- **Purpose**: Send OTP for registration or password reset
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "type": "register" | "reset-password" | "verify-email",
    "subdomain": "organization-name" // Required for registration, optional for others
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": { "email": "user@example.com" },
    "message": "OTP sent successfully"
  }
  ```

#### `/api/auth/verify-otp` (POST)

- **Purpose**: Verify OTP and generate verification token
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "otp": "123456",
    "type": "register" | "reset-password" | "verify-email",
    "subdomain": "organization-name" // Required for registration, optional for others
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "token": "jwt_token_here",
      "email": "user@example.com",
      "type": "register"
    },
    "message": "OTP verified successfully"
  }
  ```

#### `/api/auth/register` (POST)

- **Purpose**: Register new user with OTP verification
- **Request Body**:
  ```json
  {
    "name": "User Name",
    "email": "user@example.com",
    "password": "securepassword123",
    "subdomain": "organization-name", // Required for registration
    "token": "jwt_token_from_verify_otp", // Optional: either token or OTP
    "otp": "123456" // Optional: either token or OTP
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": "user_id",
      "email": "user@example.com",
      "name": "User Name",
      "role": "user",
      "uid": "unique_user_id",
      "organization": "subdomain"
    },
    "message": "Registration successful"
  }
  ```

#### `/api/auth/reset-password` (POST)

- **Purpose**: Reset user password with OTP verification
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "newsecurepassword123",
    "token": "jwt_token_from_verify_otp", // Optional: either token or OTP
    "otp": "123456", // Optional: either token or OTP
    "subdomain": "organization-name" // Optional for password reset
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": { "email": "user@example.com" },
    "message": "Password reset successfully"
  }
  ```

## Security Features

### 1. Organization/Subdomain Requirements

- **Registration**: **REQUIRES** subdomain/organization - users can only register within an existing organization
- **Password Reset**: **OPTIONAL** subdomain - can reset password without organization context (uses default database connection)
- **OTP Verification**: **OPTIONAL** subdomain - can verify OTP without organization context (uses default database connection)
- **Security**: Prevents unauthorized user creation outside of organizational boundaries while allowing password recovery

### 2. OTP Security

- **6-digit numeric OTPs** with cryptographically secure generation
- **10-minute expiration** for all OTPs
- **Maximum 3 attempts** per email/type combination
- **Automatic cleanup** of expired OTPs

### 2. Token Security

- **JWT tokens** with 10-minute expiration
- **Purpose validation** to prevent token misuse
- **Secure signing** using NEXTAUTH_SECRET
- **Token verification** before any sensitive operations

### 3. Password Security

- **bcrypt hashing** with 12 rounds (industry standard)
- **Minimum 8 characters** requirement
- **Secure password reset** flow

### 4. Input Validation

- **Zod schema validation** for all inputs
- **Email format validation**
- **OTP format validation** (6 digits only)
- **Type-safe interfaces** throughout the system

### 5. Error Handling

- **Consistent error responses** across all endpoints
- **No sensitive information** leaked in error messages
- **Proper HTTP status codes**
- **Detailed validation errors** for debugging

## Authentication Flow

### Registration Flow

1. User submits email for registration
2. System validates email and checks if user exists
3. OTP is generated and sent via email
4. User enters OTP on verification page
5. System verifies OTP and generates verification token
6. User submits registration form with token and OTP
7. System creates user account and sends welcome email

### Password Reset Flow

1. User submits email for password reset
2. System validates email and checks if user exists
3. OTP is generated and sent via email
4. User enters OTP on verification page
5. System verifies OTP and generates verification token
6. User submits new password with token and OTP
7. System updates password and sends confirmation email

## Database Schema

### Verification Collection

```javascript
{
  email: String,           // User email (unique)
  otp: Number,            // 6-digit OTP
  type: String,           // 'register' | 'reset-password' | 'verify-email'
  count: Number,          // Attempt counter (max 3)
  createdAt: Date,        // Auto-expires after 10 minutes
  updatedAt: Date         // Last update timestamp
}
```

## Error Handling

### Standard Error Response Format

```json
{
  "success": false,
  "message": "Human-readable error message",
  "errors": ["Detailed error 1", "Detailed error 2"],
  "status": 400
}
```

### Common Error Scenarios

- **Invalid email format**: 400 Bad Request
- **User already exists**: 400 Bad Request
- **User not found**: 400 Bad Request (for password reset)
- **Invalid OTP**: 400 Bad Request
- **Expired token**: 400 Bad Request
- **Maximum attempts reached**: 400 Bad Request
- **Organization not found**: 400 Bad Request
- **Internal server error**: 500 Internal Server Error

## Best Practices

### 1. Rate Limiting

- Consider implementing rate limiting for OTP requests
- Monitor for abuse patterns
- Implement progressive delays for repeated failures

### 2. Monitoring

- Log all authentication attempts
- Monitor OTP success/failure rates
- Track email delivery success rates
- Alert on unusual authentication patterns

### 3. Security Headers

- Ensure all endpoints use HTTPS
- Implement proper CORS policies
- Use security headers (HSTS, CSP, etc.)

### 4. Testing

- Unit tests for all validation schemas
- Integration tests for authentication flows
- Security tests for token validation
- Email delivery testing

## Migration Notes

### From Previous Implementation

- **Backward compatibility**: Not maintained - this is a breaking change
- **Database changes**: Verification collection schema updated
- **API changes**: All auth endpoints now use standardized response format
- **Security improvements**: Enhanced token validation and OTP security

### Deployment Checklist

- [ ] Update environment variables (NEXTAUTH_SECRET)
- [ ] Deploy new validation schemas
- [ ] Test all authentication flows
- [ ] Update client-side code to handle new response format
- [ ] Monitor authentication metrics
- [ ] Update documentation for frontend developers

## Future Enhancements

### 1. Multi-Factor Authentication

- SMS OTP as additional factor
- Authenticator app integration
- Biometric authentication

### 2. Advanced Security

- Device fingerprinting
- Location-based authentication
- Risk-based authentication

### 3. User Experience

- Remember device functionality
- Progressive authentication
- Social login integration

### 4. Monitoring & Analytics

- Authentication analytics dashboard
- Real-time security alerts
- User behavior analysis
