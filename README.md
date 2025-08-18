# Next.js Healthcare Management System (The Polyclnic)

A comprehensive healthcare management system built with Next.js, featuring appointment scheduling, user management, and drug inventory tracking.

This project is a full-stack web application designed to streamline healthcare operations. It provides a robust set of features for managing appointments, users, services, and drug inventory. The system is built with modern web technologies, ensuring a responsive and user-friendly experience for healthcare professionals and patients alike.

Key features include:

- User authentication and role-based access control
- Appointment scheduling and management
- Patient and doctor profiles
- Drug inventory tracking
- Service catalog management
- Email notifications
- Data export functionality
- Responsive dashboard with real-time updates

## Repository Structure

```
.
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── appointments/
│   │       ├── drugs/
│   │       ├── emails/
│   │       ├── services/
│   │       └── users/
│   ├── auth/
│   ├── dashboard/
│   └── appointments/
├── components/
│   ├── appointments/
│   ├── dashboard/
│   ├── ui/
│   └── auth/
├── functions/
│   ├── client/
│   └── server-actions/
├── lib/
├── models/
├── public/
├── styles/
├── utils/
├── auth.ts
├── next.config.mjs
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

Key Files:

- `app/api/`: Contains API routes for various entities
- `components/`: Reusable React components
- `functions/`: Server-side and client-side utility functions
- `models/`: Mongoose models for database entities
- `auth.ts`: Authentication configuration
- `next.config.mjs`: Next.js configuration
- `tailwind.config.ts`: Tailwind CSS configuration

## Authentication

The application uses Better Auth for authentication with email and password, including email verification with OTP. The authentication system includes:

- **Email & Password Registration**: Users can create accounts using their email address and password
- **Email Verification with OTP**: New users must verify their email address with a 6-digit OTP before registration is complete
- **Password Reset**: Users can request password reset links via email
- **Secure Login**: Users can sign in with their email and password

### Authentication Flow

1. **Registration Step 1**: Users fill out a registration form with their name, email, and password
2. **Email Verification**: A 6-digit OTP is sent to the user's email address
3. **Registration Step 2**: Users enter the OTP to verify their email and complete registration
4. **Login**: Users can sign in with their verified email and password
5. **Password Reset**: Users can request a password reset if they forget their password

### Authentication Configuration

The authentication is configured in `auth.ts` with the following features:

- Email and password authentication enabled
- Email verification with OTP before registration
- Password reset functionality with email links
- Secure password hashing using scrypt
- Session management with cookies

## Usage Instructions

### Installation

Prerequisites:

- Node.js (v18 or later)
- MongoDB (v4.4 or later)

Steps:

1. Clone the repository:
   ```
   git clone https://github.com/your-username/healthcare-management-system.git
   ```
2. Navigate to the project directory:
   ```
   cd healthcare-management-system
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env.local` file in the root directory and add the following environment variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

### Getting Started

To run the development server:

```
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Configuration

The application can be configured through various files:

- `next.config.mjs`: Adjust Next.js settings
- `tailwind.config.ts`: Customize the Tailwind CSS theme
- `auth.ts`: Configure authentication providers and callbacks

### Common Use Cases

1. Creating a new appointment:

   - Navigate to the Appointments page
   - Click "New Appointment"
   - Fill in the required details and submit

2. Managing drug inventory:

   - Go to the Dashboard
   - Select "Drugs" from the sidebar
   - Add, edit, or delete drug entries as needed

3. Exporting data:
   - Navigate to the desired section (e.g., Users, Drugs)
   - Click the "Export" button to download an Excel file

### Testing & Quality

To run the test suite:

```
npm run test
```

### Troubleshooting

Common issues and solutions:

1. Database connection errors:

   - Ensure your MongoDB instance is running
   - Check that the `MONGODB_URI` in `.env.local` is correct
   - Verify network connectivity to the database server

2. Authentication issues:

   - Make sure `NEXTAUTH_SECRET` and `NEXTAUTH_URL` are set correctly in `.env.local`
   - Clear browser cookies and try logging in again

3. API errors:
   - Check the server logs for detailed error messages
   - Verify that you're using the correct API endpoints and HTTP methods

Debugging:

- Enable verbose logging by setting `DEBUG=true` in `.env.local`
- Use the browser's developer tools to inspect network requests and console output
- Check the application logs in `./logs/app.log` for server-side errors

Performance optimization:

- Monitor API response times using the Network tab in browser dev tools
- Use the React DevTools profiler to identify slow-rendering components
- Consider implementing server-side rendering for data-heavy pages

## Data Flow

The application follows a typical client-server architecture with Next.js handling both frontend and backend operations. Here's an overview of the data flow:

1. Client makes a request (e.g., fetching appointments)
2. Next.js API route handles the request
3. API route connects to MongoDB using Mongoose
4. Data is retrieved or modified in the database
5. Response is sent back to the client
6. React components update to reflect the new data

```
[Client] <-> [Next.js API Routes] <-> [Mongoose] <-> [MongoDB]
   ^                                                    |
   |                                                    |
   +----------------------------------------------------+
```

Important technical considerations:

- Use of server-side rendering (SSR) for initial page loads
- Client-side data fetching for dynamic updates
- JWT-based authentication for secure API access
- Optimistic UI updates for improved perceived performance

## Deployment

Prerequisites:

- Vercel account or similar hosting platform
- Production MongoDB instance

Steps:

1. Push your code to a Git repository
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy the application

Environment configurations:

- Set `NODE_ENV=production`
- Ensure all required environment variables are set
- Configure proper CORS settings for production API endpoints

Monitoring:

- Use Vercel Analytics for performance monitoring
- Set up error tracking with a service like Sentry

## Infrastructure

The application is containerized using Docker for easy deployment and scaling. Key infrastructure components include:

- Docker:

  - `Dockerfile`: Defines the container image for the application
  - `docker-compose.yml`: Orchestrates the application and its dependencies

- Node.js:

  - The application runs on Node.js 18 in an Alpine Linux container

- Next.js:

  - Provides the framework for both frontend and backend

- MongoDB:

  - Used as the primary database (connection managed through environment variables)

- Tailwind CSS:
  - `tailwind.config.ts`: Configures the design system and theme
  - `tailwind.config.ts`: configure the design system and theme

The infrastructure is designed to be cloud-agnostic and can be deployed to various platforms that support Docker containers.
