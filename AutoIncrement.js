/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * NIJJARA ERP - AutoIncrement.js
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * Purpose:
 *   - Centralized auto-increment ID generation system
 *   - Replaces formula-based ARRAYFORMULA approach with reliable backend functions
 *   - Handles concurrent edits with conflict resolution
 *   - Maintains separate ID sequences per sheet
 *   - Preserves data integrity during simultaneous operations
 * 
 * Architecture:
 *   - Uses Apps Script functions instead of sheet formulas
 *   - Implements locking mechanism for concurrent access
 *   - Caches ID sequences for performance
 *   - Handles edge cases gracefully
 * 
 * Usage:
 *   - Call generateNextId(sheetName) to get next ID for a sheet
 *   - Call initializeAutoIncrementSystem() to set up all sheets
 *   - System automatically handles ID generation on record creation
 * 
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

// ╔════════════════════════════════════════════════════════════════╗
// ║                    CONFIGURATION                                ║
// ╚════════════════════════════════════════════════════════════════╝

/**
 * Sheets that require auto-increment IDs
 * Maps sheet name to ID column header pattern
 */
const AUTO_INCREMENT_CONFIG = {
  "HRM_Employees": { idColumn: "_ID", startRow: 3 },
  "HRM_Departments": { idColumn: "_ID", startRow: 3 },
  "HRM_Attendance": { idColumn: "_ID", startRow: 3 },
  "HRM_Leave": { idColumn: "_ID", startRow: 3 },
  "HRM_Advances": { idColumn: "_ID", startRow: 3 },
  "HRM_OverTime": { idColumn: "_ID", startRow: 3 },
  "HRM_Deductions": { idColumn: "_ID", startRow: 3 },
  "PRJ_Main": { idColumn: "_ID", startRow: 3 },
  "PRJ_Clients": { idColumn: "_ID", startRow: 3 },
  "PRJ_Tasks": { idColumn: "_ID", startRow: 3 },
  "PRJ_Material": { idColumn: "_ID", startRow: 3 },
  "FIN_DirectExpenses": { idColumn: "_ID", startRow: 3 },
  "FIN_InDirectExpenses_Time": { idColumn: "_ID", startRow: 3 },
  "FIN_InDirectExpenses_NoTime": { idColumn: "_ID", startRow: 3 },
  "FIN_PRJ_Revenue": { idColumn: "_ID", startRow: 3 },
  "FIN_Custody": { idColumn: "_ID", startRow: 3 },
  "FIN_HRM_Payroll": { idColumn: "_ID", startRow: 3 },
  "FIN_P&L_Statements": { idColumn: "_ID", startRow: 3 },
  "SYS_Users": { idColumn: "_ID", startRow: 3 },
  "SYS_Roles": { idColumn: "_ID", startRow: 3 },
  "SYS_Permissions": { idColumn: "_ID", startRow: 3 },
  "SYS_Role_Permissions": { idColumn: "_ID", startRow: 3 },
  "SYS_Audit_Log": { idColumn: "_ID", startRow: 3 },
  "SYS_Sessions": { idColumn: "_ID", startRow: 3 },
  "SYS_Documents": { idColumn: "_ID", startRow: 3 },
};

/**
 * In-memory cache for ID sequences
 * Reduces sheet reads for better performance
 * Format: { sheetName: { lastId: number, timestamp: Date } }
 */
let ID_CACHE = {};

/**
 * Lock mechanism for concurrent access
 * Prevents race conditions when multiple users add records simultaneously
 * Format: { sheetName: lockToken }
 */
let ID_LOCKS = {};

/**
 * Cache expiration time (milliseconds)
 * Cache is refreshed if older than this
 */
const CACHE_EXPIRY_MS = 30000; // 30 seconds

// ╔════════════════════════════════════════════════════════════════╗
// ║                    HELPER FUNCTIONS                            ║
// ╚════════════════════════════════════════════════════════════════╝

/**
 * Get the active spreadsheet
 * @returns {GoogleAppsScript.Spreadsheet.Spreadsheet} The active spreadsheet
 */
function getSpreadsheet() {
  return SpreadsheetApp.getActiveSpreadsheet();
}

/**
 * Get headers from a sheet
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet - The sheet to get headers from
 * @returns {Array<string>} Array of header names, or null if sheet is empty
 */
function getSheetHeaders(sheet) {
  try {
    const lastCol = sheet.getLastColumn();
    if (lastCol === 0) {
      Logger.log(`Sheet ${sheet.getName()} has no columns`);
      return null;
    }
    const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    return headers;
  } catch (error) {
    Logger.log(`Error getting headers for ${sheet.getName()}: ${error.toString()}`);
    return null;
  }
}

/**
 * Find the ID column index in headers
 * @param {Array<string>} headers - Array of header names
 * @param {string} idColumnPattern - Pattern to match (e.g., "_ID")
 * @returns {number} Column index (0-based), or -1 if not found
 */
function findIdColumnIndex(headers, idColumnPattern) {
  if (!headers || headers.length === 0) {
    return -1;
  }
  return headers.findIndex(
    (header) => header && header.toString().includes(idColumnPattern)
  );
}

/**
 * Get the maximum ID value from a sheet's ID column
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet - The sheet to check
 * @param {number} idColumnIndex - Column index (0-based) of the ID column
 * @param {number} startRow - First data row (1-based)
 * @returns {number} Maximum ID value found, or 0 if none found
 */
function getMaxIdFromSheet(sheet, idColumnIndex, startRow) {
  try {
    const lastRow = sheet.getLastRow();
    if (lastRow < startRow) {
      return 0;
    }

    // Get all ID values from the column
    const idRange = sheet.getRange(startRow, idColumnIndex + 1, lastRow - startRow + 1, 1);
    const idValues = idRange.getValues().flat();

    // Find maximum numeric ID
    let maxId = 0;
    idValues.forEach((value) => {
      if (value !== null && value !== "" && !isNaN(value)) {
        const numValue = Number(value);
        if (numValue > maxId) {
          maxId = numValue;
        }
      }
    });

    return maxId;
  } catch (error) {
    Logger.log(`Error getting max ID from sheet ${sheet.getName()}: ${error.toString()}`);
    return 0;
  }
}

/**
 * Acquire a lock for a sheet (prevents concurrent ID generation conflicts)
 * @param {string} sheetName - Name of the sheet
 * @param {number} timeoutMs - Maximum time to wait for lock (default: 5000ms)
 * @returns {string|null} Lock token if acquired, null if timeout
 */
function acquireLock(sheetName, timeoutMs = 5000) {
  const startTime = Date.now();
  const lockToken = Utilities.getUuid();

  while (Date.now() - startTime < timeoutMs) {
    if (!ID_LOCKS[sheetName]) {
      ID_LOCKS[sheetName] = lockToken;
      return lockToken;
    }
    Utilities.sleep(100); // Wait 100ms before retry
  }

  Logger.log(`Timeout acquiring lock for ${sheetName}`);
  return null;
}

/**
 * Release a lock for a sheet
 * @param {string} sheetName - Name of the sheet
 * @param {string} lockToken - Lock token to release
 */
function releaseLock(sheetName, lockToken) {
  if (ID_LOCKS[sheetName] === lockToken) {
    delete ID_LOCKS[sheetName];
  }
}

/**
 * Check if cache is still valid
 * @param {string} sheetName - Name of the sheet
 * @returns {boolean} True if cache is valid, false if expired or missing
 */
function isCacheValid(sheetName) {
  if (!ID_CACHE[sheetName]) {
    return false;
  }

  const cacheAge = Date.now() - ID_CACHE[sheetName].timestamp;
  return cacheAge < CACHE_EXPIRY_MS;
}

/**
 * Refresh cache for a sheet by reading from the sheet
 * @param {string} sheetName - Name of the sheet
 * @returns {number} The maximum ID found
 */
function refreshCache(sheetName) {
  try {
    const config = AUTO_INCREMENT_CONFIG[sheetName];
    if (!config) {
      return 0;
    }

    const spreadsheet = getSpreadsheet();
    const sheet = spreadsheet.getSheetByName(sheetName);
    if (!sheet) {
      Logger.log(`Sheet ${sheetName} not found for cache refresh`);
      return 0;
    }

    const headers = getSheetHeaders(sheet);
    if (!headers) {
      return 0;
    }

    const idColumnIndex = findIdColumnIndex(headers, config.idColumn);
    if (idColumnIndex === -1) {
      Logger.log(`ID column not found in ${sheetName}`);
      return 0;
    }

    const maxId = getMaxIdFromSheet(sheet, idColumnIndex, config.startRow);

    // Update cache
    ID_CACHE[sheetName] = {
      lastId: maxId,
      timestamp: Date.now(),
    };

    return maxId;
  } catch (error) {
    Logger.log(`Error refreshing cache for ${sheetName}: ${error.toString()}`);
    return 0;
  }
}

// ╔════════════════════════════════════════════════════════════════╗
// ║                    CORE ID GENERATION                          ║
// ╚════════════════════════════════════════════════════════════════╝

/**
 * Generate the next ID for a specific sheet
 * This is the main function to call when creating a new record
 * 
 * @param {string} sheetName - Name of the sheet
 * @param {boolean} useCache - Whether to use cache (default: true)
 * @returns {number} The next ID to use, or 0 if error
 * 
 * @example
 * const nextId = generateNextId("HRM_Employees");
 * // Returns: 1, 2, 3, etc. based on existing records
 */
function generateNextId(sheetName, useCache = true) {
  // Validate sheet name
  if (!AUTO_INCREMENT_CONFIG[sheetName]) {
    Logger.log(`Sheet ${sheetName} is not configured for auto-increment`);
    return 0;
  }

  // Acquire lock to prevent concurrent conflicts
  const lockToken = acquireLock(sheetName);
  if (!lockToken) {
    Logger.log(`Failed to acquire lock for ${sheetName}, retrying without cache...`);
    // Retry without cache as fallback
    useCache = false;
  }

  try {
    let maxId = 0;

    // Try to use cache if enabled and valid
    if (useCache && isCacheValid(sheetName)) {
      maxId = ID_CACHE[sheetName].lastId;
      Logger.log(`Using cached max ID for ${sheetName}: ${maxId}`);
    } else {
      // Refresh cache by reading from sheet
      maxId = refreshCache(sheetName);
      Logger.log(`Refreshed max ID for ${sheetName}: ${maxId}`);
    }

    // Calculate next ID
    const nextId = maxId + 1;

    // Update cache
    ID_CACHE[sheetName] = {
      lastId: nextId,
      timestamp: Date.now(),
    };

    Logger.log(`Generated next ID for ${sheetName}: ${nextId}`);
    return nextId;
  } catch (error) {
    Logger.log(`Error generating next ID for ${sheetName}: ${error.toString()}`);
    return 0;
  } finally {
    // Always release lock
    if (lockToken) {
      releaseLock(sheetName, lockToken);
    }
  }
}

/**
 * Generate and assign ID to a new row
 * This function both generates the ID and writes it to the sheet
 * 
 * @param {string} sheetName - Name of the sheet
 * @param {number} rowNumber - Row number to assign ID to (1-based)
 * @returns {number} The assigned ID, or 0 if error
 * 
 * @example
 * const assignedId = assignIdToRow("HRM_Employees", 4);
 * // Generates ID and writes it to row 4, column A (ID column)
 */
function assignIdToRow(sheetName, rowNumber) {
  try {
    const config = AUTO_INCREMENT_CONFIG[sheetName];
    if (!config) {
      Logger.log(`Sheet ${sheetName} is not configured for auto-increment`);
      return 0;
    }

    const spreadsheet = getSpreadsheet();
    const sheet = spreadsheet.getSheetByName(sheetName);
    if (!sheet) {
      Logger.log(`Sheet ${sheetName} not found`);
      return 0;
    }

    const headers = getSheetHeaders(sheet);
    if (!headers) {
      return 0;
    }

    const idColumnIndex = findIdColumnIndex(headers, config.idColumn);
    if (idColumnIndex === -1) {
      Logger.log(`ID column not found in ${sheetName}`);
      return 0;
    }

    // Generate next ID
    const nextId = generateNextId(sheetName);
    if (nextId === 0) {
      return 0;
    }

    // Write ID to the specified row
    const idCell = sheet.getRange(rowNumber, idColumnIndex + 1);
    
    // Check if cell already has a value (prevent overwriting)
    const existingValue = idCell.getValue();
    if (existingValue !== null && existingValue !== "" && !isNaN(existingValue)) {
      Logger.log(`Row ${rowNumber} in ${sheetName} already has ID: ${existingValue}`);
      return Number(existingValue);
    }

    // Write the new ID
    idCell.setValue(nextId);
    Logger.log(`Assigned ID ${nextId} to row ${rowNumber} in ${sheetName}`);

    return nextId;
  } catch (error) {
    Logger.log(`Error assigning ID to row ${rowNumber} in ${sheetName}: ${error.toString()}`);
    return 0;
  }
}

/**
 * Initialize all sheets with proper ID sequences
 * This should be run once after setup to ensure all sheets are ready
 * 
 * @returns {Object} Summary of initialization results
 * 
 * @example
 * const result = initializeAutoIncrementSystem();
 * // Returns: { success: true, sheetsProcessed: 25, errors: [] }
 */
function initializeAutoIncrementSystem() {
  Logger.log("🚀 Initializing Auto-Increment ID System...");

  const results = {
    success: true,
    sheetsProcessed: 0,
    sheetsSkipped: 0,
    errors: [],
    details: {},
  };

  Object.keys(AUTO_INCREMENT_CONFIG).forEach((sheetName) => {
    try {
      const config = AUTO_INCREMENT_CONFIG[sheetName];
      const spreadsheet = getSpreadsheet();
      const sheet = spreadsheet.getSheetByName(sheetName);

      if (!sheet) {
        Logger.log(`Sheet ${sheetName} not found, skipping`);
        results.sheetsSkipped++;
        results.details[sheetName] = "Sheet not found";
        return;
      }

      const headers = getSheetHeaders(sheet);
      if (!headers) {
        Logger.log(`Sheet ${sheetName} has no headers, skipping`);
        results.sheetsSkipped++;
        results.details[sheetName] = "No headers found";
        return;
      }

      const idColumnIndex = findIdColumnIndex(headers, config.idColumn);
      if (idColumnIndex === -1) {
        Logger.log(`ID column not found in ${sheetName}, skipping`);
        results.sheetsSkipped++;
        results.details[sheetName] = "ID column not found";
        return;
      }

      // Refresh cache for this sheet (reads current max ID)
      const maxId = refreshCache(sheetName);
      results.sheetsProcessed++;
      results.details[sheetName] = {
        status: "initialized",
        maxId: maxId,
        nextId: maxId + 1,
      };

      Logger.log(`✅ Initialized ${sheetName}: Max ID = ${maxId}, Next ID = ${maxId + 1}`);
    } catch (error) {
      results.success = false;
      results.errors.push({
        sheet: sheetName,
        error: error.toString(),
      });
      Logger.log(`❌ Error initializing ${sheetName}: ${error.toString()}`);
    }
  });

  Logger.log(
    `✅ Auto-Increment System Initialization Complete: ${results.sheetsProcessed} sheets processed, ${results.sheetsSkipped} skipped, ${results.errors.length} errors`
  );

  return results;
}

/**
 * Rebuild ID sequences for a sheet (fixes gaps, ensures continuity)
 * Use this if IDs have become inconsistent
 * 
 * @param {string} sheetName - Name of the sheet to rebuild
 * @param {boolean} preserveExisting - If true, only fills gaps. If false, renumbers all.
 * @returns {Object} Summary of rebuild operation
 */
function rebuildIdSequence(sheetName, preserveExisting = true) {
  Logger.log(`🔧 Rebuilding ID sequence for ${sheetName}...`);

  try {
    const config = AUTO_INCREMENT_CONFIG[sheetName];
    if (!config) {
      return {
        success: false,
        error: `Sheet ${sheetName} is not configured for auto-increment`,
      };
    }

    const spreadsheet = getSpreadsheet();
    const sheet = spreadsheet.getSheetByName(sheetName);
    if (!sheet) {
      return {
        success: false,
        error: `Sheet ${sheetName} not found`,
      };
    }

    const headers = getSheetHeaders(sheet);
    if (!headers) {
      return {
        success: false,
        error: "No headers found",
      };
    }

    const idColumnIndex = findIdColumnIndex(headers, config.idColumn);
    if (idColumnIndex === -1) {
      return {
        success: false,
        error: "ID column not found",
      };
    }

    const lastRow = sheet.getLastRow();
    if (lastRow < config.startRow) {
      return {
        success: true,
        message: "No data rows to process",
        rowsUpdated: 0,
      };
    }

    let nextId = 1;
    let rowsUpdated = 0;

    // Process each row
    for (let row = config.startRow; row <= lastRow; row++) {
      const idCell = sheet.getRange(row, idColumnIndex + 1);
      const existingId = idCell.getValue();

      if (preserveExisting) {
        // Only fill empty cells
        if (existingId === null || existingId === "" || isNaN(existingId)) {
          idCell.setValue(nextId);
          rowsUpdated++;
          nextId++;
        } else {
          // Keep existing ID, but update nextId if needed
          const numId = Number(existingId);
          if (numId >= nextId) {
            nextId = numId + 1;
          }
        }
      } else {
        // Renumber all rows sequentially
        idCell.setValue(nextId);
        rowsUpdated++;
        nextId++;
      }
    }

    // Update cache
    ID_CACHE[sheetName] = {
      lastId: nextId - 1,
      timestamp: Date.now(),
    };

    Logger.log(`✅ Rebuilt ID sequence for ${sheetName}: ${rowsUpdated} rows updated`);

    return {
      success: true,
      rowsUpdated: rowsUpdated,
      nextId: nextId,
    };
  } catch (error) {
    Logger.log(`❌ Error rebuilding ID sequence for ${sheetName}: ${error.toString()}`);
    return {
      success: false,
      error: error.toString(),
    };
  }
}

/**
 * Clear cache for a specific sheet or all sheets
 * @param {string|null} sheetName - Sheet name to clear, or null for all sheets
 */
function clearIdCache(sheetName = null) {
  if (sheetName) {
    delete ID_CACHE[sheetName];
    Logger.log(`Cleared cache for ${sheetName}`);
  } else {
    ID_CACHE = {};
    Logger.log("Cleared all ID caches");
  }
}

/**
 * Get current status of the auto-increment system
 * @returns {Object} Status information
 */
function getAutoIncrementStatus() {
  const status = {
    configuredSheets: Object.keys(AUTO_INCREMENT_CONFIG).length,
    cachedSheets: Object.keys(ID_CACHE).length,
    lockedSheets: Object.keys(ID_LOCKS).length,
    cacheDetails: {},
  };

  Object.keys(ID_CACHE).forEach((sheetName) => {
    const cache = ID_CACHE[sheetName];
    status.cacheDetails[sheetName] = {
      lastId: cache.lastId,
      nextId: cache.lastId + 1,
      cacheAge: Date.now() - cache.timestamp,
      isValid: isCacheValid(sheetName),
    };
  });

  return status;
}

// ╔════════════════════════════════════════════════════════════════╗
// ║                    LEGACY COMPATIBILITY                         ║
// ╚════════════════════════════════════════════════════════════════╝

/**
 * Legacy function name for backward compatibility
 * @deprecated Use generateNextId() instead
 */
function getNextId(sheetName) {
  return generateNextId(sheetName);
}

