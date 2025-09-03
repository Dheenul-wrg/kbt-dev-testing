# Apple Sign-In Testing Guide

## Current Setup Status

✅ **Apple Provider Configured**: Apple sign-in is properly configured in `src/utils/auth.ts`
✅ **UI Components Ready**: Apple sign-in buttons are present in login and registration modals
✅ **Build Fixed**: Static export issues resolved, app builds successfully
✅ **Repository Updated**: Changes pushed to GitHub repository

## Testing Checklist

### 1. Environment Setup

Before testing Apple sign-in, ensure you have:

- [ ] Apple Developer Account
- [ ] App ID with "Sign In with Apple" capability enabled
- [ ] Service ID created for web authentication
- [ ] Private key generated for Apple Sign-In
- [ ] Redirect URLs configured in Apple Developer Console

### 2. Required Environment Variables

Create a `.env.local` file with:

```bash
# Apple Sign-In Configuration
APPLE_CLIENT_ID="com.yourcompany.kentuky-tripbuilder"  # Your Service ID
APPLE_CLIENT_SECRET="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----"

# NextAuth Configuration
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Database (if testing with database)
DATABASE_URL="your-database-url"
```

### 3. Apple Developer Console Configuration

1. **App ID Setup**:
   - Go to Apple Developer Console → Certificates, Identifiers & Profiles
   - Create/Edit your App ID
   - Enable "Sign In with Apple" capability

2. **Service ID Setup**:
   - Create a new Service ID (e.g., `com.yourcompany.kentuky-tripbuilder`)
   - Configure Sign In with Apple
   - Add domains: `localhost` (for testing), your production domain
   - Add redirect URLs:
     - `http://localhost:3000/api/auth/callback/apple` (development)
     - `https://your-domain.com/api/auth/callback/apple` (production)

3. **Private Key Generation**:
   - Go to Keys section
   - Create a new key with "Sign In with Apple" enabled
   - Download the `.p8` file
   - Note your Team ID and Key ID

### 4. Testing Steps

#### Local Testing

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Navigate to the app**: Open `http://localhost:3000`

3. **Test Apple Sign-In**:
   - Click on login/register modal
   - Click "SIGN IN WITH APPLE" button
   - Complete Apple authentication flow
   - Verify user is created/authenticated

#### Production Testing

1. **Deploy to your hosting platform** (Vercel, Netlify, etc.)

2. **Update environment variables** in your hosting platform

3. **Test with real Apple ID** on the deployed app

### 5. Common Issues & Solutions

#### Issue: "Invalid client" error
**Solution**: 
- Verify `APPLE_CLIENT_ID` matches your Service ID exactly
- Ensure Service ID has "Sign In with Apple" enabled

#### Issue: "Invalid redirect URI" error
**Solution**:
- Add your callback URL to Apple Developer Console
- Format: `https://your-domain.com/api/auth/callback/apple`

#### Issue: "Invalid client secret" error
**Solution**:
- Ensure private key is properly formatted in `APPLE_CLIENT_SECRET`
- Include the full private key with headers and newlines

#### Issue: Apple sign-in button not working
**Solution**:
- Check browser console for errors
- Verify environment variables are loaded
- Ensure `NEXTAUTH_URL` is set correctly

### 6. Debug Mode

Enable debug mode by adding to your environment:
```bash
NEXTAUTH_DEBUG=true
```

This will provide detailed logs in the console.

### 7. Testing Checklist

- [ ] Apple sign-in button appears in login modal
- [ ] Apple sign-in button appears in registration modal
- [ ] Clicking Apple button opens Apple authentication
- [ ] User can complete Apple authentication
- [ ] User is redirected back to the app
- [ ] User session is created
- [ ] User data is stored in database (if applicable)
- [ ] User can sign out and sign back in

## Next Steps

1. **Set up Apple Developer Account** if not already done
2. **Configure Apple Sign-In** in Apple Developer Console
3. **Add environment variables** to your hosting platform
4. **Test the complete flow** from sign-in to user creation
5. **Deploy to production** and test with real users

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify all environment variables are set correctly
3. Ensure Apple Developer Console configuration matches your app
4. Test with a different Apple ID if needed
