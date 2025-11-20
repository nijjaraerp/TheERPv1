/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * NIJJARA ERP - Utils.js
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * Purpose:
 *   - Shared utility functions for the backend
 *   - Date/Time utilities
 *   - String manipulation
 *   - Validation helpers
 *   - Data transformation utilities
 * 
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

// ╔════════════════════════════════════════════════════════════════╗
// ║                    DATE & TIME UTILITIES                       ║
// ╚════════════════════════════════════════════════════════════════╝

/**
 * Get current datetime in ISO format
 */
function getCurrentDateTime() {
  return new Date().toISOString();
}

/**
 * Format date to Arabic-friendly format
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
function formatDateArabic(date) {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  };
  
  return date.toLocaleDateString('ar-SA', options);
}

/**
 * Calculate days between two dates
 */
function daysBetween(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  return Math.floor(Math.abs((d2 - d1) / millisecondsPerDay));
}

/**
 * Add days to a date
 */
function addDaysToDate(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result.toISOString().split('T')[0];
}

/**
 * Get fiscal year for a date
 */
function getFiscalYear(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  
  // Assuming fiscal year starts in January
  return year;
}

/**
 * Get month name in Arabic
 */
function getMonthNameArabic(monthNumber) {
  const months = [
    "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
  ];
  return months[monthNumber - 1] || "";
}

/**
 * Get day name in Arabic
 */
function getDayNameArabic(dayNumber) {
  const days = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
  return days[dayNumber] || "";
}

// ╔════════════════════════════════════════════════════════════════╗
// ║                   STRING UTILITIES                             ║
// ╚════════════════════════════════════════════════════════════════╝

/**
 * Capitalize first letter
 */
function capitalizeFirstLetter(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert camelCase to Title Case
 */
function camelCaseToTitle(str) {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, function(s) { return s.toUpperCase(); })
    .trim();
}

/**
 * Slugify string (convert to URL-friendly format)
 */
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Truncate string to max length
 */
function truncateString(str, maxLength, suffix = "...") {
  if (!str) return "";
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Remove extra whitespace
 */
function cleanWhitespace(str) {
  return str.trim().replace(/\s+/g, ' ');
}

/**
 * Check if string is empty or null
 */
function isEmpty(value) {
  return value === null || value === undefined || value === '';
}

/**
 * Extract Arabic text only
 */
function isArabic(str) {
  const arabicRegex = /[\u0600-\u06FF]/;
  return arabicRegex.test(str);
}

// ╔════════════════════════════════════════════════════════════════╗
// ║                   VALIDATION UTILITIES                         ║
// ╚════════════════════════════════════════════════════════════════╝

/**
 * Validate email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (basic)
 */
function isValidPhone(phone) {
  const phoneRegex = /^[0-9]{7,15}$/;
  return phoneRegex.test(phone.replace(/[-\s]/g, ''));
}

/**
 * Validate Egyptian national ID
 */
function isValidEgyptianID(nid) {
  // Basic validation - should be 14 digits
  return /^[0-9]{14}$/.test(nid);
}

/**
 * Validate date format (YYYY-MM-DD)
 */
function isValidDate(dateStr) {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateStr)) return false;
  
  const date = new Date(dateStr);
  return date instanceof Date && !isNaN(date);
}

/**
 * Validate required field
 */
function isRequired(value) {
  return value !== null && value !== undefined && value !== '';
}

/**
 * Validate number is positive
 */
function isPositiveNumber(value) {
  const num = parseFloat(value);
  return !isNaN(num) && num > 0;
}

/**
 * Validate number range
 */
function isInRange(value, min, max) {
  const num = parseFloat(value);
  return !isNaN(num) && num >= min && num <= max;
}

// ╔════════════════════════════════════════════════════════════════╗
// ║                   ARRAY UTILITIES                              ║
// ╚════════════════════════════════════════════════════════════════╝

/**
 * Group array by property
 */
function groupBy(array, property) {
  return array.reduce((groups, item) => {
    const key = item[property];
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {});
}

/**
 * Sort array of objects by property
 */
function sortByProperty(array, property, ascending = true) {
  return array.sort((a, b) => {
    const valueA = a[property];
    const valueB = b[property];
    
    if (valueA < valueB) {
      return ascending ? -1 : 1;
    }
    if (valueA > valueB) {
      return ascending ? 1 : -1;
    }
    return 0;
  });
}

/**
 * Filter unique values from array
 */
function getUniqueValues(array, property) {
  const seen = new Set();
  return array.filter(item => {
    const value = item[property];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
}

/**
 * Find item in array by property
 */
function findByProperty(array, property, value) {
  return array.find(item => item[property] === value);
}

/**
 * Filter array by multiple properties
 */
function filterByProperties(array, filterObj) {
  return array.filter(item => {
    for (const [key, value] of Object.entries(filterObj)) {
      if (item[key] !== value) {
        return false;
      }
    }
    return true;
  });
}

/**
 * Sum array values by property
 */
function sumByProperty(array, property) {
  return array.reduce((sum, item) => {
    const value = parseFloat(item[property]) || 0;
    return sum + value;
  }, 0);
}

/**
 * Average array values by property
 */
function averageByProperty(array, property) {
  if (array.length === 0) return 0;
  return sumByProperty(array, property) / array.length;
}

// ╔════════════════════════════════════════════════════════════════╗
// ║                   OBJECT UTILITIES                             ║
// ╚════════════════════════════════════════════════════════════════╝

/**
 * Deep clone object
 */
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Merge objects
 */
function mergeObjects(target, source) {
  const result = { ...target };
  for (const [key, value] of Object.entries(source)) {
    if (value !== undefined) {
      result[key] = value;
    }
  }
  return result;
}

/**
 * Pick specific properties from object
 */
function pickProperties(obj, properties) {
  const result = {};
  properties.forEach(prop => {
    if (obj.hasOwnProperty(prop)) {
      result[prop] = obj[prop];
    }
  });
  return result;
}

/**
 * Omit specific properties from object
 */
function omitProperties(obj, properties) {
  const result = { ...obj };
  properties.forEach(prop => {
    delete result[prop];
  });
  return result;
}

/**
 * Convert object to query string
 */
function objectToQueryString(obj) {
  return Object.keys(obj)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join('&');
}

/**
 * Convert query string to object
 */
function queryStringToObject(queryString) {
  const result = {};
  const pairs = queryString.split('&');
  pairs.forEach(pair => {
    const [key, value] = pair.split('=');
    result[decodeURIComponent(key)] = decodeURIComponent(value || '');
  });
  return result;
}

// ╔════════════════════════════════════════════════════════════════╗
// ║                   CALCULATION UTILITIES                        ║
// ╚════════════════════════════════════════════════════════════════╝

/**
 * Calculate percentage
 */
function calculatePercentage(value, total) {
  if (total === 0) return 0;
  return (value / total) * 100;
}

/**
 * Calculate discount price
 */
function calculateDiscount(originalPrice, discountPercent) {
  const discountAmount = (originalPrice * discountPercent) / 100;
  return originalPrice - discountAmount;
}

/**
 * Calculate compound interest
 */
function calculateCompoundInterest(principal, rate, time, compounds = 12) {
  return principal * Math.pow(1 + (rate / 100 / compounds), compounds * time);
}

/**
 * Round to decimal places
 */
function roundToDecimals(value, decimals = 2) {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

/**
 * Convert salary to hourly rate
 */
function salaryToHourlyRate(monthlySalary, workDaysPerMonth = 22, hoursPerDay = 8) {
  const hoursPerMonth = workDaysPerMonth * hoursPerDay;
  return roundToDecimals(monthlySalary / hoursPerMonth, 2);
}

/**
 * Calculate overtime payment
 */
function calculateOvertimePayment(hourlyRate, overtimeHours, multiplier = 1.5) {
  return roundToDecimals(hourlyRate * overtimeHours * multiplier, 2);
}

// ╔════════════════════════════════════════════════════════════════╗
// ║                   LOGGING & DEBUG UTILITIES                    ║
// ╚════════════════════════════════════════════════════════════════╝

/**
 * Log with timestamp
 */
function logWithTimestamp(message) {
  const timestamp = getCurrentDateTime();
  Logger.log(`[${timestamp}] ${message}`);
}

/**
 * Log object for debugging
 */
function logObject(obj, label = "Object") {
  Logger.log(`========== ${label} ==========`);
  Logger.log(JSON.stringify(obj, null, 2));
  Logger.log("========== END ==========");
}

/**
 * Create debug report
 */
function createDebugReport() {
  const report = {
    timestamp: getCurrentDateTime(),
    scriptId: ScriptApp.getScriptId(),
    spreadsheetId: SpreadsheetApp.getActiveSpreadsheet().getId(),
    user: Session.getActiveUser().getEmail(),
    quotaUsage: {
      remainingApiQuota: SpreadsheetApp.getUi().getRemainingDialogTimeout(),
      // Add more quota metrics as needed
    }
  };
  
  return report;
}

// ╔════════════════════════════════════════════════════════════════╗
// ║                   SECURITY UTILITIES                           ║
// ╚════════════════════════════════════════════════════════════════╝

/**
 * Sanitize input string (basic XSS prevention)
 */
function sanitizeInput(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

/**
 * Generate random string
 */
function generateRandomString(length = 16) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate random color
 */
function generateRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// ╔════════════════════════════════════════════════════════════════╗
// ║                   EXPORT FOR TESTING                           ║
// ╚════════════════════════════════════════════════════════════════╝

/**
 * Test utility functions
 */
function testUtils() {
  Logger.log("🧪 Testing Utility Functions...");
  
  // Test date functions
  Logger.log("📅 Date: " + getCurrentDateTime());
  Logger.log("📅 Days between: " + daysBetween("2024-01-01", "2024-12-31"));
  
  // Test validation
  Logger.log("✅ Email valid: " + isValidEmail("test@example.com"));
  Logger.log("✅ Phone valid: " + isValidPhone("01002003004"));
  
  // Test calculations
  Logger.log("💰 Percentage: " + calculatePercentage(50, 100) + "%");
  Logger.log("💰 Discount: " + calculateDiscount(1000, 10));
  
  Logger.log("🧪 Tests completed!");
}

