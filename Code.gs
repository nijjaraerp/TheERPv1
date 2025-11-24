/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * NIJJARA ERP - Code.gs (Backend)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Fresh start - simplified and working version
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

const CONFIG = {
  SESSION_TIMEOUT_MINUTES: 480,
};

/**
 * Handle HTTP GET requests - serve Login page
 */
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile("Login")
    .setTitle("Nijjara ERP")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Serve Dashboard page
 */
function getDashboard() {
  return HtmlService.createHtmlOutputFromFile("Dashboard").getContent();
}

/**
 * Handle HTTP POST requests - API endpoint
 */
function doPost(e) {
  try {
    const request = JSON.parse(e.postData.contents);
    const action = request.action;
    const params = request.params || {};

    let response;

    switch (action) {
      case "login":
        response = doLogin(params.username, params.password);
        break;
      case "getScriptUrl":
        response = { success: true, url: ScriptApp.getService().getUrl() };
        break;
      default:
        response = { success: false, message: "Unknown action: " + action };
    }

    return ContentService.createTextOutput(
      JSON.stringify(response)
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log("doPost error: " + error.toString());
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, message: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Login function
 */
function doLogin(username, password) {
  try {
    if (!username || !password) {
      return { success: false, message: "اسم المستخدم وكلمة السر مطلوبان" };
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();

    const usersSheet = ss.getSheetByName("SYS_Users");
    if (!usersSheet) {
      return { success: false, message: "يرجى تشغيل setupDatabase() أولاً" };
    }

    // Get user data (skip first 2 rows - headers)
    const data = usersSheet
      .getRange(3, 1, usersSheet.getLastRow() - 2, usersSheet.getLastColumn())
      .getValues();
    const headers = usersSheet
      .getRange(1, 1, 1, usersSheet.getLastColumn())
      .getValues()[0];

    // Find column indexes
    const usrNameIdx = headers.indexOf("USR_Name");
    const passwordIdx = headers.indexOf("Password_Hash");
    const activeIdx = headers.indexOf("USR_Is_Active");
    const usrIdIdx = headers.indexOf("USR_ID");
    const emailIdx = headers.indexOf("EMP_Email");

    // Find user
    let userRow = null;
    for (let i = 0; i < data.length; i++) {
      if (data[i][usrNameIdx] === username) {
        userRow = data[i];
        break;
      }
    }

    if (!userRow) {
      return { success: false, message: "اسم المستخدم أو كلمة السر غير صحيحة" };
    }

    // Check if active
    if (userRow[activeIdx] !== true && userRow[activeIdx] !== "TRUE") {
      return { success: false, message: "حساب المستخدم غير نشط" };
    }

    // Hash password and check
    const hashedPassword = hashPassword(password);
    if (userRow[passwordIdx] !== hashedPassword) {
      return { success: false, message: "اسم المستخدم أو كلمة السر غير صحيحة" };
    }

    // Success - create session token
    const sessionToken = Utilities.getUuid();

    // Log to DBUG_AppLog
    logInfo(
      userRow[usrIdIdx],
      "LOGIN",
      "USER",
      userRow[usrIdIdx],
      "تسجيل دخول ناجح"
    );

    return {
      success: true,
      message: "تم تسجيل الدخول بنجاح",
      token: sessionToken,
      user: {
        id: userRow[usrIdIdx],
        username: userRow[usrNameIdx],
        email: userRow[emailIdx],
      },
    };
  } catch (error) {
    Logger.log("Login error: " + error.toString());
    return { success: false, message: "حدث خطأ: " + error.toString() };
  }
}

/**
 * Hash password using SHA-256
 */
function hashPassword(password) {
  const rawHash = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    password,
    Utilities.Charset.UTF_8
  );

  let hashString = "";
  for (let i = 0; i < rawHash.length; i++) {
    const byte = rawHash[i];
    if (byte < 0) {
      hashString += ("0" + (byte + 256).toString(16)).slice(-2);
    } else {
      hashString += ("0" + byte.toString(16)).slice(-2);
    }
  }

  return hashString;
}

/**
 * Log info to DBUG_AppLog
 */
function logInfo(actor, action, entity, entityId, details) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("DBUG_AppLog");

    if (!sheet) {
      Logger.log("DBUG_AppLog not found");
      return;
    }

    const timestamp = new Date().toISOString();
    const logId = "LOG_" + timestamp.replace(/[-:T.Z]/g, "");

    sheet.appendRow([
      logId,
      timestamp,
      actor,
      action,
      entity,
      entityId,
      details,
    ]);
  } catch (error) {
    Logger.log("logInfo error: " + error.toString());
  }
}

/**
 * Get script URL for client
 */
function getScriptUrl() {
  return ScriptApp.getService().getUrl();
}
