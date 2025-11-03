// utils/locationHelper.js
import geoip from 'geoip-lite';
import { UAParser } from 'ua-parser-js';

/**
 * Get location information from IP address
 * @param {string} ip - IP address
 * @returns {string} Formatted location string
 */
export const getLocationFromIP = (ip) => {
  try {
    // Handle localhost/development
    if (ip === '::1' || ip === '127.0.0.1' || ip === 'localhost') {
      return 'Local Development (localhost)';
    }

    // Handle IPv4-mapped IPv6 addresses (::ffff:xxx.xxx.xxx.xxx)
    if (ip.includes('::ffff:')) {
      ip = ip.replace('::ffff:', '');
    }

    const geo = geoip.lookup(ip);
    
    if (!geo) {
      return `Unknown Location (IP: ${ip})`;
    }

    const city = geo.city || 'Unknown City';
    const region = geo.region || '';
    const country = geo.country || 'Unknown Country';
    
    // Format location string
    let location = city;
    if (region && region !== city) {
      location += `, ${region}`;
    }
    location += `, ${country}`;
    
    return location;
  } catch (error) {
    console.error('Error getting location from IP:', error);
    return `Unknown Location (IP: ${ip})`;
  }
};

/**
 * Parse user agent string to get device/browser info
 * @param {string} userAgent - User agent string from request headers
 * @returns {string} Formatted device/browser string
 */
export const parseUserAgent = (userAgent) => {
  try {
    if (!userAgent) {
      return 'Unknown Device';
    }

    const parser = new UAParser(userAgent);
    const result = parser.getResult();
    
    const browser = result.browser.name || 'Unknown Browser';
    const browserVersion = result.browser.version ? ` ${result.browser.version.split('.')[0]}` : '';
    const os = result.os.name || 'Unknown OS';
    const osVersion = result.os.version ? ` ${result.os.version}` : '';
    const device = result.device.type ? ` (${result.device.type})` : '';
    
    return `${browser}${browserVersion} on ${os}${osVersion}${device}`;
  } catch (error) {
    console.error('Error parsing user agent:', error);
    return 'Unknown Device';
  }
};

/**
 * Get client IP address from request (handles proxies)
 * @param {object} req - Express request object
 * @returns {string} IP address
 */
export const getClientIP = (req) => {
  // Try different headers in order of preference
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwarded.split(',')[0].trim();
  }
  
  return (
    req.headers['x-real-ip'] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.connection?.socket?.remoteAddress ||
    'Unknown'
  );
};
