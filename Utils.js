/**
 * Utils.js
 * ========
 * Utility functions for the ERP system
 */

// ============================================================
// DATE & TIME UTILITIES
// ============================================================

/**
 * Format date to Arabic locale
 */
function formatDateArabic(date) {
  if (!date) return '';
  
  const d = new Date(date);
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    locale: 'ar-EG'
  };
  
  return d.toLocaleDateString('ar-EG', options);
}

/**
 * Format date to YYYY-MM-DD
 */
function formatDateISO(date) {
  if (!date) return '';
  
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

/**
 * Get current date/time
 */
function getCurrentDateTime() {
  return new Date();
}

/**
 * Calculate difference in days
 */
function daysDifference(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Check if date is weekend (Friday or Saturday)
 */
function isWeekend(date) {
  const d = new Date(date);
  const day = d.getDay();
  return day === 5 || day === 6; // Friday = 5, Saturday = 6
}

/**
 * Check if date is a public holiday
 */
function isPublicHoliday(date) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const holidaysSheet = ss.getSheetByName('SYS_PubHolidays');
  
  if (!holidaysSheet) return false;
  
  const data = holidaysSheet.getDataRange().getValues();
  const dateStr = formatDateISO(date);
  
  for (let i = 2; i < data.length; i++) {
    const holidayDate = formatDateISO(data[i][1]);
    if (holidayDate === dateStr) {
      return true;
    }
  }
  
  return false;
}

// ============================================================
// STRING UTILITIES
// ============================================================

/**
 * Generate unique ID with prefix
 */
function generateId(prefix = 'ID') {
  const uuid = Utilities.getUuid().substring(0, 8).toUpperCase();
  return `${prefix}_${uuid}`;
}

/**
 * Generate sequential ID
 */
function getNextSequentialId(sheetName, prefix, startNumber = 1) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) return `${prefix}${String(startNumber).padStart(3, '0')}`;
  
  const data = sheet.getDataRange().getValues();
  if (data.length <= 2) {
    return `${prefix}${String(startNumber).padStart(3, '0')}`;
  }
  
  // Get last ID
  const lastRow = data[data.length - 1];
  const lastId = lastRow[0];
  
  if (!lastId || typeof lastId !== 'string') {
    return `${prefix}${String(startNumber).padStart(3, '0')}`;
  }
  
  // Extract number from last ID
  const match = lastId.match(/\d+$/);
  if (match) {
    const nextNum = parseInt(match[0]) + 1;
    return `${prefix}${String(nextNum).padStart(3, '0')}`;
  }
  
  return `${prefix}${String(startNumber).padStart(3, '0')}`;
}

/**
 * Sanitize string input
 */
function sanitizeString(str) {
  if (!str) return '';
  return String(str).trim().replace(/[<>]/g, '');
}

/**
 * Truncate string
 */
function truncateString(str, maxLength = 50) {
  if (!str || str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
}

// ============================================================
// NUMBER UTILITIES
// ============================================================

/**
 * Format number with Arabic thousands separator
 */
function formatNumberArabic(num) {
  if (num === null || num === undefined) return '0';
  return Number(num).toLocaleString('ar-EG');
}

/**
 * Format currency (Egyptian Pound)
 */
function formatCurrency(amount) {
  if (amount === null || amount === undefined) return 'ج.م 0';
  return `ج.م ${formatNumberArabic(amount)}`;
}

/**
 * Calculate VAT amount
 */
function calculateVAT(amount, vatRate = 14) {
  return (amount * vatRate) / 100;
}

/**
 * Calculate total with VAT
 */
function calculateTotalWithVAT(amount, vatRate = 14) {
  return amount + calculateVAT(amount, vatRate);
}

/**
 * Round to 2 decimal places
 */
function roundDecimal(num, decimals = 2) {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

// ============================================================
// VALIDATION UTILITIES
// ============================================================

/**
 * Validate email format
 */
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Validate Egyptian mobile number
 */
function isValidEgyptianMobile(mobile) {
  // Egyptian mobile: 11 digits starting with 01
  const regex = /^01[0-2,5]{1}[0-9]{8}$/;
  return regex.test(mobile);
}

/**
 * Validate Egyptian National ID
 */
function isValidNationalId(nationalId) {
  // Egyptian National ID: 14 digits
  const regex = /^\d{14}$/;
  return regex.test(nationalId);
}

/**
 * Check if value is empty
 */
function isEmpty(value) {
  return value === null || value === undefined || value === '';
}

/**
 * Validate required fields
 */
function validateRequired(data, requiredFields) {
  const errors = [];
  
  requiredFields.forEach(field => {
    if (isEmpty(data[field])) {
      errors.push(`${field} is required`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

// ============================================================
// ARRAY & OBJECT UTILITIES
// ============================================================

/**
 * Convert array of arrays to array of objects
 */
function arrayToObjects(data, headers) {
  if (!data || data.length === 0) return [];
  
  return data.map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });
}

/**
 * Convert array of objects to array of arrays
 */
function objectsToArray(objects, headers) {
  if (!objects || objects.length === 0) return [];
  
  return objects.map(obj => {
    return headers.map(header => obj[header] || '');
  });
}

/**
 * Group array by key
 */
function groupBy(array, key) {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
}

/**
 * Sort array by key
 */
function sortBy(array, key, ascending = true) {
  return array.sort((a, b) => {
    if (a[key] < b[key]) return ascending ? -1 : 1;
    if (a[key] > b[key]) return ascending ? 1 : -1;
    return 0;
  });
}

/**
 * Filter array by condition
 */
function filterBy(array, condition) {
  return array.filter(condition);
}

// ============================================================
// SHEET UTILITIES
// ============================================================

/**
 * Get sheet data as objects
 */
function getSheetDataAsObjects(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) return [];
  
  const data = sheet.getDataRange().getValues();
  if (data.length < 3) return [];
  
  const headers = data[0];
  const rows = data.slice(2); // Skip both header rows
  
  return arrayToObjects(rows, headers);
}

/**
 * Find row by ID
 */
function findRowById(sheetName, id) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) return null;
  
  const data = sheet.getDataRange().getValues();
  
  for (let i = 2; i < data.length; i++) {
    if (data[i][0] === id) {
      return {
        rowIndex: i + 1,
        data: data[i]
      };
    }
  }
  
  return null;
}

/**
 * Get column values
 */
function getColumnValues(sheetName, columnIndex) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) return [];
  
  const data = sheet.getDataRange().getValues();
  return data.slice(2).map(row => row[columnIndex]);
}

/**
 * Clear sheet preserving headers
 */
function clearSheetPreserveHeaders(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) return false;
  
  const lastRow = sheet.getLastRow();
  if (lastRow > 2) {
    sheet.deleteRows(3, lastRow - 2);
  }
  
  return true;
}

// ============================================================
// PERMISSION UTILITIES
// ============================================================

/**
 * Check if user has permission
 */
function hasPermission(userId, permissionId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const usersSheet = ss.getSheetByName('SYS_Users');
  const rolePermsSheet = ss.getSheetByName('SYS_Role_Permissions');
  
  if (!usersSheet || !rolePermsSheet) return false;
  
  // Get user's role
  const userData = usersSheet.getDataRange().getValues();
  const userHeaders = userData[0];
  const userIdCol = userHeaders.indexOf('USR_ID');
  const roleIdCol = userHeaders.indexOf('ROL_ID');
  
  let userRole = null;
  for (let i = 2; i < userData.length; i++) {
    if (userData[i][userIdCol] === userId) {
      userRole = userData[i][roleIdCol];
      break;
    }
  }
  
  if (!userRole) return false;
  
  // Check if role has permission
  const rolePermData = rolePermsSheet.getDataRange().getValues();
  const rpHeaders = rolePermData[0];
  const roleCol = rpHeaders.indexOf('ROL_ID');
  const permCol = rpHeaders.indexOf('PRM_ID');
  const allowedCol = rpHeaders.indexOf('SRP_Is_Allowed');
  
  for (let i = 2; i < rolePermData.length; i++) {
    if (rolePermData[i][roleCol] === userRole && 
        rolePermData[i][permCol] === permissionId &&
        rolePermData[i][allowedCol] === true) {
      return true;
    }
  }
  
  return false;
}

/**
 * Get all user permissions
 */
function getAllUserPermissions(userId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const usersSheet = ss.getSheetByName('SYS_Users');
  const rolePermsSheet = ss.getSheetByName('SYS_Role_Permissions');
  
  if (!usersSheet || !rolePermsSheet) return [];
  
  // Get user's role
  const userData = usersSheet.getDataRange().getValues();
  const userHeaders = userData[0];
  const userIdCol = userHeaders.indexOf('USR_ID');
  const roleIdCol = userHeaders.indexOf('ROL_ID');
  
  let userRole = null;
  for (let i = 2; i < userData.length; i++) {
    if (userData[i][userIdCol] === userId) {
      userRole = userData[i][roleIdCol];
      break;
    }
  }
  
  if (!userRole) return [];
  
  // Get all permissions for role
  const rolePermData = rolePermsSheet.getDataRange().getValues();
  const rpHeaders = rolePermData[0];
  const roleCol = rpHeaders.indexOf('ROL_ID');
  const permCol = rpHeaders.indexOf('PRM_ID');
  const allowedCol = rpHeaders.indexOf('SRP_Is_Allowed');
  
  const permissions = [];
  for (let i = 2; i < rolePermData.length; i++) {
    if (rolePermData[i][roleCol] === userRole && rolePermData[i][allowedCol] === true) {
      permissions.push(rolePermData[i][permCol]);
    }
  }
  
  return permissions;
}

// ============================================================
// EXPORT UTILITIES
// ============================================================

/**
 * Export sheet to CSV
 */
function exportToCSV(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    return { success: false, message: 'Sheet not found' };
  }
  
  const data = sheet.getDataRange().getValues();
  const csv = data.map(row => row.join(',')).join('\n');
  
  const blob = Utilities.newBlob(csv, 'text/csv', `${sheetName}.csv`);
  const file = DriveApp.createFile(blob);
  
  return {
    success: true,
    fileId: file.getId(),
    fileName: file.getName(),
    url: file.getUrl()
  };
}

// ============================================================
// NOTIFICATION UTILITIES
// ============================================================

/**
 * Send email notification
 */
function sendEmailNotification(to, subject, body) {
  try {
    MailApp.sendEmail({
      to: to,
      subject: subject,
      htmlBody: body
    });
    return { success: true };
  } catch (error) {
    Logger.log(`Email error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Format HTML email template
 */
function formatEmailTemplate(title, content) {
  return `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; direction: rtl; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #667eea; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f5f5f5; }
        .footer { text-align: center; padding: 10px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>${title}</h2>
        </div>
        <div class="content">
          ${content}
        </div>
        <div class="footer">
          <p>© 2024 Nijjara ERP - جميع الحقوق محفوظة</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

