/**
 * Nijjara ERP - Code.js
 * Google Apps Script backend for authentication, session management, and CRUD operations
 */

// Global constants
const SESSION_TIMEOUT_MINUTES = 480; // 8 hours
const MAX_LOGIN_ATTEMPTS = 3;

/**
 * Main entry point for all API calls
 * Routes requests to appropriate handlers
 */
function doPost(e) {
  try {
    const request = JSON.parse(e.postData.contents);
    const action = request.action;

    Logger.log(`API Call: ${action}`);

    switch (action) {
      case "login":
        return handleLogin(request);
      case "logout":
        return handleLogout(request);
      case "get_bootstrap":
        return handleGetBootstrap(request);
      case "get_view":
        return handleGetView(request);
      case "save_form":
        return handleSaveForm(request);
      case "get_form_data":
        return handleGetFormData(request);
      case "validate_session":
        return handleValidateSession(request);
      case "get_dashboard_data":
        return handleGetDashboardData(request);
      default:
        return createResponse(false, "Unknown action", null);
    }
  } catch (error) {
    Logger.log(`Error in doPost: ${error.toString()}`);
    return createResponse(false, "Internal server error", {
      error: error.toString(),
    });
  }
}

/**
 * Handle user login
 */
function handleLogin(request) {
  const { username, password, device_info, ip_address } = request.data;

  try {
    // Validate input
    if (!username || !password) {
      return createResponse(false, "اسم المستخدم وكلمة المرور مطلوبان", null);
    }

    // Get user data
    const userData = getUserByUsername(username);
    if (!userData) {
      logFailedLogin(username, "User not found", ip_address);
      return createResponse(false, "بيانات الدخول غير صحيحة", null);
    }

    // Check if user is active
    if (!userData.USR_Is_Active) {
      logFailedLogin(username, "User inactive", ip_address);
      return createResponse(false, "الحساب غير نشط", null);
    }

    // Check if account is locked due to failed attempts
    if (isAccountLocked(username)) {
      return createResponse(
        false,
        "الحساب مؤقتاً مقفل بسبب محاولات الدخول الفاشلة",
        null
      );
    }

    // Verify password
    const passwordHash = Utilities.computeDigest(
      Utilities.DigestAlgorithm.SHA_256,
      password
    )
      .map((b) => ("0" + (b & 0xff).toString(16)).slice(-2))
      .join("");

    if (passwordHash !== userData.Password_Hash) {
      logFailedLogin(username, "Invalid password", ip_address);
      return createResponse(false, "بيانات الدخول غير صحيحة", null);
    }

    // Clear failed login attempts on successful login
    clearFailedLoginAttempts(username);

    // Generate session token
    const sessionToken = generateSessionToken();

    // Create session record
    const sessionId = createSession(
      userData.USR_ID,
      userData.EMP_Email,
      device_info,
      ip_address,
      sessionToken
    );

    // Update last login
    updateLastLogin(userData.USR_ID);

    // Log successful login
    logAuditEvent(
      userData.USR_ID,
      "LOGIN",
      "User logged in successfully",
      "SYS_Sessions",
      sessionId,
      ip_address
    );

    // Get bootstrap data
    const bootstrapData = getBootstrapData(userData.USR_ID);

    return createResponse(true, "تم تسجيل الدخول بنجاح", {
      session_token: sessionToken,
      user: {
        id: userData.USR_ID,
        name: userData.EMP_Name_EN,
        email: userData.EMP_Email,
        role: userData.ROL_ID,
        department: userData.DEPT_Name,
      },
      bootstrap: bootstrapData,
    });
  } catch (error) {
    Logger.log(`Login error: ${error.toString()}`);
    return createResponse(false, "خطأ في تسجيل الدخول", {
      error: error.toString(),
    });
  }
}

/**
 * Handle user logout
 */
function handleLogout(request) {
  const { session_token } = request.data;

  try {
    const sessionData = validateSessionToken(session_token);
    if (sessionData) {
      // End session
      endSession(sessionData.SESS_ID);

      // Log logout
      logAuditEvent(
        sessionData.USR_ID,
        "LOGOUT",
        "User logged out",
        "SYS_Sessions",
        sessionData.SESS_ID
      );

      return createResponse(true, "تم تسجيل الخروج بنجاح", null);
    } else {
      return createResponse(false, "جلسة غير صالحة", null);
    }
  } catch (error) {
    Logger.log(`Logout error: ${error.toString()}`);
    return createResponse(false, "خطأ في تسجيل الخروج", {
      error: error.toString(),
    });
  }
}

/**
 * Get bootstrap data for authenticated user
 */
function handleGetBootstrap(request) {
  const { session_token } = request.data;

  try {
    const sessionData = validateSessionToken(session_token);
    if (!sessionData) {
      return createResponse(false, "جلسة غير صالحة", null);
    }

    const bootstrapData = getBootstrapData(sessionData.USR_ID);
    return createResponse(true, "تم تحميل البيانات الأساسية", bootstrapData);
  } catch (error) {
    Logger.log(`Get bootstrap error: ${error.toString()}`);
    return createResponse(false, "خطأ في تحميل البيانات الأساسية", {
      error: error.toString(),
    });
  }
}

/**
 * Get view data for a specific view ID
 */
function handleGetView(request) {
  const { session_token, view_id, filters, pagination } = request.data;

  try {
    const sessionData = validateSessionToken(session_token);
    if (!sessionData) {
      return createResponse(false, "جلسة غير صالحة", null);
    }

    // Check permissions
    if (!hasPermission(sessionData.USR_ID, "VIEW", view_id)) {
      return createResponse(false, "ليس لديك صلاحية لعرض هذه البيانات", null);
    }

    const viewData = getViewData(view_id, filters, pagination);
    return createResponse(true, "تم تحميل البيانات", viewData);
  } catch (error) {
    Logger.log(`Get view error: ${error.toString()}`);
    return createResponse(false, "خطأ في تحميل البيانات", {
      error: error.toString(),
    });
  }
}

/**
 * Save form data
 */
function handleSaveForm(request) {
  const { session_token, form_id, form_data, is_update } = request.data;

  try {
    const sessionData = validateSessionToken(session_token);
    if (!sessionData) {
      return createResponse(false, "جلسة غير صالحة", null);
    }

    // Check permissions
    const permission = is_update ? "UPDATE" : "CREATE";
    if (!hasPermission(sessionData.USR_ID, permission, form_id)) {
      return createResponse(false, "ليس لديك صلاحية لحفظ هذه البيانات", null);
    }

    const result = saveFormData(
      form_id,
      form_data,
      sessionData.USR_ID,
      is_update
    );

    if (result.success) {
      // Log audit event
      const action = is_update ? "UPDATE" : "CREATE";
      logAuditEvent(
        sessionData.USR_ID,
        action,
        `Saved form data for ${form_id}`,
        result.target_sheet,
        result.record_id
      );
    }

    return createResponse(result.success, result.message, result.data);
  } catch (error) {
    Logger.log(`Save form error: ${error.toString()}`);
    return createResponse(false, "خطأ في حفظ البيانات", {
      error: error.toString(),
    });
  }
}

/**
 * Get form data for editing
 */
function handleGetFormData(request) {
  const { session_token, form_id, record_id } = request.data;

  try {
    const sessionData = validateSessionToken(session_token);
    if (!sessionData) {
      return createResponse(false, "جلسة غير صالحة", null);
    }

    // Check permissions
    if (!hasPermission(sessionData.USR_ID, "READ", form_id)) {
      return createResponse(false, "ليس لديك صلاحية لعرض هذه البيانات", null);
    }

    const formData = getFormDataForEdit(form_id, record_id);
    return createResponse(true, "تم تحميل بيانات النموذج", formData);
  } catch (error) {
    Logger.log(`Get form data error: ${error.toString()}`);
    return createResponse(false, "خطأ في تحميل بيانات النموذج", {
      error: error.toString(),
    });
  }
}

/**
 * Validate session token
 */
function handleValidateSession(request) {
  const { session_token } = request.data;

  try {
    const sessionData = validateSessionToken(session_token);
    if (sessionData) {
      // Update session last seen
      updateSessionLastSeen(sessionData.SESS_ID);

      return createResponse(true, "الجلسة صالحة", {
        user: {
          id: sessionData.USR_ID,
          email: sessionData.EMP_Email,
        },
      });
    } else {
      return createResponse(false, "الجلسة غير صالحة", null);
    }
  } catch (error) {
    Logger.log(`Validate session error: ${error.toString()}`);
    return createResponse(false, "خطأ في التحقق من الجلسة", {
      error: error.toString(),
    });
  }
}

/**
 * Get dashboard data
 */
function handleGetDashboardData(request) {
  const { session_token, module } = request.data;

  try {
    const sessionData = validateSessionToken(session_token);
    if (!sessionData) {
      return createResponse(false, "جلسة غير صالحة", null);
    }

    const dashboardData = getDashboardData(module, sessionData.USR_ID);
    return createResponse(true, "تم تحميل بيانات لوحة التحكم", dashboardData);
  } catch (error) {
    Logger.log(`Get dashboard data error: ${error.toString()}`);
    return createResponse(false, "خطأ في تحميل بيانات لوحة التحكم", {
      error: error.toString(),
    });
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Create standardized API response
 */
function createResponse(success, message, data) {
  return ContentService.createTextOutput(
    JSON.stringify({
      success: success,
      message: message,
      data: data,
      timestamp: new Date().toISOString(),
    })
  ).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Generate a secure session token
 */
function generateSessionToken() {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token + "_" + new Date().getTime();
}

/**
 * Get user data by username
 */
function getUserByUsername(username) {
  const sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("SYS_Users");
  if (!sheet) return null;

  const data = sheet.getDataRange().getValues();

  // Find user (skip header rows)
  for (let i = 2; i < data.length; i++) {
    if (data[i][1] === username) {
      // USR_Name is in column B (index 1)
      return {
        USR_ID: data[i][0],
        EMP_Name_EN: data[i][1],
        USR_Name: data[i][2],
        EMP_Email: data[i][3],
        Job_Title: data[i][4],
        DEPT_Name: data[i][5],
        ROL_ID: data[i][6],
        USR_Is_Active: data[i][7],
        Password_Hash: data[i][8],
        Last_Login: data[i][9],
      };
    }
  }

  return null;
}

/**
 * Create a new session record
 */
function createSession(userId, email, deviceInfo, ipAddress, token) {
  const sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("SYS_Sessions");
  if (!sheet) throw new Error("SYS_Sessions sheet not found");

  const sessionId = "SESS_" + new Date().getTime();
  const now = new Date();

  const rowData = [
    sessionId,
    userId,
    email,
    "",
    "WEB",
    "ACTIVE",
    deviceInfo || "",
    ipAddress || "",
    token,
    now,
    null,
    now,
    "SYSTEM",
    now,
    null,
    null,
    JSON.stringify({ source: "web_login" }),
  ];

  sheet.appendRow(rowData);
  return sessionId;
}

/**
 * Validate session token
 */
function validateSessionToken(token) {
  const sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("SYS_Sessions");
  if (!sheet) return null;

  const data = sheet.getDataRange().getValues();

  for (let i = 2; i < data.length; i++) {
    if (data[i][8] === token && data[i][5] === "ACTIVE") {
      // Auth_Token and SESS_Status
      const sessionStart = new Date(data[i][9]); // SESS_Start_At
      const now = new Date();

      // Check if session is expired
      const sessionAge = (now - sessionStart) / (1000 * 60); // minutes
      if (sessionAge > SESSION_TIMEOUT_MINUTES) {
        endSession(data[i][0]); // End expired session
        return null;
      }

      return {
        SESS_ID: data[i][0],
        USR_ID: data[i][1],
        EMP_Email: data[i][2],
        SESS_Status: data[i][5],
        SESS_Start_At: data[i][9],
      };
    }
  }

  return null;
}

/**
 * End a session
 */
function endSession(sessionId) {
  const sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("SYS_Sessions");
  if (!sheet) return;

  const data = sheet.getDataRange().getValues();

  for (let i = 2; i < data.length; i++) {
    if (data[i][0] === sessionId) {
      sheet.getRange(i + 1, 6).setValue("ENDED"); // SESS_Status
      sheet.getRange(i + 1, 10).setValue(new Date()); // SESS_End_At
      break;
    }
  }
}

/**
 * Update session last seen timestamp
 */
function updateSessionLastSeen(sessionId) {
  const sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("SYS_Sessions");
  if (!sheet) return;

  const data = sheet.getDataRange().getValues();

  for (let i = 2; i < data.length; i++) {
    if (data[i][0] === sessionId) {
      sheet.getRange(i + 1, 14).setValue(new Date()); // SESS_Last_Seen
      break;
    }
  }
}

/**
 * Update user's last login timestamp
 */
function updateLastLogin(userId) {
  const sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("SYS_Users");
  if (!sheet) return;

  const data = sheet.getDataRange().getValues();

  for (let i = 2; i < data.length; i++) {
    if (data[i][0] === userId) {
      sheet.getRange(i + 1, 10).setValue(new Date()); // Last_Login
      break;
    }
  }
}

/**
 * Log audit event
 */
function logAuditEvent(userId, action, details, entity, entityId, ipAddress) {
  const sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("SYS_Audit_Log");
  if (!sheet) return;

  const auditId = "AUD_" + new Date().getTime();

  const rowData = [
    auditId,
    new Date(),
    userId,
    "",
    action,
    details,
    entity,
    entityId,
    "WEB",
    "",
    "",
    ipAddress || "",
  ];

  sheet.appendRow(rowData);
}

/**
 * Check if account is locked due to failed login attempts
 */
function isAccountLocked(username) {
  // This would typically check a failed login attempts table
  // For now, we'll implement a simple check
  const cache = CacheService.getScriptCache();
  const key = `failed_attempts_${username}`;
  const attempts = parseInt(cache.get(key) || "0");

  return attempts >= MAX_LOGIN_ATTEMPTS;
}

/**
 * Log failed login attempt
 */
function logFailedLogin(username, reason, ipAddress) {
  const cache = CacheService.getScriptCache();
  const key = `failed_attempts_${username}`;
  const attempts = parseInt(cache.get(key) || "0") + 1;

  cache.put(key, attempts.toString(), 3600); // Expire in 1 hour

  logAuditEvent(
    "",
    "FAILED_LOGIN",
    `Failed login for ${username}: ${reason}`,
    "SYS_Users",
    username,
    ipAddress
  );
}

/**
 * Clear failed login attempts after successful login
 */
function clearFailedLoginAttempts(username) {
  const cache = CacheService.getScriptCache();
  const key = `failed_attempts_${username}`;
  cache.remove(key);
}

/**
 * Get bootstrap data containing all ENG_ configurations
 */
function getBootstrapData(userId) {
  // Get user role and permissions
  const userRole = getUserRole(userId);
  const permissions = getUserPermissions(userId);

  return {
    user: {
      id: userId,
      role: userRole,
    },
    permissions: permissions,
    forms: getAccessibleForms(userRole),
    views: getAccessibleViews(userRole),
    buttons: getAccessibleButtons(userRole),
    dropdowns: getAccessibleDropdowns(userRole),
    settings: getSystemSettings(),
    navigation: getNavigationMenu(userRole),
  };
}

/**
 * Get user's role
 */
function getUserRole(userId) {
  const userData = getUserByUsername(""); // We need to get user by ID, not username
  // This is a simplified implementation
  return "HR_MANAGER"; // Default for demo
}

/**
 * Get user permissions
 */
function getUserPermissions(userId) {
  // This would check SYS_Role_Permissions table
  // For now, return default permissions
  return {
    can_create: true,
    can_read: true,
    can_update: true,
    can_delete: false,
  };
}

/**
 * Get accessible forms based on user role
 */
function getAccessibleForms(userRole) {
  const sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("ENG_Forms");
  if (!sheet) return [];

  const data = sheet.getDataRange().getValues();
  const forms = [];

  for (let i = 2; i < data.length; i++) {
    const form = {
      FORM_ID: data[i][0],
      Form_Label: data[i][1],
      Tab_ID: data[i][2],
      Tab_Label: data[i][3],
      Field_ID: data[i][4],
      Field_Label: data[i][5],
      Field_Type: data[i][6],
      Field_Can_Edit: data[i][7],
      Source_Sheet: data[i][8],
      Source_Columns: data[i][9],
      Is_Mandatory: data[i][10],
      Default_Value: data[i][11],
      DD_ID: data[i][12],
      Target_Sheet: data[i][13],
      Target_Column: data[i][14],
      ROL_ID: data[i][15],
      Is_Visible: data[i][16],
      But_ID: data[i][17],
    };

    // Check if user role has access to this form
    if (!form.ROL_ID || form.ROL_ID === userRole || userRole === "SYS_ADMIN") {
      forms.push(form);
    }
  }

  return forms;
}

/**
 * Get accessible views based on user role
 */
function getAccessibleViews(userRole) {
  const sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("ENG_Views");
  if (!sheet) return [];

  const data = sheet.getDataRange().getValues();
  const views = [];

  for (let i = 2; i < data.length; i++) {
    const view = {
      VIEW_ID: data[i][0],
      View_Title: data[i][1],
      Source_Sheet: data[i][2],
      Source_Columns: data[i][3],
    };

    // For now, all authenticated users can see all views
    // In production, this would check permissions
    views.push(view);
  }

  return views;
}

/**
 * Get accessible buttons based on user role
 */
function getAccessibleButtons(userRole) {
  const sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("ENG_Buttons");
  if (!sheet) return [];

  const data = sheet.getDataRange().getValues();
  const buttons = [];

  for (let i = 2; i < data.length; i++) {
    buttons.push({
      BTN_ID: data[i][0],
      BTN_Label: data[i][1],
      BTN_Type: data[i][2],
      BTN_Description: data[i][3],
    });
  }

  return buttons;
}

/**
 * Get accessible dropdowns
 */
function getAccessibleDropdowns(userRole) {
  const sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("ENG_Dropdowns");
  if (!sheet) return [];

  const data = sheet.getDataRange().getValues();
  const dropdowns = [];

  for (let i = 2; i < data.length; i++) {
    if (data[i][3]) {
      // DD_Is_Active
      dropdowns.push({
        DD_ID: data[i][0],
        DD_EN: data[i][1],
        DD_AR: data[i][2],
        DD_Is_Active: data[i][3],
        DD_Sort_Order: data[i][4],
      });
    }
  }

  return dropdowns;
}

/**
 * Get system settings
 */
function getSystemSettings() {
  const sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("ENG_Settings");
  if (!sheet) return {};

  const data = sheet.getDataRange().getValues();
  const settings = {};

  for (let i = 2; i < data.length; i++) {
    settings[data[i][0]] = data[i][1]; // Setting_Key -> Setting_Value
  }

  return settings;
}

/**
 * Get navigation menu based on user role
 */
function getNavigationMenu(userRole) {
  const baseMenu = [
    {
      id: "dashboard",
      label: "لوحة التحكم",
      icon: "dashboard",
      children: [],
    },
  ];

  // Add modules based on role
  if (userRole === "SYS_ADMIN" || userRole === "HR_MANAGER") {
    baseMenu.push({
      id: "hr",
      label: "الموارد البشرية",
      icon: "users",
      children: [
        { id: "hr_employees", label: "الموظفين", view: "HRM_EMP_LIST" },
        { id: "hr_departments", label: "الأقسام", view: "HRM_DEPT_LIST" },
        { id: "hr_attendance", label: "الحضور", view: "HRM_ATT_LIST" },
      ],
    });
  }

  if (userRole === "SYS_ADMIN" || userRole === "PROJECT_MANAGER") {
    baseMenu.push({
      id: "projects",
      label: "المشاريع",
      icon: "folder",
      children: [
        { id: "prj_main", label: "المشاريع", view: "PRJ_MAIN_LIST" },
        { id: "prj_clients", label: "العملاء", view: "PRJ_CLIENTS_LIST" },
        { id: "prj_tasks", label: "المهام", view: "PRJ_TASKS_LIST" },
      ],
    });
  }

  if (userRole === "SYS_ADMIN" || userRole === "FINANCE_MANAGER") {
    baseMenu.push({
      id: "finance",
      label: "المالية",
      icon: "dollar-sign",
      children: [
        { id: "fin_expenses", label: "المصروفات", view: "FIN_EXPENSES_LIST" },
        { id: "fin_revenue", label: "الإيرادات", view: "FIN_REVENUE_LIST" },
        { id: "fin_payroll", label: "المرتبات", view: "FIN_PAYROLL_LIST" },
      ],
    });
  }

  if (userRole === "SYS_ADMIN") {
    baseMenu.push({
      id: "system",
      label: "النظام",
      icon: "settings",
      children: [
        { id: "sys_users", label: "المستخدمين", view: "SYS_USERS_LIST" },
        { id: "sys_roles", label: "الأدوار", view: "SYS_ROLES_LIST" },
        { id: "sys_audit", label: "سجل العمليات", view: "SYS_AUDIT_LIST" },
      ],
    });
  }

  return baseMenu;
}

/**
 * Check if user has permission for an action
 */
function hasPermission(userId, action, resource) {
  // This would check SYS_Role_Permissions table
  // For now, allow all actions for authenticated users
  return true;
}

/**
 * Get view data
 */
function getViewData(viewId, filters, pagination) {
  // This would query the appropriate sheet based on view configuration
  // For now, return sample data for HRM_EMP_LIST
  if (viewId === "HRM_EMP_LIST") {
    const sheet =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName("HRM_Employees");
    if (!sheet) return { records: [], total: 0 };

    const data = sheet.getDataRange().getValues();
    const records = [];

    // Skip headers and process data rows
    for (let i = 2; i < data.length; i++) {
      if (data[i][0]) {
        // Check if EMP_ID exists
        records.push({
          EMP_ID: data[i][0],
          EMP_Name_AR: data[i][2], // Arabic name
          Job_Title: data[i][13],
          DEPT_Name: data[i][15],
          EMP_Status: data[i][18],
        });
      }
    }

    return {
      records: records,
      total: records.length,
      page: pagination?.page || 1,
      pageSize: pagination?.pageSize || 50,
    };
  }

  return { records: [], total: 0 };
}

/**
 * Save form data
 */
function saveFormData(formId, formData, userId, isUpdate) {
  try {
    // Determine target sheet based on form ID
    let targetSheet = "";
    if (formId.startsWith("HRM_EMP")) {
      targetSheet = "HRM_Employees";
    } else if (formId.startsWith("HRM_DEPT")) {
      targetSheet = "HRM_Departments";
    } else {
      return { success: false, message: "نموذج غير معروف", data: null };
    }

    const sheet =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName(targetSheet);
    if (!sheet) {
      return { success: false, message: "جدول البيانات غير موجود", data: null };
    }

    if (isUpdate) {
      // Find and update existing record
      const recordId = formData.EMP_ID || formData.DEPT_ID;
      const result = updateRecord(sheet, recordId, formData, userId);
      return result;
    } else {
      // Create new record
      const result = createNewRecord(sheet, formData, userId);
      return result;
    }
  } catch (error) {
    Logger.log(`Save form data error: ${error.toString()}`);
    return { success: false, message: "خطأ في حفظ البيانات", data: null };
  }
}

/**
 * Create new record
 */
function createNewRecord(sheet, formData, userId) {
  // Generate new ID
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const idColumnIndex = headers.findIndex((h) => h.includes("_ID"));

  if (idColumnIndex === -1) {
    return { success: false, message: "تعذر إنشاء معرف جديد", data: null };
  }

  // Get last ID and increment
  const lastRow = sheet.getLastRow();
  let newId = 1;

  if (lastRow > 2) {
    const lastId = sheet.getRange(lastRow, idColumnIndex + 1).getValue();
    if (typeof lastId === "number") {
      newId = lastId + 1;
    }
  }

  // Prepare row data
  const rowData = headers.map((header) => {
    if (header.includes("_ID")) {
      return newId;
    } else if (header.includes("Crt_At")) {
      return new Date();
    } else if (header.includes("Crt_By")) {
      return userId;
    } else if (header.includes("Upd_At")) {
      return new Date();
    } else if (header.includes("Upd_By")) {
      return userId;
    } else {
      return formData[header] || "";
    }
  });

  sheet.appendRow(rowData);

  return {
    success: true,
    message: "تم حفظ البيانات بنجاح",
    data: { record_id: newId },
    target_sheet: sheet.getName(),
    record_id: newId,
  };
}

/**
 * Update existing record
 */
function updateRecord(sheet, recordId, formData, userId) {
  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  // Find the record
  for (let i = 2; i < data.length; i++) {
    if (data[i][0] == recordId) {
      // Assuming ID is in first column
      // Update the row
      const rowIndex = i + 1;
      const idColumnIndex = headers.findIndex((h) => h.includes("_ID"));

      headers.forEach((header, colIndex) => {
        if (!header.includes("_ID") && !header.includes("Crt_")) {
          if (header.includes("Upd_At")) {
            sheet.getRange(rowIndex, colIndex + 1).setValue(new Date());
          } else if (header.includes("Upd_By")) {
            sheet.getRange(rowIndex, colIndex + 1).setValue(userId);
          } else if (formData[header] !== undefined) {
            sheet.getRange(rowIndex, colIndex + 1).setValue(formData[header]);
          }
        }
      });

      return {
        success: true,
        message: "تم تحديث البيانات بنجاح",
        data: { record_id: recordId },
        target_sheet: sheet.getName(),
        record_id: recordId,
      };
    }
  }

  return { success: false, message: "السجل غير موجود", data: null };
}

/**
 * Get form data for editing
 */
function getFormDataForEdit(formId, recordId) {
  // This would query the appropriate sheet and return the record data
  // For now, return empty object
  return {};
}

/**
 * Get dashboard data
 */
function getDashboardData(module, userId) {
  // This would aggregate data for dashboard metrics
  // For now, return sample data
  return {
    metrics: [
      { label: "إجمالي الموظفين", value: 25, change: "+5%" },
      { label: "المشاريع النشطة", value: 8, change: "+2" },
      { label: "إجمالي الإيرادات", value: "2,450,000 ج.م", change: "+12%" },
    ],
    recent_activity: [
      { action: "إضافة موظف جديد", user: "أحمد محمد", time: "منذ 5 دقائق" },
      { action: "تحديث مشروع", user: "فاطمة علي", time: "منذ 15 دقيقة" },
      { action: "دفع فاتورة", user: "محمد سالم", time: "منذ ساعة" },
    ],
  };
}
