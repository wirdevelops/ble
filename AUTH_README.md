# BLE Authentication System

This document outlines the authentication system implementation for the BLE project.

## Features

- 🔐 Secure Authentication
  - Email Magic Link Authentication
  - Google OAuth Integration
  - Passwordless Authentication
  - Session Management
  - Route Protection

- 👤 User Management
  - User Profiles
  - Role-Based Access Control
  - Onboarding Flow
  - Profile Updates

- 🛡️ Security Features
  - Row Level Security (RLS)
  - Secure Session Handling
  - Protected Routes
  - Environment Variable Configuration

## Setup Instructions

1. **Environment Variables**
   Make sure your `.env` file contains:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

2. **Database Setup**
   ```bash
   # Initialize Supabase locally
   npx supabase init

   # Link to your Supabase project
   npx supabase link --project-ref your_project_ref

   # Push the database migrations
   npx supabase db push

   # Apply the seed data
   npx supabase db reset
   ```

3. **Google OAuth Setup**
   1. Create a project in Google Cloud Console
   2. Enable Google OAuth API
   3. Configure OAuth consent screen
   4. Create OAuth 2.0 Client ID
   5. Add authorized redirect URIs:
      - `https://your-domain.com/auth/callback`
      - `http://localhost:3000/auth/callback` (for development)

## Authentication Flow

1. **Sign Up Flow**
   - User enters email or clicks Google Sign In
   - System creates user account
   - Automatic profile creation
   - Redirect to onboarding if needed

2. **Sign In Flow**
   - User enters email for magic link or uses Google
   - System verifies credentials
   - Creates secure session
   - Redirects to intended destination

3. **Protected Routes**
   - Middleware checks session
   - Redirects to sign in if needed
   - Handles special routes (share, API)
   - Maintains intended destination

4. **Session Management**
   - Automatic session refresh
   - Secure cookie handling
   - Real-time session updates
   - Cross-tab synchronization

## Security Considerations

1. **Environment Variables**
   - Never commit .env files
   - Use different keys per environment
   - Rotate keys periodically

2. **Database Security**
   - Row Level Security enabled
   - Strict access policies
   - Secure profile management
   - Protected user data

3. **API Security**
   - Protected routes
   - Rate limiting
   - CORS configuration
   - Secure headers

## User Experience

1. **Authentication Options**
   - Passwordless (Magic Link)
   - Social Login (Google)
   - Remember session
   - Cross-device support

2. **Error Handling**
   - User-friendly messages
   - Clear instructions
   - Graceful fallbacks
   - Recovery options

3. **Navigation**
   - Smart redirects
   - Path preservation
   - Onboarding integration
   - Profile completion

## Development Guidelines

1. **Adding New Auth Features**
   - Follow existing patterns
   - Implement proper error handling
   - Add appropriate types
   - Update documentation

2. **Security Updates**
   - Regular dependency updates
   - Security audit fixes
   - Key rotation
   - Policy reviews

3. **Testing**
   - Test all auth flows
   - Cross-browser testing
   - Mobile responsiveness
   - Error scenarios
