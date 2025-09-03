# NextAuth State Cookie Error Troubleshooting

## Error: "State cookie was missing"

This error occurs when NextAuth.js can't find the `state` cookie during OAuth authentication.

## Root Causes & Solutions

### 1. Google OAuth Redirect URI Mismatch (Most Common)

**Problem**: The redirect URI configured in Google Cloud Console doesn't match your actual callback URL.

**Solution**:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "APIs & Services" > "Credentials"
3. Edit your OAuth 2.0 Client ID
4. Add this exact redirect URI: `http://localhost:3000/api/auth/callback/google`
5. Make sure there are no trailing slashes or typos

### 2. Environment Variables

**Required Variables**:

```env
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**Verify**: Run `npm run dev` and check terminal for any missing env var warnings.

### 3. Browser Cookie Issues

**Check**:

- Cookies are enabled in your browser
- No browser extensions blocking cookies
- Not in incognito/private mode
- Clear browser cookies and try again

### 4. Development Server Issues

**Solutions**:

1. Stop the development server (`Ctrl+C`)
2. Clear `.next` folder: `rm -rf .next`
3. Restart: `npm run dev`

### 5. NextAuth Version Compatibility

**Current**: NextAuth v4.24.11
**Note**: Configuration syntax differs between v4 and v5

## Debug Steps

### Step 1: Use Debug Page

Navigate to `/auth/debug` to test OAuth flow and see detailed logs.

### Step 2: Check Browser Console

Look for any JavaScript errors during the OAuth flow.

### Step 3: Check Terminal Logs

Look for NextAuth debug messages (debug mode is enabled in development).

### Step 4: Verify Google OAuth Setup

1. Check redirect URI in Google Cloud Console
2. Ensure OAuth consent screen is configured
3. Verify API is enabled (Google+ API)

## Common Fixes

### Fix 1: Update Google OAuth Configuration

```typescript
// In Google Cloud Console, add these redirect URIs:
http://localhost:3000/api/auth/callback/google
http://localhost:3000/api/auth/callback/facebook
http://localhost:3000/api/auth/callback/apple
```

### Fix 2: Clear Browser Data

- Clear cookies for localhost:3000
- Clear browser cache
- Try in a different browser

### Fix 3: Check Network Tab

1. Open browser DevTools
2. Go to Network tab
3. Try to sign in with Google
4. Look for failed requests or redirects

## Testing

1. **Test OAuth Flow**: Use `/auth/debug` page
2. **Check Environment**: Verify all env vars are loaded
3. **Monitor Logs**: Watch terminal and browser console
4. **Verify Redirect**: Check Google Cloud Console redirect URIs

## Still Having Issues?

1. Check if the error occurs in production vs development
2. Try with a different OAuth provider (Facebook, Apple)
3. Verify your Google OAuth app is not in testing mode
4. Check if your domain is verified in Google Cloud Console

## Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth Setup Guide](https://developers.google.com/identity/protocols/oauth2)
- [NextAuth v4 Migration Guide](https://next-auth.js.org/getting-started/upgrade-v4)


