/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * NIJJARA ERP - Setup.js
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * Purpose: 
 *   - Single source of truth for database schema
 *   - Builds, validates, and updates the entire Google Sheet structure
 *   - Creates all required sheets with bilingual headers
 *   - Initializes system configuration
 * 
 * Usage: Run in Google Apps Script editor from the menu
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

// ╔════════════════════════════════════════════════════════════════╗
// ║                        ERP_SCHEMA OBJECT                       ║
// ║     This defines EVERY sheet and EVERY header in the system    ║
// ╚════════════════════════════════════════════════════════════════╝

const ERP_SCHEMA = {
  // ════════════════════════════════════════════════════════════════
  // SYSTEM ENGINES (ENG_) - Configuration Sheets
  // ════════════════════════════════════════════════════════════════
  
  "ENG_Forms": {
    headers_en: [
      "FORM_ID", "Form_Label", "TAB_ID", "Tab_Label", "FIELD_ID", 
      "Field_Label", "Field_Type", "Field_Can_Edit", "Source_Sheet", 
      "Source_Columns", "Is_Mandatory", "Default_Value", "DD_ID", 
      "Target_Sheet", "Target_Column", "ROL_ID", "Is_Visible", "BTN_ID"
    ],
    headers_ar: [
      "معرّف النموذج", "عنوان النموذج", "معرّف التبويب", "عنوان التبويب", 
      "معرّف الحقل", "تسمية الحقل", "نوع الحقل", "يمكن تحرير الحقل", 
      "الورقة المصدر", "أعمدة المصدر", "حقل إلزامي", "القيمة الافتراضية", 
      "معرّف القائمة المنسدلة", "ورقة الهدف", "عمود الهدف", "معرّف الدور", 
      "مرئي", "معرّف الزر"
    ],
    description: "Form definitions for data entry and display"
  },

  "ENG_Views": {
    headers_en: ["VIEW_ID", "View_Title", "Source_Sheet", "Source_Columns"],
    headers_ar: ["معرّف العرض", "عنوان العرض", "الورقة المصدر", "أعمدة المصدر"],
    description: "Custom views for displaying lists of data"
  },

  "ENG_Buttons": {
    headers_en: ["BTN_ID", "BTN_Label", "BTN_Type", "BTN_Description"],
    headers_ar: ["معرّف الزر", "تسمية الزر", "نوع الزر", "وصف الزر"],
    description: "Action buttons available in forms and tabs"
  },

  "ENG_Dropdowns": {
    headers_en: ["DD_ID", "DD_EN", "DD_AR", "DD_Is_Active", "DD_Sort_Order"],
    headers_ar: ["معرّف القائمة", "الاسم بالإنجليزية", "الاسم بالعربية", "نشط", "ترتيب الفرز"],
    description: "Dropdown lists used in forms"
  },

  "ENG_Settings": {
    headers_en: ["Setting_Key", "Setting_Value", "Description_EN", "Updated_By", "Updated_At"],
    headers_ar: ["مفتاح الإعداد", "قيمة الإعداد", "الوصف", "محدّث بواسطة", "تاريخ التحديث"],
    description: "System-wide configuration settings"
  },

  // ════════════════════════════════════════════════════════════════
  // SYSTEM ADMINISTRATION (SYS_) - Core System Tables
  // ════════════════════════════════════════════════════════════════

  "SYS_Users": {
    headers_en: [
      "USR_ID", "EMP_Name_EN", "USR_Name", "EMP_Email", "Job_Title", 
      "DEPT_Name", "ROL_ID", "USR_Is_Active", "Password_Hash", 
      "Last_Login", "USR_Crt_At", "USR_Crt_By", "USR_Upd_At", "USR_Upd_By"
    ],
    headers_ar: [
      "معرّف المستخدم", "اسم الموظف", "اسم المستخدم", "البريد الإلكتروني", 
      "المسمى الوظيفي", "الإدارة", "معرّف الدور", "نشط", "كلمة المرور المشفرة", 
      "آخر تسجيل دخول", "تاريخ الإنشاء", "أنشأ بواسطة", "تاريخ التحديث", "محدّث بواسطة"
    ],
    description: "System users and authentication"
  },

  "SYS_Roles": {
    headers_en: ["ROL_ID", "ROL_Title", "ROL_Notes", "ROL_Is_System", "ROL_Crt_At", "ROL_Crt_By", "ROL_Upd_At", "ROL_Upd_By"],
    headers_ar: ["معرّف الدور", "عنوان الدور", "ملاحظات الدور", "دور النظام", "تاريخ الإنشاء", "أنشأ بواسطة", "تاريخ التحديث", "محدّث بواسطة"],
    description: "User roles and permissions"
  },

  "SYS_Permissions": {
    headers_en: ["PRM_ID", "PRM_Name", "PRM_Notes", "PRM_Catg", "PRM_Crt_At", "PRM_Crt_By", "PRM_Upd_At", "PRM_Upd_By"],
    headers_ar: ["معرّف الصلاحية", "اسم الصلاحية", "ملاحظات", "الفئة", "تاريخ الإنشاء", "أنشأ بواسطة", "تاريخ التحديث", "محدّث بواسطة"],
    description: "System permissions"
  },

  "SYS_Role_Permissions": {
    headers_en: ["ROL_ID", "PRM_ID", "SRP_Scope", "SRP_Is_Allowed", "SRP_Constraints", "SRP_Crt_At", "SRP_Crt_By", "SRP_Upd_At", "SRP_Upd_By"],
    headers_ar: ["معرّف الدور", "معرّف الصلاحية", "النطاق", "مسموح", "القيود", "تاريخ الإنشاء", "أنشأ بواسطة", "تاريخ التحديث", "محدّث بواسطة"],
    description: "Role-permission mappings"
  },

  "SYS_Sessions": {
    headers_en: [
      "SESS_ID", "USR_ID", "EMP_Email", "Actor_USR_ID", "SESS_Type", 
      "SESS_Status", "USR_Device", "IP_Address", "Auth_Token", 
      "SESS_Start_At", "SESS_End_At", "SESS_Crt_At", "SESS_Crt_By", 
      "SESS_Last_Seen", "SESS_Revoked_At", "SESS_Revoked_By", "SESS_Metadata"
    ],
    headers_ar: [
      "معرّف الجلسة", "معرّف المستخدم", "البريد الإلكتروني", "معرّف الممثل", "نوع الجلسة",
      "حالة الجلسة", "الجهاز", "عنوان IP", "رمز التحقق",
      "وقت البداية", "وقت النهاية", "تاريخ الإنشاء", "أنشأ بواسطة",
      "آخر مشاهدة", "تم السحب", "تم السحب بواسطة", "بيانات وصفية"
    ],
    description: "Active user sessions"
  },

  "SYS_Audit_Log": {
    headers_en: [
      "AUD_ID", "AUD_Time_Stamp", "USR_ID", "USR_Name", "USR_Action", 
      "ACT_Details", "AUD_Entity", "AUD_Entity_ID", "AUD_Scope", 
      "AUD_Sheet_ID", "AUD_Sheet_Name", "IP_Address"
    ],
    headers_ar: [
      "معرّف التدقيق", "الطابع الزمني", "معرّف المستخدم", "اسم المستخدم", "إجراء المستخدم",
      "تفاصيل الإجراء", "كيان التدقيق", "معرّف الكيان", "النطاق",
      "معرّف الورقة", "اسم الورقة", "عنوان IP"
    ],
    description: "Audit trail for all system actions"
  },

  "SYS_Dashboard": {
    headers_en: ["SYS_Dash_ID", "SYS_Metric_Code", "SYS_Metric_Value", "SYS_Dash_Date", "SYS_Dash_Notes"],
    headers_ar: ["معرّف لوحة التحكم", "رمز المقياس", "قيمة المقياس", "التاريخ", "ملاحظات"],
    description: "System dashboard metrics"
  },

  "SYS_Documents": {
    headers_en: ["DOC_ID", "DOC_Entity", "DOC_Entity_ID", "DOC_File_Name", "DOC_Label", "DOC_Drive_File_ID", "DOC_Drive_URL", "DOC_Upload_By", "DOC_Crt_At"],
    headers_ar: ["معرّف المستند", "الكيان", "معرّف الكيان", "اسم الملف", "التسمية", "معرّف الملف", "رابط الملف", "تم الرفع بواسطة", "تاريخ الإنشاء"],
    description: "Document management"
  },

  "SYS_PubHolidays": {
    headers_en: ["PUBHOL_ID", "Pub_Holiday_Date", "Pub_Holiday_Name"],
    headers_ar: ["معرّف العطلة", "تاريخ العطلة", "اسم العطلة"],
    description: "Public holidays"
  },

  "SYS_Analysis": {
    headers_en: ["SYS_ANA_ID", "SYS_ANA_Date", "SYS_ANA_Start", "SYS_ANA_End", "SYS_ANA_Item1", "SYS_ANA_Item2", "SYS_ANA_Item3", "SYS_ANA_Item4", "SYS_ANA_Item5", "SYS_ANA_Item6", "SYS_ANA_Item7", "SYS_ANA_Item8", "SYS_ANA_Item9"],
    headers_ar: ["معرّف التحليل", "التاريخ", "البداية", "النهاية", "البند 1", "البند 2", "البند 3", "البند 4", "البند 5", "البند 6", "البند 7", "البند 8", "البند 9"],
    description: "System analysis data"
  },

  // ════════════════════════════════════════════════════════════════
  // HUMAN RESOURCES (HRM_) - HR Management Tables
  // ════════════════════════════════════════════════════════════════

  "HRM_Departments": {
    headers_en: ["DEPT_ID", "DEPT_Name", "DEPT_Is_Active", "DEPT_Sort_Order", "DEPT_Crt_At", "DEPT_Crt_By", "DEPT_Upd_At", "DEPT_Upd_By"],
    headers_ar: ["معرّف الإدارة", "اسم الإدارة", "نشط", "ترتيب الفرز", "تاريخ الإنشاء", "أنشأ بواسطة", "تاريخ التحديث", "محدّث بواسطة"],
    description: "HR Departments"
  },

  "HRM_Employees": {
    headers_en: [
      "EMP_ID", "EMP_Name_EN", "EMP_Name_AR", "Date_of_Birth", "Gender", 
      "National_ID", "Marital_Status", "Military_Status", "EMP_Mob_Main", 
      "EMP_Mob_Sub", "Home_Address", "EMP_Email", "Emrgcy_Cont", 
      "EmrCont_Relation", "EmrCont_Mob", "Job_Title", "DEPT_Name", 
      "Hire_Date", "EMP_CONT_Type", "EMP_Status", "Basic_Salary", 
      "Allowances", "Deducts", "EMP_Crt_At", "EMP_Crt_By"
    ],
    headers_ar: [
      "معرّف الموظف", "اسم الموظف بالإنجليزية", "اسم الموظف بالعربية", "تاريخ الميلاد", "الجنس",
      "الهوية الوطنية", "الحالة الاجتماعية", "الحالة العسكرية", "الهاتف الرئيسي",
      "الهاتف الثانوي", "العنوان", "البريد الإلكتروني", "جهة الاتصال الطارئة",
      "علاقة جهة الاتصال", "هاتف جهة الاتصال", "المسمى الوظيفي", "الإدارة",
      "تاريخ التعيين", "نوع العقد", "حالة الموظف", "الراتب الأساسي",
      "البدلات", "الخصومات", "تاريخ الإنشاء", "أنشأ بواسطة"
    ],
    description: "Employee master data"
  },

  "HRM_Attendance": {
    headers_en: ["ATT_ID", "EMP_ID", "ATT_Date", "ATT_Check_In", "ATT_Check_Out", "ATT_Hours", "ATT_Late_Mints", "ATT_EarlyLV_Mints", "ATT_OT_Mints", "ATT_Notes", "ATT_Status", "ATT_Crt_At", "ATT_Crt_By", "ATT_Upd_At", "ATT_Upd_By"],
    headers_ar: ["معرّف الحضور", "معرّف الموظف", "التاريخ", "دخول", "خروج", "الساعات", "التأخر", "المغادرة المبكرة", "الإضافي", "ملاحظات", "الحالة", "تاريخ الإنشاء", "أنشأ بواسطة", "تاريخ التحديث", "محدّث بواسطة"],
    description: "Employee attendance records"
  },

  "HRM_Leave": {
    headers_en: ["LV_ID", "EMP_ID", "LV_Type", "LV_Start_Date", "LV_End_Date", "LV_NumDays", "LV_Status", "LV_Reason", "LV_Approved_By", "LV_Notes", "LV_Crt_At", "LV_Crt_By", "LV_Upd_At", "LV_Upd_By"],
    headers_ar: ["معرّف الإجازة", "معرّف الموظف", "نوع الإجازة", "تاريخ البداية", "تاريخ النهاية", "عدد الأيام", "الحالة", "السبب", "موافق من قبل", "ملاحظات", "تاريخ الإنشاء", "أنشأ بواسطة", "تاريخ التحديث", "محدّث بواسطة"],
    description: "Employee leave requests"
  },

  "HRM_Advances": {
    headers_en: ["ADV_ID", "EMP_ID", "ADV_Issue_Date", "ADV_Amnt", "ADV_Setlmnt_Period", "ADV_Instal", "ADV_Notes", "ADV_Status", "ADV_Crt_At", "ADV_Crt_By", "ADV_Upd_At", "ADV_Upd_By"],
    headers_ar: ["معرّف السلفة", "معرّف الموظف", "تاريخ الإصدار", "المبلغ", "فترة التسوية", "القسط", "ملاحظات", "الحالة", "تاريخ الإنشاء", "أنشأ بواسطة", "تاريخ التحديث", "محدّث بواسطة"],
    description: "Employee salary advances"
  },

  "HRM_OverTime": {
    headers_en: ["OT_ID", "EMP_ID", "POL_OT_ID", "ATT_Date", "ATT_OT_Mints", "OT_Amnt", "OT_Crt_At", "OT_Crt_By", "OT_Upd_At", "OT_Upd_By"],
    headers_ar: ["معرّف الإضافي", "معرّف الموظف", "معرّف السياسة", "التاريخ", "الدقائق", "المبلغ", "تاريخ الإنشاء", "أنشأ بواسطة", "تاريخ التحديث", "محدّث بواسطة"],
    description: "Overtime records"
  },

  "HRM_Deductions": {
    headers_en: ["DEDCT_ID", "PEN_ID", "PEN_Name", "EMP_ID", "DEDCT_Date", "DEDCT_Amnt", "DEDCT_Crt_At", "DEDCT_Crt_By", "DEDCT_Upd_At", "DEDCT_Upd_By"],
    headers_ar: ["معرّف الخصم", "معرّف العقوبة", "اسم العقوبة", "معرّف الموظف", "التاريخ", "المبلغ", "تاريخ الإنشاء", "أنشأ بواسطة", "تاريخ التحديث", "محدّث بواسطة"],
    description: "Employee deductions"
  },

  "HRM_Dashboard": {
    headers_en: ["HR_Dash_ID", "HR_Metric_Code", "HR_Metric_Value", "HR_Dash_Date", "HR_Dash_Notes"],
    headers_ar: ["معرّف لوحة التحكم", "رمز المقياس", "قيمة المقياس", "التاريخ", "ملاحظات"],
    description: "HR dashboard metrics"
  },

  "HRM_Analysis": {
    headers_en: ["HR_ANA_ID", "HR_ANA_Date", "HR_ANA_Start", "HR_ANA_End", "HR_ANA_Item1", "HR_ANA_Item2", "HR_ANA_Item3", "HR_ANA_Item4", "HR_ANA_Item5", "HR_ANA_Item6", "HR_ANA_Item7", "HR_ANA_Item8", "HR_ANA_Item9"],
    headers_ar: ["معرّف التحليل", "التاريخ", "البداية", "النهاية", "البند 1", "البند 2", "البند 3", "البند 4", "البند 5", "البند 6", "البند 7", "البند 8", "البند 9"],
    description: "HR analysis data"
  },

  // ════════════════════════════════════════════════════════════════
  // PROJECTS (PRJ_) - Project Management Tables
  // ════════════════════════════════════════════════════════════════

  "PRJ_Clients": {
    headers_en: ["CLI_ID", "CLI_Name", "CLI_Mob_1", "CLI_Mob_2", "CLI_Email", "ADV_Crt_At", "ADV_Crt_By", "ADV_Upd_At", "ADV_Upd_By"],
    headers_ar: ["معرّف العميل", "اسم العميل", "الهاتف 1", "الهاتف 2", "البريد الإلكتروني", "تاريخ الإنشاء", "أنشأ بواسطة", "تاريخ التحديث", "محدّث بواسطة"],
    description: "Project clients"
  },

  "PRJ_Main": {
    headers_en: ["PRJ_ID", "PRJ_Name", "CLI_ID", "CLI_Name", "PRJ_Status", "PRJ_Type", "PRJ_Budget", "Plan_Num_Days", "Plan_Start_Date", "PRJ_Location", "ADV_Crt_At", "ADV_Crt_By", "ADV_Upd_At", "ADV_Upd_By"],
    headers_ar: ["معرّف المشروع", "اسم المشروع", "معرّف العميل", "اسم العميل", "الحالة", "النوع", "الميزانية", "عدد الأيام المخطط", "تاريخ البداية المخطط", "الموقع", "تاريخ الإنشاء", "أنشأ بواسطة", "تاريخ التحديث", "محدّث بواسطة"],
    description: "Projects master data"
  },

  "PRJ_Tasks": {
    headers_en: ["TSK_ID", "PRJ_ID", "TSK_Name", "TSK_Priority", "EMP_ID", "TSK_Plan_Start", "TSK_Plan_End", "TSK_Start", "TSK_End", "TSK_Status", "ADV_Crt_At", "ADV_Crt_By", "ADV_Upd_At", "ADV_Upd_By"],
    headers_ar: ["معرّف المهمة", "معرّف المشروع", "اسم المهمة", "الأولوية", "معرّف الموظف", "البداية المخطط", "النهاية المخطط", "البداية الفعلية", "النهاية الفعلية", "الحالة", "تاريخ الإنشاء", "أنشأ بواسطة", "تاريخ التحديث", "محدّث بواسطة"],
    description: "Project tasks"
  },

  "PRJ_Material": {
    headers_en: ["MAT_ID", "MAT_Name", "MAT_Catg", "MAT_Sub1", "MAT_Sub2", "Default_Unit", "Default_Price", "MAT_Active", "ADV_Crt_At", "ADV_Crt_By", "ADV_Upd_At", "ADV_Upd_By"],
    headers_ar: ["معرّف المادة", "اسم المادة", "الفئة", "الفئة الفرعية 1", "الفئة الفرعية 2", "الوحدة الافتراضية", "السعر الافتراضي", "نشط", "تاريخ الإنشاء", "أنشأ بواسطة", "تاريخ التحديث", "محدّث بواسطة"],
    description: "Materials master data"
  },

  "PRJ_IndirExp_Time_Alloc": {
    headers_en: ["ALO_TM_ID", "InDiEXP_TM_ID", "PRJ_ID", "ALO_TM_Methd", "ALO_TM_Percnt", "ALO_TM_Amnt", "ADV_Crt_At", "ADV_Crt_By", "ADV_Upd_At", "ADV_Upd_By"],
    headers_ar: ["معرّف التخصيص", "معرّف النفقة", "معرّف المشروع", "الطريقة", "النسبة المئوية", "المبلغ", "تاريخ الإنشاء", "أنشأ بواسطة", "تاريخ التحديث", "محدّث بواسطة"],
    description: "Indirect expense time-based allocation"
  },

  "PRJ_IndirExp_NoTime_Alloc": {
    headers_en: ["ALO_NT_ID", "InDiEXP_NT_ID", "PRJ_ID", "ALO_NT_Methd", "ALO_NT_Percnt", "ALO_NT_Amnt", "ADV_Crt_At", "ADV_Crt_By", "ADV_Upd_At", "ADV_Upd_By"],
    headers_ar: ["معرّف التخصيص", "معرّف النفقة", "معرّف المشروع", "الطريقة", "النسبة المئوية", "المبلغ", "تاريخ الإنشاء", "أنشأ بواسطة", "تاريخ التحديث", "محدّث بواسطة"],
    description: "Indirect expense non-time-based allocation"
  },

  "PRJ_Plan_vs_Actual": {
    headers_en: ["PvA_ID", "PRJ_ID", "PRJ_Name", "Plan_Start_Date", "Actual_Start_Date", "Plan_Num_Days", "Actual_Num_Days", "Plan_End_Date", "Actual_End_Date", "Plan_Direct_Exp", "Actual_Direct_Exp", "Plan_MATs", "Actual_MATs", "ADV_Crt_At", "ADV_Crt_By", "ADV_Upd_At", "ADV_Upd_By"],
    headers_ar: ["معرّف المقارنة", "معرّف المشروع", "اسم المشروع", "تاريخ البداية المخطط", "تاريخ البداية الفعلي", "عدد الأيام المخطط", "عدد الأيام الفعلي", "تاريخ النهاية المخطط", "تاريخ النهاية الفعلي", "النفقات المباشرة المخططة", "النفقات المباشرة الفعلية", "المواد المخططة", "المواد الفعلية", "تاريخ الإنشاء", "أنشأ بواسطة", "تاريخ التحديث", "محدّث بواسطة"],
    description: "Project plan vs actual tracking"
  },

  "PRJ_Dashboard": {
    headers_en: ["PRJ_Dash_ID", "PRJ_Metric_Code", "PRJ_Metric_Value", "PRJ_Dash_Date", "PRJ_Dash_Notes"],
    headers_ar: ["معرّف لوحة التحكم", "رمز المقياس", "قيمة المقياس", "التاريخ", "ملاحظات"],
    description: "Project dashboard metrics"
  },

  "PRJ_Analysis": {
    headers_en: ["PRJ_ANA_ID", "PRJ_ANA_Date", "PRJ_ANA_Start", "PRJ_ANA_End", "PRJ_ANA_Item1", "PRJ_ANA_Item2", "PRJ_ANA_Item3", "PRJ_ANA_Item4", "PRJ_ANA_Item5", "PRJ_ANA_Item6", "PRJ_ANA_Item7", "PRJ_ANA_Item8", "PRJ_ANA_Item9"],
    headers_ar: ["معرّف التحليل", "التاريخ", "البداية", "النهاية", "البند 1", "البند 2", "البند 3", "البند 4", "البند 5", "البند 6", "البند 7", "البند 8", "البند 9"],
    description: "Project analysis data"
  },

  // ════════════════════════════════════════════════════════════════
  // FINANCE (FIN_) - Financial Management Tables
  // ════════════════════════════════════════════════════════════════

  "FIN_DirectExpenses": {
    headers_en: ["DiEXP_ID", "PRJ_ID", "PRJ_Name", "DiEXP_Date", "MAT_ID", "MAT_Name", "MAT_Catg", "MAT_Sub1", "MAT_Sub2", "Default_Unit", "Default_Price", "MAT_Quantity", "DiEXP_Total_VAT_Exc", "DiEXP_Total_VAT_Inc", "DiEXP_Pay_Status", "DiEXP_Pay_Methd", "DiEXP_Notes", "ADV_Crt_At", "ADV_Crt_By", "ADV_Upd_At", "ADV_Upd_By"],
    headers_ar: ["معرّف النفقة", "معرّف المشروع", "اسم المشروع", "التاريخ", "معرّف المادة", "اسم المادة", "الفئة", "الفئة الفرعية 1", "الفئة الفرعية 2", "الوحدة", "السعر", "الكمية", "الإجمالي بدون ضريبة", "الإجمالي مع ضريبة", "حالة الدفع", "طريقة الدفع", "ملاحظات", "تاريخ الإنشاء", "أنشأ بواسطة", "تاريخ التحديث", "محدّث بواسطة"],
    description: "Direct project expenses"
  },

  "FIN_InDirectExpenses_Time": {
    headers_en: ["InDiEXP_TM_ID", "InDiEXP_TM_Catg", "InDiEXP_TM_Sub1", "InDiEXP_TM_Sub2", "InDiEXP_Start", "InDiEXP_End", "InDiEXP_TM_Pay_Status", "InDiEXP_TM_Pay_Methd", "InDiEXP_TM_Notes", "ADV_Crt_At", "ADV_Crt_By", "ADV_Upd_At", "ADV_Upd_By"],
    headers_ar: ["معرّف النفقة", "الفئة", "الفئة الفرعية 1", "الفئة الفرعية 2", "البداية", "النهاية", "حالة الدفع", "طريقة الدفع", "ملاحظات", "تاريخ الإنشاء", "أنشأ بواسطة", "تاريخ التحديث", "محدّث بواسطة"],
    description: "Indirect time-based expenses"
  },

  "FIN_InDirectExpenses_NoTime": {
    headers_en: ["InDiEXP_NT_ID", "InDiEXP_NT_Catg", "InDiEXP_NT_Sub1", "InDiEXP_NT_Sub2", "Useful_Life_Months", "Depreciation_Start_Date", "InDiEXP_NT_Pay_Status", "InDiEXP_NT_Pay_Methd", "InDiEXP_NT_Notes", "ADV_Crt_At", "ADV_Crt_By", "ADV_Upd_At", "ADV_Upd_By"],
    headers_ar: ["معرّف النفقة", "الفئة", "الفئة الفرعية 1", "الفئة الفرعية 2", "العمر الافتراضي", "تاريخ البداية", "حالة الدفع", "طريقة الدفع", "ملاحظات", "تاريخ الإنشاء", "أنشأ بواسطة", "تاريخ التحديث", "محدّث بواسطة"],
    description: "Indirect non-time-based expenses"
  },

  "FIN_PRJ_Revenue": {
    headers_en: ["REV_ID", "PRJ_ID", "REV_Date", "REV_Amnt", "REV_Type", "REV_Source", "REV_Notes", "REV_Pay_Methd", "REV_Invoice_Number", "REV_Pay_Status", "REV_Total", "REV_Remain", "ADV_Crt_At", "ADV_Crt_By", "ADV_Upd_At", "ADV_Upd_By"],
    headers_ar: ["معرّف الإيراد", "معرّف المشروع", "التاريخ", "المبلغ", "النوع", "المصدر", "ملاحظات", "طريقة الدفع", "رقم الفاتورة", "حالة الدفع", "الإجمالي", "المتبقي", "تاريخ الإنشاء", "أنشأ بواسطة", "تاريخ التحديث", "محدّث بواسطة"],
    description: "Project revenue records"
  },

  "FIN_Custody": {
    headers_en: ["CSTD_ID", "EMP_ID", "EMP_Name", "PRJ_ID", "PRJ_Name", "CSTD_Issue_Date", "CSTD_Settl_Date", "CSTD_Amnt", "CSTD_Purpose", "CSTD_Status", "CSTD_Notes", "ADV_Crt_At", "ADV_Crt_By", "ADV_Upd_At", "ADV_Upd_By"],
    headers_ar: ["معرّف العهدة", "معرّف الموظف", "اسم الموظف", "معرّف المشروع", "اسم المشروع", "تاريخ الإصدار", "تاريخ التسوية", "المبلغ", "الغرض", "الحالة", "ملاحظات", "تاريخ الإنشاء", "أنشأ بواسطة", "تاريخ التحديث", "محدّث بواسطة"],
    description: "Custody/advances management"
  },

  "FIN_HRM_Payroll": {
    headers_en: ["PAY_ID", "EMP_ID", "EMP_Name", "PAY_Start_Date", "PAY_End_Date", "Basic_Salary", "Total_OT_Amnt", "ADV_Instal", "Total_DEDCT_Amnt", "PAY_Net_Pay", "PAY_Status", "ADV_Crt_At", "ADV_Crt_By", "ADV_Upd_At", "ADV_Upd_By"],
    headers_ar: ["معرّف الرواتب", "معرّف الموظف", "اسم الموظف", "تاريخ البداية", "تاريخ النهاية", "الراتب الأساسي", "إجمالي الإضافي", "قسط السلفة", "إجمالي الخصومات", "صافي الراتب", "الحالة", "تاريخ الإنشاء", "أنشأ بواسطة", "تاريخ التحديث", "محدّث بواسطة"],
    description: "Payroll records"
  },

  "FIN_P&L_Statements": {
    headers_en: ["P&L_ID", "Rev_ID", "DiEXP_ID", "InDiEXP_TM_ID", "InDiEXP_NT_ID", "REV_Total", "Total_DiEXP", "Total_InDiEXP_TM", "Total_InDiEXP_NT", "P&L_Start_Date", "P&L_End_Date", "P&L_Amnt", "ADV_Crt_At", "ADV_Crt_By", "ADV_Upd_At", "ADV_Upd_By"],
    headers_ar: ["معرّف الحساب", "معرّف الإيراد", "معرّف النفقة", "معرّف النفقة", "معرّف النفقة", "إجمالي الإيراد", "إجمالي النفقات المباشرة", "إجمالي النفقات غير المباشرة", "إجمالي النفقات", "تاريخ البداية", "تاريخ النهاية", "المبلغ", "تاريخ الإنشاء", "أنشأ بواسطة", "تاريخ التحديث", "محدّث بواسطة"],
    description: "Profit & Loss statements"
  },

  "FIN_Dashboard": {
    headers_en: ["FIN_Dash_ID", "FIN_Metric_Code", "FIN_Metric_Value", "FIN_Dash_Date", "FIN_Dash_Notes"],
    headers_ar: ["معرّف لوحة التحكم", "رمز المقياس", "قيمة المقياس", "التاريخ", "ملاحظات"],
    description: "Finance dashboard metrics"
  },

  "FIN_Analysis": {
    headers_en: ["FIN_ANA_ID", "FIN_ANA_Date", "FIN_ANA_Start", "FIN_ANA_End", "FIN_ANA_Item1", "FIN_ANA_Item2", "FIN_ANA_Item3", "FIN_ANA_Item4", "FIN_ANA_Item5", "FIN_ANA_Item6", "FIN_ANA_Item7", "FIN_ANA_Item8", "FIN_ANA_Item9"],
    headers_ar: ["معرّف التحليل", "التاريخ", "البداية", "النهاية", "البند 1", "البند 2", "البند 3", "البند 4", "البند 5", "البند 6", "البند 7", "البند 8", "البند 9"],
    description: "Finance analysis data"
  }
};

// ╔════════════════════════════════════════════════════════════════╗
// ║                   MAIN SETUP FUNCTIONS                        ║
// ╚════════════════════════════════════════════════════════════════╝

/**
 * MAIN: Execute full system setup
 * This function creates all sheets and headers in the Google Sheet
 */
function setupERPSystem() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    Logger.log("🚀 Starting ERP System Setup...");
    
    // Get existing sheets
    const existingSheets = ss.getSheets().map(s => s.getName());
    
    for (const [sheetName, config] of Object.entries(ERP_SCHEMA)) {
      try {
        // Check if sheet exists
        let sheet = ss.getSheetByName(sheetName);
        
        if (!sheet) {
          // Create new sheet
          sheet = ss.insertSheet(sheetName);
          Logger.log(`✅ Created sheet: ${sheetName}`);
        } else {
          Logger.log(`⚠️  Sheet already exists: ${sheetName} (skipping creation)`);
        }
        
        // Add bilingual headers
        const headers_en = config.headers_en;
        const headers_ar = config.headers_ar;
        
        // Clear existing content
        const range = sheet.getRange(1, 1, sheet.getMaxRows(), sheet.getMaxColumns());
        range.clearContent();
        
        // Write English headers (Row 1)
        sheet.getRange(1, 1, 1, headers_en.length).setValues([headers_en]);
        
        // Write Arabic headers (Row 2)
        sheet.getRange(2, 1, 1, headers_ar.length).setValues([headers_ar]);
        
        // Format headers
        const headerRange = sheet.getRange(1, 1, 2, Math.max(headers_en.length, headers_ar.length));
        headerRange.setFontWeight("bold");
        headerRange.setBackground("#4285F4");
        headerRange.setFontColor("white");
        headerRange.setHorizontalAlignment("center");
        
        Logger.log(`✅ Headers added for: ${sheetName}`);
        
      } catch (e) {
        Logger.log(`❌ Error setting up sheet ${sheetName}: ${e.message}`);
      }
    }
    
    Logger.log("✅ ERP System setup completed successfully!");
    showAlert("✅ ERP System Setup Complete!", "All sheets and headers have been created.");
    
  } catch (e) {
    Logger.log(`❌ Setup Error: ${e.message}`);
    showAlert("❌ Error During Setup", e.message);
  }
}

/**
 * Validation: Check if all required sheets exist
 */
function validateSchemaIntegrity() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const existingSheets = ss.getSheets().map(s => s.getName());
  const requiredSheets = Object.keys(ERP_SCHEMA);
  
  const missing = requiredSheets.filter(s => !existingSheets.includes(s));
  
  if (missing.length === 0) {
    Logger.log("✅ All required sheets exist!");
    return true;
  } else {
    Logger.log(`❌ Missing sheets: ${missing.join(", ")}`);
    return false;
  }
}

/**
 * Utility: Show alert dialog
 */
function showAlert(title, message) {
  SpreadsheetApp.getUi().alert(`${title}\n\n${message}`);
}

/**
 * Get the ERP_SCHEMA for external use
 */
function getERPSchema() {
  return ERP_SCHEMA;
}

/**
 * Get all sheet names from schema
 */
function getSchemaSheetNames() {
  return Object.keys(ERP_SCHEMA);
}

/**
 * Export schema as JSON (for frontend use)
 */
function exportSchemaAsJSON() {
  return JSON.stringify(ERP_SCHEMA, null, 2);
}

