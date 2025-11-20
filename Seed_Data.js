/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * NIJJARA ERP - Seed_Data.js
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * Purpose:
 *   - Single source of truth for initial database data
 *   - Populates ENG_ sheets with system configuration
 *   - Creates default system roles and permissions
 *   - Seeds demo data for testing
 * 
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

const SHEET_NAME = "TheERPv1";

function getSpreadsheet() {
  var name = SHEET_NAME;
  var ss;
  try {
    ss = SpreadsheetApp.getActiveSpreadsheet();
    if (ss && (!name || ss.getName() === name)) {
      return ss;
    }
  } catch (e) {}
  var files = DriveApp.getFilesByName(name);
  if (!files.hasNext()) {
    throw new Error("Spreadsheet not found: " + name);
  }
  var file = files.next();
  if (files.hasNext()) {
    Logger.log("Multiple spreadsheets found with name " + name + ", using first");
  }
  return SpreadsheetApp.openById(file.getId());
}

// ╔════════════════════════════════════════════════════════════════╗
// ║                  ENG_DROPDOWNS SEED DATA                       ║
// ╚════════════════════════════════════════════════════════════════╝

const DROPDOWN_SEED_DATA = [
  // Employee Status
  { DD_ID: "EMP_STATUS", DD_EN: "Active", DD_AR: "نشط", DD_Is_Active: true, DD_Sort_Order: 1 },
  { DD_ID: "EMP_STATUS", DD_EN: "On Leave", DD_AR: "في إجازة", DD_Is_Active: true, DD_Sort_Order: 2 },
  { DD_ID: "EMP_STATUS", DD_EN: "Inactive", DD_AR: "غير نشط", DD_Is_Active: true, DD_Sort_Order: 3 },
  { DD_ID: "EMP_STATUS", DD_EN: "Terminated", DD_AR: "منسحب", DD_Is_Active: true, DD_Sort_Order: 4 },

  // Gender
  { DD_ID: "GENDER", DD_EN: "Male", DD_AR: "ذكر", DD_Is_Active: true, DD_Sort_Order: 1 },
  { DD_ID: "GENDER", DD_EN: "Female", DD_AR: "أنثى", DD_Is_Active: true, DD_Sort_Order: 2 },

  // Marital Status
  { DD_ID: "MARITAL_STATUS", DD_EN: "Single", DD_AR: "أعزب", DD_Is_Active: true, DD_Sort_Order: 1 },
  { DD_ID: "MARITAL_STATUS", DD_EN: "Married", DD_AR: "متزوج", DD_Is_Active: true, DD_Sort_Order: 2 },
  { DD_ID: "MARITAL_STATUS", DD_EN: "Divorced", DD_AR: "مطلق", DD_Is_Active: true, DD_Sort_Order: 3 },
  { DD_ID: "MARITAL_STATUS", DD_EN: "Widowed", DD_AR: "أرمل", DD_Is_Active: true, DD_Sort_Order: 4 },

  // Military Status
  { DD_ID: "MILITARY_STATUS", DD_EN: "Completed", DD_AR: "مكمل", DD_Is_Active: true, DD_Sort_Order: 1 },
  { DD_ID: "MILITARY_STATUS", DD_EN: "Exempted", DD_AR: "معفى", DD_Is_Active: true, DD_Sort_Order: 2 },
  { DD_ID: "MILITARY_STATUS", DD_EN: "Not Required", DD_AR: "غير مطلوب", DD_Is_Active: true, DD_Sort_Order: 3 },

  // Leave Types
  { DD_ID: "LEAVE_TYPE", DD_EN: "Annual", DD_AR: "سنوية", DD_Is_Active: true, DD_Sort_Order: 1 },
  { DD_ID: "LEAVE_TYPE", DD_EN: "Sick", DD_AR: "مرضية", DD_Is_Active: true, DD_Sort_Order: 2 },
  { DD_ID: "LEAVE_TYPE", DD_EN: "Emergency", DD_AR: "طارئة", DD_Is_Active: true, DD_Sort_Order: 3 },
  { DD_ID: "LEAVE_TYPE", DD_EN: "Unpaid", DD_AR: "بدون راتب", DD_Is_Active: true, DD_Sort_Order: 4 },

  // Leave Status
  { DD_ID: "LEAVE_STATUS", DD_EN: "Pending", DD_AR: "قيد الانتظار", DD_Is_Active: true, DD_Sort_Order: 1 },
  { DD_ID: "LEAVE_STATUS", DD_EN: "Approved", DD_AR: "موافق عليه", DD_Is_Active: true, DD_Sort_Order: 2 },
  { DD_ID: "LEAVE_STATUS", DD_EN: "Rejected", DD_AR: "مرفوض", DD_Is_Active: true, DD_Sort_Order: 3 },
  { DD_ID: "LEAVE_STATUS", DD_EN: "Cancelled", DD_AR: "ملغى", DD_Is_Active: true, DD_Sort_Order: 4 },

  // Project Status
  { DD_ID: "PROJECT_STATUS", DD_EN: "Planning", DD_AR: "التخطيط", DD_Is_Active: true, DD_Sort_Order: 1 },
  { DD_ID: "PROJECT_STATUS", DD_EN: "In Progress", DD_AR: "قيد التنفيذ", DD_Is_Active: true, DD_Sort_Order: 2 },
  { DD_ID: "PROJECT_STATUS", DD_EN: "On Hold", DD_AR: "موقوف", DD_Is_Active: true, DD_Sort_Order: 3 },
  { DD_ID: "PROJECT_STATUS", DD_EN: "Completed", DD_AR: "مكتمل", DD_Is_Active: true, DD_Sort_Order: 4 },
  { DD_ID: "PROJECT_STATUS", DD_EN: "Cancelled", DD_AR: "ملغى", DD_Is_Active: true, DD_Sort_Order: 5 },

  // Task Priority
  { DD_ID: "TASK_PRIORITY", DD_EN: "Low", DD_AR: "منخفضة", DD_Is_Active: true, DD_Sort_Order: 1 },
  { DD_ID: "TASK_PRIORITY", DD_EN: "Medium", DD_AR: "متوسطة", DD_Is_Active: true, DD_Sort_Order: 2 },
  { DD_ID: "TASK_PRIORITY", DD_EN: "High", DD_AR: "عالية", DD_Is_Active: true, DD_Sort_Order: 3 },
  { DD_ID: "TASK_PRIORITY", DD_EN: "Critical", DD_AR: "حرجة", DD_Is_Active: true, DD_Sort_Order: 4 },

  // Task Status
  { DD_ID: "TASK_STATUS", DD_EN: "Not Started", DD_AR: "لم تبدأ", DD_Is_Active: true, DD_Sort_Order: 1 },
  { DD_ID: "TASK_STATUS", DD_EN: "In Progress", DD_AR: "قيد التنفيذ", DD_Is_Active: true, DD_Sort_Order: 2 },
  { DD_ID: "TASK_STATUS", DD_EN: "In Review", DD_AR: "تحت المراجعة", DD_Is_Active: true, DD_Sort_Order: 3 },
  { DD_ID: "TASK_STATUS", DD_EN: "Completed", DD_AR: "مكتملة", DD_Is_Active: true, DD_Sort_Order: 4 },

  // Payment Status
  { DD_ID: "PAYMENT_STATUS", DD_EN: "Pending", DD_AR: "معلق", DD_Is_Active: true, DD_Sort_Order: 1 },
  { DD_ID: "PAYMENT_STATUS", DD_EN: "Partial", DD_AR: "جزئي", DD_Is_Active: true, DD_Sort_Order: 2 },
  { DD_ID: "PAYMENT_STATUS", DD_EN: "Paid", DD_AR: "مدفوع", DD_Is_Active: true, DD_Sort_Order: 3 },
  { DD_ID: "PAYMENT_STATUS", DD_EN: "Overdue", DD_AR: "متأخر", DD_Is_Active: true, DD_Sort_Order: 4 },

  // Payment Method
  { DD_ID: "PAYMENT_METHOD", DD_EN: "Cash", DD_AR: "نقد", DD_Is_Active: true, DD_Sort_Order: 1 },
  { DD_ID: "PAYMENT_METHOD", DD_EN: "Check", DD_AR: "شيك", DD_Is_Active: true, DD_Sort_Order: 2 },
  { DD_ID: "PAYMENT_METHOD", DD_EN: "Bank Transfer", DD_AR: "تحويل بنكي", DD_Is_Active: true, DD_Sort_Order: 3 },
  { DD_ID: "PAYMENT_METHOD", DD_EN: "Card", DD_AR: "بطاقة", DD_Is_Active: true, DD_Sort_Order: 4 },

  // Employment Type
  { DD_ID: "EMPLOYMENT_TYPE", DD_EN: "Full Time", DD_AR: "دوام كامل", DD_Is_Active: true, DD_Sort_Order: 1 },
  { DD_ID: "EMPLOYMENT_TYPE", DD_EN: "Part Time", DD_AR: "دوام جزئي", DD_Is_Active: true, DD_Sort_Order: 2 },
  { DD_ID: "EMPLOYMENT_TYPE", DD_EN: "Contract", DD_AR: "عقد", DD_Is_Active: true, DD_Sort_Order: 3 },
  { DD_ID: "EMPLOYMENT_TYPE", DD_EN: "Temporary", DD_AR: "مؤقت", DD_Is_Active: true, DD_Sort_Order: 4 }
];

// ╔════════════════════════════════════════════════════════════════╗
// ║                  SYSTEM ROLES SEED DATA                        ║
// ╚════════════════════════════════════════════════════════════════╝

const ROLES_SEED_DATA = [
  {
    ROL_ID: "ROLE_ADMIN",
    ROL_Title: "System Administrator",
    ROL_Notes: "Full system access",
    ROL_Is_System: true
  },
  {
    ROL_ID: "ROLE_HR_MANAGER",
    ROL_Title: "HR Manager",
    ROL_Notes: "Human Resources management",
    ROL_Is_System: true
  },
  {
    ROL_ID: "ROLE_HR_OFFICER",
    ROL_Title: "HR Officer",
    ROL_Notes: "HR data entry and maintenance",
    ROL_Is_System: true
  },
  {
    ROL_ID: "ROLE_FIN_MANAGER",
    ROL_Title: "Finance Manager",
    ROL_Notes: "Finance module access",
    ROL_Is_System: true
  },
  {
    ROL_ID: "ROLE_FIN_OFFICER",
    ROL_Title: "Finance Officer",
    ROL_Notes: "Finance data entry",
    ROL_Is_System: true
  },
  {
    ROL_ID: "ROLE_PRJ_MANAGER",
    ROL_Title: "Project Manager",
    ROL_Notes: "Project management",
    ROL_Is_System: true
  },
  {
    ROL_ID: "ROLE_PRJ_TEAM",
    ROL_Title: "Project Team Member",
    ROL_Notes: "Project execution",
    ROL_Is_System: true
  },
  {
    ROL_ID: "ROLE_EMPLOYEE",
    ROL_Title: "Employee",
    ROL_Notes: "Standard employee access",
    ROL_Is_System: true
  }
];

// ╔════════════════════════════════════════════════════════════════╗
// ║               PERMISSIONS SEED DATA                            ║
// ╚════════════════════════════════════════════════════════════════╝

const PERMISSIONS_SEED_DATA = [
  // HRM Permissions
  { PRM_ID: "HRM_VIEW_EMPLOYEES", PRM_Name: "View Employees", PRM_Catg: "HRM", PRM_Notes: "Can view employee list" },
  { PRM_ID: "HRM_CREATE_EMPLOYEE", PRM_Name: "Create Employee", PRM_Catg: "HRM", PRM_Notes: "Can create new employees" },
  { PRM_ID: "HRM_EDIT_EMPLOYEE", PRM_Name: "Edit Employee", PRM_Catg: "HRM", PRM_Notes: "Can edit employee data" },
  { PRM_ID: "HRM_DELETE_EMPLOYEE", PRM_Name: "Delete Employee", PRM_Catg: "HRM", PRM_Notes: "Can delete employees" },
  { PRM_ID: "HRM_VIEW_ATTENDANCE", PRM_Name: "View Attendance", PRM_Catg: "HRM", PRM_Notes: "Can view attendance" },
  { PRM_ID: "HRM_MANAGE_LEAVE", PRM_Name: "Manage Leave", PRM_Catg: "HRM", PRM_Notes: "Can approve/reject leave" },
  { PRM_ID: "HRM_VIEW_PAYROLL", PRM_Name: "View Payroll", PRM_Catg: "HRM", PRM_Notes: "Can view payroll data" },

  // Finance Permissions
  { PRM_ID: "FIN_VIEW_INVOICES", PRM_Name: "View Invoices", PRM_Catg: "FIN", PRM_Notes: "Can view invoices" },
  { PRM_ID: "FIN_CREATE_INVOICE", PRM_Name: "Create Invoice", PRM_Catg: "FIN", PRM_Notes: "Can create invoices" },
  { PRM_ID: "FIN_APPROVE_INVOICE", PRM_Name: "Approve Invoice", PRM_Catg: "FIN", PRM_Notes: "Can approve invoices" },
  { PRM_ID: "FIN_VIEW_EXPENSES", PRM_Name: "View Expenses", PRM_Catg: "FIN", PRM_Notes: "Can view expenses" },
  { PRM_ID: "FIN_CREATE_EXPENSE", PRM_Name: "Create Expense", PRM_Catg: "FIN", PRM_Notes: "Can create expenses" },
  { PRM_ID: "FIN_VIEW_REPORTS", PRM_Name: "View Reports", PRM_Catg: "FIN", PRM_Notes: "Can view financial reports" },

  // Project Permissions
  { PRM_ID: "PRJ_VIEW_PROJECTS", PRM_Name: "View Projects", PRM_Catg: "PRJ", PRM_Notes: "Can view projects" },
  { PRM_ID: "PRJ_CREATE_PROJECT", PRM_Name: "Create Project", PRM_Catg: "PRJ", PRM_Notes: "Can create projects" },
  { PRM_ID: "PRJ_EDIT_PROJECT", PRM_Name: "Edit Project", PRM_Catg: "PRJ", PRM_Notes: "Can edit projects" },
  { PRM_ID: "PRJ_MANAGE_TASKS", PRM_Name: "Manage Tasks", PRM_Catg: "PRJ", PRM_Notes: "Can manage project tasks" },
  { PRM_ID: "PRJ_VIEW_TASKS", PRM_Name: "View Tasks", PRM_Catg: "PRJ", PRM_Notes: "Can view tasks" },

  // System Permissions
  { PRM_ID: "SYS_MANAGE_USERS", PRM_Name: "Manage Users", PRM_Catg: "SYS", PRM_Notes: "Can create/edit users" },
  { PRM_ID: "SYS_MANAGE_ROLES", PRM_Name: "Manage Roles", PRM_Catg: "SYS", PRM_Notes: "Can manage roles" },
  { PRM_ID: "SYS_VIEW_AUDIT", PRM_Name: "View Audit Log", PRM_Catg: "SYS", PRM_Notes: "Can view audit logs" },
  { PRM_ID: "SYS_MANAGE_SETTINGS", PRM_Name: "Manage Settings", PRM_Catg: "SYS", PRM_Notes: "Can manage system settings" }
];

// ╔════════════════════════════════════════════════════════════════╗
// ║             ROLE PERMISSIONS MAPPING SEED DATA                 ║
// ╚════════════════════════════════════════════════════════════════╝

const ROLE_PERMISSIONS_SEED_DATA = [
  // Admin role - all permissions
  ...PERMISSIONS_SEED_DATA.map(p => ({
    ROL_ID: "ROLE_ADMIN",
    PRM_ID: p.PRM_ID,
    SRP_Scope: "ALL",
    SRP_Is_Allowed: true,
    SRP_Constraints: ""
  })),

  // HR Manager permissions
  { ROL_ID: "ROLE_HR_MANAGER", PRM_ID: "HRM_VIEW_EMPLOYEES", SRP_Scope: "ALL", SRP_Is_Allowed: true, SRP_Constraints: "" },
  { ROL_ID: "ROLE_HR_MANAGER", PRM_ID: "HRM_CREATE_EMPLOYEE", SRP_Scope: "ALL", SRP_Is_Allowed: true, SRP_Constraints: "" },
  { ROL_ID: "ROLE_HR_MANAGER", PRM_ID: "HRM_EDIT_EMPLOYEE", SRP_Scope: "ALL", SRP_Is_Allowed: true, SRP_Constraints: "" },
  { ROL_ID: "ROLE_HR_MANAGER", PRM_ID: "HRM_VIEW_ATTENDANCE", SRP_Scope: "ALL", SRP_Is_Allowed: true, SRP_Constraints: "" },
  { ROL_ID: "ROLE_HR_MANAGER", PRM_ID: "HRM_MANAGE_LEAVE", SRP_Scope: "ALL", SRP_Is_Allowed: true, SRP_Constraints: "" },
  { ROL_ID: "ROLE_HR_MANAGER", PRM_ID: "HRM_VIEW_PAYROLL", SRP_Scope: "ALL", SRP_Is_Allowed: true, SRP_Constraints: "" },

  // HR Officer permissions
  { ROL_ID: "ROLE_HR_OFFICER", PRM_ID: "HRM_VIEW_EMPLOYEES", SRP_Scope: "ALL", SRP_Is_Allowed: true, SRP_Constraints: "" },
  { ROL_ID: "ROLE_HR_OFFICER", PRM_ID: "HRM_CREATE_EMPLOYEE", SRP_Scope: "ALL", SRP_Is_Allowed: true, SRP_Constraints: "" },
  { ROL_ID: "ROLE_HR_OFFICER", PRM_ID: "HRM_EDIT_EMPLOYEE", SRP_Scope: "OWN", SRP_Is_Allowed: true, SRP_Constraints: "" },
  { ROL_ID: "ROLE_HR_OFFICER", PRM_ID: "HRM_VIEW_ATTENDANCE", SRP_Scope: "ALL", SRP_Is_Allowed: true, SRP_Constraints: "" },

  // Finance Manager permissions
  { ROL_ID: "ROLE_FIN_MANAGER", PRM_ID: "FIN_VIEW_INVOICES", SRP_Scope: "ALL", SRP_Is_Allowed: true, SRP_Constraints: "" },
  { ROL_ID: "ROLE_FIN_MANAGER", PRM_ID: "FIN_CREATE_INVOICE", SRP_Scope: "ALL", SRP_Is_Allowed: true, SRP_Constraints: "" },
  { ROL_ID: "ROLE_FIN_MANAGER", PRM_ID: "FIN_APPROVE_INVOICE", SRP_Scope: "ALL", SRP_Is_Allowed: true, SRP_Constraints: "" },
  { ROL_ID: "ROLE_FIN_MANAGER", PRM_ID: "FIN_VIEW_EXPENSES", SRP_Scope: "ALL", SRP_Is_Allowed: true, SRP_Constraints: "" },
  { ROL_ID: "ROLE_FIN_MANAGER", PRM_ID: "FIN_VIEW_REPORTS", SRP_Scope: "ALL", SRP_Is_Allowed: true, SRP_Constraints: "" },

  // Project Manager permissions
  { ROL_ID: "ROLE_PRJ_MANAGER", PRM_ID: "PRJ_VIEW_PROJECTS", SRP_Scope: "ALL", SRP_Is_Allowed: true, SRP_Constraints: "" },
  { ROL_ID: "ROLE_PRJ_MANAGER", PRM_ID: "PRJ_CREATE_PROJECT", SRP_Scope: "ALL", SRP_Is_Allowed: true, SRP_Constraints: "" },
  { ROL_ID: "ROLE_PRJ_MANAGER", PRM_ID: "PRJ_EDIT_PROJECT", SRP_Scope: "ALL", SRP_Is_Allowed: true, SRP_Constraints: "" },
  { ROL_ID: "ROLE_PRJ_MANAGER", PRM_ID: "PRJ_MANAGE_TASKS", SRP_Scope: "ALL", SRP_Is_Allowed: true, SRP_Constraints: "" },

  // Project Team permissions
  { ROL_ID: "ROLE_PRJ_TEAM", PRM_ID: "PRJ_VIEW_PROJECTS", SRP_Scope: "ALL", SRP_Is_Allowed: true, SRP_Constraints: "" },
  { ROL_ID: "ROLE_PRJ_TEAM", PRM_ID: "PRJ_VIEW_TASKS", SRP_Scope: "ALL", SRP_Is_Allowed: true, SRP_Constraints: "" },

  // Employee permissions
  { ROL_ID: "ROLE_EMPLOYEE", PRM_ID: "HRM_VIEW_EMPLOYEES", SRP_Scope: "OWN", SRP_Is_Allowed: true, SRP_Constraints: "self_only" }
];

// ╔════════════════════════════════════════════════════════════════╗
// ║               DEMO USERS SEED DATA                             ║
// ╚════════════════════════════════════════════════════════════════╝

const USERS_SEED_DATA = [
  {
    USR_ID: "USR_ADMIN_001",
    EMP_Name_EN: "System Admin",
    USR_Name: "admin",
    EMP_Email: "admin@nijjara.com",
    Job_Title: "System Administrator",
    DEPT_Name: "IT",
    ROL_ID: "ROLE_ADMIN",
    USR_Is_Active: true,
    Password_Hash: hashPassword("admin@123") // Change immediately
  },
  {
    USR_ID: "USR_HR_001",
    EMP_Name_EN: "Mohammed Khoraiby",
    USR_Name: "mkhoraiby",
    EMP_Email: "mkhoraiby@nijjara.com",
    Job_Title: "HR Manager",
    DEPT_Name: "Human Resources",
    ROL_ID: "ROLE_HR_MANAGER",
    USR_Is_Active: true,
    Password_Hash: hashPassword("210388")
  },
  {
    USR_ID: "USR_HR_002",
    EMP_Name_EN: "Fatima Ahmed",
    USR_Name: "fatimaah",
    EMP_Email: "fatimaah@nijjara.com",
    Job_Title: "HR Officer",
    DEPT_Name: "Human Resources",
    ROL_ID: "ROLE_HR_OFFICER",
    USR_Is_Active: true,
    Password_Hash: hashPassword("pass@123")
  },
  {
    USR_ID: "USR_FIN_001",
    EMP_Name_EN: "Ahmed Hassan",
    USR_Name: "ahassan",
    EMP_Email: "ahassan@nijjara.com",
    Job_Title: "Finance Manager",
    DEPT_Name: "Finance",
    ROL_ID: "ROLE_FIN_MANAGER",
    USR_Is_Active: true,
    Password_Hash: hashPassword("pass@123")
  },
  {
    USR_ID: "USR_PRJ_001",
    EMP_Name_EN: "Ali Mohamed",
    USR_Name: "amohamed",
    EMP_Email: "amohamed@nijjara.com",
    Job_Title: "Project Manager",
    DEPT_Name: "Projects",
    ROL_ID: "ROLE_PRJ_MANAGER",
    USR_Is_Active: true,
    Password_Hash: hashPassword("pass@123")
  }
];

// ╔════════════════════════════════════════════════════════════════╗
// ║               DEPARTMENTS SEED DATA                            ║
// ╚════════════════════════════════════════════════════════════════╝

const DEPARTMENTS_SEED_DATA = [
  { DEPT_ID: "DEPT_001", DEPT_Name: "Executive", DEPT_Is_Active: true, DEPT_Sort_Order: 1 },
  { DEPT_ID: "DEPT_002", DEPT_Name: "Human Resources", DEPT_Is_Active: true, DEPT_Sort_Order: 2 },
  { DEPT_ID: "DEPT_003", DEPT_Name: "Finance", DEPT_Is_Active: true, DEPT_Sort_Order: 3 },
  { DEPT_ID: "DEPT_004", DEPT_Name: "Projects", DEPT_Is_Active: true, DEPT_Sort_Order: 4 },
  { DEPT_ID: "DEPT_005", DEPT_Name: "Quality Assurance", DEPT_Is_Active: true, DEPT_Sort_Order: 5 },
  { DEPT_ID: "DEPT_006", DEPT_Name: "IT", DEPT_Is_Active: true, DEPT_Sort_Order: 6 },
  { DEPT_ID: "DEPT_007", DEPT_Name: "Operations", DEPT_Is_Active: true, DEPT_Sort_Order: 7 }
];

// ╔════════════════════════════════════════════════════════════════╗
// ║                  MAIN SEED FUNCTIONS                           ║
// ╚════════════════════════════════════════════════════════════════╝

/**
 * Run all seed data functions
 * Execute this after running setupERPSystem
 */
function seedAllData() {
  try {
    Logger.log("🌱 Starting data seeding...");

    seedDropdowns();
    seedRoles();
    seedPermissions();
    seedRolePermissions();
    seedDepartments();
    seedUsers();
    seedSettings();

    Logger.log("✅ Data seeding completed successfully!");
    showAlert("✅ Success", "All seed data has been populated!");

  } catch (e) {
    Logger.log(`❌ Seeding Error: ${e.message}`);
    showAlert("❌ Error", `Seeding failed: ${e.message}`);
  }
}

/**
 * Seed dropdowns
 */
function seedDropdowns() {
  Logger.log("📋 Seeding dropdowns...");
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName("ENG_Dropdowns");
  if (!sheet) {
    throw new Error("Sheet ENG_Dropdowns not found");
  }

  DROPDOWN_SEED_DATA.forEach(data => {
    const row = [
      data.DD_ID,
      data.DD_EN,
      data.DD_AR,
      data.DD_Is_Active,
      data.DD_Sort_Order
    ];
    sheet.appendRow(row);
  });

  Logger.log(`✅ Added ${DROPDOWN_SEED_DATA.length} dropdown entries`);
}

/**
 * Seed roles
 */
function seedRoles() {
  Logger.log("👥 Seeding roles...");
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName("SYS_Roles");
  if (!sheet) {
    throw new Error("Sheet SYS_Roles not found");
  }

  ROLES_SEED_DATA.forEach(data => {
    const row = [
      data.ROL_ID,
      data.ROL_Title,
      data.ROL_Notes,
      data.ROL_Is_System,
      new Date().toISOString(),
      "SYSTEM",
      "",
      ""
    ];
    sheet.appendRow(row);
  });

  Logger.log(`✅ Added ${ROLES_SEED_DATA.length} roles`);
}

/**
 * Seed permissions
 */
function seedPermissions() {
  Logger.log("🔐 Seeding permissions...");
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName("SYS_Permissions");
  if (!sheet) {
    throw new Error("Sheet SYS_Permissions not found");
  }

  PERMISSIONS_SEED_DATA.forEach(data => {
    const row = [
      data.PRM_ID,
      data.PRM_Name,
      data.PRM_Notes,
      data.PRM_Catg,
      new Date().toISOString(),
      "SYSTEM",
      "",
      ""
    ];
    sheet.appendRow(row);
  });

  Logger.log(`✅ Added ${PERMISSIONS_SEED_DATA.length} permissions`);
}

/**
 * Seed role-permission mappings
 */
function seedRolePermissions() {
  Logger.log("🔗 Seeding role-permission mappings...");
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName("SYS_Role_Permissions");
  if (!sheet) {
    throw new Error("Sheet SYS_Role_Permissions not found");
  }

  ROLE_PERMISSIONS_SEED_DATA.forEach(data => {
    const row = [
      data.ROL_ID,
      data.PRM_ID,
      data.SRP_Scope,
      data.SRP_Is_Allowed,
      data.SRP_Constraints,
      new Date().toISOString(),
      "SYSTEM",
      "",
      ""
    ];
    sheet.appendRow(row);
  });

  Logger.log(`✅ Added ${ROLE_PERMISSIONS_SEED_DATA.length} role-permission mappings`);
}

/**
 * Seed departments
 */
function seedDepartments() {
  Logger.log("🏢 Seeding departments...");
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName("HRM_Departments");
  if (!sheet) {
    throw new Error("Sheet HRM_Departments not found");
  }

  DEPARTMENTS_SEED_DATA.forEach(data => {
    const row = [
      data.DEPT_ID,
      data.DEPT_Name,
      data.DEPT_Is_Active,
      data.DEPT_Sort_Order,
      new Date().toISOString(),
      "SYSTEM",
      "",
      ""
    ];
    sheet.appendRow(row);
  });

  Logger.log(`✅ Added ${DEPARTMENTS_SEED_DATA.length} departments`);
}

/**
 * Seed demo users
 */
function seedUsers() {
  Logger.log("👤 Seeding demo users...");
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName("SYS_Users");
  if (!sheet) {
    throw new Error("Sheet SYS_Users not found");
  }

  USERS_SEED_DATA.forEach(data => {
    const row = [
      data.USR_ID,
      data.EMP_Name_EN,
      data.USR_Name,
      data.EMP_Email,
      data.Job_Title,
      data.DEPT_Name,
      data.ROL_ID,
      data.USR_Is_Active,
      data.Password_Hash,
      "",
      new Date().toISOString(),
      "SYSTEM",
      "",
      ""
    ];
    sheet.appendRow(row);
  });

  Logger.log(`✅ Added ${USERS_SEED_DATA.length} demo users`);
}

/**
 * Seed system settings
 */
function seedSettings() {
  Logger.log("⚙️ Seeding system settings...");
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName("ENG_Settings");
  if (!sheet) {
    throw new Error("Sheet ENG_Settings not found");
  }

  const settings = [
    {
      Setting_Key: "SYSTEM_NAME",
      Setting_Value: "Nijjara ERP",
      Description_EN: "System name"
    },
    {
      Setting_Key: "COMPANY_NAME",
      Setting_Value: "نيجارا",
      Description_EN: "Company Arabic name"
    },
    {
      Setting_Key: "FINANCIAL_YEAR_START",
      Setting_Value: "01-01",
      Description_EN: "Financial year start (MM-DD)"
    },
    {
      Setting_Key: "CURRENCY",
      Setting_Value: "EGP",
      Description_EN: "Default currency"
    },
    {
      Setting_Key: "TIMEZONE",
      Setting_Value: "Africa/Cairo",
      Description_EN: "System timezone"
    },
    {
      Setting_Key: "WORKING_DAYS_PER_WEEK",
      Setting_Value: "5",
      Description_EN: "Working days per week"
    },
    {
      Setting_Key: "WORKING_HOURS_PER_DAY",
      Setting_Value: "8",
      Description_EN: "Working hours per day"
    },
    {
      Setting_Key: "OVERTIME_MULTIPLIER",
      Setting_Value: "1.5",
      Description_EN: "Overtime payment multiplier"
    },
    {
      Setting_Key: "AUDIT_RETENTION_DAYS",
      Setting_Value: "365",
      Description_EN: "How many days to retain audit logs"
    },
    {
      Setting_Key: "SESSION_TIMEOUT_MINUTES",
      Setting_Value: "480",
      Description_EN: "Session timeout in minutes (8 hours)"
    }
  ];

  settings.forEach(data => {
    const row = [
      data.Setting_Key,
      data.Setting_Value,
      data.Description_EN,
      "SYSTEM",
      new Date().toISOString()
    ];
    sheet.appendRow(row);
  });

  Logger.log(`✅ Added ${settings.length} system settings`);
}

// ╔════════════════════════════════════════════════════════════════╗
// ║                   UTILITY FUNCTIONS                            ║
// ╚════════════════════════════════════════════════════════════════╝

/**
 * Hash password (same as in Code.js for consistency)
 */
function hashPassword(password) {
  const hash = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    password
  );
  return Utilities.base64Encode(hash);
}

/**
 * Show alert (same as in Setup.js)
 */
function showAlert(title, message) {
  SpreadsheetApp.getUi().alert(`${title}\n\n${message}`);
}

/**
 * Clear all seeded data (for testing)
 */
function clearAllSeededData() {
  var ui = SpreadsheetApp.getUi();
  var res = ui.alert("⚠️ Confirm", "This will delete all seeded data. Proceed?", ui.ButtonSet.YES_NO);
  if (res !== ui.Button.YES) {
    return;
  }

  try {
    const ss = getSpreadsheet();
    const sheetNames = [
      "ENG_Dropdowns",
      "SYS_Roles",
      "SYS_Permissions",
      "SYS_Role_Permissions",
      "HRM_Departments",
      "SYS_Users",
      "ENG_Settings"
    ];

    sheetNames.forEach(sheetName => {
      const sheet = ss.getSheetByName(sheetName);
      if (sheet && sheet.getLastRow() > 2) {
        sheet.deleteRows(3, sheet.getLastRow() - 2);
      }
    });

    Logger.log("✅ Seeded data cleared");
    showAlert("✅ Success", "All seeded data has been cleared!");

  } catch (e) {
    Logger.log(`❌ Clear Error: ${e.message}`);
    showAlert("❌ Error", `Clear failed: ${e.message}`);
  }
}

