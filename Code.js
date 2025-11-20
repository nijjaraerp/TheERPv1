/**
 * Code.js
 * ========
 * Main backend logic for the ERP system
 * Handles authentication, data operations, and API endpoints
 */

// ============================================================
// WEB APP ENTRY POINTS
// ============================================================

/**
 * Serves the login page or dashboard based on session
 */
function doGet(e) {
  const page = e.parameter.page || "login";

  if (page === "dashboard") {
    const template = HtmlService.createTemplateFromFile("Dashboard");
    return template
      .evaluate()
      .setTitle("Nijjara ERP - Dashboard")
      .addMetaTag("viewport", "width=device-width, initial-scale=1")
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  const template = HtmlService.createTemplateFromFile("Login");
  return template
    .evaluate()
    .setTitle("Nijjara ERP - Login")
    .addMetaTag("viewport", "width=device-width, initial-scale=1")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Get script URL for redirects
 */
function getScriptUrl() {
  return ScriptApp.getService().getUrl();
}

/**
 * Include external files (CSS, JS, etc.)
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// ============================================================
// AUTHENTICATION
// ============================================================

/**
 * Authenticate user and create session
 */
function authenticateUser(username, password) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const usersSheet = ss.getSheetByName("SYS_Users");

    if (!usersSheet) {
      return {
        success: false,
        message: "خطأ في النظام / System Error",
      };
    }

    // Get all user data
    const data = usersSheet.getDataRange().getValues();
    const headers = data[0];

    // Find column indices
    const usernameCol = headers.indexOf("USR_Name");
    const passwordCol = headers.indexOf("Password_Hash");
    const activeCol = headers.indexOf("USR_Is_Active");
    const roleCol = headers.indexOf("ROL_ID");
    const userIdCol = headers.indexOf("USR_ID");
    const emailCol = headers.indexOf("EMP_Email");
    const nameCol = headers.indexOf("EMP_Name_EN");

    // Search for user (start from row 3, skip headers)
    let userRow = null;
    for (let i = 2; i < data.length; i++) {
      if (data[i][usernameCol] === username) {
        userRow = data[i];
        break;
      }
    }

    if (!userRow) {
      return {
        success: false,
        message: "اسم المستخدم أو كلمة المرور غير صحيحة",
      };
    }

    // Verify password
    const storedHash = userRow[passwordCol];
    const inputHash = Utilities.base64Encode(
      Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, password)
    );

    if (storedHash !== inputHash) {
      logAudit(
        username,
        "LOGIN_FAILED",
        "Invalid password attempt",
        "SYS_Users",
        username
      );
      return {
        success: false,
        message: "اسم المستخدم أو كلمة المرور غير صحيحة",
      };
    }

    // Check if user is active
    if (!userRow[activeCol]) {
      return {
        success: false,
        message: "هذا المستخدم غير نشط",
      };
    }

    // Create session
    const sessionToken = Utilities.getUuid();
    const userId = userRow[userIdCol];
    const userEmail = userRow[emailCol];
    const userName = userRow[nameCol];
    const roleId = userRow[roleCol];

    createSession(userId, userEmail, sessionToken, roleId);

    // Update last login
    updateLastLogin(username);

    // Log successful login
    logAudit(
      userId,
      "LOGIN_SUCCESS",
      `User logged in successfully`,
      "SYS_Users",
      userId
    );

    // Get bootstrap data
    const bootstrapData = getBootstrapData(userId, roleId);

    return {
      success: true,
      token: sessionToken,
      userId: userId,
      userName: userName,
      roleId: roleId,
      bootstrap: bootstrapData,
    };
  } catch (error) {
    Logger.log(`Authentication error: ${error.message}`);
    return {
      success: false,
      message: "حدث خطأ أثناء تسجيل الدخول",
    };
  }
}

/**
 * Create new session record
 */
function createSession(userId, userEmail, token, roleId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sessionsSheet = ss.getSheetByName("SYS_Sessions");

  if (!sessionsSheet) return;

  const now = new Date();
  const sessionId = "SESS_" + Utilities.getUuid().substring(0, 8);

  const sessionData = [
    sessionId,
    userId,
    userEmail,
    userId,
    "WEB",
    "ACTIVE",
    "Browser",
    "N/A", // IP Address
    token,
    now,
    null,
    now,
    userId,
    now,
    null,
    null,
    JSON.stringify({ roleId: roleId }),
  ];

  sessionsSheet.appendRow(sessionData);
}

/**
 * Update user's last login timestamp
 */
function updateLastLogin(username) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const usersSheet = ss.getSheetByName("SYS_Users");

  if (!usersSheet) return;

  const data = usersSheet.getDataRange().getValues();
  const headers = data[0];
  const usernameCol = headers.indexOf("USR_Name");
  const lastLoginCol = headers.indexOf("Last_Login");

  for (let i = 2; i < data.length; i++) {
    if (data[i][usernameCol] === username) {
      usersSheet.getRange(i + 1, lastLoginCol + 1).setValue(new Date());
      break;
    }
  }
}

/**
 * Logout user and end session
 */
function logoutUser(token) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sessionsSheet = ss.getSheetByName("SYS_Sessions");

    if (!sessionsSheet) {
      return { success: false };
    }

    const data = sessionsSheet.getDataRange().getValues();
    const headers = data[0];
    const tokenCol = headers.indexOf("Auth_Token");
    const endAtCol = headers.indexOf("SESS_End_At");
    const statusCol = headers.indexOf("SESS_Status");

    for (let i = 2; i < data.length; i++) {
      if (data[i][tokenCol] === token) {
        const now = new Date();
        sessionsSheet.getRange(i + 1, endAtCol + 1).setValue(now);
        sessionsSheet.getRange(i + 1, statusCol + 1).setValue("EXPIRED");

        logAudit(
          data[i][1],
          "LOGOUT",
          "User logged out",
          "SYS_Sessions",
          data[i][0]
        );
        break;
      }
    }

    return { success: true };
  } catch (error) {
    Logger.log(`Logout error: ${error.message}`);
    return { success: false };
  }
}

/**
 * Verify session token is valid
 */
function verifySession(token) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sessionsSheet = ss.getSheetByName("SYS_Sessions");

  if (!sessionsSheet) return null;

  const data = sessionsSheet.getDataRange().getValues();
  const headers = data[0];
  const tokenCol = headers.indexOf("Auth_Token");
  const statusCol = headers.indexOf("SESS_Status");
  const userIdCol = headers.indexOf("USR_ID");
  const startCol = headers.indexOf("SESS_Start_At");

  for (let i = 2; i < data.length; i++) {
    if (data[i][tokenCol] === token && data[i][statusCol] === "ACTIVE") {
      // Check session timeout (8 hours = 480 minutes)
      const startTime = new Date(data[i][startCol]);
      const now = new Date();
      const diffMinutes = (now - startTime) / (1000 * 60);

      if (diffMinutes > 480) {
        // Session expired
        sessionsSheet.getRange(i + 1, statusCol + 1).setValue("EXPIRED");
        return null;
      }

      // Update last seen
      const lastSeenCol = headers.indexOf("SESS_Last_Seen");
      sessionsSheet.getRange(i + 1, lastSeenCol + 1).setValue(now);

      return {
        userId: data[i][userIdCol],
        sessionId: data[i][0],
      };
    }
  }

  return null;
}

// ============================================================
// BOOTSTRAP DATA
// ============================================================

/**
 * Get all configuration data needed for the frontend
 */
function getBootstrapData(userId, roleId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // Get user permissions
    const permissions = getUserPermissions(roleId);

    // Get dropdown options
    const dropdowns = getDropdownData();

    // Get button configurations
    const buttons = getButtonData();

    // Get system settings
    const settings = getSystemSettings();

    return {
      permissions: permissions,
      dropdowns: dropdowns,
      buttons: buttons,
      settings: settings,
      forms: [], // Will be populated based on permissions
      views: [], // Will be populated based on permissions
    };
  } catch (error) {
    Logger.log(`Bootstrap error: ${error.message}`);
    return {};
  }
}

/**
 * Get user permissions based on role
 */
function getUserPermissions(roleId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const rolePermsSheet = ss.getSheetByName("SYS_Role_Permissions");

  if (!rolePermsSheet) return [];

  const data = rolePermsSheet.getDataRange().getValues();
  const headers = data[0];
  const roleCol = headers.indexOf("ROL_ID");
  const permCol = headers.indexOf("PRM_ID");
  const allowedCol = headers.indexOf("SRP_Is_Allowed");

  const permissions = [];
  for (let i = 2; i < data.length; i++) {
    if (data[i][roleCol] === roleId && data[i][allowedCol]) {
      permissions.push(data[i][permCol]);
    }
  }

  return permissions;
}

/**
 * Get all dropdown data
 */
function getDropdownData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ddSheet = ss.getSheetByName("ENG_Dropdowns");

  if (!ddSheet) return {};

  const data = ddSheet.getDataRange().getValues();
  const dropdowns = {};

  // Group by DD_ID
  for (let i = 2; i < data.length; i++) {
    const ddId = data[i][0];
    const ddEn = data[i][1];
    const ddAr = data[i][2];
    const isActive = data[i][3];

    if (isActive) {
      if (!dropdowns[ddId]) {
        dropdowns[ddId] = [];
      }
      dropdowns[ddId].push({
        value: ddId,
        labelEn: ddEn,
        labelAr: ddAr,
      });
    }
  }

  return dropdowns;
}

/**
 * Get button configurations
 */
function getButtonData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const btnSheet = ss.getSheetByName("ENG_Buttons");

  if (!btnSheet) return {};

  const data = btnSheet.getDataRange().getValues();
  const buttons = {};

  for (let i = 2; i < data.length; i++) {
    const btnId = data[i][0];
    buttons[btnId] = {
      id: btnId,
      label: data[i][1],
      type: data[i][2],
      description: data[i][3],
    };
  }

  return buttons;
}

/**
 * Get system settings
 */
function getSystemSettings() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const settingsSheet = ss.getSheetByName("ENG_Settings");

  if (!settingsSheet) return {};

  const data = settingsSheet.getDataRange().getValues();
  const settings = {};

  for (let i = 2; i < data.length; i++) {
    const key = data[i][0];
    const value = data[i][1];
    settings[key] = value;
  }

  return settings;
}

// ============================================================
// AUDIT LOGGING
// ============================================================

/**
 * Log user action to audit trail
 */
function logAudit(userId, action, details, entity, entityId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const auditSheet = ss.getSheetByName("SYS_Audit_Log");

    if (!auditSheet) return;

    const now = new Date();
    const auditId = "AUD_" + Utilities.getUuid().substring(0, 8);

    const auditData = [
      auditId,
      now,
      userId,
      userId, // Username - would need to fetch
      action,
      details,
      entity,
      entityId,
      "SYSTEM",
      ss.getId(),
      ss.getName(),
      "N/A", // IP Address
    ];

    auditSheet.appendRow(auditData);
  } catch (error) {
    Logger.log(`Audit logging error: ${error.message}`);
  }
}

// ============================================================
// DATA OPERATIONS
// ============================================================

/**
 * Get data from a sheet with optional filters
 */
function getData(sheetName, filters = {}) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(sheetName);

    if (!sheet) {
      return { success: false, message: "Sheet not found" };
    }

    const data = sheet.getDataRange().getValues();
    const headersEn = data[0];
    const headersAr = data[1];
    const rows = data.slice(2); // Skip header rows

    // Convert to objects
    const records = rows.map((row) => {
      const record = {};
      headersEn.forEach((header, index) => {
        record[header] = row[index];
      });
      return record;
    });

    return {
      success: true,
      headersEn: headersEn,
      headersAr: headersAr,
      data: records,
    };
  } catch (error) {
    Logger.log(`Get data error: ${error.message}`);
    return { success: false, message: error.message };
  }
}

/**
 * Add new record to a sheet
 */
function addRecord(sheetName, recordData, userId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(sheetName);

    if (!sheet) {
      return { success: false, message: "Sheet not found" };
    }

    const headers = sheet
      .getRange(1, 1, 1, sheet.getLastColumn())
      .getValues()[0];
    const now = new Date();

    // Build row array based on headers
    const newRow = headers.map((header) => {
      if (recordData[header] !== undefined) {
        return recordData[header];
      } else if (header.includes("Crt_At") || header.includes("_Crt_At")) {
        return now;
      } else if (header.includes("Crt_By") || header.includes("_Crt_By")) {
        return userId;
      }
      return "";
    });

    sheet.appendRow(newRow);

    // Log audit
    logAudit(
      userId,
      "ADD",
      `Added new record to ${sheetName}`,
      sheetName,
      recordData[headers[0]]
    );

    return { success: true, message: "Record added successfully" };
  } catch (error) {
    Logger.log(`Add record error: ${error.message}`);
    return { success: false, message: error.message };
  }
}

/**
 * Update existing record
 */
function updateRecord(sheetName, recordId, recordData, userId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(sheetName);

    if (!sheet) {
      return { success: false, message: "Sheet not found" };
    }

    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const idCol = 0; // Assuming first column is always ID

    // Find the record
    for (let i = 2; i < data.length; i++) {
      if (data[i][idCol] === recordId) {
        // Update fields
        headers.forEach((header, colIndex) => {
          if (recordData[header] !== undefined) {
            sheet.getRange(i + 1, colIndex + 1).setValue(recordData[header]);
          } else if (header.includes("Upd_At") || header.includes("_Upd_At")) {
            sheet.getRange(i + 1, colIndex + 1).setValue(new Date());
          } else if (header.includes("Upd_By") || header.includes("_Upd_By")) {
            sheet.getRange(i + 1, colIndex + 1).setValue(userId);
          }
        });

        // Log audit
        logAudit(
          userId,
          "UPDATE",
          `Updated record in ${sheetName}`,
          sheetName,
          recordId
        );

        return { success: true, message: "Record updated successfully" };
      }
    }

    return { success: false, message: "Record not found" };
  } catch (error) {
    Logger.log(`Update record error: ${error.message}`);
    return { success: false, message: error.message };
  }
}

/**
 * Delete record (soft delete by setting status to inactive)
 */
function deleteRecord(sheetName, recordId, userId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(sheetName);

    if (!sheet) {
      return { success: false, message: "Sheet not found" };
    }

    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const idCol = 0;

    // Find status or active column
    let statusCol = headers.findIndex(
      (h) => h.includes("Status") || h.includes("Is_Active")
    );

    for (let i = 2; i < data.length; i++) {
      if (data[i][idCol] === recordId) {
        if (statusCol >= 0) {
          // Soft delete
          sheet.getRange(i + 1, statusCol + 1).setValue("DELETED");
        } else {
          // Hard delete if no status column
          sheet.deleteRow(i + 1);
        }

        // Log audit
        logAudit(
          userId,
          "DELETE",
          `Deleted record from ${sheetName}`,
          sheetName,
          recordId
        );

        return { success: true, message: "Record deleted successfully" };
      }
    }

    return { success: false, message: "Record not found" };
  } catch (error) {
    Logger.log(`Delete record error: ${error.message}`);
    return { success: false, message: error.message };
  }
}
