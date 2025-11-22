/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * NIJJARA ERP - Code.js (Backend)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * Purpose:
 *   - Main backend API for the ERP system
 *   - Authentication & Session Management
 *   - Bootstrap data generation
 *   - CRUD operations for all entities
 *   - Permission checking & Authorization
 *   - Audit logging
 *
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

// ╔════════════════════════════════════════════════════════════════╗
// ║                      GLOBAL CONFIGURATION                      ║
// ╚════════════════════════════════════════════════════════════════╝

const CONFIG = {
  SHEET_NAME: "TheERPv1",
  SESSION_TIMEOUT_MINUTES: 480, // 8 hours
  MAX_LOG_ENTRIES: 100000,
  PADDING_SIZE: 1000, // Extra rows for data padding
  ENCRYPTION_KEY:
    PropertiesService.getScriptProperties().getProperty("ENCRYPTION_KEY") ||
    "default_key_change_me",
};

// ╔════════════════════════════════════════════════════════════════╗
// ║                   AUTHENTICATION ENDPOINTS                     ║
// ╚════════════════════════════════════════════════════════════════╝

/**
 * Login endpoint: Authenticate user credentials
 * @param {string} username - Username (USR_Name)
 * @param {string} password - Password (plain text, will be hashed)
 * @returns {Object} {success: boolean, message: string, bootstrap?: Object, token?: string}
 */
function doLogin(username, password) {
  try {
    if (!username || !password) {
      return {
        success: false,
        message: "Username and password are required",
      };
    }

    const ss = SpreadsheetApp.openByName(CONFIG.SHEET_NAME);
    const usersSheet = ss.getSheetByName("SYS_Users");

    if (!usersSheet) {
      return {
        success: false,
        message: "System not initialized. Please run Setup.js first.",
      };
    }

    // Get all user data (skip headers)
    const usersData = usersSheet
      .getRange(3, 1, usersSheet.getLastRow() - 2, usersSheet.getLastColumn())
      .getValues();

    // Headers mapping
    const headerRow = usersSheet
      .getRange(1, 1, 1, usersSheet.getLastColumn())
      .getValues()[0];
    const usrIdIdx = headerRow.indexOf("USR_ID");
    const usrNameIdx = headerRow.indexOf("USR_Name");
    const passwordIdx = headerRow.indexOf("Password_Hash");
    const usrActiveIdx = headerRow.indexOf("USR_Is_Active");
    const rolIdx = headerRow.indexOf("ROL_ID");
    const emailIdx = headerRow.indexOf("EMP_Email");

    // Find user
    let userRow = null;
    let userRowIndex = null;

    for (let i = 0; i < usersData.length; i++) {
      if (usersData[i][usrNameIdx] === username) {
        userRow = usersData[i];
        userRowIndex = i + 3; // +3 because we skipped headers
        break;
      }
    }

    if (!userRow) {
      return {
        success: false,
        message: "Invalid username or password",
      };
    }

    // Check if user is active
    if (userRow[usrActiveIdx] !== true && userRow[usrActiveIdx] !== "TRUE") {
      return {
        success: false,
        message: "User account is inactive",
      };
    }

    // Verify password
    const passwordHash = hashPassword(password);
    if (userRow[passwordIdx] !== passwordHash) {
      return {
        success: false,
        message: "Invalid username or password",
      };
    }

    // Generate session token
    const sessionToken = generateSessionToken();
    const sessionId = generateUniqueId("SESS");

    // Create session record
    const sessionData = {
      SESS_ID: sessionId,
      USR_ID: userRow[usrIdIdx],
      EMP_Email: userRow[emailIdx],
      Actor_USR_ID: userRow[usrIdIdx],
      SESS_Type: "LOGIN",
      SESS_Status: "ACTIVE",
      USR_Device: "Web",
      IP_Address: getClientIP(),
      Auth_Token: sessionToken,
      SESS_Start_At: new Date().toISOString(),
      SESS_End_At: "",
      SESS_Crt_At: new Date().toISOString(),
      SESS_Crt_By: userRow[usrIdIdx],
      SESS_Last_Seen: new Date().toISOString(),
      SESS_Revoked_At: "",
      SESS_Revoked_By: "",
      SESS_Metadata: JSON.stringify({ loginTime: new Date().toISOString() }),
    };

    // Save session
    appendRowToSheet("SYS_Sessions", sessionData);

    // Update last login
    usersSheet
      .getRange(userRowIndex, headerRow.indexOf("Last_Login") + 1)
      .setValue(new Date().toISOString());

    // Generate bootstrap object
    const bootstrap = generateBootstrap(userRow[usrIdIdx], userRow[rolIdx]);

    // Log login
    logAudit(
      userRow[usrIdIdx],
      "LOGIN",
      `User logged in successfully`,
      "SYS_Users",
      userRow[usrIdIdx]
    );

    return {
      success: true,
      message: "Login successful",
      bootstrap: bootstrap,
      token: sessionToken,
      sessionId: sessionId,
    };
  } catch (e) {
    Logger.log(`Login Error: ${e.message}`);
    return {
      success: false,
      message: `Login failed: ${e.message}`,
    };
  }
}

/**
 * Logout endpoint: End user session
 * @param {string} sessionToken - Session token
 * @returns {Object} {success: boolean, message: string}
 */
function doLogout(sessionToken) {
  try {
    const ss = SpreadsheetApp.openByName(CONFIG.SHEET_NAME);
    const sessionsSheet = ss.getSheetByName("SYS_Sessions");

    if (!sessionsSheet) {
      return { success: false, message: "Sessions sheet not found" };
    }

    const sessionsData = sessionsSheet
      .getRange(
        3,
        1,
        sessionsSheet.getLastRow() - 2,
        sessionsSheet.getLastColumn()
      )
      .getValues();
    const headerRow = sessionsSheet
      .getRange(1, 1, 1, sessionsSheet.getLastColumn())
      .getValues()[0];
    const tokenIdx = headerRow.indexOf("Auth_Token");
    const statusIdx = headerRow.indexOf("SESS_Status");
    const endAtIdx = headerRow.indexOf("SESS_End_At");

    for (let i = 0; i < sessionsData.length; i++) {
      if (sessionsData[i][tokenIdx] === sessionToken) {
        sessionsSheet.getRange(i + 3, statusIdx + 1).setValue("ENDED");
        sessionsSheet
          .getRange(i + 3, endAtIdx + 1)
          .setValue(new Date().toISOString());

        logAudit("", "LOGOUT", "User logged out", "SYS_Sessions", "");

        return { success: true, message: "Logout successful" };
      }
    }

    return { success: false, message: "Session not found" };
  } catch (e) {
    Logger.log(`Logout Error: ${e.message}`);
    return { success: false, message: `Logout failed: ${e.message}` };
  }
}

// ╔════════════════════════════════════════════════════════════════╗
// ║                    BOOTSTRAP GENERATION                        ║
// ╚════════════════════════════════════════════════════════════════╝

/**
 * Generate complete bootstrap object for frontend
 * Contains all metadata and user-accessible data
 */
function generateBootstrap(userId, roleId) {
  try {
    const ss = SpreadsheetApp.openByName(CONFIG.SHEET_NAME);

    const bootstrap = {
      timestamp: new Date().toISOString(),
      user: {
        id: userId,
        roleId: roleId,
      },
      forms: getAllForms(),
      views: getAllViews(),
      buttons: getAllButtons(),
      dropdowns: getAllDropdowns(),
      settings: getAllSettings(),
      permissions: getRolePermissions(roleId),
    };

    return bootstrap;
  } catch (e) {
    Logger.log(`Bootstrap Generation Error: ${e.message}`);
    return { error: e.message };
  }
}

/**
 * Get all forms from ENG_Forms sheet
 */
function getAllForms() {
  try {
    return getSheetDataAsObjects("ENG_Forms");
  } catch (e) {
    Logger.log(`Error fetching forms: ${e.message}`);
    return [];
  }
}

/**
 * Get all views from ENG_Views sheet
 */
function getAllViews() {
  try {
    return getSheetDataAsObjects("ENG_Views");
  } catch (e) {
    Logger.log(`Error fetching views: ${e.message}`);
    return [];
  }
}

/**
 * Get all buttons from ENG_Buttons sheet
 */
function getAllButtons() {
  try {
    return getSheetDataAsObjects("ENG_Buttons");
  } catch (e) {
    Logger.log(`Error fetching buttons: ${e.message}`);
    return [];
  }
}

/**
 * Get all dropdowns from ENG_Dropdowns sheet
 */
function getAllDropdowns() {
  try {
    return getSheetDataAsObjects("ENG_Dropdowns");
  } catch (e) {
    Logger.log(`Error fetching dropdowns: ${e.message}`);
    return [];
  }
}

/**
 * Get all settings from ENG_Settings sheet
 */
function getAllSettings() {
  try {
    return getSheetDataAsObjects("ENG_Settings");
  } catch (e) {
    Logger.log(`Error fetching settings: ${e.message}`);
    return [];
  }
}

/**
 * Get permissions for a role
 */
function getRolePermissions(roleId) {
  try {
    const ss = SpreadsheetApp.openByName(CONFIG.SHEET_NAME);
    const permSheet = ss.getSheetByName("SYS_Role_Permissions");

    if (!permSheet) return {};

    const data = getSheetDataAsObjects("SYS_Role_Permissions");
    const rolePerms = data.filter((p) => p.ROL_ID === roleId);

    const permissions = {};
    rolePerms.forEach((p) => {
      permissions[p.PRM_ID] = {
        allowed: p.SRP_Is_Allowed === true || p.SRP_Is_Allowed === "TRUE",
        scope: p.SRP_Scope,
        constraints: p.SRP_Constraints,
      };
    });

    return permissions;
  } catch (e) {
    Logger.log(`Error fetching permissions: ${e.message}`);
    return {};
  }
}

// ╔════════════════════════════════════════════════════════════════╗
// ║                   DATA RETRIEVAL ENDPOINTS                     ║
// ╚════════════════════════════════════════════════════════════════╝

/**
 * Get data for a specific view
 * @param {string} viewId - VIEW_ID from ENG_Views
 * @returns {Array} Array of data objects
 */
function getViewData(viewId) {
  try {
    const ss = SpreadsheetApp.openByName(CONFIG.SHEET_NAME);
    const viewsSheet = ss.getSheetByName("ENG_Views");

    const viewsData = getSheetDataAsObjects("ENG_Views");
    const view = viewsData.find((v) => v.VIEW_ID === viewId);

    if (!view) {
      return { error: `View ${viewId} not found` };
    }

    const sourceSheet = view.Source_Sheet;
    const sourceColumns = view.Source_Columns
      ? view.Source_Columns.split(",").map((c) => c.trim())
      : [];

    if (!sourceColumns.length) {
      return { error: "No columns configured for this view" };
    }

    // Get data from source sheet
    let data = getSheetDataAsObjects(sourceSheet);

    // Filter to only requested columns
    data = data.map((row) => {
      const filtered = {};
      sourceColumns.forEach((col) => {
        if (row.hasOwnProperty(col)) {
          filtered[col] = row[col];
        }
      });
      return filtered;
    });

    return {
      viewId: viewId,
      title: view.View_Title,
      data: data,
    };
  } catch (e) {
    Logger.log(`Get View Data Error: ${e.message}`);
    return { error: e.message };
  }
}

// ╔════════════════════════════════════════════════════════════════╗
// ║                   CRUD OPERATIONS                              ║
// ╚════════════════════════════════════════════════════════════════╝

/**
 * Save a record (CREATE or UPDATE)
 * @param {string} targetSheet - Sheet name to save to
 * @param {Object} data - Data object to save
 * @param {string} action - "CREATE" or "UPDATE"
 * @returns {Object} {success: boolean, message: string, id?: string}
 */
function saveRecord(targetSheet, data, action = "CREATE") {
  try {
    if (action === "CREATE") {
      return createRecord(targetSheet, data);
    } else if (action === "UPDATE") {
      return updateRecord(targetSheet, data);
    } else {
      return { success: false, message: "Invalid action" };
    }
  } catch (e) {
    Logger.log(`Save Record Error: ${e.message}`);
    return { success: false, message: e.message };
  }
}

/**
 * Create a new record
 */
function createRecord(targetSheet, data) {
  try {
    // Generate ID based on sheet name
    const id = generateUniqueId(extractPrefix(targetSheet));
    data[extractIdField(targetSheet)] = id;

    // Add system fields
    data.Crt_At = new Date().toISOString();
    data.Crt_By = getCurrentUser();

    // Append to sheet
    appendRowToSheet(targetSheet, data);

    // Log action
    logAudit(
      getCurrentUser(),
      "CREATE",
      `Created new record in ${targetSheet}`,
      targetSheet,
      id
    );

    return {
      success: true,
      message: "Record created successfully",
      id: id,
    };
  } catch (e) {
    Logger.log(`Create Record Error: ${e.message}`);
    return { success: false, message: e.message };
  }
}

/**
 * Update an existing record
 */
function updateRecord(targetSheet, data) {
  try {
    // Add system fields
    data.Upd_At = new Date().toISOString();
    data.Upd_By = getCurrentUser();

    const ss = SpreadsheetApp.openByName(CONFIG.SHEET_NAME);
    const sheet = ss.getSheetByName(targetSheet);
    const headers = sheet
      .getRange(1, 1, 1, sheet.getLastColumn())
      .getValues()[0];

    const idField = extractIdField(targetSheet);
    const idColumnIndex = headers.indexOf(idField);

    if (idColumnIndex === -1) {
      return { success: false, message: `ID field ${idField} not found` };
    }

    const recordId = data[idField];
    const sheetData = sheet
      .getRange(3, 1, sheet.getLastRow() - 2, sheet.getLastColumn())
      .getValues();

    for (let i = 0; i < sheetData.length; i++) {
      if (sheetData[i][idColumnIndex] === recordId) {
        const rowNumber = i + 3;
        updateSheetRow(sheet, rowNumber, headers, data);

        logAudit(
          getCurrentUser(),
          "UPDATE",
          `Updated record in ${targetSheet}`,
          targetSheet,
          recordId
        );

        return {
          success: true,
          message: "Record updated successfully",
          id: recordId,
        };
      }
    }

    return { success: false, message: "Record not found" };
  } catch (e) {
    Logger.log(`Update Record Error: ${e.message}`);
    return { success: false, message: e.message };
  }
}

/**
 * Delete a record
 */
function deleteRecord(targetSheet, recordId) {
  try {
    const ss = SpreadsheetApp.openByName(CONFIG.SHEET_NAME);
    const sheet = ss.getSheetByName(targetSheet);
    const headers = sheet
      .getRange(1, 1, 1, sheet.getLastColumn())
      .getValues()[0];

    const idField = extractIdField(targetSheet);
    const idColumnIndex = headers.indexOf(idField);

    const sheetData = sheet
      .getRange(3, 1, sheet.getLastRow() - 2, sheet.getLastColumn())
      .getValues();

    for (let i = 0; i < sheetData.length; i++) {
      if (sheetData[i][idColumnIndex] === recordId) {
        sheet.deleteRow(i + 3);
        logAudit(
          getCurrentUser(),
          "DELETE",
          `Deleted record from ${targetSheet}`,
          targetSheet,
          recordId
        );

        return {
          success: true,
          message: "Record deleted successfully",
        };
      }
    }

    return { success: false, message: "Record not found" };
  } catch (e) {
    Logger.log(`Delete Record Error: ${e.message}`);
    return { success: false, message: e.message };
  }
}

// ╔════════════════════════════════════════════════════════════════╗
// ║                   AUDIT LOGGING                                ║
// ╚════════════════════════════════════════════════════════════════╝

/**
 * Log an action to audit trail
 */
function logAudit(userId, action, details, entity, entityId) {
  try {
    const auditData = {
      AUD_ID: generateUniqueId("AUD"),
      AUD_Time_Stamp: new Date().toISOString(),
      USR_ID: userId,
      USR_Name: getUserName(userId),
      USR_Action: action,
      ACT_Details: details,
      AUD_Entity: entity,
      AUD_Entity_ID: entityId,
      AUD_Scope: "SYSTEM",
      AUD_Sheet_ID: "",
      AUD_Sheet_Name: CONFIG.SHEET_NAME,
      IP_Address: getClientIP(),
    };

    appendRowToSheet("SYS_Audit_Log", auditData);
  } catch (e) {
    Logger.log(`Audit Logging Error: ${e.message}`);
  }
}

// ╔════════════════════════════════════════════════════════════════╗
// ║                   UTILITY FUNCTIONS                            ║
// ╚════════════════════════════════════════════════════════════════╝

/**
 * Convert sheet data to array of objects
 */
function getSheetDataAsObjects(sheetName) {
  const ss = SpreadsheetApp.openByName(CONFIG.SHEET_NAME);
  const sheet = ss.getSheetByName(sheetName);

  if (!sheet || sheet.getLastRow() < 3) {
    return [];
  }

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const data = sheet
    .getRange(3, 1, sheet.getLastRow() - 2, sheet.getLastColumn())
    .getValues();

  return data.map((row) => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });
}

/**
 * Append a row to a sheet
 */
function appendRowToSheet(sheetName, dataObj) {
  const ss = SpreadsheetApp.openByName(CONFIG.SHEET_NAME);
  const sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    throw new Error(`Sheet ${sheetName} not found`);
  }

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const row = headers.map((header) => dataObj[header] || "");

  sheet.appendRow(row);
}

/**
 * Update a sheet row
 */
function updateSheetRow(sheet, rowNumber, headers, dataObj) {
  const values = headers.map((header) =>
    dataObj[header] !== undefined ? dataObj[header] : ""
  );
  sheet.getRange(rowNumber, 1, 1, headers.length).setValues([values]);
}

/**
 * Generate unique ID
 */
function generateUniqueId(prefix) {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 9);
  return `${prefix}_${timestamp}_${random}`.toUpperCase();
}

/**
 * Generate session token
 */
function generateSessionToken() {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 64; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

/**
 * Hash password (use bcryptjs in production)
 */
function hashPassword(password) {
  // WARNING: This is a simple hash for demo. Use proper hashing in production!
  const hash = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    password
  );
  return Utilities.base64Encode(hash);
}

function appendDebugRow(sheetName, dataObj) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return;
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var row = headers.map(function (h) {
    return dataObj[h] !== undefined ? dataObj[h] : "";
  });
  sheet.appendRow(row);
}

function logInfo_(actor, action, entity, id, details) {
  try {
    var data = {
      DBG_ID: generateUniqueId("DBG"),
      Time_Stamp: new Date().toISOString(),
      Actor: actor || "",
      Action: action || "",
      Entity: entity || "",
      Entity_ID: id || "",
      Details:
        typeof details === "string" ? details : JSON.stringify(details || {}),
    };
    appendDebugRow("DBUG_AppLog", data);
    Logger.log(
      "INFO " + (action || "") + " " + (entity || "") + " " + (id || "")
    );
  } catch (e) {
    Logger.log("LogInfo Error: " + e.message);
  }
}

function logWarn_(actor, action, entity, id, details) {
  try {
    var data = {
      DBG_WARN_ID: generateUniqueId("WARN"),
      Time_Stamp: new Date().toISOString(),
      Actor: actor || "",
      Action: action || "",
      Entity: entity || "",
      Entity_ID: id || "",
      Details:
        typeof details === "string" ? details : JSON.stringify(details || {}),
    };
    appendDebugRow("DBUG_WarnLog", data);
    Logger.log(
      "WARN " + (action || "") + " " + (entity || "") + " " + (id || "")
    );
  } catch (e) {
    Logger.log("LogWarn Error: " + e.message);
  }
}

function logError_(actor, action, entity, id, message, errorObject) {
  try {
    var data = {
      DBG_ERR_ID: generateUniqueId("ERR"),
      Time_Stamp: new Date().toISOString(),
      Actor: actor || "",
      Action: action || "",
      Entity: entity || "",
      Entity_ID: id || "",
      Message: message || "",
      Error_Object:
        typeof errorObject === "string"
          ? errorObject
          : JSON.stringify(errorObject || {}),
    };
    appendDebugRow("DBUG_ErrorLog", data);
    try {
      console.error(message);
    } catch (_) {}
    Logger.log(
      "ERROR " +
        (action || "") +
        " " +
        (entity || "") +
        " " +
        (id || "") +
        " " +
        (message || "")
    );
  } catch (e) {
    Logger.log("LogError Error: " + e.message);
  }
}

/**
 * Extract ID field name from sheet name
 */
function extractIdField(sheetName) {
  const prefixMap = {
    SYS_: "SYS",
    HRM_: "HRM",
    PRJ_: "PRJ",
    FIN_: "FIN",
    ENG_: "ENG",
  };

  for (const [prefix, short] of Object.entries(prefixMap)) {
    if (sheetName.startsWith(prefix)) {
      const namePart = sheetName.substring(prefix.length);
      if (namePart === "Users") return "USR_ID";
      if (namePart === "Roles") return "ROL_ID";
      if (namePart === "Permissions") return "PRM_ID";
      // Add more mappings as needed
      return short + "_ID";
    }
  }

  return "ID";
}

/**
 * Extract prefix from sheet name
 */
function extractPrefix(sheetName) {
  const match = sheetName.match(/^([A-Z]{3})_/);
  return match ? match[1] : "GEN";
}

/**
 * Get client IP (stubbed - would need proxied header in production)
 */
function getClientIP() {
  return "127.0.0.1"; // Placeholder - requires additional context in production
}

/**
 * Get current user
 */
function getCurrentUser() {
  return Session.getActiveUser().getEmail();
}

/**
 * Get user name by ID
 */
function getUserName(userId) {
  try {
    const data = getSheetDataAsObjects("SYS_Users");
    const user = data.find((u) => u.USR_ID === userId);
    return user ? user.USR_Name : userId;
  } catch (e) {
    return userId;
  }
}

/**
 * Verify session token
 */
function verifySessionToken(token) {
  try {
    const data = getSheetDataAsObjects("SYS_Sessions");
    const session = data.find(
      (s) => s.Auth_Token === token && s.SESS_Status === "ACTIVE"
    );
    return session ? { valid: true, session: session } : { valid: false };
  } catch (e) {
    return { valid: false };
  }
}

// ╔════════════════════════════════════════════════════════════════╗
// ║                   GOOGLE APPS SCRIPT HANDLERS                  ║
// ╚════════════════════════════════════════════════════════════════╝

/**
 * Handle HTTP POST requests from frontend
 * This is called when the frontend makes API calls
 */
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const action = payload.action;
    const params = payload.params || {};

    let result;

    switch (action) {
      case "login":
        result = doLogin(params.username, params.password);
        break;
      case "logout":
        result = doLogout(params.token);
        break;
      case "getViewData":
        result = getViewData(params.viewId);
        break;
      case "saveRecord":
        result = saveRecord(params.sheet, params.data, params.action);
        break;
      case "deleteRecord":
        result = deleteRecord(params.sheet, params.id);
        break;
      case "getBootstrap":
        result = generateBootstrap(params.userId, params.roleId);
        break;
      default:
        result = { error: "Unknown action" };
    }

    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(
      ContentService.MimeType.JSON
    );
  } catch (e) {
    Logger.log(`API Error: ${e.message}`);
    return ContentService.createTextOutput(
      JSON.stringify({ error: e.message })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle HTTP GET requests
 */
function doGet(e) {
  var t = HtmlService.createTemplateFromFile('Login');
  t.scriptUrl = ScriptApp.getService().getUrl();
  return t.evaluate().setTitle('Nijjara ERP');
}
