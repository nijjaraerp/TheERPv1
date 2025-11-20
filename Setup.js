/**
 * Setup.js
 * ========
 * Single Source of Truth for ERP Database Schema
 * This file defines the complete structure of all sheets in TheERPv1 Google Sheet
 * 
 * CRITICAL: All sheets follow bilingual header standard:
 * - Row 1: English backend column names
 * - Row 2: Arabic frontend column names
 * - Row 3+: Data
 */

const ERP_SCHEMA = {
  
  // ============================================================
  // SYSTEM ENGINES (ENG_)
  // ============================================================
  
  ENG_Forms: {
    headers_en: [
      'FORM_ID', 'Form_Label', 'Tab_ID', 'Tab_Label', 'Field_ID', 
      'Field_Label', 'Field_Type', 'Field_Can_Edit', 'Source_Sheet', 'Source_Columns', 
      'Is_Mandatory', 'Default_Value', 'DD_ID', 'Target_Sheet', 'Target_Column', 
      'ROL_ID', 'Is_Visible', 'But_ID'
    ],
    headers_ar: [
      'معرف النموذج', 'عنوان النموذج', 'معرف التبويب', 'عنوان التبويب', 'معرف الحقل',
      'تسمية الحقل', 'نوع الحقل', 'قابل للتعديل', 'جدول المصدر', 'أعمدة المصدر',
      'إلزامي', 'القيمة الافتراضية', 'معرف القائمة', 'جدول الهدف', 'عمود الهدف',
      'معرف الدور', 'مرئي', 'معرف الزر'
    ]
  },

  ENG_Views: {
    headers_en: ['VIEW_ID', 'View_Title', 'Source_Sheet', 'Source_Columns'],
    headers_ar: ['معرف العرض', 'عنوان العرض', 'جدول المصدر', 'أعمدة المصدر']
  },

  ENG_Buttons: {
    headers_en: ['BTN_ID', 'BTN_Label', 'BTN_Type', 'BTN_Description'],
    headers_ar: ['معرف الزر', 'تسمية الزر', 'نوع الزر', 'وصف الزر']
  },

  ENG_Dropdowns: {
    headers_en: ['DD_ID', 'DD_EN', 'DD_AR', 'DD_Is_Active', 'DD_Sort_Order'],
    headers_ar: ['معرف القائمة', 'الاسم بالإنجليزية', 'الاسم بالعربية', 'نشط', 'ترتيب الفرز']
  },

  ENG_Settings: {
    headers_en: ['Setting_Key', 'Setting_Value', 'Description_EN', 'Updated_By', 'Updated_At'],
    headers_ar: ['مفتاح الإعداد', 'قيمة الإعداد', 'الوصف', 'تم التحديث بواسطة', 'تاريخ التحديث']
  },

  // ============================================================
  // SYSTEM ADMINISTRATION (SYS_)
  // ============================================================

  SYS_Dashboard: {
    headers_en: ['SYS_Dash_ID', 'SYS_Metric_Code', 'SYS_Metric_Value', 'SYS_Dash_Date', 'SYS_Dash_Notes'],
    headers_ar: ['معرف اللوحة', 'رمز المقياس', 'قيمة المقياس', 'التاريخ', 'ملاحظات']
  },

  SYS_Documents: {
    headers_en: [
      'DOC_ID', 'DOC_Entity', 'DOC_Entity_ID', 'DOC_File_Name', 'DOC_Label',
      'DOC_Drive_File_ID', 'DOC_Drive_URL', 'DOC_Upload_By', 'DOC_Crt_At'
    ],
    headers_ar: [
      'معرف المستند', 'الكيان', 'معرف الكيان', 'اسم الملف', 'تسمية المستند',
      'معرف الملف في Drive', 'رابط Drive', 'تم الرفع بواسطة', 'تاريخ الإنشاء'
    ]
  },

  SYS_Users: {
    headers_en: [
      'USR_ID', 'EMP_Name_EN', 'USR_Name', 'EMP_Email', 'Job_Title', 'DEPT_Name',
      'ROL_ID', 'USR_Is_Active', 'Password_Hash', 'Last_Login',
      'USR_Crt_At', 'USR_Crt_By', 'USR_Upd_At', 'USR_Upd_By'
    ],
    headers_ar: [
      'معرف المستخدم', 'اسم الموظف', 'اسم المستخدم', 'البريد الإلكتروني', 'المسمى الوظيفي', 'اسم القسم',
      'معرف الدور', 'نشط', 'كلمة المرور المشفرة', 'آخر تسجيل دخول',
      'تاريخ الإنشاء', 'أنشئ بواسطة', 'تاريخ التحديث', 'تم التحديث بواسطة'
    ]
  },

  SYS_Roles: {
    headers_en: [
      'ROL_ID', 'ROL_Title', 'ROL_Notes', 'ROL_Is_System',
      'ROL_Crt_At', 'ROL_Crt_By', 'ROL_Upd_At', 'ROL_Upd_By'
    ],
    headers_ar: [
      'معرف الدور', 'عنوان الدور', 'ملاحظات', 'دور نظام',
      'تاريخ الإنشاء', 'أنشئ بواسطة', 'تاريخ التحديث', 'تم التحديث بواسطة'
    ]
  },

  SYS_Permissions: {
    headers_en: [
      'PRM_ID', 'PRM_Name', 'PRM_Notes', 'PRM_Catg',
      'PRM_Crt_At', 'PRM_Crt_By', 'PRM_Upd_At', 'PRM_Upd_By'
    ],
    headers_ar: [
      'معرف الصلاحية', 'اسم الصلاحية', 'ملاحظات', 'الفئة',
      'تاريخ الإنشاء', 'أنشئ بواسطة', 'تاريخ التحديث', 'تم التحديث بواسطة'
    ]
  },

  SYS_Role_Permissions: {
    headers_en: [
      'ROL_ID', 'PRM_ID', 'SRP_Scope', 'SRP_Is_Allowed', 'SRP_Constraints',
      'SRP_Crt_At', 'SRP_Crt_By', 'SRP_Upd_At', 'SRP_Upd_By'
    ],
    headers_ar: [
      'معرف الدور', 'معرف الصلاحية', 'النطاق', 'مسموح', 'القيود',
      'تاريخ الإنشاء', 'أنشئ بواسطة', 'تاريخ التحديث', 'تم التحديث بواسطة'
    ]
  },

  SYS_Audit_Log: {
    headers_en: [
      'AUD_ID', 'AUD_Time_Stamp', 'USR_ID', 'USR_Name', 'USR_Action', 'ACT_Details',
      'AUD_Entity', 'AUD_Entity_ID', 'AUD_Scope', 'AUD_Sheet_ID', 'AUD_Sheet_Name', 'IP_Address'
    ],
    headers_ar: [
      'معرف السجل', 'الطابع الزمني', 'معرف المستخدم', 'اسم المستخدم', 'الإجراء', 'تفاصيل الإجراء',
      'الكيان', 'معرف الكيان', 'النطاق', 'معرف الورقة', 'اسم الورقة', 'عنوان IP'
    ]
  },

  SYS_Sessions: {
    headers_en: [
      'SESS_ID', 'USR_ID', 'EMP_Email', 'Actor_USR_ID', 'SESS_Type', 'SESS_Status',
      'USR_Device', 'IP_Address', 'Auth_Token', 'SESS_Start_At', 'SESS_End_At',
      'SESS_Crt_At', 'SESS_Crt_By', 'SESS_Last_Seen', 'SESS_Revoked_At', 'SESS_Revoked_By', 'SESS_Metadata'
    ],
    headers_ar: [
      'معرف الجلسة', 'معرف المستخدم', 'البريد الإلكتروني', 'معرف الفاعل', 'نوع الجلسة', 'حالة الجلسة',
      'الجهاز', 'عنوان IP', 'رمز المصادقة', 'بداية الجلسة', 'نهاية الجلسة',
      'تاريخ الإنشاء', 'أنشئ بواسطة', 'آخر ظهور', 'تاريخ الإلغاء', 'ألغيت بواسطة', 'بيانات وصفية'
    ]
  },

  SYS_PubHolidays: {
    headers_en: ['PUBHOL_ID', 'Pub_Holiday_Date', 'Pub_Holiday_Name'],
    headers_ar: ['معرف العطلة', 'تاريخ العطلة', 'اسم العطلة']
  },

  SYS_Analysis: {
    headers_en: [
      'SYS_ANA_ID', 'SYS_ANA_Date', 'SYS_ANA_Start', 'SYS_ANA_End',
      'SYS_ANA_Item1', 'SYS_ANA_Item2', 'SYS_ANA_Item3', 'SYS_ANA_Item4',
      'SYS_ANA_Item5', 'SYS_ANA_Item6', 'SYS_ANA_Item7', 'SYS_ANA_Item8', 'SYS_ANA_Item9'
    ],
    headers_ar: [
      'معرف التحليل', 'التاريخ', 'تاريخ البداية', 'تاريخ النهاية',
      'البند 1', 'البند 2', 'البند 3', 'البند 4',
      'البند 5', 'البند 6', 'البند 7', 'البند 8', 'البند 9'
    ]
  },

  // ============================================================
  // HUMAN RESOURCES MODULE (HRM_)
  // ============================================================

  HRM_Dashboard: {
    headers_en: ['HR_Dash_ID', 'HR_Metric_Code', 'HR_Metric_Value', 'HR_Dash_Date', 'HR_Dash_Notes'],
    headers_ar: ['معرف اللوحة', 'رمز المقياس', 'قيمة المقياس', 'التاريخ', 'ملاحظات']
  },

  HRM_Departments: {
    headers_en: [
      'DEPT_ID', 'DEPT_Name', 'DEPT_Is_Active', 'DEPT_Sort_Order',
      'DEPT_Crt_At', 'DEPT_Crt_By', 'DEPT_Upd_At', 'DEPT_Upd_By'
    ],
    headers_ar: [
      'معرف القسم', 'اسم القسم', 'نشط', 'ترتيب الفرز',
      'تاريخ الإنشاء', 'أنشئ بواسطة', 'تاريخ التحديث', 'تم التحديث بواسطة'
    ]
  },

  HRM_Employees: {
    headers_en: [
      'EMP_ID', 'EMP_Name_EN', 'EMP_Name_AR', 'Date_of_Birth', 'Gender', 'National_ID',
      'Marital_Status', 'Military_Status', 'EMP_Mob_Main', 'EMP_Mob_Sub', 'Home_Address',
      'EMP_Email', 'Emrgcy_Cont', 'EmrCont_Relation', 'EmrCont__Mob', 'Job_Title',
      'DEPT_Name', 'Hire_Date', 'EMP_CONT_Type', 'EMP_Status', 'Basic_Salary',
      'Allowances', 'Deducts', 'EMP_Crt_At', 'EMP_Crt_By'
    ],
    headers_ar: [
      'كود الموظف', 'الاسم بالإنجليزية', 'الاسم بالعربية', 'تاريخ الميلاد', 'النوع', 'الرقم القومي',
      'الحالة الاجتماعية', 'الحالة العسكرية', 'الموبايل الرئيسي', 'الموبايل الفرعي', 'عنوان السكن',
      'البريد الإلكتروني', 'جهة الاتصال للطوارئ', 'صلة القرابة', 'موبايل الطوارئ', 'المسمى الوظيفي',
      'اسم القسم', 'تاريخ التعيين', 'نوع العقد', 'حالة الموظف', 'الراتب الأساسي',
      'البدلات', 'الخصومات', 'تاريخ الإنشاء', 'أنشئ بواسطة'
    ]
  },

  HRM_Attendance: {
    headers_en: [
      'ATT_ID', 'EMP_ID', 'ATT_Date', 'ATT_Check_In', 'ATT_Check_Out', 'ATT_Hours',
      'ATT_Late_Mints', 'ATT_EarlyLV_Mints', 'ATT_OT_Mints', 'ATT_Notes', 'ATT_Status',
      'ATT_Crt_At', 'ATT_Crt_By', 'ATT_Upd_At', 'ATT_Upd_By'
    ],
    headers_ar: [
      'معرف الحضور', 'كود الموظف', 'التاريخ', 'وقت الدخول', 'وقت الخروج', 'عدد الساعات',
      'دقائق التأخير', 'دقائق الخروج المبكر', 'دقائق الوقت الإضافي', 'ملاحظات', 'الحالة',
      'تاريخ الإنشاء', 'أنشئ بواسطة', 'تاريخ التحديث', 'تم التحديث بواسطة'
    ]
  },

  HRM_Leave: {
    headers_en: [
      'LV_ID', 'EMP_ID', 'LV_Type', 'LV_Start_Date', 'LV_End_Date', 'LV_NumDays',
      'LV_Status', 'LV_Reason', 'LV_Approved_By', 'LV_Notes',
      'LV_Crt_At', 'LV_Crt_By', 'LV_Upd_At', 'LV_Upd_By'
    ],
    headers_ar: [
      'معرف الإجازة', 'كود الموظف', 'نوع الإجازة', 'تاريخ البداية', 'تاريخ النهاية', 'عدد الأيام',
      'الحالة', 'السبب', 'تمت الموافقة بواسطة', 'ملاحظات',
      'تاريخ الإنشاء', 'أنشئ بواسطة', 'تاريخ التحديث', 'تم التحديث بواسطة'
    ]
  },

  HRM_Advances: {
    headers_en: [
      'ADV_ID', 'EMP_ID', 'ADV_Issue_Date', 'ADV_Amnt', 'ADV_Setlmnt_Period', 'ADV_Instal',
      'ADV_Notes', 'ADV_Status', 'ADV_Crt_At', 'ADV_Crt_By', 'ADV_Upd_At', 'ADV_Upd_By'
    ],
    headers_ar: [
      'معرف السلفة', 'كود الموظف', 'تاريخ الإصدار', 'المبلغ', 'فترة التسوية', 'القسط',
      'ملاحظات', 'الحالة', 'تاريخ الإنشاء', 'أنشئ بواسطة', 'تاريخ التحديث', 'تم التحديث بواسطة'
    ]
  },

  HRM_OverTime: {
    headers_en: [
      'OT_ID', 'EMP_ID', 'POL_OT_ID', 'ATT_Date', 'ATT_OT_Mints', 'OT_Amnt',
      'OT_Crt_At', 'OT_Crt_By', 'OT_Upd_At', 'OT_Upd_By'
    ],
    headers_ar: [
      'معرف الوقت الإضافي', 'كود الموظف', 'معرف سياسة الوقت الإضافي', 'التاريخ', 'دقائق الوقت الإضافي', 'المبلغ',
      'تاريخ الإنشاء', 'أنشئ بواسطة', 'تاريخ التحديث', 'تم التحديث بواسطة'
    ]
  },

  HRM_Deductions: {
    headers_en: [
      'DEDCT_ID', 'PEN_ID', 'PEN_Name', 'EMP_ID', 'DEDCT_Date', 'DEDCT_Amnt',
      'DEDCT_Crt_At', 'DEDCT_Crt_By', 'DEDCT_Upd_At', 'DEDCT_Upd_By'
    ],
    headers_ar: [
      'معرف الخصم', 'معرف الجزاء', 'اسم الجزاء', 'كود الموظف', 'التاريخ', 'المبلغ',
      'تاريخ الإنشاء', 'أنشئ بواسطة', 'تاريخ التحديث', 'تم التحديث بواسطة'
    ]
  },

  HRM_Analysis: {
    headers_en: [
      'HR_ANA_ID', 'HR_ANA_Date', 'HR_ANA_Start', 'HR_ANA_End',
      'HR_ANA_Item1', 'HR_ANA_Item2', 'HR_ANA_Item3', 'HR_ANA_Item4',
      'HR_ANA_Item5', 'HR_ANA_Item6', 'HR_ANA_Item7', 'HR_ANA_Item8', 'HR_ANA_Item9'
    ],
    headers_ar: [
      'معرف التحليل', 'التاريخ', 'تاريخ البداية', 'تاريخ النهاية',
      'البند 1', 'البند 2', 'البند 3', 'البند 4',
      'البند 5', 'البند 6', 'البند 7', 'البند 8', 'البند 9'
    ]
  },

  // ============================================================
  // PROJECTS MODULE (PRJ_)
  // ============================================================

  PRJ_Dashboard: {
    headers_en: ['PRJ_Dash_ID', 'PRJ_Metric_Code', 'PRJ_Metric_Value', 'PRJ_Dash_Date', 'PRJ_Dash_Notes'],
    headers_ar: ['معرف اللوحة', 'رمز المقياس', 'قيمة المقياس', 'التاريخ', 'ملاحظات']
  },

  PRJ_Main: {
    headers_en: [
      'PRJ_ID', 'PRJ_Name', 'CLI_ID', 'CLI_Name', 'PRJ_Status', 'PRJ_Type', 'PRJ_Budget',
      'Plan_Num_Days', 'Plan_Start_Date', 'PRJ_Location',
      'ADV_Crt_At', 'ADV_Crt_By', 'ADV_Upd_At', 'ADV_Upd_By'
    ],
    headers_ar: [
      'معرف المشروع', 'اسم المشروع', 'معرف العميل', 'اسم العميل', 'حالة المشروع', 'نوع المشروع', 'الميزانية',
      'عدد الأيام المخططة', 'تاريخ البداية المخطط', 'موقع المشروع',
      'تاريخ الإنشاء', 'أنشئ بواسطة', 'تاريخ التحديث', 'تم التحديث بواسطة'
    ]
  },

  PRJ_Clients: {
    headers_en: [
      'CLI_ID', 'CLI_Name', 'CLI_Mob_1', 'CLI_Mob_2', 'CLI_Email',
      'ADV_Crt_At', 'ADV_Crt_By', 'ADV_Upd_At', 'ADV_Upd_By'
    ],
    headers_ar: [
      'معرف العميل', 'اسم العميل', 'الموبايل 1', 'الموبايل 2', 'البريد الإلكتروني',
      'تاريخ الإنشاء', 'أنشئ بواسطة', 'تاريخ التحديث', 'تم التحديث بواسطة'
    ]
  },

  PRJ_Tasks: {
    headers_en: [
      'TSK_ID', 'PRJ_ID', 'TSK_Name', 'TSK_Priority', 'EMP_ID',
      'TSK_Plan_Start', 'TSK_Plan_End', 'TSK_Start', 'TSK_End', 'TSK_Status',
      'ADV_Crt_At', 'ADV_Crt_By', 'ADV_Upd_At', 'ADV_Upd_By'
    ],
    headers_ar: [
      'معرف المهمة', 'معرف المشروع', 'اسم المهمة', 'الأولوية', 'كود الموظف',
      'البداية المخططة', 'النهاية المخططة', 'البداية الفعلية', 'النهاية الفعلية', 'الحالة',
      'تاريخ الإنشاء', 'أنشئ بواسطة', 'تاريخ التحديث', 'تم التحديث بواسطة'
    ]
  },

  PRJ_Material: {
    headers_en: [
      'MAT_ID', 'MAT_Name', 'MAT_Catg', 'MAT_Sub1', 'MAT_Sub2',
      'Default_Unit', 'Default_Price', 'MAT_Active',
      'ADV_Crt_At', 'ADV_Crt_By', 'ADV_Upd_At', 'ADV_Upd_By'
    ],
    headers_ar: [
      'معرف المادة', 'اسم المادة', 'الفئة', 'الفئة الفرعية 1', 'الفئة الفرعية 2',
      'الوحدة الافتراضية', 'السعر الافتراضي', 'نشط',
      'تاريخ الإنشاء', 'أنشئ بواسطة', 'تاريخ التحديث', 'تم التحديث بواسطة'
    ]
  },

  PRJ_IndirExp_Time_Alloc: {
    headers_en: [
      'ALO_TM_ID', 'InDiEXP_TM_ID', 'PRJ_ID', 'ALO_TM_Methd', 'ALO_TM_Percnt', 'ALO_TM_Amnt',
      'ADV_Crt_At', 'ADV_Crt_By', 'ADV_Upd_At', 'ADV_Upd_By'
    ],
    headers_ar: [
      'معرف التخصيص', 'معرف المصروف', 'معرف المشروع', 'طريقة التخصيص', 'النسبة المئوية', 'المبلغ',
      'تاريخ الإنشاء', 'أنشئ بواسطة', 'تاريخ التحديث', 'تم التحديث بواسطة'
    ]
  },

  PRJ_IndirExp_NoTime_Alloc: {
    headers_en: [
      'ALO_NT_ID', 'InDiEXP_NT_ID', 'PRJ_ID', 'ALO_NT_Methd', 'ALO_NT_Percnt', 'ALO_NT_Amnt',
      'ADV_Crt_At', 'ADV_Crt_By', 'ADV_Upd_At', 'ADV_Upd_By'
    ],
    headers_ar: [
      'معرف التخصيص', 'معرف المصروف', 'معرف المشروع', 'طريقة التخصيص', 'النسبة المئوية', 'المبلغ',
      'تاريخ الإنشاء', 'أنشئ بواسطة', 'تاريخ التحديث', 'تم التحديث بواسطة'
    ]
  },

  PRJ_Plan_vs_Actual: {
    headers_en: [
      'PvA_ID', 'PRJ_ID', 'PRJ_Name', 'Plan_Start_Date', 'Actual_Start_Date',
      'Plan_Num_Days', 'Actual_Num_Days', 'Plan_End_Date', 'Actual_End_Date',
      'Plan_Direct_Exp', 'Actual_Direct_Exp', 'Plan_MATs', 'Actual_MATs',
      'ADV_Crt_At', 'ADV_Crt_By', 'ADV_Upd_At', 'ADV_Upd_By'
    ],
    headers_ar: [
      'معرف المقارنة', 'معرف المشروع', 'اسم المشروع', 'البداية المخططة', 'البداية الفعلية',
      'عدد الأيام المخططة', 'عدد الأيام الفعلية', 'النهاية المخططة', 'النهاية الفعلية',
      'المصروفات المباشرة المخططة', 'المصروفات المباشرة الفعلية', 'المواد المخططة', 'المواد الفعلية',
      'تاريخ الإنشاء', 'أنشئ بواسطة', 'تاريخ التحديث', 'تم التحديث بواسطة'
    ]
  },

  PRJ_Analysis: {
    headers_en: [
      'PRJ_ANA_ID', 'PRJ_ANA_Date', 'PRJ_ANA_Start', 'PRJ_ANA_End',
      'PRJ_ANA_Item1', 'PRJ_ANA_Item2', 'PRJ_ANA_Item3', 'PRJ_ANA_Item4',
      'PRJ_ANA_Item5', 'PRJ_ANA_Item6', 'PRJ_ANA_Item7', 'PRJ_ANA_Item8', 'PRJ_ANA_Item9'
    ],
    headers_ar: [
      'معرف التحليل', 'التاريخ', 'تاريخ البداية', 'تاريخ النهاية',
      'البند 1', 'البند 2', 'البند 3', 'البند 4',
      'البند 5', 'البند 6', 'البند 7', 'البند 8', 'البند 9'
    ]
  },

  // ============================================================
  // FINANCE MODULE (FIN_)
  // ============================================================

  FIN_Dashboard: {
    headers_en: ['FIN_Dash_ID', 'FIN_Metric_Code', 'FIN_Metric_Value', 'FIN_Dash_Date', 'FIN_Dash_Notes'],
    headers_ar: ['معرف اللوحة', 'رمز المقياس', 'قيمة المقياس', 'التاريخ', 'ملاحظات']
  },

  FIN_DirectExpenses: {
    headers_en: [
      'DiEXP_ID', 'PRJ_ID', 'PRJ_Name', 'DiEXP_Date', 'MAT_ID', 'MAT_Name',
      'MAT_Catg', 'MAT_Sub1', 'MAT_Sub2', 'Default_Unit', 'Default_Price', 'MAT_Quantity',
      'DiEXP_Total_VAT_Exc', 'DiEXP_Total_VAT_Inc', 'DiEXP_Pay_Status', 'DiEXP_Pay_Methd', 'DiEXP_Notes',
      'ADV_Crt_At', 'ADV_Crt_By', 'ADV_Upd_At', 'ADV_Upd_By'
    ],
    headers_ar: [
      'معرف المصروف', 'معرف المشروع', 'اسم المشروع', 'التاريخ', 'معرف المادة', 'اسم المادة',
      'الفئة', 'الفئة الفرعية 1', 'الفئة الفرعية 2', 'الوحدة', 'السعر', 'الكمية',
      'الإجمالي بدون ضريبة', 'الإجمالي مع الضريبة', 'حالة الدفع', 'طريقة الدفع', 'ملاحظات',
      'تاريخ الإنشاء', 'أنشئ بواسطة', 'تاريخ التحديث', 'تم التحديث بواسطة'
    ]
  },

  FIN_InDirectExpenses_Time: {
    headers_en: [
      'InDiEXP_TM_ID', 'InDiEXP_TM_Catg', 'InDiEXP_TM_Sub1', 'InDiEXP_TM_Sub2',
      'InDiEXP_Start', 'InDiEXP_End', 'InDiEXP_TM_Pay_Status', 'InDiEXP_TM_Pay_Methd', 'InDiEXP_TM_Notes',
      'ADV_Crt_At', 'ADV_Crt_By', 'ADV_Upd_At', 'ADV_Upd_By'
    ],
    headers_ar: [
      'معرف المصروف', 'الفئة', 'الفئة الفرعية 1', 'الفئة الفرعية 2',
      'تاريخ البداية', 'تاريخ النهاية', 'حالة الدفع', 'طريقة الدفع', 'ملاحظات',
      'تاريخ الإنشاء', 'أنشئ بواسطة', 'تاريخ التحديث', 'تم التحديث بواسطة'
    ]
  },

  FIN_InDirectExpenses_NoTime: {
    headers_en: [
      'InDiEXP_NT_ID', 'InDiEXP_NT_Catg', 'InDiEXP_NT_Sub1', 'InDiEXP_NT_Sub2',
      'Useful_Life_Months', 'Depreciation_Start_Date', 'InDiEXP_NT_Pay_Status', 'InDiEXP_NT_Pay_Methd', 'InDiEXP_NT_Notes',
      'ADV_Crt_At', 'ADV_Crt_By', 'ADV_Upd_At', 'ADV_Upd_By'
    ],
    headers_ar: [
      'معرف المصروف', 'الفئة', 'الفئة الفرعية 1', 'الفئة الفرعية 2',
      'العمر الافتراضي بالأشهر', 'تاريخ بدء الاستهلاك', 'حالة الدفع', 'طريقة الدفع', 'ملاحظات',
      'تاريخ الإنشاء', 'أنشئ بواسطة', 'تاريخ التحديث', 'تم التحديث بواسطة'
    ]
  },

  FIN_PRJ_Revenue: {
    headers_en: [
      'REV_ID', 'PRJ_ID', 'REV_Date', 'REV_Amnt', 'REV_Type', 'REV_Source', 'REV_Notes',
      'REV_Pay_Methd', 'REV_Invoice_Number', 'REV_Pay_Status', 'REV_Total', 'REV_Remain',
      'ADV_Crt_At', 'ADV_Crt_By', 'ADV_Upd_At', 'ADV_Upd_By'
    ],
    headers_ar: [
      'معرف الإيراد', 'معرف المشروع', 'التاريخ', 'المبلغ', 'النوع', 'المصدر', 'ملاحظات',
      'طريقة الدفع', 'رقم الفاتورة', 'حالة الدفع', 'الإجمالي', 'المتبقي',
      'تاريخ الإنشاء', 'أنشئ بواسطة', 'تاريخ التحديث', 'تم التحديث بواسطة'
    ]
  },

  FIN_Custody: {
    headers_en: [
      'CSTD_ID', 'EMP_ID', 'EMP_Name', 'PRJ_ID', 'PRJ_Name', 'CSTD_Issue_Date', 'CSTD_Settl_Date',
      'CSTD_Amnt', 'CSTD_Purpose', 'CSTD_Status', 'CSTD_Notes',
      'ADV_Crt_At', 'ADV_Crt_By', 'ADV_Upd_At', 'ADV_Upd_By'
    ],
    headers_ar: [
      'معرف العهدة', 'كود الموظف', 'اسم الموظف', 'معرف المشروع', 'اسم المشروع', 'تاريخ الإصدار', 'تاريخ التسوية',
      'المبلغ', 'الغرض', 'الحالة', 'ملاحظات',
      'تاريخ الإنشاء', 'أنشئ بواسطة', 'تاريخ التحديث', 'تم التحديث بواسطة'
    ]
  },

  FIN_HRM_Payroll: {
    headers_en: [
      'PAY_ID', 'EMP_ID', 'EMP_Name', 'PAY_Start_Date', 'PAY_End_Date', 'Basic_Salary',
      'Total_OT_Amnt', 'ADV_Instal', 'Total_DEDCT_Amnt', 'PAY_Net_Pay', 'PAY_Status',
      'ADV_Crt_At', 'ADV_Crt_By', 'ADV_Upd_At', 'ADV_Upd_By'
    ],
    headers_ar: [
      'معرف المرتب', 'كود الموظف', 'اسم الموظف', 'تاريخ البداية', 'تاريخ النهاية', 'الراتب الأساسي',
      'إجمالي الوقت الإضافي', 'قسط السلفة', 'إجمالي الخصومات', 'صافي المرتب', 'الحالة',
      'تاريخ الإنشاء', 'أنشئ بواسطة', 'تاريخ التحديث', 'تم التحديث بواسطة'
    ]
  },

  'FIN_P&L_Statements': {
    headers_en: [
      'P&L_ID', 'Rev_ID', 'DiEXP_ID', 'InDiEXP_TM_ID', 'InDiEXP_NT_ID',
      'REV_Total', 'Total_DiEXP', 'Total_InDiEXP_TM', 'Total_InDiEXP_NT',
      'P&L_Start_Date', 'P&L_End_Date', 'P&L_Amnt',
      'ADV_Crt_At', 'ADV_Crt_By', 'ADV_Upd_At', 'ADV_Upd_By'
    ],
    headers_ar: [
      'معرف قائمة الأرباح', 'معرف الإيراد', 'معرف المصروف المباشر', 'معرف المصروف غير المباشر الزمني', 'معرف المصروف غير المباشر',
      'إجمالي الإيرادات', 'إجمالي المصروفات المباشرة', 'إجمالي المصروفات غير المباشرة الزمنية', 'إجمالي المصروفات غير المباشرة',
      'تاريخ البداية', 'تاريخ النهاية', 'صافي الربح/الخسارة',
      'تاريخ الإنشاء', 'أنشئ بواسطة', 'تاريخ التحديث', 'تم التحديث بواسطة'
    ]
  },

  FIN_Analysis: {
    headers_en: [
      'FIN_ANA_ID', 'FIN_ANA_Date', 'FIN_ANA_Start', 'FIN_ANA_End',
      'FIN_ANA_Item1', 'FIN_ANA_Item2', 'FIN_ANA_Item3', 'FIN_ANA_Item4',
      'FIN_ANA_Item5', 'FIN_ANA_Item6', 'FIN_ANA_Item7', 'FIN_ANA_Item8', 'FIN_ANA_Item9'
    ],
    headers_ar: [
      'معرف التحليل', 'التاريخ', 'تاريخ البداية', 'تاريخ النهاية',
      'البند 1', 'البند 2', 'البند 3', 'البند 4',
      'البند 5', 'البند 6', 'البند 7', 'البند 8', 'البند 9'
    ]
  }
};

/**
 * Main setup function - Creates/Updates all sheets with bilingual headers
 */
function setupDatabase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  Logger.log('🚀 Starting ERP Database Setup...');
  
  let created = 0;
  let updated = 0;
  let skipped = 0;
  
  // Process each sheet in the schema
  for (const [sheetName, config] of Object.entries(ERP_SCHEMA)) {
    try {
      let sheet = ss.getSheetByName(sheetName);
      
      if (!sheet) {
        // Create new sheet
        sheet = ss.insertSheet(sheetName);
        Logger.log(`✅ Created sheet: ${sheetName}`);
        created++;
      } else {
        Logger.log(`⚙️ Updating sheet: ${sheetName}`);
        updated++;
      }
      
      // Write bilingual headers
      const headers_en = config.headers_en;
      const headers_ar = config.headers_ar;
      
      // Row 1: English headers
      sheet.getRange(1, 1, 1, headers_en.length).setValues([headers_en]);
      
      // Row 2: Arabic headers
      sheet.getRange(2, 1, 1, headers_ar.length).setValues([headers_ar]);
      
      // Format headers
      formatHeaders(sheet, headers_en.length);
      
    } catch (error) {
      Logger.log(`❌ Error processing ${sheetName}: ${error.message}`);
      skipped++;
    }
  }
  
  Logger.log('\n📊 Setup Complete!');
  Logger.log(`   ✅ Created: ${created} sheets`);
  Logger.log(`   ⚙️ Updated: ${updated} sheets`);
  Logger.log(`   ❌ Skipped: ${skipped} sheets`);
  
  return {
    success: true,
    created: created,
    updated: updated,
    skipped: skipped
  };
}

/**
 * Format header rows
 */
function formatHeaders(sheet, numColumns) {
  // Row 1 (English) - Bold, Light Gray Background
  const row1Range = sheet.getRange(1, 1, 1, numColumns);
  row1Range.setFontWeight('bold')
           .setBackground('#f3f3f3')
           .setFontColor('#000000')
           .setHorizontalAlignment('left')
           .setVerticalAlignment('middle');
  
  // Row 2 (Arabic) - Bold, Light Blue Background, Cairo font
  const row2Range = sheet.getRange(2, 1, 1, numColumns);
  row2Range.setFontWeight('bold')
           .setBackground('#e3f2fd')
           .setFontColor('#1565c0')
           .setHorizontalAlignment('right')
           .setVerticalAlignment('middle')
           .setFontFamily('Cairo');
  
  // Freeze header rows
  sheet.setFrozenRows(2);
  
  // Auto-resize columns
  for (let i = 1; i <= numColumns; i++) {
    sheet.autoResizeColumn(i);
  }
}

/**
 * Validate database structure
 */
function validateDatabase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const issues = [];
  
  Logger.log('🔍 Validating database structure...');
  
  for (const [sheetName, config] of Object.entries(ERP_SCHEMA)) {
    const sheet = ss.getSheetByName(sheetName);
    
    if (!sheet) {
      issues.push(`Missing sheet: ${sheetName}`);
      continue;
    }
    
    // Check if headers exist
    const row1 = sheet.getRange(1, 1, 1, config.headers_en.length).getValues()[0];
    const row2 = sheet.getRange(2, 1, 1, config.headers_ar.length).getValues()[0];
    
    // Validate English headers
    for (let i = 0; i < config.headers_en.length; i++) {
      if (row1[i] !== config.headers_en[i]) {
        issues.push(`${sheetName}: English header mismatch at column ${i+1}`);
      }
    }
    
    // Validate Arabic headers
    for (let i = 0; i < config.headers_ar.length; i++) {
      if (row2[i] !== config.headers_ar[i]) {
        issues.push(`${sheetName}: Arabic header mismatch at column ${i+1}`);
      }
    }
  }
  
  if (issues.length === 0) {
    Logger.log('✅ Database structure is valid!');
  } else {
    Logger.log(`⚠️ Found ${issues.length} issues:`);
    issues.forEach(issue => Logger.log(`   - ${issue}`));
  }
  
  return issues;
}

/**
 * Get column index by English header name
 */
function getColumnIndex(sheetName, columnName) {
  if (!ERP_SCHEMA[sheetName]) {
    throw new Error(`Sheet ${sheetName} not found in schema`);
  }
  
  const headers = ERP_SCHEMA[sheetName].headers_en;
  const index = headers.indexOf(columnName);
  
  if (index === -1) {
    throw new Error(`Column ${columnName} not found in ${sheetName}`);
  }
  
  return index + 1; // Convert to 1-based index
}

/**
 * Get Arabic header for a column
 */
function getArabicHeader(sheetName, columnName) {
  if (!ERP_SCHEMA[sheetName]) {
    throw new Error(`Sheet ${sheetName} not found in schema`);
  }
  
  const headers_en = ERP_SCHEMA[sheetName].headers_en;
  const headers_ar = ERP_SCHEMA[sheetName].headers_ar;
  const index = headers_en.indexOf(columnName);
  
  if (index === -1) {
    throw new Error(`Column ${columnName} not found in ${sheetName}`);
  }
  
  return headers_ar[index];
}

