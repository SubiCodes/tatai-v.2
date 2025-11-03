# Login Notification Feature

## Overview
Every time an admin or super admin logs in, they receive an email notification with details about the login, including location, IP address, device information, and timestamp. This enhances security by alerting users to any unauthorized access attempts.

## Features

### Email Contains:
1. **Login Time** - Full date and time in UTC
2. **Location** - City, Region, Country (derived from IP address)
3. **IP Address** - The actual IP address used for login
4. **Device/Browser Info** - Browser name, version, OS, and device type

### Security Alert
- Clear subject line: "🔐 New Login to Your TatAi Admin Account"
- Prominent warning if the login wasn't authorized
- Link to admin portal for quick access
- Professional security alert styling

## Implementation

### Backend Components

#### 1. Location Helper Utility (`utils/locationHelper.js`)
Three main functions:

**`getLocationFromIP(ip)`**
- Uses `geoip-lite` for offline IP geolocation
- Handles localhost/development environments
- Handles IPv4-mapped IPv6 addresses
- Returns formatted location string (e.g., "New York, NY, US")

**`parseUserAgent(userAgent)`**
- Uses `ua-parser-js` to parse user agent strings
- Extracts browser name, version, OS, device type
- Returns human-readable string (e.g., "Chrome 119 on Windows 10")

**`getClientIP(req)`**
- Handles various proxy headers (x-forwarded-for, x-real-ip)
- Returns the actual client IP address
- Supports multiple proxy scenarios

#### 2. Email Template (`nodemailer/email.js`)
**`sendLoginNotification(to, userName, loginTime, location, ipAddress, userAgent)`**
- Professional HTML email template
- TatAi branded styling
- Clear security alert design
- Table format for login details
- Warning section for unauthorized access
- Link to admin portal

#### 3. Login Controller Integration (`controllers/auth.admin.controller.js`)
On successful login:
1. Extract IP address from request
2. Get location from IP
3. Parse user agent for device info
4. Format timestamp
5. Send email notification (non-blocking)
6. Log login details to console

### Dependencies
```json
{
  "geoip-lite": "^1.4.10",
  "ua-parser-js": "^1.0.39"
}
```

## Email Template Preview

```
🔐 TatAi Security Alert

New Login Detected

Hello John Doe,

We detected a new login to your TatAi admin account. If this was you, 
you can safely ignore this email.

Login Details:
├─ Time: Monday, November 4, 2025 at 10:30:45 AM UTC
├─ Location: Manila, NCR, PH
├─ IP Address: 123.45.67.89
└─ Device: Chrome 119 on Windows 11

⚠️ Wasn't you?
If you didn't log in, please reset your password immediately and contact support.

[Go to TatAi Admin]
```

## Backend Console Logs

### Successful Login with Email:
```
[LOGIN] User: admin@example.com, Active Session Token: undefined, Force Login: false
[LOGIN] ✅ Allowing login - generating new session token
[LOGIN] ✅ User admin@example.com logged in from Manila, NCR, PH (123.45.67.89)
📧 Initializing Gmail client...
✅ Gmail client initialized successfully
📧 Login notification sent to admin@example.com
✅ Email sent successfully to admin@example.com - MessageId: 18c5d1234567890
```

### Email Send Failure (Non-blocking):
```
[LOGIN] ✅ User admin@example.com logged in from Manila, NCR, PH (123.45.67.89)
❌ Failed to send login notification to admin@example.com: Network error
```

## Testing

### Test Case 1: Local Development Login
1. Log in from localhost
2. Check email
3. **Expected**: Location shows "Local Development (localhost)"

### Test Case 2: Production Login
1. Log in from production URL
2. Check email
3. **Expected**: 
   - Real location (city, region, country)
   - Real IP address
   - Correct browser/OS info

### Test Case 3: Different Browsers
1. Log in using Chrome
2. Check email - should show "Chrome on Windows 11"
3. Log in using Firefox
4. Check email - should show "Firefox on Windows 11"

### Test Case 4: Mobile Device
1. Log in from mobile device
2. Check email
3. **Expected**: Shows device type (e.g., "Chrome on Android (mobile)")

### Test Case 5: Behind Proxy/VPN
1. Log in using VPN
2. Check email
3. **Expected**: Shows VPN exit location, not actual location

### Test Case 6: Email Send Failure
1. Disable internet/Gmail API temporarily
2. Try to log in
3. **Expected**:
   - Login still succeeds
   - Error logged in backend console
   - User can access dashboard normally

## Security Considerations

### Privacy
- IP addresses are logged for security purposes
- Location data is approximate (city/region level)
- No personal browsing data is collected
- Email is sent only to account owner

### Non-Blocking
- Email sending doesn't block login process
- If email fails, login still succeeds
- User experience is not affected by email issues

### Accuracy
- Location based on IP (may show ISP location)
- VPN/Proxy users see VPN location
- Localhost shows as "Local Development"
- Unknown IPs show as "Unknown Location"

## User Experience

### Normal Login Flow:
1. User enters credentials
2. Clicks "Sign in"
3. Sees success message
4. Redirected to dashboard
5. Receives email within seconds

### Email Receipt:
- Subject clearly indicates security alert
- Easy to identify if login was unauthorized
- Provides all relevant details
- One-click access to admin portal

### If Suspicious:
1. User sees unauthorized login notification
2. Email provides clear warning
3. User clicks reset password link
4. All sessions terminated immediately
5. Unauthorized access blocked

## Configuration

### Environment Variables Required:
```env
REACT_URI=https://your-admin-url.com/
GMAIL_TOKEN={"client_id":"...","client_secret":"...","refresh_token":"..."}
```

### Customization Options:

**Email Template**:
- Modify `sendLoginNotification()` in `email.js`
- Change colors, layout, wording

**Location Details**:
- Adjust `getLocationFromIP()` for more/less detail
- Change location format string

**Time Format**:
- Modify `loginTime` formatting in controller
- Change timezone from UTC to local

## Future Enhancements

1. **Login History Dashboard**
   - Show list of recent logins
   - Map visualization of login locations
   - Option to revoke sessions

2. **Suspicious Login Detection**
   - Flag logins from new locations
   - Alert on unusual times/patterns
   - Require additional verification

3. **Email Preferences**
   - Allow users to opt-in/opt-out
   - Choose notification frequency
   - Select notification types

4. **Multi-factor Authentication**
   - Require 2FA for suspicious logins
   - Send OTP to email/phone
   - Approve login from another device

5. **Device Management**
   - Remember trusted devices
   - Name devices for easy identification
   - Remote logout from specific devices

## Troubleshooting

### Email Not Received
1. Check spam/junk folder
2. Verify GMAIL_TOKEN is configured
3. Check backend console for errors
4. Verify email address in user profile

### Wrong Location
- VPN/Proxy will show VPN location
- Corporate networks may show ISP location
- Mobile data may show carrier location
- This is normal behavior for IP geolocation

### Localhost Shows as Unknown
- Update to latest code
- Should show "Local Development (localhost)"
- Check `getLocationFromIP()` function

### Email Delays
- Gmail API has rate limits
- Large email queues may cause delays
- Network issues can affect delivery
- Typical delivery: 1-10 seconds

## Notes

- Feature applies to admin and super admin only
- Emails sent asynchronously (non-blocking)
- Failed emails are logged but don't affect login
- Location data is approximate, not exact
- User agent parsing handles most modern browsers
- Works with IPv4 and IPv6 addresses
