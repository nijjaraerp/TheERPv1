/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * NIJJARA ERP - Seed_Data.gs
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Configuration data seeding for ENG_* sheets
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

/**
 * Seed all configuration data
 */
function seedAllData() {
  seedRoles();
  seedPermissions();
  seedRolePermissions();
  seedDepartments();
  seedDropdowns();
  seedButtons();
  seedForms();
  seedViews();
  seedSettings();

  SpreadsheetApp.getUi().alert("تم إضافة جميع البيانات التكوينية بنجاح!");
}

/**
 * Seed system roles
 */
function seedRoles() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("SYS_Roles");

  const roles = [
    [
      "ROLE_ADMIN",
      "مدير النظام",
      "صلاحيات كاملة على النظام",
      true,
      new Date().toISOString(),
      "SYSTEM",
      new Date().toISOString(),
      "SYSTEM",
    ],
    [
      "ROLE_HR_MANAGER",
      "مدير الموارد البشرية",
      "إدارة الموارد البشرية",
      true,
      new Date().toISOString(),
      "SYSTEM",
      new Date().toISOString(),
      "SYSTEM",
    ],
    [
      "ROLE_PROJECT_MANAGER",
      "مدير المشاريع",
      "إدارة المشاريع",
      true,
      new Date().toISOString(),
      "SYSTEM",
      new Date().toISOString(),
      "SYSTEM",
    ],
    [
      "ROLE_EMPLOYEE",
      "موظف",
      "صلاحيات الموظف العادي",
      true,
      new Date().toISOString(),
      "SYSTEM",
      new Date().toISOString(),
      "SYSTEM",
    ],
  ];

  sheet.getRange(3, 1, roles.length, 8).setValues(roles);
  Logger.log("Roles seeded");
}

/**
 * Seed system permissions
 */
function seedPermissions() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("SYS_Permissions");

  const permissions = [
    [
      "PRM_USERS_VIEW",
      "عرض المستخدمين",
      "عرض قائمة المستخدمين",
      "Users",
      new Date().toISOString(),
      "SYSTEM",
      new Date().toISOString(),
      "SYSTEM",
    ],
    [
      "PRM_USERS_EDIT",
      "تعديل المستخدمين",
      "إضافة وتعديل المستخدمين",
      "Users",
      new Date().toISOString(),
      "SYSTEM",
      new Date().toISOString(),
      "SYSTEM",
    ],
    [
      "PRM_EMPLOYEES_VIEW",
      "عرض الموظفين",
      "عرض بيانات الموظفين",
      "HR",
      new Date().toISOString(),
      "SYSTEM",
      new Date().toISOString(),
      "SYSTEM",
    ],
    [
      "PRM_EMPLOYEES_EDIT",
      "تعديل الموظفين",
      "إضافة وتعديل الموظفين",
      "HR",
      new Date().toISOString(),
      "SYSTEM",
      new Date().toISOString(),
      "SYSTEM",
    ],
    [
      "PRM_ATTENDANCE_VIEW",
      "عرض الحضور",
      "عرض سجلات الحضور",
      "HR",
      new Date().toISOString(),
      "SYSTEM",
      new Date().toISOString(),
      "SYSTEM",
    ],
    [
      "PRM_ATTENDANCE_EDIT",
      "تعديل الحضور",
      "إدارة سجلات الحضور",
      "HR",
      new Date().toISOString(),
      "SYSTEM",
      new Date().toISOString(),
      "SYSTEM",
    ],
    [
      "PRM_PROJECTS_VIEW",
      "عرض المشاريع",
      "عرض المشاريع",
      "Projects",
      new Date().toISOString(),
      "SYSTEM",
      new Date().toISOString(),
      "SYSTEM",
    ],
    [
      "PRM_PROJECTS_EDIT",
      "تعديل المشاريع",
      "إدارة المشاريع",
      "Projects",
      new Date().toISOString(),
      "SYSTEM",
      new Date().toISOString(),
      "SYSTEM",
    ],
  ];

  sheet.getRange(3, 1, permissions.length, 8).setValues(permissions);
  Logger.log("Permissions seeded");
}

/**
 * Seed role-permission mappings
 */
function seedRolePermissions() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("SYS_Role_Permissions");

  const mappings = [
    [
      "ROLE_ADMIN",
      "PRM_USERS_VIEW",
      "ALL",
      true,
      "",
      new Date().toISOString(),
      "SYSTEM",
      new Date().toISOString(),
      "SYSTEM",
    ],
    [
      "ROLE_ADMIN",
      "PRM_USERS_EDIT",
      "ALL",
      true,
      "",
      new Date().toISOString(),
      "SYSTEM",
      new Date().toISOString(),
      "SYSTEM",
    ],
    [
      "ROLE_ADMIN",
      "PRM_EMPLOYEES_VIEW",
      "ALL",
      true,
      "",
      new Date().toISOString(),
      "SYSTEM",
      new Date().toISOString(),
      "SYSTEM",
    ],
    [
      "ROLE_ADMIN",
      "PRM_EMPLOYEES_EDIT",
      "ALL",
      true,
      "",
      new Date().toISOString(),
      "SYSTEM",
      new Date().toISOString(),
      "SYSTEM",
    ],
    [
      "ROLE_ADMIN",
      "PRM_ATTENDANCE_VIEW",
      "ALL",
      true,
      "",
      new Date().toISOString(),
      "SYSTEM",
      new Date().toISOString(),
      "SYSTEM",
    ],
    [
      "ROLE_ADMIN",
      "PRM_ATTENDANCE_EDIT",
      "ALL",
      true,
      "",
      new Date().toISOString(),
      "SYSTEM",
      new Date().toISOString(),
      "SYSTEM",
    ],
    [
      "ROLE_ADMIN",
      "PRM_PROJECTS_VIEW",
      "ALL",
      true,
      "",
      new Date().toISOString(),
      "SYSTEM",
      new Date().toISOString(),
      "SYSTEM",
    ],
    [
      "ROLE_ADMIN",
      "PRM_PROJECTS_EDIT",
      "ALL",
      true,
      "",
      new Date().toISOString(),
      "SYSTEM",
      new Date().toISOString(),
      "SYSTEM",
    ],
    [
      "ROLE_HR_MANAGER",
      "PRM_EMPLOYEES_VIEW",
      "ALL",
      true,
      "",
      new Date().toISOString(),
      "SYSTEM",
      new Date().toISOString(),
      "SYSTEM",
    ],
    [
      "ROLE_HR_MANAGER",
      "PRM_EMPLOYEES_EDIT",
      "ALL",
      true,
      "",
      new Date().toISOString(),
      "SYSTEM",
      new Date().toISOString(),
      "SYSTEM",
    ],
    [
      "ROLE_HR_MANAGER",
      "PRM_ATTENDANCE_VIEW",
      "ALL",
      true,
      "",
      new Date().toISOString(),
      "SYSTEM",
      new Date().toISOString(),
      "SYSTEM",
    ],
    [
      "ROLE_HR_MANAGER",
      "PRM_ATTENDANCE_EDIT",
      "ALL",
      true,
      "",
      new Date().toISOString(),
      "SYSTEM",
      new Date().toISOString(),
      "SYSTEM",
    ],
    [
      "ROLE_PROJECT_MANAGER",
      "PRM_PROJECTS_VIEW",
      "ALL",
      true,
      "",
      new Date().toISOString(),
      "SYSTEM",
      new Date().toISOString(),
      "SYSTEM",
    ],
    [
      "ROLE_PROJECT_MANAGER",
      "PRM_PROJECTS_EDIT",
      "ALL",
      true,
      "",
      new Date().toISOString(),
      "SYSTEM",
      new Date().toISOString(),
      "SYSTEM",
    ],
  ];

  sheet.getRange(3, 1, mappings.length, 9).setValues(mappings);
  Logger.log("Role permissions seeded");
}

/**
 * Seed departments
 */
function seedDepartments() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("HRM_Departments");

  const departments = [
    [
      "DEPT001",
      "الموارد البشرية",
      true,
      1,
      new Date().toISOString(),
      "SYSTEM",
      new Date().toISOString(),
      "SYSTEM",
    ],
    [
      "DEPT002",
      "تقنية المعلومات",
      true,
      2,
      new Date().toISOString(),
      "SYSTEM",
      new Date().toISOString(),
      "SYSTEM",
    ],
    [
      "DEPT003",
      "الإدارة المالية",
      true,
      3,
      new Date().toISOString(),
      "SYSTEM",
      new Date().toISOString(),
      "SYSTEM",
    ],
    [
      "DEPT004",
      "المشاريع",
      true,
      4,
      new Date().toISOString(),
      "SYSTEM",
      new Date().toISOString(),
      "SYSTEM",
    ],
  ];

  sheet.getRange(3, 1, departments.length, 8).setValues(departments);
  Logger.log("Departments seeded");
}

/**
 * Seed dropdown options
 */
function seedDropdowns() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("ENG_Dropdowns");

  const dropdowns = [
    ["DD_GENDER", "Male", "ذكر", true, 1],
    ["DD_GENDER", "Female", "أنثى", true, 2],
    ["DD_MARITAL_STATUS", "Single", "أعزب", true, 1],
    ["DD_MARITAL_STATUS", "Married", "متزوج", true, 2],
    ["DD_MARITAL_STATUS", "Divorced", "مطلق", true, 3],
    ["DD_MARITAL_STATUS", "Widowed", "أرمل", true, 4],
    ["DD_MILITARY_STATUS", "Exempted", "معفى", true, 1],
    ["DD_MILITARY_STATUS", "Completed", "أنهى الخدمة", true, 2],
    ["DD_MILITARY_STATUS", "Postponed", "مؤجل", true, 3],
    ["DD_CONTRACT_TYPE", "Permanent", "دائم", true, 1],
    ["DD_CONTRACT_TYPE", "Contract", "عقد", true, 2],
    ["DD_CONTRACT_TYPE", "Part-time", "دوام جزئي", true, 3],
    ["DD_EMPLOYEE_STATUS", "Active", "نشط", true, 1],
    ["DD_EMPLOYEE_STATUS", "Inactive", "غير نشط", true, 2],
    ["DD_EMPLOYEE_STATUS", "Terminated", "مفصول", true, 3],
    ["DD_LEAVE_TYPE", "Annual Leave", "إجازة سنوية", true, 1],
    ["DD_LEAVE_TYPE", "Sick Leave", "إجازة مرضية", true, 2],
    ["DD_LEAVE_TYPE", "Emergency Leave", "إجازة طارئة", true, 3],
    ["DD_LEAVE_STATUS", "Pending", "معلق", true, 1],
    ["DD_LEAVE_STATUS", "Approved", "موافق عليه", true, 2],
    ["DD_LEAVE_STATUS", "Rejected", "مرفوض", true, 3],
    ["DD_ATTENDANCE_STATUS", "Present", "حاضر", true, 1],
    ["DD_ATTENDANCE_STATUS", "Absent", "غائب", true, 2],
    ["DD_ATTENDANCE_STATUS", "Late", "متأخر", true, 3],
    ["DD_PROJECT_STATUS", "Planning", "تخطيط", true, 1],
    ["DD_PROJECT_STATUS", "In Progress", "قيد التنفيذ", true, 2],
    ["DD_PROJECT_STATUS", "Completed", "مكتمل", true, 3],
    ["DD_PROJECT_STATUS", "On Hold", "متوقف", true, 4],
    ["DD_PROJECT_TYPE", "Construction", "إنشاءات", true, 1],
    ["DD_PROJECT_TYPE", "Consulting", "استشارات", true, 2],
    ["DD_PROJECT_TYPE", "Maintenance", "صيانة", true, 3],
  ];

  sheet.getRange(3, 1, dropdowns.length, 5).setValues(dropdowns);
  Logger.log("Dropdowns seeded");
}

/**
 * Seed button definitions
 */
function seedButtons() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("ENG_Buttons");

  const buttons = [
    ["BTN_SAVE", "حفظ", "primary", "حفظ البيانات"],
    ["BTN_EDIT", "تعديل", "secondary", "تعديل البيانات"],
    ["BTN_DELETE", "حذف", "danger", "حذف البيانات"],
    ["BTN_CANCEL", "إلغاء", "secondary", "إلغاء العملية"],
    ["BTN_NEW", "جديد", "primary", "إضافة سجل جديد"],
    ["BTN_SEARCH", "بحث", "secondary", "البحث في البيانات"],
    ["BTN_EXPORT", "تصدير", "secondary", "تصدير البيانات"],
    ["BTN_PRINT", "طباعة", "secondary", "طباعة التقرير"],
  ];

  sheet.getRange(3, 1, buttons.length, 4).setValues(buttons);
  Logger.log("Buttons seeded");
}

/**
 * Seed form definitions
 */
function seedForms() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("ENG_Forms");

  const forms = [
    [
      "FRM_EMPLOYEE",
      "إدارة الموظفين",
      "HRM_Employees",
      "إدارة الموظفين",
      "EMP_ID",
      "معرّف الموظف",
      "text",
      "",
      "",
      true,
      "",
      "",
      "HRM_Employees",
      "EMP_ID",
      "ROLE_HR_MANAGER",
      true,
      "BTN_SAVE",
    ],
    [
      "FRM_EMPLOYEE",
      "إدارة الموظفين",
      "HRM_Employees",
      "إدارة الموظفين",
      "EMP_Name_EN",
      "الاسم بالإنجليزية",
      "text",
      "",
      "",
      true,
      "",
      "",
      "HRM_Employees",
      "EMP_Name_EN",
      "ROLE_HR_MANAGER",
      true,
      "BTN_SAVE",
    ],
    [
      "FRM_EMPLOYEE",
      "إدارة الموظفين",
      "HRM_Employees",
      "إدارة الموظفين",
      "EMP_Name_AR",
      "الاسم بالعربية",
      "text",
      "",
      "",
      true,
      "",
      "",
      "HRM_Employees",
      "EMP_Name_AR",
      "ROLE_HR_MANAGER",
      true,
      "BTN_SAVE",
    ],
    [
      "FRM_EMPLOYEE",
      "إدارة الموظفين",
      "HRM_Employees",
      "إدارة الموظفين",
      "Gender",
      "الجنس",
      "select",
      "",
      "",
      true,
      "",
      "DD_GENDER",
      "HRM_Employees",
      "Gender",
      "ROLE_HR_MANAGER",
      true,
      "BTN_SAVE",
    ],
    [
      "FRM_EMPLOYEE",
      "إدارة الموظفين",
      "HRM_Employees",
      "إدارة الموظفين",
      "DEPT_Name",
      "الإدارة",
      "select",
      "HRM_Departments",
      "DEPT_Name",
      true,
      "",
      "",
      "HRM_Employees",
      "DEPT_Name",
      "ROLE_HR_MANAGER",
      true,
      "BTN_SAVE",
    ],
    [
      "FRM_EMPLOYEE",
      "إدارة الموظفين",
      "HRM_Employees",
      "إدارة الموظفين",
      "Job_Title",
      "المسمى الوظيفي",
      "text",
      "",
      "",
      true,
      "",
      "",
      "HRM_Employees",
      "Job_Title",
      "ROLE_HR_MANAGER",
      true,
      "BTN_SAVE",
    ],
    [
      "FRM_EMPLOYEE",
      "إدارة الموظفين",
      "HRM_Employees",
      "إدارة الموظفين",
      "Basic_Salary",
      "الراتب الأساسي",
      "number",
      "",
      "",
      true,
      "0",
      "",
      "HRM_Employees",
      "Basic_Salary",
      "ROLE_HR_MANAGER",
      true,
      "BTN_SAVE",
    ],
    [
      "FRM_ATTENDANCE",
      "إدارة الحضور",
      "HRM_Attendance",
      "إدارة الحضور",
      "EMP_ID",
      "الموظف",
      "select",
      "HRM_Employees",
      "EMP_ID,EMP_Name_EN",
      true,
      "",
      "",
      "HRM_Attendance",
      "EMP_ID",
      "ROLE_HR_MANAGER",
      true,
      "BTN_SAVE",
    ],
    [
      "FRM_ATTENDANCE",
      "إدارة الحضور",
      "HRM_Attendance",
      "إدارة الحضور",
      "ATT_Date",
      "تاريخ الحضور",
      "date",
      "",
      "",
      true,
      "",
      "",
      "HRM_Attendance",
      "ATT_Date",
      "ROLE_HR_MANAGER",
      true,
      "BTN_SAVE",
    ],
    [
      "FRM_ATTENDANCE",
      "إدارة الحضور",
      "HRM_Attendance",
      "إدارة الحضور",
      "ATT_Check_In",
      "وقت الدخول",
      "time",
      "",
      "",
      false,
      "",
      "",
      "HRM_Attendance",
      "ATT_Check_In",
      "ROLE_HR_MANAGER",
      true,
      "BTN_SAVE",
    ],
    [
      "FRM_ATTENDANCE",
      "إدارة الحضور",
      "HRM_Attendance",
      "إدارة الحضور",
      "ATT_Check_Out",
      "وقت الخروج",
      "time",
      "",
      "",
      false,
      "",
      "",
      "HRM_Attendance",
      "ATT_Check_Out",
      "ROLE_HR_MANAGER",
      true,
      "BTN_SAVE",
    ],
    [
      "FRM_PROJECT",
      "إدارة المشاريع",
      "PRJ_Main",
      "إدارة المشاريع",
      "PRJ_ID",
      "معرّف المشروع",
      "text",
      "",
      "",
      true,
      "",
      "",
      "PRJ_Main",
      "PRJ_ID",
      "ROLE_PROJECT_MANAGER",
      true,
      "BTN_SAVE",
    ],
    [
      "FRM_PROJECT",
      "إدارة المشاريع",
      "PRJ_Main",
      "إدارة المشاريع",
      "PRJ_Name",
      "اسم المشروع",
      "text",
      "",
      "",
      true,
      "",
      "",
      "PRJ_Main",
      "PRJ_Name",
      "ROLE_PROJECT_MANAGER",
      true,
      "BTN_SAVE",
    ],
    [
      "FRM_PROJECT",
      "إدارة المشاريع",
      "PRJ_Main",
      "إدارة المشاريع",
      "PRJ_Status",
      "حالة المشروع",
      "select",
      "",
      "",
      true,
      "",
      "DD_PROJECT_STATUS",
      "PRJ_Main",
      "PRJ_Status",
      "ROLE_PROJECT_MANAGER",
      true,
      "BTN_SAVE",
    ],
    [
      "FRM_PROJECT",
      "إدارة المشاريع",
      "PRJ_Main",
      "إدارة المشاريع",
      "PRJ_Budget",
      "الميزانية",
      "number",
      "",
      "",
      false,
      "0",
      "",
      "PRJ_Main",
      "PRJ_Budget",
      "ROLE_PROJECT_MANAGER",
      true,
      "BTN_SAVE",
    ],
  ];

  sheet.getRange(3, 1, forms.length, 17).setValues(forms);
  Logger.log("Forms seeded");
}

/**
 * Seed view definitions
 */
function seedViews() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("ENG_Views");

  const views = [
    [
      "VW_EMPLOYEES_LIST",
      "قائمة الموظفين",
      "HRM_Employees",
      "EMP_ID,EMP_Name_EN,EMP_Name_AR,Job_Title,DEPT_Name,EMP_Status",
    ],
    [
      "VW_ATTENDANCE_LIST",
      "سجل الحضور",
      "HRM_Attendance",
      "ATT_ID,EMP_ID,ATT_Date,ATT_Check_In,ATT_Check_Out,ATT_Hours,ATT_Status",
    ],
    [
      "VW_PROJECTS_LIST",
      "قائمة المشاريع",
      "PRJ_Main",
      "PRJ_ID,PRJ_Name,PRJ_Status,PRJ_Type,PRJ_Budget",
    ],
    [
      "VW_USERS_LIST",
      "قائمة المستخدمين",
      "SYS_Users",
      "USR_ID,EMP_Name_EN,USR_Name,ROL_ID,USR_Is_Active",
    ],
  ];

  sheet.getRange(3, 1, views.length, 4).setValues(views);
  Logger.log("Views seeded");
}

/**
 * Seed system settings
 */
function seedSettings() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("ENG_Settings");

  const settings = [
    [
      "company_name",
      "Nijjara ERP",
      "اسم الشركة",
      "SYSTEM",
      new Date().toISOString(),
    ],
    [
      "company_address",
      "Egypt",
      "عنوان الشركة",
      "SYSTEM",
      new Date().toISOString(),
    ],
    [
      "fiscal_year_start",
      "01-01",
      "بداية السنة المالية",
      "SYSTEM",
      new Date().toISOString(),
    ],
    ["currency", "EGP", "العملة", "SYSTEM", new Date().toISOString()],
    [
      "language_default",
      "ar",
      "اللغة الافتراضية",
      "SYSTEM",
      new Date().toISOString(),
    ],
    [
      "timezone",
      "Africa/Cairo",
      "المنطقة الزمنية",
      "SYSTEM",
      new Date().toISOString(),
    ],
    [
      "working_hours_start",
      "09:00",
      "بداية ساعات العمل",
      "SYSTEM",
      new Date().toISOString(),
    ],
    [
      "working_hours_end",
      "17:00",
      "نهاية ساعات العمل",
      "SYSTEM",
      new Date().toISOString(),
    ],
    [
      "session_timeout_minutes",
      "480",
      "مهلة الجلسة بالدقائق",
      "SYSTEM",
      new Date().toISOString(),
    ],
    [
      "max_file_size_mb",
      "10",
      "الحد الأقصى لحجم الملف بالميجابايت",
      "SYSTEM",
      new Date().toISOString(),
    ],
  ];

  sheet.getRange(3, 1, settings.length, 5).setValues(settings);
  Logger.log("Settings seeded");
}
