import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export const generateTokenAndSetCookie = (res, userId, sessionToken) => {
    const token = jwt.sign({ userId, sessionToken }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
    
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // true in production
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' for cross-origin
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days (note: maxAge, not maximumAge)
    });

    return token;
};

export const generateSessionToken = () => {
    return crypto.randomBytes(32).toString('hex');
};