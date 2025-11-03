// middleware/rateLimiter.middleware.js
import rateLimit from 'express-rate-limit';

/**
 * Rate limiter for login attempts
 * Allows 5 login attempts per 15 minutes per IP address
 */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many login attempts from this IP. Please try again after 15 minutes.'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipSuccessfulRequests: false, // Count all requests, even successful ones
  skipFailedRequests: false, // Count failed requests
  handler: (req, res) => {
    console.log(`[RATE LIMIT] ⚠️ IP ${req.ip} exceeded login attempts limit`);
    res.status(429).json({
      success: false,
      message: 'Too many login attempts. Please try again after 15 minutes.',
      retryAfter: Math.ceil(req.rateLimit.resetTime.getTime() - Date.now()) / 1000 / 60 // minutes
    });
  }
});

/**
 * Rate limiter for password reset requests
 * Allows 3 password reset requests per hour per IP address
 */
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 requests per hour
  message: {
    success: false,
    message: 'Too many password reset requests from this IP. Please try again after 1 hour.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  handler: (req, res) => {
    console.log(`[RATE LIMIT] ⚠️ IP ${req.ip} exceeded password reset limit`);
    res.status(429).json({
      success: false,
      message: 'Too many password reset requests. Please try again after 1 hour.',
      retryAfter: Math.ceil(req.rateLimit.resetTime.getTime() - Date.now()) / 1000 / 60 // minutes
    });
  }
});

/**
 * General API rate limiter for all routes
 * Allows 100 requests per 15 minutes per IP address
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
  handler: (req, res) => {
    console.log(`[RATE LIMIT] ⚠️ IP ${req.ip} exceeded general API limit`);
    res.status(429).json({
      success: false,
      message: 'Too many requests. Please slow down and try again later.',
      retryAfter: Math.ceil(req.rateLimit.resetTime.getTime() - Date.now()) / 1000 / 60 // minutes
    });
  }
});
