# Deployment Guide

## Prerequisites

1. **Apple Developer Account**: You need an Apple Developer account to set up Apple Sign-In
2. **OAuth Provider Setup**: Configure Google, Facebook, and Apple OAuth applications
3. **Database**: PostgreSQL database (local or hosted)
4. **Hosting Platform**: Vercel, Netlify, or similar

## Environment Variables Setup

### Required Environment Variables

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/kentuky_tripbuilder"

# NextAuth Configuration
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="https://your-domain.com"  # Update for production

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

FACEBOOK_CLIENT_ID="your-facebook-client-id"
FACEBOOK_CLIENT_SECRET="your-facebook-client-secret"

APPLE_CLIENT_ID="your-apple-client-id"
APPLE_CLIENT_SECRET="your-apple-client-secret"

# GraphQL
NEXT_PUBLIC_GRAPHQL_URL="https://your-graphql-endpoint.com/graphql"
```

## Apple Sign-In Setup

### 1. Apple Developer Console Setup

1. Go to [Apple Developer Console](https://developer.apple.com/account/)
2. Navigate to "Certificates, Identifiers & Profiles"
3. Create a new App ID or use existing one
4. Enable "Sign In with Apple" capability
5. Create a Service ID for web authentication
6. Configure the Service ID with your domain and redirect URLs

### 2. Apple Sign-In Configuration

1. **Service ID**: Create a Service ID (e.g., `com.yourcompany.kentuky-tripbuilder`)
2. **Redirect URLs**: Add your callback URLs:
   - Development: `http://localhost:3000/api/auth/callback/apple`
   - Production: `https://your-domain.com/api/auth/callback/apple`
3. **Private Key**: Generate a private key for Sign In with Apple
4. **Team ID**: Get your Apple Developer Team ID

### 3. Environment Variables for Apple

```bash
APPLE_CLIENT_ID="com.yourcompany.kentuky-tripbuilder"  # Your Service ID
APPLE_CLIENT_SECRET="your-apple-private-key"  # Generated private key
```

## Deployment Steps

### Option 1: Vercel (Recommended)

1. **Connect Repository**:
   ```bash
   npm install -g vercel
   vercel login
   vercel --prod
   ```

2. **Set Environment Variables**:
   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Add all required environment variables

3. **Deploy**:
   ```bash
   git push origin main  # Auto-deploys to Vercel
   ```

### Option 2: Manual Deployment

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Start production server**:
   ```bash
   npm start
   ```

## Testing Apple Sign-In

### Local Testing

1. **Set up local environment**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your actual values
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```

3. **Test Apple Sign-In**:
   - Navigate to your app
   - Click "SIGN IN WITH APPLE" button
   - Complete Apple authentication flow

### Production Testing

1. **Deploy to staging/production**
2. **Test with real Apple ID**
3. **Verify user creation in database**
4. **Test sign-out and re-sign-in**

## Troubleshooting

### Common Issues

1. **"Invalid client" error**: Check APPLE_CLIENT_ID matches your Service ID
2. **"Invalid redirect URI"**: Ensure redirect URLs are configured in Apple Developer Console
3. **"Invalid client secret"**: Verify APPLE_CLIENT_SECRET is correctly formatted
4. **CORS issues**: Ensure NEXTAUTH_URL is set correctly for your domain

### Debug Mode

Enable debug mode by adding to your environment:
```bash
NEXTAUTH_DEBUG=true
```

## Security Notes

1. **Never commit** `.env` files to version control
2. **Use strong secrets** for NEXTAUTH_SECRET
3. **Rotate OAuth secrets** regularly
4. **Use HTTPS** in production
5. **Validate redirect URLs** in Apple Developer Console
