Server side source code: https://github.com/imankitkalirawana/the-polyclinic-api

# The Polyclinic - Healthcare Management System

A comprehensive, multi-tenant healthcare management system built with Next.js 15, featuring appointment scheduling, user management, drug inventory tracking, and organization management.

## 🏥 Overview

The Polyclinic is a full-stack healthcare management platform designed to streamline operations for clinics, hospitals, and healthcare facilities. It provides a robust set of features for managing appointments, users, services, drug inventory, and multi-tenant organizations with role-based access control.

### Key Features

- **Multi-tenant Architecture**: Support for multiple organizations with subdomain-based routing
- **Role-based Access Control**: 7 different user roles (superadmin, moderator, ops, admin, receptionist, doctor, patient)
- **Appointment Management**: Complete scheduling system with calendar integration
- **User Management**: Comprehensive user profiles with organization-based access
- **Drug Inventory**: Track medications, dosages, and stock levels
- **Service Catalog**: Manage medical services and procedures
- **Email Notifications**: Automated email system for appointments and communications
- **Data Export**: Excel export functionality for all major entities
- **Real-time Dashboard**: Responsive admin dashboard with analytics
- **Secure Authentication**: OTP-based verification with JWT tokens
- **API Documentation**: RESTful API with comprehensive endpoints

## 🏗️ Architecture

### Technology Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **UI Framework**: HeroUI (formerly NextUI), Tailwind CSS
- **Backend**: Nest.js
- **Database**: Postgres, MongoDB (for caching)
- **Authentication**: Session based JWT authentication
- **State Management**: React Query (TanStack Query), Zustand
- **Email**: Nodemailer with custom templates
- **Deployment**: Docker, Vercel-ready
- **Monitoring**: Sentry integration
- **Development**: ESLint, Prettier, Husky, Commitlint

### Project Structure

```
the-polyclinic/
├── app/                          # Next.js App Router
│   ├── auth/                    # Authentication pages
│   ├── dashboard/               # Admin dashboard
│   ├── appointments/            # Appointment management
│   └── s/[subdomain]/          # Multi-tenant pages
├── components/                   # React components
│   ├── auth/                    # Authentication components
│   ├── dashboard/               # Dashboard components
│   ├── client/                  # Client-facing components
│   └── ui/                      # Reusable UI components
├── services/                     # API services and React Query hooks
│   ├── client/                  # Client services
│   ├── common/                  # Shared services
│   └── system/                  # System services
├── models/                       # Mongoose models
├── lib/                         # Utility libraries
├── functions/                   # Server actions
├── hooks/                       # Custom React hooks
├── types/                       # TypeScript type definitions
├── docs/                        # Documentation
└── public/                      # Static assets
```

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/the-polyclinic.git
   cd the-polyclinic
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:

   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/the-polyclinic

   # Authentication
   NEXTAUTH_SECRET=your-secret-key-here
   NEXTAUTH_URL=http://localhost:3000

   # Google OAuth (optional)
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret

   # Email Configuration
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password

   # Sentry (optional)
   SENTRY_DSN=your-sentry-dsn
   ```

4. **Start the development server**

   ```bash
   pnpm dev
   ```

5. **Access the application**
   - Main application: http://localhost:3000
   - Admin dashboard: http://localhost:3000/dashboard
   - Multi-tenant: http://organization.lvh.me:3000

## 📋 User Roles & Permissions

| Role             | Permissions                                 |
| ---------------- | ------------------------------------------- |
| **Superadmin**   | Full system access, organization management |
| **Moderator**    | User management, system oversight           |
| **Ops**          | Operational management, user administration |
| **Admin**        | Clinic management, staff oversight          |
| **Receptionist** | Patient management, appointment scheduling  |
| **Doctor**       | Patient care, appointment management        |
| **Patient**      | Personal appointments, profile management   |

## 🔧 Configuration

### Multi-tenant Setup

The system supports multi-tenancy through subdomain routing:

- **Development**: `organization.lvh.me:3000`
- **Production**: `organization.yourdomain.com`
- **Vercel**: `organization---branch.vercel.app`

### Appointment Configuration

Configure appointment settings in `lib/config.ts`:

```typescript
export const TIMINGS = {
  appointment: {
    start: 9, // 9 AM
    end: 17, // 5 PM
    interval: 30, // 30-minute slots
  },
  booking: {
    maximum: 30, // Max days in advance
  },
  holidays: ['weekend', '2025-01-17', '2025-01-26'],
};
```

### Email Templates

Customize email templates in `templates/email/`:

- OTP verification emails
- Appointment confirmations
- Password reset notifications
- Welcome emails

## 📚 API Documentation

### Authentication Endpoints

#### Send OTP

```http
POST /api/auth/send-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "type": "register",
  "subdomain": "organization-name"
}
```

#### Verify OTP

```http
POST /api/auth/verify-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456",
  "type": "register"
}
```

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "User Name",
  "email": "user@example.com",
  "password": "securepassword123",
  "subdomain": "organization-name",
  "token": "jwt_token_from_verify_otp"
}
```

### Core API Endpoints

#### Users

- `GET /api/v1/common/users` - List users
- `POST /api/v1/common/users` - Create user
- `GET /api/v1/common/users/[uid]` - Get user details
- `PUT /api/v1/common/users/[uid]` - Update user
- `DELETE /api/v1/common/users/[uid]` - Delete user

#### Appointments

- `GET /api/v1/client/appointments` - List appointments
- `POST /api/v1/client/appointments` - Create appointment
- `GET /api/v1/client/appointments/[aid]` - Get appointment
- `PUT /api/v1/client/appointments/[aid]` - Update appointment
- `DELETE /api/v1/client/appointments/[aid]` - Cancel appointment

#### Doctors

- `GET /api/v1/client/doctors` - List doctors
- `POST /api/v1/client/doctors` - Create doctor profile
- `GET /api/v1/client/doctors/[uid]` - Get doctor details
- `GET /api/v1/client/doctors/[uid]/slots` - Get available slots

#### Drugs

- `GET /api/v1/client/drugs` - List drugs
- `POST /api/v1/client/drugs` - Add drug
- `PUT /api/v1/client/drugs/[did]` - Update drug
- `DELETE /api/v1/client/drugs/[did]` - Remove drug

#### Services

- `GET /api/v1/client/services` - List services
- `POST /api/v1/client/services` - Create service
- `PUT /api/v1/client/services/[id]` - Update service
- `DELETE /api/v1/client/services/[id]` - Delete service

## 🗄️ Database Schema

### Core Models

#### User Model

```typescript
{
  uid: String,           // Unique identifier
  name: String,          // User's full name
  email: String,         // Email address (unique)
  organization: String,  // Organization subdomain
  phone: String,         // Phone number
  password: String,      // Hashed password
  image: String,         // Profile image URL
  role: String,          // User role
  status: String,        // Active/Inactive
  createdBy: String,     // Creator email
  updatedBy: String,     // Last updater email
  createdAt: Date,       // Creation timestamp
  updatedAt: Date        // Last update timestamp
}
```

#### Doctor Model

```typescript
{
  uid: Number,           // Doctor ID
  designation: String,   // Job title
  department: String,    // Medical department
  experience: String,    // Years of experience
  education: String,     // Educational background
  patients: Number,      // Patient count
  biography: String,     // Detailed bio
  shortbio: String,      // Short bio
  seating: String,       // Office location
  createdBy: String,     // Creator email
  updatedBy: String,     // Last updater email
  createdAt: Date,       // Creation timestamp
  updatedAt: Date        // Last update timestamp
}
```

#### Drug Model

```typescript
{
  did: Number,           // Drug ID
  brandName: String,     // Brand name
  genericName: String,   // Generic name
  description: String,   // Drug description
  manufacturer: String,  // Manufacturer
  dosage: String,        // Dosage information
  form: String,          // Form (tablet, liquid, etc.)
  strength: Number,      // Strength
  quantity: Number,      // Quantity
  price: Number,         // Price
  frequency: String,     // Frequency
  status: String,        // Available/Out of stock
  stock: Number,         // Stock level
  createdBy: String,     // Creator email
  updatedBy: String,     // Last updater email
  createdAt: Date,       // Creation timestamp
  updatedAt: Date        // Last update timestamp
}
```

#### Service Model

```typescript
{
  uniqueId: String,      // Unique service ID
  name: String,          // Service name
  description: String,   // Service description
  summary: String,       // Short summary
  price: Number,         // Service price
  duration: Number,      // Duration in minutes
  image: String,         // Service image
  status: String,        // Active/Inactive
  type: String,          // Service type
  data: Map,             // Additional data
  createdBy: String,     // Creator email
  updatedBy: String,     // Last updater email
  createdAt: Date,       // Creation timestamp
  updatedAt: Date        // Last update timestamp
}
```

## 🚀 Deployment

### Docker Deployment

1. **Build the Docker image**

   ```bash
   docker build -t the-polyclinic .
   ```

2. **Run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

### Vercel Deployment

1. **Connect to Vercel**

   ```bash
   vercel --prod
   ```

2. **Set environment variables** in Vercel dashboard:
   - `MONGODB_URI`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `EMAIL_HOST`
   - `EMAIL_USER`
   - `EMAIL_PASS`

### Environment Variables

| Variable               | Description                   | Required |
| ---------------------- | ----------------------------- | -------- |
| `MONGODB_URI`          | MongoDB connection string     | Yes      |
| `NEXTAUTH_SECRET`      | NextAuth.js secret key        | Yes      |
| `NEXTAUTH_URL`         | Application URL               | Yes      |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID        | No       |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret    | No       |
| `EMAIL_HOST`           | SMTP host                     | Yes      |
| `EMAIL_PORT`           | SMTP port                     | Yes      |
| `EMAIL_USER`           | SMTP username                 | Yes      |
| `EMAIL_PASS`           | SMTP password                 | Yes      |
| `SENTRY_DSN`           | Sentry DSN for error tracking | No       |

## 🧪 Development

### Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint errors
pnpm format           # Format code with Prettier
pnpm tsc              # Type check

# Utilities
pnpm clean            # Clean node_modules and rebuild
```

### Code Style

- **ESLint**: Airbnb configuration with TypeScript support
- **Prettier**: Code formatting with Tailwind CSS plugin
- **Husky**: Git hooks for pre-commit linting
- **Commitlint**: Conventional commit messages

### Testing

```bash
# Run tests (when implemented)
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

## 📖 Documentation

- [Authentication Architecture](docs/AUTHENTICATION_ARCHITECTURE.md) - Detailed auth system documentation
- [Organization Management](docs/ORGANIZATION_MANAGEMENT.md) - Multi-tenant setup guide
- [API Reference](docs/API.md) - Complete API documentation
- [Deployment Guide](docs/DEPLOYMENT.md) - Production deployment instructions
- [Contributing Guide](docs/CONTRIBUTING.md) - Development guidelines

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and patterns
- Write meaningful commit messages using conventional commits
- Add tests for new features
- Update documentation as needed
- Ensure all checks pass before submitting PR

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the [docs](docs/) folder
- **Issues**: Report bugs and request features via [GitHub Issues](https://github.com/your-username/the-polyclinic/issues)
- **Discussions**: Join community discussions in [GitHub Discussions](https://github.com/your-username/the-polyclinic/discussions)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [HeroUI](https://heroui.com/) - UI component library
- [MongoDB](https://www.mongodb.com/) - Database
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [React Query](https://tanstack.com/query) - Data fetching

---

**Built with ❤️ for healthcare professionals**
