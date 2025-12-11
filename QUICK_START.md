# Quick Start Guide - New Authentication Features

## What's New?

Your frontend now supports:
1. ✅ Forgot Password / Password Reset
2. ✅ Registration Status Checking  
3. ✅ Pending Account Approval Flow
4. ✅ Enhanced Error Handling
5. ✅ Centralized Authentication Service

## Accessing New Features

### For Users
- **Forgot Password**: Click "Forgot password?" on login page → `/forgot-password`
- **Check Status**: Go to `/check-status` to check registration approval status
- **Reset Password**: Follow email link from forgot password (format: `/reset-password?token=xxx`)

### Routes Added
```javascript
/login              // Updated with forgot password link
/register           // Updated with password confirmation
/forgot-password    // New - Request password reset
/reset-password     // New - Reset with token from email
/check-status       // New - Check registration status
```

## For Developers

### Using the New Auth Service
```javascript
import authService from '../services/authService';

// All available methods:
authService.register(userData)
authService.login(credentials)
authService.checkStatus(email)
authService.forgotPassword(email)
authService.verifyResetToken(token)
authService.resetPassword(token, password)
authService.getMe()
authService.logout()
authService.refreshToken()
```

### Using Enhanced UserAPI Hook
```javascript
const state = useContext(GlobalState);

// Existing (still works):
const [user, setUser] = state.userAPI.user;
const [isLoggedIn] = state.userAPI.isLoggedIn;
const [isAdmin] = state.userAPI.isAdmin;

// New methods available:
const login = state.userAPI.login;
const register = state.userAPI.register;
const logout = state.userAPI.logout;
const [loading] = state.userAPI.loading;
const [error] = state.userAPI.error;

// Use them:
await login({ email, password, rememberMe });
await register({ name, email, password });
logout();
```

## Backend Requirements

Your backend must implement these endpoints:

### Required Endpoints
```
POST /api/user/register
POST /api/user/login
POST /api/user/forgot-password
POST /api/user/verify-reset-token
POST /api/user/reset-password/:token
POST /api/user/check-status
GET  /api/user/info (already exists)
POST /api/user/logout (already exists)
```

### User Model Changes
Ensure your User model supports:
```javascript
{
  status: "APPROVED" | "PENDING" | "DENIED",
  resetPasswordToken: String,
  resetPasswordExpires: Date
}
```

## Configuration

### Environment Variables
In `.env`:
```bash
# For development (leave empty to use relative URLs):
REACT_APP_API_BASE_URL=

# For production:
REACT_APP_API_BASE_URL=https://your-api-domain.com
```

## Testing the Implementation

### 1. Test Registration
- Go to `/register`
- Fill in name, email, password, confirm password
- Submit
- Should redirect based on approval requirement

### 2. Test Login
- Go to `/login`
- Enter credentials
- Check "Remember Me" if desired
- Submit
- Should handle both approved and pending accounts

### 3. Test Forgot Password
- Go to `/login`
- Click "Forgot password?"
- Enter email
- Check for success message
- (Backend should send email with reset link)

### 4. Test Reset Password
- Click link from email (format: `/reset-password?token=xxxxx`)
- Should verify token
- Enter new password twice
- Submit
- Should redirect to login

### 5. Test Check Status
- Go to `/check-status`
- Enter registered email
- View account status (APPROVED/PENDING/DENIED)

## Common Issues & Solutions

### Issue: "Invalid Authentication" error
**Solution**: Check that backend is generating tokens correctly and cookies are being set

### Issue: Reset link doesn't work
**Solution**: Ensure token is passed as query parameter: `/reset-password?token=xxx`

### Issue: Can't login after registration
**Solution**: Check if account requires approval (status = "PENDING")

### Issue: Redirect not working after login
**Solution**: Ensure localStorage items are set correctly and cookies are accessible

### Issue: 401 errors on protected routes
**Solution**: Check axios interceptor is adding Authorization header correctly

## Browser Console Debugging

Check console for:
```javascript
// Successful login:
"user info" - shows user data

// Token refresh:
"refresh" - shows refresh token response

// Auth errors:
"Auth error:" - shows what went wrong
"Login error:" - shows login failures
```

## Code Examples

### Custom Login Form
```javascript
import { useContext, useState } from 'react';
import { GlobalState } from './GlobalState';

const MyLogin = () => {
  const state = useContext(GlobalState);
  const login = state.userAPI.login;
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await login({
        email: credentials.email,
        password: credentials.password,
        rememberMe: true
      });
      if (result.limitedAccess) {
        alert('Account pending approval');
      } else {
        // Success - redirect handled by component
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
    </form>
  );
};
```

### Check If User is Pending
```javascript
const state = useContext(GlobalState);
const [user] = state.userAPI.user;

if (user.status === 'PENDING') {
  return <div>Your account is pending approval</div>;
}
```

## Styling

All new components use your existing CSS:
- `auth.css` - Main auth styling
- `.login-btn` - Button styles
- `.form__input` - Input field styles
- `.alert-danger` - Error messages
- `.alert-success` - Success messages
- `.badge` - Status badges

## Next Steps

1. ✅ Test all new features locally
2. ✅ Ensure backend endpoints are implemented
3. ✅ Configure production API URL
4. ✅ Test email delivery for password reset
5. ✅ Update admin dashboard to approve/deny users
6. ✅ Add password reset email template
7. ✅ Test on multiple browsers

## Support

If you encounter issues:
1. Check browser console for errors
2. Check network tab for failed API calls
3. Verify backend is running
4. Check .env configuration
5. Ensure cookies are enabled

## Backward Compatibility

✅ All existing code continues to work
✅ No breaking changes to current auth flow
✅ Existing components don't need updates
✅ GlobalState context structure unchanged
✅ PrivateRoute works as before

You can adopt new features gradually!
