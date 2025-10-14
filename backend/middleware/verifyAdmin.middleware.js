// middleware/verifyAdmin.middleware.js
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  path: '/',
};

export const verifyAdmin = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token ||
      (req.header('Authorization') || '').replace('Bearer ', '');

    if (!token) {
      console.log('[AUTH LOG] ❌ No token provided');
      return handleUnauthorized(req, res, 'No token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      console.log('[AUTH LOG] ❌ User not found');
      return handleUnauthorized(req, res, 'User not found');
    }

    const allowedRoles = ['admin', 'super admin'];
    if (!allowedRoles.includes(user.role)) {
      console.log(`[AUTH LOG] ⚠️ Access denied for ${user.role}`);
      return handleUnauthorized(req, res, 'Admins only');
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('[AUTH ERROR]', error.message);
    return handleUnauthorized(req, res, 'Invalid or expired token');
  }
};

// Helper to logout + redirect
function handleUnauthorized(req, res, message) {
  // Clear cookie properly
  res.clearCookie('token', cookieOptions);
  res.cookie('token', '', { ...cookieOptions, expires: new Date(0) });

  // Force logout log
  console.log(`[AUTH LOGOUT] 🔒 Logging out user due to: ${message}`);

  // Detect if it's a normal browser navigation or an API call
  const acceptsHTML = req.accepts(['html', 'json']) === 'html';

  if (acceptsHTML) {
    // For normal page navigation → redirect directly
    return res.redirect('/');
  }

  // For API calls → send JSON with redirect instruction
  return res.status(401).json({
    success: false,
    message,
    redirect: '/',
  });
}
