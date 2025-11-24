/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * NIJJARA ERP - Setup.gs
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Complete database schema and setup
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

/**
 * Complete ERP Schema Definition
 */
const ERP_SCHEMA = {
  // Debug sheets (no Arabic headers)
  DBUG_AppLog: {
    headers_en: [
      "DBG_ID",
      "Time_Stamp",
      "Actor",
      "Action",
      "Entity",
      "Entity_ID",
      "Details",
    ],
    headers_ar: [],
    description: "Application activity log",
  },
  DBUG_WarnLog: {
    headers_en: [
      "DBG_WARN_ID",
      "Time_Stamp",
      "Actor",
      "Action",
      "Entity",
      "Entity_ID",
      "Details",
    ],
    headers_ar: [],
    description: "Warning log",
  },
  DBUG_ErrorLog: {
    headers_en: [
      "DBG_ERR_ID",
      "Time_Stamp",
      "Actor",
      "Action",
      "Entity",
      "Entity_ID",
      "Message",
      "Error_Object",
    ],
    headers_ar: [],
    description: "Error log",
  },

  // Engine sheets (no Arabic headers)
  ENG_Forms: {
    headers_en: [
      "FORM_ID",
      "Form_Label",
      "Tab_ID",
      "Tab_Label",
      "Field_ID",
      "Field_Label",
      "Field_Type",
      "Source_Sheet",
      "Source_Columns",
      "Is_Mandatory",
      "Default_Value",
      "DD_ID",
      "Target_Sheet",
      "Target_Column",
      "ROL_ID",
      "Is_Visible",
      "But_ID",
    ],
    headers_ar: [],
    description: "Form definitions",
  },
  ENG_Views: {
    headers_en: ["VIEW_ID", "View_Title", "Source_Sheet", "Source_Columns"],
    headers_ar: [],
    description: "View definitions",
  },
  ENG_Buttons: {
    headers_en: ["BTN_ID", "BTN_Label", "BTN_Type", "BTN_Description"],
    headers_ar: [],
    description: "Button definitions",
  },
  ENG_Dropdowns: {
    headers_en: ["DD_ID", "DD_EN", "DD_AR", "DD_Is_Active", "DD_Sort_Order"],
    headers_ar: [],
    description: "Dropdown options",
  },
  ENG_Settings: {
    headers_en: [
      "Setting_Key",
      "Setting_Value",
      "Description_EN",
      "Updated_By",
      "Updated_At",
    ],
    headers_ar: [],
    description: "System settings",
  },

  // System sheets (with Arabic headers)
  SYS_Dashboard: {
    headers_en: [
      "SYS_Dash_ID",
      "SYS_Metric_Code",
      "SYS_Metric_Value",
      "SYS_Dash_Date",
      "SYS_Dash_Notes",
    ],
    headers_ar: [
      "معرّف لوحة التحكم",
      "رمز المقياس",
      "قيمة المقياس",
      "تاريخ لوحة التحكم",
      "ملاحظات لوحة التحكم",
    ],
    description: "System dashboard metrics",
  },
  SYS_Documents: {
    headers_en: [
      "DOC_ID",
      "DOC_Entity",
      "DOC_Entity_ID",
      "DOC_File_Name",
      "DOC_Label",
      "DOC_Drive_File_ID",
      "DOC_Drive_URL",
      "DOC_Upload_By",
      "DOC_Crt_At",
    ],
    headers_ar: [
      "معرّف المستند",
      "الكيان",
      "معرّف الكيان",
      "اسم الملف",
      "التسمية",
      "معرّف ملف Drive",
      "رابط Drive",
      "تم الرفع بواسطة",
      "تاريخ الإنشاء",
    ],
    description: "Document management",
  },
  SYS_Users: {
    headers_en: [
      "USR_ID",
      "EMP_Name_EN",
      "USR_Name",
      "EMP_Email",
      "Job_Title",
      "DEPT_Name",
      "ROL_ID",
      "USR_Is_Active",
      "Password_Hash",
      "Last_Login",
      "USR_Crt_At",
      "USR_Crt_By",
      "USR_Upd_At",
      "USR_Upd_By",
    ],
    headers_ar: [
      "معرّف المستخدم",
      "اسم الموظف",
      "اسم المستخدم",
      "البريد الإلكتروني",
      "المسمى الوظيفي",
      "الإدارة",
      "معرّف الدور",
      "نشط",
      "كلمة المرور المشفرة",
      "آخر تسجيل دخول",
      "تاريخ الإنشاء",
      "أنشأ بواسطة",
      "تاريخ التحديث",
      "محدّث بواسطة",
    ],
    description: "User accounts",
  },
  SYS_Roles: {
    headers_en: [
      "ROL_ID",
      "ROL_Title",
      "ROL_Notes",
      "ROL_Is_System",
      "ROL_Crt_At",
      "ROL_Crt_By",
      "ROL_Upd_At",
      "ROL_Upd_By",
    ],
    headers_ar: [
      "معرّف الدور",
      "عنوان الدور",
      "ملاحظات الدور",
      "نظامي",
      "تاريخ الإنشاء",
      "أنشأ بواسطة",
      "تاريخ التحديث",
      "محدّث بواسطة",
    ],
    description: "User roles",
  },
  SYS_Permissions: {
    headers_en: [
      "PRM_ID",
      "PRM_Name",
      "PRM_Notes",
      "PRM_Catg",
      "PRM_Crt_At",
      "PRM_Crt_By",
      "PRM_Upd_At",
      "PRM_Upd_By",
    ],
    headers_ar: [
      "معرّف الصلاحية",
      "اسم الصلاحية",
      "ملاحظات الصلاحية",
      "الفئة",
      "تاريخ الإنشاء",
      "أنشأ بواسطة",
      "تاريخ التحديث",
      "محدّث بواسطة",
    ],
    description: "System permissions",
  },
  SYS_Role_Permissions: {
    headers_en: [
      "ROL_ID",
      "PRM_ID",
      "SRP_Scope",
      "SRP_Is_Allowed",
      "SRP_Constraints",
      "SRP_Crt_At",
      "SRP_Crt_By",
      "SRP_Upd_At",
      "SRP_Upd_By",
    ],
    headers_ar: [
      "معرّف الدور",
      "معرّف الصلاحية",
      "النطاق",
      "مسموح",
      "القيود",
      "تاريخ الإنشاء",
      "أنشأ بواسطة",
      "تاريخ التحديث",
      "محدّث بواسطة",
    ],
    description: "Role-permission mappings",
  },
  SYS_Audit_Log: {
    headers_en: [
      "AUD_ID",
      "AUD_Time_Stamp",
      "USR_ID",
      "USR_Name",
      "USR_Action",
      "ACT_Details",
      "AUD_Entity",
      "AUD_Entity_ID",
      "AUD_Scope",
      "AUD_Sheet_ID",
      "AUD_Sheet_Name",
      "IP_Address",
    ],
    headers_ar: [
      "معرّف السجل",
      "الطابع الزمني",
      "معرّف المستخدم",
      "اسم المستخدم",
      "الإجراء",
      "تفاصيل الإجراء",
      "الكيان",
      "معرّف الكيان",
      "النطاق",
      "معرّف الورقة",
      "اسم الورقة",
      "عنوان IP",
    ],
    description: "Audit trail",
  },
  SYS_Sessions: {
    headers_en: [
      "SESS_ID",
      "USR_ID",
      "EMP_Email",
      "Actor_USR_ID",
      "SESS_Type",
      "SESS_Status",
      "USR_Device",
      "IP_Address",
      "Auth_Token",
      "SESS_Start_At",
      "SESS_End_At",
      "SESS_Crt_At",
      "SESS_Crt_By",
      "SESS_Last_Seen",
      "SESS_Revoked_At",
      "SESS_Revoked_By",
      "SESS_Metadata",
    ],
    headers_ar: [
      "معرّف الجلسة",
      "معرّف المستخدم",
      "البريد الإلكتروني",
      "معرّف المستخدم الممثل",
      "نوع الجلسة",
      "حالة الجلسة",
      "جهاز المستخدم",
      "عنوان IP",
      "رمز المصادقة",
      "تاريخ البدء",
      "تاريخ الانتهاء",
      "تاريخ الإنشاء",
      "أنشأ بواسطة",
      "آخر ظهور",
      "تاريخ الإلغاء",
      "ألغى بواسطة",
      "البيانات الوصفية",
    ],
    description: "User sessions",
  },
  SYS_PubHolidays: {
    headers_en: ["PUBHOL_ID", "Pub_Holiday_Date", "Pub_Holiday_Name"],
    headers_ar: ["معرّف العطلة", "تاريخ العطلة", "اسم العطلة"],
    description: "Public holidays",
  },
  SYS_Analysis: {
    headers_en: [
      "SYS_ANA_ID",
      "SYS_ANA_Date",
      "SYS_ANA_Start",
      "SYS_ANA_End",
      "SYS_ANA_Item1",
      "SYS_ANA_Item2",
      "SYS_ANA_Item3",
      "SYS_ANA_Item4",
      "SYS_ANA_Item5",
      "SYS_ANA_Item6",
      "SYS_ANA_Item7",
      "SYS_ANA_Item8",
      "SYS_ANA_Item9",
    ],
    headers_ar: [
      "معرّف التحليل",
      "تاريخ التحليل",
      "البداية",
      "النهاية",
      "العنصر 1",
      "العنصر 2",
      "العنصر 3",
      "العنصر 4",
      "العنصر 5",
      "العنصر 6",
      "العنصر 7",
      "العنصر 8",
      "العنصر 9",
    ],
    description: "System analysis data",
  },

  // HRM sheets (with Arabic headers)
  HRM_Dashboard: {
    headers_en: [
      "HR_Dash_ID",
      "HR_Metric_Code",
      "HR_Metric_Value",
      "HR_Dash_Date",
      "HR_Dash_Notes",
    ],
    headers_ar: [
      "معرّف لوحة الموارد البشرية",
      "رمز المقياس",
      "قيمة المقياس",
      "تاريخ لوحة الموارد البشرية",
      "ملاحظات لوحة الموارد البشرية",
    ],
    description: "HR dashboard metrics",
  },
  HRM_Departments: {
    headers_en: [
      "DEPT_ID",
      "DEPT_Name",
      "DEPT_Is_Active",
      "DEPT_Sort_Order",
      "DEPT_Crt_At",
      "DEPT_Crt_By",
      "DEPT_Upd_At",
      "DEPT_Upd_By",
    ],
    headers_ar: [
      "معرّف الإدارة",
      "اسم الإدارة",
      "نشط",
      "ترتيب الفرز",
      "تاريخ الإنشاء",
      "أنشأ بواسطة",
      "تاريخ التحديث",
      "محدّث بواسطة",
    ],
    description: "Departments",
  },
  HRM_Employees: {
    headers_en: [
      "EMP_ID",
      "EMP_Name_EN",
      "EMP_Name_AR",
      "Date_of_Birth",
      "Gender",
      "National_ID",
      "Marital_Status",
      "Military_Status",
      "EMP_Mob_Main",
      "EMP_Mob_Sub",
      "Home_Address",
      "EMP_Email",
      "Emrgcy_Cont",
      "EmrCont_Relation",
      "EmrCont__Mob",
      "Job_Title",
      "DEPT_Name",
      "Hire_Date",
      "EMP_CONT_Type",
      "EMP_Status",
      "Basic_Salary",
      "Allowances",
      "Deducts",
      "EMP_Crt_At",
      "EMP_Crt_By",
    ],
    headers_ar: [
      "معرّف الموظف",
      "الاسم بالإنجليزية",
      "الاسم بالعربية",
      "تاريخ الميلاد",
      "الجنس",
      "الرقم القومي",
      "الحالة الاجتماعية",
      "الحالة العسكرية",
      "رقم الهاتف الرئيسي",
      "رقم الهاتف الفرعي",
      "عنوان المنزل",
      "البريد الإلكتروني",
      "جهة الاتصال في حالات الطوارئ",
      "علاقة جهة الاتصال",
      "رقم هاتف جهة الاتصال",
      "المسمى الوظيفي",
      "اسم الإدارة",
      "تاريخ التوظيف",
      "نوع العقد",
      "حالة الموظف",
      "الراتب الأساسي",
      "البدلات",
      "الخصومات",
      "تاريخ الإنشاء",
      "أنشأ بواسطة",
    ],
    description: "Employee records",
  },
  HRM_Attendance: {
    headers_en: [
      "ATT_ID",
      "EMP_ID",
      "ATT_Date",
      "ATT_Check_In",
      "ATT_Check_Out",
      "ATT_Hours",
      "ATT_Late_Mints",
      "ATT_EarlyLV_Mints",
      "ATT_OT_Mints",
      "ATT_Notes",
      "ATT_Status",
      "ATT_Crt_At",
      "ATT_Crt_By",
      "ATT_Upd_At",
      "ATT_Upd_By",
    ],
    headers_ar: [
      "معرّف الحضور",
      "معرّف الموظف",
      "تاريخ الحضور",
      "وقت الدخول",
      "وقت الخروج",
      "ساعات العمل",
      "دقائق التأخير",
      "دقائق المغادرة المبكرة",
      "دقائق العمل الإضافي",
      "ملاحظات الحضور",
      "حالة الحضور",
      "تاريخ الإنشاء",
      "أنشأ بواسطة",
      "تاريخ التحديث",
      "محدّث بواسطة",
    ],
    description: "Attendance records",
  },
  HRM_Leave: {
    headers_en: [
      "LV_ID",
      "EMP_ID",
      "LV_Type",
      "LV_Start_Date",
      "LV_End_Date",
      "LV_NumDays",
      "LV_Status",
      "LV_Reason",
      "LV_Approved_By",
      "LV_Notes",
      "LV_Crt_At",
      "LV_Crt_By",
      "LV_Upd_At",
      "LV_Upd_By",
    ],
    headers_ar: [
      "معرّف الإجازة",
      "معرّف الموظف",
      "نوع الإجازة",
      "تاريخ البدء",
      "تاريخ الانتهاء",
      "عدد الأيام",
      "حالة الإجازة",
      "سبب الإجازة",
      "وافق بواسطة",
      "ملاحظات الإجازة",
      "تاريخ الإنشاء",
      "أنشأ بواسطة",
      "تاريخ التحديث",
      "محدّث بواسطة",
    ],
    description: "Leave requests",
  },
  HRM_Advances: {
    headers_en: [
      "ADV_ID",
      "EMP_ID",
      "ADV_Issue_Date",
      "ADV_Amnt",
      "ADV_Setlmnt_Period",
      "ADV_Instal",
      "ADV_Notes",
      "ADV_Status",
      "ADV_Crt_At",
      "ADV_Crt_By",
      "ADV_Upd_At",
      "ADV_Upd_By",
    ],
    headers_ar: [
      "معرّف السلفة",
      "معرّف الموظف",
      "تاريخ الإصدار",
      "المبلغ",
      "فترة التسوية",
      "القسط",
      "ملاحظات السلفة",
      "حالة السلفة",
      "تاريخ الإنشاء",
      "أنشأ بواسطة",
      "تاريخ التحديث",
      "محدّث بواسطة",
    ],
    description: "Employee advances",
  },
  HRM_OverTime: {
    headers_en: [
      "OT_ID",
      "EMP_ID",
      "POL_OT_ID",
      "ATT_Date",
      "ATT_OT_Mints",
      "OT_Amnt",
      "OT_Crt_At",
      "OT_Crt_By",
      "OT_Upd_At",
      "OT_Upd_By",
    ],
    headers_ar: [
      "معرّف العمل الإضافي",
      "معرّف الموظف",
      "معرّف سياسة العمل الإضافي",
      "تاريخ الحضور",
      "دقائق العمل الإضافي",
      "مبلغ العمل الإضافي",
      "تاريخ الإنشاء",
      "أنشأ بواسطة",
      "تاريخ التحديث",
      "محدّث بواسطة",
    ],
    description: "Overtime records",
  },
  HRM_Deductions: {
    headers_en: [
      "DEDCT_ID",
      "PEN_ID",
      "PEN_Name",
      "EMP_ID",
      "DEDCT_Date",
      "DEDCT_Amnt",
      "DEDCT_Crt_At",
      "DEDCT_Crt_By",
      "DEDCT_Upd_At",
      "DEDCT_Upd_By",
    ],
    headers_ar: [
      "معرّف الخصم",
      "معرّف العقوبة",
      "اسم العقوبة",
      "معرّف الموظف",
      "تاريخ الخصم",
      "مبلغ الخصم",
      "تاريخ الإنشاء",
      "أنشأ بواسطة",
      "تاريخ التحديث",
      "محدّث بواسطة",
    ],
    description: "Employee deductions",
  },
  HRM_Analysis: {
    headers_en: [
      "HR_ANA_ID",
      "HR_ANA_Date",
      "HR_ANA_Start",
      "HR_ANA_End",
      "HR_ANA_Item1",
      "HR_ANA_Item2",
      "HR_ANA_Item3",
      "HR_ANA_Item4",
      "HR_ANA_Item5",
      "HR_ANA_Item6",
      "HR_ANA_Item7",
      "HR_ANA_Item8",
      "HR_ANA_Item9",
    ],
    headers_ar: [
      "معرّف تحليل الموارد البشرية",
      "تاريخ التحليل",
      "البداية",
      "النهاية",
      "العنصر 1",
      "العنصر 2",
      "العنصر 3",
      "العنصر 4",
      "العنصر 5",
      "العنصر 6",
      "العنصر 7",
      "العنصر 8",
      "العنصر 9",
    ],
    description: "HR analysis data",
  },

  // PRJ sheets (with Arabic headers)
  PRJ_Dashboard: {
    headers_en: [
      "PRJ_Dash_ID",
      "PRJ_Metric_Code",
      "PRJ_Metric_Value",
      "PRJ_Dash_Date",
      "PRJ_Dash_Notes",
    ],
    headers_ar: [
      "معرّف لوحة المشاريع",
      "رمز المقياس",
      "قيمة المقياس",
      "تاريخ لوحة المشاريع",
      "ملاحظات لوحة المشاريع",
    ],
    description: "Project dashboard metrics",
  },
  PRJ_Main: {
    headers_en: [
      "PRJ_ID",
      "PRJ_Name",
      "CLI_ID",
      "CLI_Name",
      "PRJ_Status",
      "PRJ_Type",
      "PRJ_Budget",
      "Plan_Num_Days",
      "Plan_Start_Date",
      "PRJ_Location",
      "ADV_Crt_At",
      "ADV_Crt_By",
      "ADV_Upd_At",
      "ADV_Upd_By",
    ],
    headers_ar: [
      "معرّف المشروع",
      "اسم المشروع",
      "معرّف العميل",
      "اسم العميل",
      "حالة المشروع",
      "نوع المشروع",
      "ميزانية المشروع",
      "عدد الأيام المخطط",
      "تاريخ البدء المخطط",
      "موقع المشروع",
      "تاريخ الإنشاء",
      "أنشأ بواسطة",
      "تاريخ التحديث",
      "محدّث بواسطة",
    ],
    description: "Project master data",
  },
};

/**
 * Create essential sheets for testing
 */
function setupDatabase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  Logger.log("Setting up database in spreadsheet: " + ss.getName());

  // Create sheets from schema
  for (const [sheetName, schema] of Object.entries(ERP_SCHEMA)) {
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);

      // Row 1: English headers
      sheet
        .getRange(1, 1, 1, schema.headers_en.length)
        .setValues([schema.headers_en]);

      // Row 2: Arabic headers (if provided)
      if (schema.headers_ar.length > 0) {
        sheet
          .getRange(2, 1, 1, schema.headers_ar.length)
          .setValues([schema.headers_ar]);
      }

      // Format headers
      const headerRange =
        schema.headers_ar.length > 0
          ? sheet.getRange(1, 1, 2, schema.headers_en.length)
          : sheet.getRange(1, 1, 1, schema.headers_en.length);
      headerRange
        .setFontWeight("bold")
        .setBackground("#4285f4")
        .setFontColor("#ffffff");

      Logger.log("Created sheet: " + sheetName);
    }
  }

  Logger.log("Database setup complete");
  SpreadsheetApp.getUi().alert("تم إنشاء جميع الجداول بنجاح!");
}

/**
 * Create default admin user
 */
function seedAdmin() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const usersSheet = ss.getSheetByName("SYS_Users");

  if (!usersSheet) {
    throw new Error("Please run setupDatabase() first");
  }

  // Hash password 'admin123'
  const password = "admin123";
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

  const now = new Date().toISOString();

  // Add admin user (Row 3 - first data row)
  usersSheet
    .getRange(3, 1, 1, 14)
    .setValues([
      [
        "USR001",
        "System Administrator",
        "admin",
        "admin@nijjara.com",
        "مدير النظام",
        "الإدارة",
        "ROLE_ADMIN",
        true,
        hashString,
        "",
        now,
        "SYSTEM",
        now,
        "SYSTEM",
      ],
    ]);

  Logger.log("Admin user created successfully");
  SpreadsheetApp.getUi().alert(
    "تم إنشاء مستخدم المدير!\n\nاسم المستخدم: admin\nكلمة السر: admin123"
  );
}

/**
 * Custom menu on open
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu("🔧 Nijjara ERP")
    .addItem("1️⃣ Initialize Database", "setupDatabase")
    .addItem("2️⃣ Create Admin User", "seedAdmin")
    .addItem("3️⃣ Seed Configuration Data", "seedAllData")
    .addToUi();
}
