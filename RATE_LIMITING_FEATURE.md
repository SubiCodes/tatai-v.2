# Rate Limiting Feature

## Overview
Implemented rate limiting to protect against brute force attacks and abuse. Different rate limits are applied to different endpoints based on their sensitivity and usage patterns.

## Rate Limits

### 1. Login Attempts (`/api/v1/authAdmin/signin`)
- **Limit**: 5 attempts per 15 minutes per IP address
- **Purpose**: Prevent brute force password attacks
- **Response**: HTTP 429 with retry-after time

### 2. Password Reset Requests (`/api/v1/authAdmin/password`)
- **Limit**: 3 requests per hour per IP address
- **Purpose**: Prevent password reset spam and abuse
- **Response**: HTTP 429 with retry-after time

### 3. General API (Optional - Not Currently Applied)
- **Limit**: 100 requests per 15 minutes per IP address
- **Purpose**: Prevent API abuse
- **Available**: Can be applied to specific routes as needed

## Implementation

### Backend

#### Rate Limiter Middleware (`middleware/rateLimiter.middleware.js`)
Three rate limiters exported:
1. `loginLimiter` - For login endpoints
2. `passwordResetLimiter` - For password reset endpoints
3. `generalLimiter` - For general API protection

#### Features:
- IP-based rate limiting
- Configurable time windows and attempt limits
- Custom error messages
- Retry-after time in response
- Console logging of rate limit violations
- Standard headers for rate limit info

#### Applied Routes (`routes/auth.admin.route.js`)
```javascript
authAdminRouter.post("/signin", loginLimiter, signInAdmin);
authAdminRouter.post("/password", passwordResetLimiter, sendResetPasswordLink);
```

### Frontend

#### Error Handling (`store/admin.store.jsx`)
- Detects 429 (Too Many Requests) status code
- Shows specialized error message with retry time
- Longer toast duration (8 seconds) for rate limit errors
- User-friendly messaging

## User Experience

### Login Rate Limit Exceeded

**What happens:**
1. User tries to log in 6+ times within 15 minutes
2. Backend returns 429 error
3. Frontend shows toast: "Too Many Attempts"
4. Message: "Too many login attempts. Please wait X minutes."
5. Toast stays visible for 8 seconds

**User sees:**
```
❌ Too Many Attempts
Too many login attempts from this IP. 
Please try again after 15 minutes. 
Please wait 14 minutes.
```

### Password Reset Rate Limit Exceeded

**What happens:**
1. User requests password reset 4+ times within 1 hour
2. Backend returns 429 error
3. Frontend shows toast: "Too Many Requests"
4. Message includes retry-after time
5. Toast stays visible for 8 seconds

**User sees:**
```
❌ Too Many Requests
Too many password reset requests from this IP. 
Please try again after 1 hour.
Please wait 53 minutes.
```

## Security Benefits

### Against Brute Force Attacks
- **5 login attempts** limits password guessing
- **15-minute lockout** makes brute force impractical
- **IP-based** - attackers need multiple IPs

### Against Password Reset Abuse
- **3 requests per hour** prevents spam
- Protects email server from overload
- Prevents user harassment via reset emails

### Against API Abuse
- General limiter available for other endpoints
- Protects server resources
- Prevents DOS attacks

## Configuration

### Adjusting Rate Limits

**Login Limit:**
```javascript
windowMs: 15 * 60 * 1000, // 15 minutes
max: 5, // 5 attempts
```

**Password Reset Limit:**
```javascript
windowMs: 60 * 60 * 1000, // 1 hour
max: 3, // 3 requests
```

### Per-User vs Per-IP

Currently uses **per-IP** limiting:
- Simpler implementation
- Works without authentication
- Protects unauthenticated endpoints

**To switch to per-user** (future enhancement):
```javascript
keyGenerator: (req) => req.user?._id || req.ip
```

## Response Format

### Rate Limit Exceeded (429)
```json
{
  "success": false,
  "message": "Too many login attempts. Please try again after 15 minutes.",
  "retryAfter": 14.5
}
```

### Headers Included
```
RateLimit-Limit: 5
RateLimit-Remaining: 0
RateLimit-Reset: 1730736600
```

## Backend Console Logs

### Rate Limit Violation
```
[RATE LIMIT] ⚠️ IP 123.45.67.89 exceeded login attempts limit
```

### Normal Operation
No logs (only violations are logged)

## Testing

### Test Case 1: Login Rate Limit
1. Attempt to log in with wrong password 5 times
2. **Expected**: 5 attempts succeed (return 400)
3. 6th attempt returns 429
4. Toast shows "Too Many Attempts" with wait time
5. Wait 15 minutes
6. Can attempt login again

### Test Case 2: Password Reset Rate Limit
1. Request password reset 3 times
2. **Expected**: All 3 succeed
3. 4th request returns 429
4. Toast shows "Too Many Requests" with wait time
5. Wait 1 hour
6. Can request reset again

### Test Case 3: Different IPs
1. Hit rate limit from IP 1
2. Try from IP 2
3. **Expected**: IP 2 is not affected
4. Both IPs have independent limits

### Test Case 4: Successful Login
1. Log in successfully
2. Logout
3. Log in again
4. **Expected**: Successful logins count towards limit
5. Need to wait if limit reached

## Edge Cases

### Shared IP (NAT/Proxy)
**Issue**: Multiple users behind same IP share limit
**Solution**: Users see rate limit errors
**Mitigation**: Generous limits (5 login attempts should be enough)

### VPN/Proxy Switching
**Issue**: User can switch IPs to bypass limit
**Mitigation**: 
- Short time windows
- Monitor for patterns
- Future: Account-based limits

### Legitimate High Usage
**Issue**: Admin logging in frequently gets blocked
**Solution**: 
- 15-minute window refreshes
- 5 attempts is reasonable for legitimate use
- Can increase limits if needed

## Future Enhancements

### 1. Per-Account Rate Limiting
```javascript
// Combine IP + account ID
keyGenerator: (req) => {
  const email = req.body.email;
  return email ? `${req.ip}-${email}` : req.ip;
}
```

### 2. Progressive Delays
```javascript
// Increase delay with each failed attempt
delayMs: (attempts) => attempts * 1000
```

### 3. Whitelist for Admins
```javascript
skip: (req) => {
  // Skip rate limit for super admins
  return req.user?.role === 'super admin';
}
```

### 4. Redis Store (For Scaling)
```javascript
import RedisStore from 'rate-limit-redis';

const limiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
  }),
  // ... other options
});
```

### 5. Account Lockout
After X failed attempts:
- Temporarily lock account
- Require CAPTCHA
- Send security alert email

## Monitoring

### What to Monitor
1. **Rate limit hits**: How often are limits reached?
2. **IP addresses**: Are same IPs repeatedly hitting limits?
3. **Time patterns**: When do rate limits trigger most?
4. **False positives**: Legitimate users blocked?

### Log Analysis
```bash
# Count rate limit violations
grep "RATE LIMIT" logs.txt | wc -l

# Top offending IPs
grep "RATE LIMIT" logs.txt | awk '{print $5}' | sort | uniq -c | sort -rn
```

## Dependencies

```json
{
  "express-rate-limit": "^7.4.1"
}
```

## Configuration Options

All rate limiters support:
- `windowMs`: Time window in milliseconds
- `max`: Maximum requests in window
- `message`: Error message object
- `standardHeaders`: Include RateLimit-* headers
- `skipSuccessfulRequests`: Don't count successful requests
- `skipFailedRequests`: Don't count failed requests
- `handler`: Custom error handler function

## Notes

- Rate limits are **per IP address** (can be changed to per-user)
- Limits are **in-memory** (reset on server restart)
- For production at scale, consider **Redis store**
- Current limits balance security and usability
- Can be adjusted based on usage patterns
- Does not affect legitimate users under normal circumstances
