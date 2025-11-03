# Single Session Management Feature

## Overview
This feature prevents multiple simultaneous logins for admin and super admin accounts. When an admin or super admin logs in from a new location, any existing session will be automatically terminated.

## How It Works

### Backend Implementation

#### 1. User Model Update
- **File**: `backend/models/user.model.js`
- **Change**: Added `activeSessionToken` field to track the current active session
```javascript
activeSessionToken: {
    type: String,
    default: undefined
}
```

#### 2. Token Generation
- **File**: `backend/utils/generateTokenAndSetCookie.js`
- **Changes**:
  - Added `generateSessionToken()` function to create unique session identifiers
  - Modified `generateTokenAndSetCookie()` to include session token in JWT payload
  - Session token is a 32-byte random hex string

#### 3. Login Controller
- **File**: `backend/controllers/auth.admin.controller.js`
- **Changes**:
  - When admin/super admin logs in:
    1. Generate a unique session token
    2. Store it in the database (`user.activeSessionToken`)
    3. Include it in the JWT token
  - This ensures only the most recent login is valid

#### 4. Logout Controller
- **File**: `backend/controllers/auth.admin.controller.js`
- **Changes**:
  - When user logs out, clear the `activeSessionToken` from database
  - This invalidates the session completely

#### 5. Middleware Verification
- **File**: `backend/middleware/verifyAdmin.middleware.js`
- **Changes**:
  - Added session validation logic
  - Compares JWT's session token with database's active session token
  - If they don't match → session conflict (logged in elsewhere)
  - Returns `sessionConflict: true` in error response

### Frontend Implementation

#### 1. Global Error Handling
- **File**: `admin/src/App.jsx`
- **Changes**:
  - Added axios response interceptor
  - Detects session conflict errors (401 with `sessionConflict: true`)
  - Shows toast notification: "Your account has been logged in from another location"
  - Automatically redirects to login page after 2 seconds

## User Experience

### Scenario: Admin logs in from two locations

1. **Admin logs in from Computer A**
   - Session Token A is generated
   - Token A is stored in database
   - Admin can access the system

2. **Same Admin logs in from Computer B**
   - Session Token B is generated (new)
   - Token B replaces Token A in database
   - Admin on Computer B can access the system

3. **Admin on Computer A tries to access any page**
   - Middleware checks: Token A ≠ Token B (current active token)
   - Returns session conflict error
   - Frontend shows notification
   - User is redirected to login page

### User Notification
When a session conflict is detected, users see:
- **Title**: "Session Expired"
- **Message**: "Your account has been logged in from another location."
- **Action**: Automatic redirect to login page

## Security Benefits

1. **Prevents Session Hijacking**: Even if someone steals an old token, it becomes invalid after a new login
2. **Account Control**: Users have explicit control - newest login always wins
3. **Audit Trail**: Session tokens can be logged for security monitoring
4. **Automatic Cleanup**: Logging out properly clears the session

## Technical Details

### Session Token Format
- **Generation**: `crypto.randomBytes(32).toString('hex')`
- **Length**: 64 characters
- **Uniqueness**: Cryptographically secure random generation

### Token Validation Flow
```
Request → Extract JWT → Decode JWT → Get User from DB
         ↓
   Compare sessionToken in JWT with activeSessionToken in DB
         ↓
   Match? → Allow access
   No Match? → Session Conflict → Force Logout
```

### API Endpoints Affected
All protected admin routes now validate session tokens through the `verifyAdmin` middleware.

## Files Modified

### Backend
1. `backend/models/user.model.js` - Added session field
2. `backend/utils/generateTokenAndSetCookie.js` - Session token generation
3. `backend/controllers/auth.admin.controller.js` - Login/logout session handling
4. `backend/middleware/verifyAdmin.middleware.js` - Session validation
5. `backend/routes/auth.admin.route.js` - Added middleware to logout route

### Frontend
1. `admin/src/App.jsx` - Global session conflict handling

## Testing the Feature

### Test Case 1: Normal Login
1. Log in as admin → Should work normally
2. Access any protected route → Should work normally

### Test Case 2: Multiple Login Detection
1. Log in as Admin User on Browser 1
2. Log in as same Admin User on Browser 2
3. Try to access any page on Browser 1
4. Expected: Session conflict error and redirect to login

### Test Case 3: Logout
1. Log in as admin
2. Click logout
3. Try to access protected route with old cookie
4. Expected: Unauthorized error (no active session)

## Rollback Instructions

If you need to disable this feature:

1. Restore `backend/utils/generateTokenAndSetCookie.js`:
   - Remove `sessionToken` parameter
   - Remove it from JWT payload

2. Restore `backend/controllers/auth.admin.controller.js`:
   - Remove session token generation and storage in login
   - Remove session clearing in logout

3. Restore `backend/middleware/verifyAdmin.middleware.js`:
   - Remove session validation logic
   - Keep only basic JWT validation

4. Restore `admin/src/App.jsx`:
   - Remove axios interceptor for session conflicts

## Future Enhancements

1. **Multiple Sessions with Limit**: Allow 2-3 concurrent sessions per user
2. **Session Management UI**: Let users see and terminate active sessions
3. **Session Activity Logs**: Track when and where users logged in
4. **Device Fingerprinting**: Identify devices for better security
5. **Grace Period**: Allow a brief overlap when switching devices

## Notes

- This feature only applies to admin and super admin accounts
- Regular users are not affected
- Session tokens are stored in memory (JWT) and database
- Session expires with JWT (7 days) if not refreshed
