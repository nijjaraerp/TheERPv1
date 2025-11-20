/**
 * Nijjara ERP - Seed_Data.js
 * Single source of truth for initial database data
 * Populates ENG_ sheets with required configuration data
 */

// EMPLOYEE MANAGEMENT FORMS CONFIGURATION
const EMPLOYEE_FORMS_CONFIG = [
  // HRM Employee Add Form - Basic Tab
  {
    FORM_ID: 'HRM_EMP_ADD_FORM',
    Form_Label: 'إضافة موظف جديد',
    Tab_ID: 'HRM_EMP_TAB_BASIC',
    Tab_Label: 'البيانات الأساسية',
    Field_ID: 'EMP_Name_AR',
    Field_Label: 'اسم الموظف',
    Field_Type: 'text',
    Field_Can_Edit: true,
    Source_Sheet: '',
    Source_Columns: '',
    Is_Mandatory: true,
    Default_Value: 'أدخل اسم الموظف بالعربية',
    DD_ID: '',
    Target_Sheet: 'HRM_Employees',
    Target_Column: 'EMP_Name_AR',
    ROL_ID: 'HR_MANAGER',
    Is_Visible: true,
    But_ID: ''
  },
  {
    FORM_ID: 'HRM_EMP_ADD_FORM',
    Form_Label: 'إضافة موظف جديد',
    Tab_ID: 'HRM_EMP_TAB_BASIC',
    Tab_Label: 'البيانات الأساسية',
    Field_ID: 'Job_Title',
    Field_Label: 'المسمى الوظيفي',
    Field_Type: 'text',
    Field_Can_Edit: true,
    Source_Sheet: '',
    Source_Columns: '',
    Is_Mandatory: true,
    Default_Value: 'مثال: مهندس موقع',
    DD_ID: '',
    Target_Sheet: 'HRM_Employees',
    Target_Column: 'Job_Title',
    ROL_ID: 'HR_MANAGER',
    Is_Visible: true,
    But_ID: ''
  },
  {
    FORM_ID: 'HRM_EMP_ADD_FORM',
    Form_Label: 'إضافة موظف جديد',
    Tab_ID: 'HRM_EMP_TAB_BASIC',
    Tab_Label: 'البيانات الأساسية',
    Field_ID: 'DEPT_Name',
    Field_Label: 'القسم',
    Field_Type: 'dropdown',
    Field_Can_Edit: true,
    Source_Sheet: '',
    Source_Columns: '',
    Is_Mandatory: true,
    Default_Value: '',
    DD_ID: 'DD_DEPARTMENTS',
    Target_Sheet: 'HRM_Employees',
    Target_Column: 'DEPT_Name',
    ROL_ID: 'HR_MANAGER',
    Is_Visible: true,
    But_ID: ''
  },
  // HRM Employee Add Form - Contact Tab
  {
    FORM_ID: 'HRM_EMP_ADD_FORM',
    Form_Label: 'إضافة موظف جديد',
    Tab_ID: 'HRM_EMP_TAB_CONTACT',
    Tab_Label: 'التواصل',
    Field_ID: 'EMP_Email',
    Field_Label: 'البريد الإلكتروني',
    Field_Type: 'email',
    Field_Can_Edit: true,
    Source_Sheet: '',
    Source_Columns: '',
    Is_Mandatory: true,
    Default_Value: 'example@company.com',
    DD_ID: '',
    Target_Sheet: 'HRM_Employees',
    Target_Column: 'EMP_Email',
    ROL_ID: 'HR_MANAGER',
    Is_Visible: true,
    But_ID: ''
  },
  {
    FORM_ID: 'HRM_EMP_ADD_FORM',
    Form_Label: 'إضافة موظف جديد',
    Tab_ID: 'HRM_EMP_TAB_CONTACT',
    Tab_Label: 'التواصل',
    Field_ID: 'EMP_Mob_Main',
    Field_Label: 'رقم الهاتف الرئيسي',
    Field_Type: 'tel',
    Field_Can_Edit: true,
    Source_Sheet: '',
    Source_Columns: '',
    Is_Mandatory: true,
    Default_Value: '01xxxxxxxxx',
    DD_ID: '',
    Target_Sheet: 'HRM_Employees',
    Target_Column: 'EMP_Mob_Main',
    ROL_ID: 'HR_MANAGER',
    Is_Visible: true,
    But_ID: ''
  },
  // HRM Employee Add Form - Job Tab
  {
    FORM_ID: 'HRM_EMP_ADD_FORM',
    Form_Label: 'إضافة موظف جديد',
    Tab_ID: 'HRM_EMP_TAB_JOB',
    Tab_Label: 'الوظيفة',
    Field_ID: 'Hire_Date',
    Field_Label: 'تاريخ التعيين',
    Field_Type: 'date',
    Field_Can_Edit: true,
    Source_Sheet: '',
    Source_Columns: '',
    Is_Mandatory: true,
    Default_Value: '',
    DD_ID: '',
    Target_Sheet: 'HRM_Employees',
    Target_Column: 'Hire_Date',
    ROL_ID: 'HR_MANAGER',
    Is_Visible: true,
    But_ID: ''
  },
  {
    FORM_ID: 'HRM_EMP_ADD_FORM',
    Form_Label: 'إضافة موظف جديد',
    Tab_ID: 'HRM_EMP_TAB_JOB',
    Tab_Label: 'الوظيفة',
    Field_ID: 'Basic_Salary',
    Field_Label: 'الراتب الأساسي',
    Field_Type: 'number',
    Field_Can_Edit: true,
    Source_Sheet: '',
    Source_Columns: '',
    Is_Mandatory: true,
    Default_Value: '0',
    DD_ID: '',
    Target_Sheet: 'HRM_Employees',
    Target_Column: 'Basic_Salary',
    ROL_ID: 'HR_MANAGER',
    Is_Visible: true,
    But_ID: ''
  },
  // HRM Employee View Form - Basic Tab (Read-only)
  {
    FORM_ID: 'HRM_EMP_VIEW_FORM',
    Form_Label: 'تفاصيل الموظف',
    Tab_ID: 'HRM_EMP_TAB_BASIC',
    Tab_Label: 'البيانات الأساسية',
    Field_ID: 'EMP_ID',
    Field_Label: 'كود الموظف',
    Field_Type: 'text',
    Field_Can_Edit: false,
    Source_Sheet: 'HRM_Employees',
    Source_Columns: 'EMP_ID',
    Is_Mandatory: true,
    Default_Value: '',
    DD_ID: '',
    Target_Sheet: '',
    Target_Column: '',
    ROL_ID: 'HR_MANAGER',
    Is_Visible: true,
    But_ID: ''
  },
  {
    FORM_ID: 'HRM_EMP_VIEW_FORM',
    Form_Label: 'تفاصيل الموظف',
    Tab_ID: 'HRM_EMP_TAB_BASIC',
    Tab_Label: 'البيانات الأساسية',
    Field_ID: 'EMP_Name_AR',
    Field_Label: 'اسم الموظف',
    Field_Type: 'text',
    Field_Can_Edit: true,
    Source_Sheet: 'HRM_Employees',
    Source_Columns: 'EMP_Name_AR',
    Is_Mandatory: true,
    Default_Value: '',
    DD_ID: '',
    Target_Sheet: 'HRM_Employees',
    Target_Column: 'EMP_Name_AR',
    ROL_ID: 'HR_MANAGER',
    Is_Visible: true,
    But_ID: ''
  }
];

// EMPLOYEE VIEWS CONFIGURATION
const EMPLOYEE_VIEWS_CONFIG = [
  {
    VIEW_ID: 'HRM_EMP_LIST',
    View_Title: 'قائمة الموظفين',
    Source_Sheet: 'HRM_Employees',
    Source_Columns: 'EMP_ID,EMP_Name_AR,Job_Title,DEPT_Name,EMP_Status'
  }
];

// BUTTONS CONFIGURATION
const BUTTONS_CONFIG = [
  {
    BTN_ID: 'HRM_EMP_ADD',
    BTN_Label: 'إضافة موظف جديد',
    BTN_Type: 'add',
    BTN_Description: 'Opens employee addition form'
  },
  {
    BTN_ID: 'HRM_EMP_EDIT',
    BTN_Label: 'تعديل',
    BTN_Type: 'edit',
    BTN_Description: 'Enables editing mode for employee details'
  },
  {
    BTN_ID: 'HRM_EMP_SAVE',
    BTN_Label: 'حفظ',
    BTN_Type: 'save',
    BTN_Description: 'Saves employee data changes'
  },
  {
    BTN_ID: 'HRM_EMP_CANCEL',
    BTN_Label: 'إلغاء',
    BTN_Type: 'cancel',
    BTN_Description: 'Cancels current operation'
  },
  {
    BTN_ID: 'HRM_EMP_VIEW',
    BTN_Label: 'عرض التفاصيل',
    BTN_Type: 'view',
    BTN_Description: 'Opens employee details view'
  }
];

// DROPDOWN LISTS CONFIGURATION
const DROPDOWN_CONFIG = [
  // Departments
  {
    DD_ID: 'DD_DEPARTMENTS',
    DD_EN: 'Departments',
    DD_AR: 'الأقسام',
    DD_Is_Active: true,
    DD_Sort_Order: 1
  },
  {
    DD_ID: 'DD_JOB_TITLES',
    DD_EN: 'Job Titles',
    DD_AR: 'المسميات الوظيفية',
    DD_Is_Active: true,
    DD_Sort_Order: 2
  },
  {
    DD_ID: 'DD_EMPLOYEE_STATUS',
    DD_EN: 'Employee Status',
    DD_AR: 'حالة الموظف',
    DD_Is_Active: true,
    DD_Sort_Order: 3
  },
  {
    DD_ID: 'DD_GENDER',
    DD_EN: 'Gender',
    DD_AR: 'الجنس',
    DD_Is_Active: true,
    DD_Sort_Order: 4
  },
  {
    DD_ID: 'DD_MARITAL_STATUS',
    DD_EN: 'Marital Status',
    DD_AR: 'الحالة الاجتماعية',
    DD_Is_Active: true,
    DD_Sort_Order: 5
  },
  {
    DD_ID: 'DD_MILITARY_STATUS',
    DD_EN: 'Military Status',
    DD_AR: 'الحالة العسكرية',
    DD_Is_Active: true,
    DD_Sort_Order: 6
  },
  {
    DD_ID: 'DD_CONTRACT_TYPE',
    DD_EN: 'Contract Type',
    DD_AR: 'نوع العقد',
    DD_Is_Active: true,
    DD_Sort_Order: 7
  },
  // Project Status
  {
    DD_ID: 'DD_PROJECT_STATUS',
    DD_EN: 'Project Status',
    DD_AR: 'حالة المشروع',
    DD_Is_Active: true,
    DD_Sort_Order: 8
  },
  {
    DD_ID: 'DD_PROJECT_TYPE',
    DD_EN: 'Project Type',
    DD_AR: 'نوع المشروع',
    DD_Is_Active: true,
    DD_Sort_Order: 9
  },
  // Task Priority and Status
  {
    DD_ID: 'DD_TASK_PRIORITY',
    DD_EN: 'Task Priority',
    DD_AR: 'أولوية المهمة',
    DD_Is_Active: true,
    DD_Sort_Order: 10
  },
  {
    DD_ID: 'DD_TASK_STATUS',
    DD_EN: 'Task Status',
    DD_AR: 'حالة المهمة',
    DD_Is_Active: true,
    DD_Sort_Order: 11
  },
  // Leave Types and Status
  {
    DD_ID: 'DD_LEAVE_TYPE',
    DD_EN: 'Leave Type',
    DD_AR: 'نوع الإجازة',
    DD_Is_Active: true,
    DD_Sort_Order: 12
  },
  {
    DD_ID: 'DD_LEAVE_STATUS',
    DD_EN: 'Leave Status',
    DD_AR: 'حالة الإجازة',
    DD_Is_Active: true,
    DD_Sort_Order: 13
  },
  // Payment Methods and Status
  {
    DD_ID: 'DD_PAYMENT_METHOD',
    DD_EN: 'Payment Method',
    DD_AR: 'طريقة الدفع',
    DD_Is_Active: true,
    DD_Sort_Order: 14
  },
  {
    DD_ID: 'DD_PAYMENT_STATUS',
    DD_EN: 'Payment Status',
    DD_AR: 'حالة الدفع',
    DD_Is_Active: true,
    DD_Sort_Order: 15
  }
];

// SYSTEM SETTINGS CONFIGURATION
const SYSTEM_SETTINGS_CONFIG = [
  {
    Setting_Key: 'SYSTEM_NAME',
    Setting_Value: 'نيجارا ERP',
    Description_EN: 'ERP System Name',
    Updated_By: 'system',
    Updated_At: new Date().toISOString()
  },
  {
    Setting_Key: 'DEFAULT_LANGUAGE',
    Setting_Value: 'ar',
    Description_EN: 'Default System Language',
    Updated_By: 'system',
    Updated_At: new Date().toISOString()
  },
  {
    Setting_Key: 'DATE_FORMAT',
    Setting_Value: 'DD/MM/YYYY',
    Description_EN: 'Default Date Format',
    Updated_By: 'system',
    Updated_At: new Date().toISOString()
  },
  {
    Setting_Key: 'CURRENCY',
    Setting_Value: 'EGP',
    Description_EN: 'Default Currency',
    Updated_By: 'system',
    Updated_At: new Date().toISOString()
  },
  {
    Setting_Key: 'SESSION_TIMEOUT',
    Setting_Value: '480', // minutes
    Description_EN: 'Session Timeout in Minutes',
    Updated_By: 'system',
    Updated_At: new Date().toISOString()
  },
  {
    Setting_Key: 'MAX_LOGIN_ATTEMPTS',
    Setting_Value: '3',
    Description_EN: 'Maximum Login Attempts Before Lockout',
    Updated_By: 'system',
    Updated_At: new Date().toISOString()
  }
];

// DEPARTMENT DATA
const DEPARTMENTS_DATA = [
  { DEPT_ID: 1, DEPT_Name: 'الجودة', DEPT_Is_Active: true, DEPT_Sort_Order: 1, DEPT_Crt_At: new Date().toISOString(), DEPT_Crt_By: 'system', DEPT_Upd_At: new Date().toISOString(), DEPT_Upd_By: 'system' },
  { DEPT_ID: 2, DEPT_Name: 'المالية', DEPT_Is_Active: true, DEPT_Sort_Order: 2, DEPT_Crt_At: new Date().toISOString(), DEPT_Crt_By: 'system', DEPT_Upd_At: new Date().toISOString(), DEPT_Upd_By: 'system' },
  { DEPT_ID: 3, DEPT_Name: 'الموارد البشرية', DEPT_Is_Active: true, DEPT_Sort_Order: 3, DEPT_Crt_At: new Date().toISOString(), DEPT_Crt_By: 'system', DEPT_Upd_At: new Date().toISOString(), DEPT_Upd_By: 'system' },
  { DEPT_ID: 4, DEPT_Name: 'المشاريع', DEPT_Is_Active: true, DEPT_Sort_Order: 4, DEPT_Crt_At: new Date().toISOString(), DEPT_Crt_By: 'system', DEPT_Upd_At: new Date().toISOString(), DEPT_Upd_By: 'system' }
];

// INITIAL USERS DATA
const INITIAL_USERS_DATA = [
  {
    USR_ID: 'admin',
    EMP_Name_EN: 'System Administrator',
    USR_Name: 'admin',
    EMP_Email: 'admin@nijjara.com',
    Job_Title: 'System Administrator',
    DEPT_Name: 'الموارد البشرية',
    ROL_ID: 'SYS_ADMIN',
    USR_Is_Active: true,
    Password_Hash: '', // Will be set during initialization
    Last_Login: null,
    USR_Crt_At: new Date().toISOString(),
    USR_Crt_By: 'system',
    USR_Upd_At: new Date().toISOString(),
    USR_Upd_By: 'system'
  },
  {
    USR_ID: 'mkhoraiby',
    EMP_Name_EN: 'Mohamed Khoraiby',
    USR_Name: 'mkhoraiby',
    EMP_Email: 'mkhoraiby@nijjara.com',
    Job_Title: 'HR Manager',
    DEPT_Name: 'الموارد البشرية',
    ROL_ID: 'HR_MANAGER',
    USR_Is_Active: true,
    Password_Hash: '', // Will be set during initialization
    Last_Login: null,
    USR_Crt_At: new Date().toISOString(),
    USR_Crt_By: 'system',
    USR_Upd_At: new Date().toISOString(),
    USR_Upd_By: 'system'
  }
];

// ROLES DATA
const ROLES_DATA = [
  {
    ROL_ID: 'SYS_ADMIN',
    ROL_Title: 'System Administrator',
    ROL_Notes: 'Full system access',
    ROL_Is_System: true,
    ROL_Crt_At: new Date().toISOString(),
    ROL_Crt_By: 'system',
    ROL_Upd_At: new Date().toISOString(),
    ROL_Upd_By: 'system'
  },
  {
    ROL_ID: 'HR_MANAGER',
    ROL_Title: 'HR Manager',
    ROL_Notes: 'Human Resources management access',
    ROL_Is_System: false,
    ROL_Crt_At: new Date().toISOString(),
    ROL_Crt_By: 'system',
    ROL_Upd_At: new Date().toISOString(),
    ROL_Upd_By: 'system'
  },
  {
    ROL_ID: 'PROJECT_MANAGER',
    ROL_Title: 'Project Manager',
    ROL_Notes: 'Project management access',
    ROL_Is_System: false,
    ROL_Crt_At: new Date().toISOString(),
    ROL_Crt_By: 'system',
    ROL_Upd_At: new Date().toISOString(),
    ROL_Upd_By: 'system'
  },
  {
    ROL_ID: 'FINANCE_MANAGER',
    ROL_Title: 'Finance Manager',
    ROL_Notes: 'Finance management access',
    ROL_Is_System: false,
    ROL_Crt_At: new Date().toISOString(),
    ROL_Crt_By: 'system',
    ROL_Upd_At: new Date().toISOString(),
    ROL_Upd_By: 'system'
  }
];

/**
 * Populate ENG_Forms sheet with initial form configurations
 */
function seedENGForms() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName('ENG_Forms');

  if (!sheet) {
    Logger.log('ENG_Forms sheet not found');
    return { success: false, message: 'ENG_Forms sheet not found' };
  }

  try {
    // Clear existing data (keep headers)
    const lastRow = sheet.getLastRow();
    if (lastRow > 2) {
      sheet.getRange(3, 1, lastRow - 2, sheet.getLastColumn()).clearContent();
    }

    // Prepare data for insertion
    const data = EMPLOYEE_FORMS_CONFIG.map(form => [
      form.FORM_ID, form.Form_Label, form.Tab_ID, form.Tab_Label, form.Field_ID,
      form.Field_Label, form.Field_Type, form.Field_Can_Edit, form.Source_Sheet,
      form.Source_Columns, form.Is_Mandatory, form.Default_Value, form.DD_ID,
      form.Target_Sheet, form.Target_Column, form.ROL_ID, form.Is_Visible, form.But_ID
    ]);

    // Insert data starting from row 3
    if (data.length > 0) {
      sheet.getRange(3, 1, data.length, data[0].length).setValues(data);
    }

    Logger.log(`Seeded ENG_Forms with ${data.length} records`);
    return { success: true, message: `Seeded ${data.length} form configurations` };

  } catch (error) {
    Logger.log(`Error seeding ENG_Forms: ${error.toString()}`);
    return { success: false, message: error.toString() };
  }
}

/**
 * Populate ENG_Views sheet with initial view configurations
 */
function seedENGViews() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName('ENG_Views');

  if (!sheet) {
    Logger.log('ENG_Views sheet not found');
    return { success: false, message: 'ENG_Views sheet not found' };
  }

  try {
    // Clear existing data (keep headers)
    const lastRow = sheet.getLastRow();
    if (lastRow > 2) {
      sheet.getRange(3, 1, lastRow - 2, sheet.getLastColumn()).clearContent();
    }

    // Prepare data for insertion
    const data = EMPLOYEE_VIEWS_CONFIG.map(view => [
      view.VIEW_ID, view.View_Title, view.Source_Sheet, view.Source_Columns
    ]);

    // Insert data starting from row 3
    if (data.length > 0) {
      sheet.getRange(3, 1, data.length, data[0].length).setValues(data);
    }

    Logger.log(`Seeded ENG_Views with ${data.length} records`);
    return { success: true, message: `Seeded ${data.length} view configurations` };

  } catch (error) {
    Logger.log(`Error seeding ENG_Views: ${error.toString()}`);
    return { success: false, message: error.toString() };
  }
}

/**
 * Populate ENG_Buttons sheet with initial button configurations
 */
function seedENGButtons() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName('ENG_Buttons');

  if (!sheet) {
    Logger.log('ENG_Buttons sheet not found');
    return { success: false, message: 'ENG_Buttons sheet not found' };
  }

  try {
    // Clear existing data (keep headers)
    const lastRow = sheet.getLastRow();
    if (lastRow > 2) {
      sheet.getRange(3, 1, lastRow - 2, sheet.getLastColumn()).clearContent();
    }

    // Prepare data for insertion
    const data = BUTTONS_CONFIG.map(button => [
      button.BTN_ID, button.BTN_Label, button.BTN_Type, button.BTN_Description
    ]);

    // Insert data starting from row 3
    if (data.length > 0) {
      sheet.getRange(3, 1, data.length, data[0].length).setValues(data);
    }

    Logger.log(`Seeded ENG_Buttons with ${data.length} records`);
    return { success: true, message: `Seeded ${data.length} button configurations` };

  } catch (error) {
    Logger.log(`Error seeding ENG_Buttons: ${error.toString()}`);
    return { success: false, message: error.toString() };
  }
}

/**
 * Populate ENG_Dropdowns sheet with initial dropdown configurations
 */
function seedENGDropdowns() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName('ENG_Dropdowns');

  if (!sheet) {
    Logger.log('ENG_Dropdowns sheet not found');
    return { success: false, message: 'ENG_Dropdowns sheet not found' };
  }

  try {
    // Clear existing data (keep headers)
    const lastRow = sheet.getLastRow();
    if (lastRow > 2) {
      sheet.getRange(3, 1, lastRow - 2, sheet.getLastColumn()).clearContent();
    }

    // Prepare data for insertion
    const data = DROPDOWN_CONFIG.map(dd => [
      dd.DD_ID, dd.DD_EN, dd.DD_AR, dd.DD_Is_Active, dd.DD_Sort_Order
    ]);

    // Insert data starting from row 3
    if (data.length > 0) {
      sheet.getRange(3, 1, data.length, data[0].length).setValues(data);
    }

    Logger.log(`Seeded ENG_Dropdowns with ${data.length} records`);
    return { success: true, message: `Seeded ${data.length} dropdown configurations` };

  } catch (error) {
    Logger.log(`Error seeding ENG_Dropdowns: ${error.toString()}`);
    return { success: false, message: error.toString() };
  }
}

/**
 * Populate ENG_Settings sheet with initial system settings
 */
function seedENGSettings() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName('ENG_Settings');

  if (!sheet) {
    Logger.log('ENG_Settings sheet not found');
    return { success: false, message: 'ENG_Settings sheet not found' };
  }

  try {
    // Clear existing data (keep headers)
    const lastRow = sheet.getLastRow();
    if (lastRow > 2) {
      sheet.getRange(3, 1, lastRow - 2, sheet.getLastColumn()).clearContent();
    }

    // Prepare data for insertion
    const data = SYSTEM_SETTINGS_CONFIG.map(setting => [
      setting.Setting_Key, setting.Setting_Value, setting.Description_EN,
      setting.Updated_By, setting.Updated_At
    ]);

    // Insert data starting from row 3
    if (data.length > 0) {
      sheet.getRange(3, 1, data.length, data[0].length).setValues(data);
    }

    Logger.log(`Seeded ENG_Settings with ${data.length} records`);
    return { success: true, message: `Seeded ${data.length} system settings` };

  } catch (error) {
    Logger.log(`Error seeding ENG_Settings: ${error.toString()}`);
    return { success: false, message: error.toString() };
  }
}

/**
 * Populate HRM_Departments sheet with initial departments
 */
function seedDepartments() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName('HRM_Departments');

  if (!sheet) {
    Logger.log('HRM_Departments sheet not found');
    return { success: false, message: 'HRM_Departments sheet not found' };
  }

  try {
    // Clear existing data (keep headers)
    const lastRow = sheet.getLastRow();
    if (lastRow > 2) {
      sheet.getRange(3, 1, lastRow - 2, sheet.getLastColumn()).clearContent();
    }

    // Prepare data for insertion
    const data = DEPARTMENTS_DATA.map(dept => [
      dept.DEPT_ID, dept.DEPT_Name, dept.DEPT_Is_Active, dept.DEPT_Sort_Order,
      dept.DEPT_Crt_At, dept.DEPT_Crt_By, dept.DEPT_Upd_At, dept.DEPT_Upd_By
    ]);

    // Insert data starting from row 3
    if (data.length > 0) {
      sheet.getRange(3, 1, data.length, data[0].length).setValues(data);
    }

    Logger.log(`Seeded HRM_Departments with ${data.length} records`);
    return { success: true, message: `Seeded ${data.length} departments` };

  } catch (error) {
    Logger.log(`Error seeding HRM_Departments: ${error.toString()}`);
    return { success: false, message: error.toString() };
  }
}

/**
 * Populate SYS_Users sheet with initial users
 */
function seedUsers() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName('SYS_Users');

  if (!sheet) {
    Logger.log('SYS_Users sheet not found');
    return { success: false, message: 'SYS_Users sheet not found' };
  }

  try {
    // Clear existing data (keep headers)
    const lastRow = sheet.getLastRow();
    if (lastRow > 2) {
      sheet.getRange(3, 1, lastRow - 2, sheet.getLastColumn()).clearContent();
    }

    // Hash passwords for initial users
    const usersWithHashes = INITIAL_USERS_DATA.map(user => {
      let passwordHash = '';
      if (user.USR_Name === 'admin') {
        passwordHash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, 'admin123').map(b => ('0' + (b & 0xFF).toString(16)).slice(-2)).join('');
      } else if (user.USR_Name === 'mkhoraiby') {
        passwordHash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, '210388').map(b => ('0' + (b & 0xFF).toString(16)).slice(-2)).join('');
      }

      return [
        user.USR_ID, user.EMP_Name_EN, user.USR_Name, user.EMP_Email,
        user.Job_Title, user.DEPT_Name, user.ROL_ID, user.USR_Is_Active,
        passwordHash, user.Last_Login, user.USR_Crt_At, user.USR_Crt_By,
        user.USR_Upd_At, user.USR_Upd_By
      ];
    });

    // Insert data starting from row 3
    if (usersWithHashes.length > 0) {
      sheet.getRange(3, 1, usersWithHashes.length, usersWithHashes[0].length).setValues(usersWithHashes);
    }

    Logger.log(`Seeded SYS_Users with ${usersWithHashes.length} records`);
    return { success: true, message: `Seeded ${usersWithHashes.length} users` };

  } catch (error) {
    Logger.log(`Error seeding SYS_Users: ${error.toString()}`);
    return { success: false, message: error.toString() };
  }
}

/**
 * Populate SYS_Roles sheet with initial roles
 */
function seedRoles() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName('SYS_Roles');

  if (!sheet) {
    Logger.log('SYS_Roles sheet not found');
    return { success: false, message: 'SYS_Roles sheet not found' };
  }

  try {
    // Clear existing data (keep headers)
    const lastRow = sheet.getLastRow();
    if (lastRow > 2) {
      sheet.getRange(3, 1, lastRow - 2, sheet.getLastColumn()).clearContent();
    }

    // Prepare data for insertion
    const data = ROLES_DATA.map(role => [
      role.ROL_ID, role.ROL_Title, role.ROL_Notes, role.ROL_Is_System,
      role.ROL_Crt_At, role.ROL_Crt_By, role.ROL_Upd_At, role.ROL_Upd_By
    ]);

    // Insert data starting from row 3
    if (data.length > 0) {
      sheet.getRange(3, 1, data.length, data[0].length).setValues(data);
    }

    Logger.log(`Seeded SYS_Roles with ${data.length} records`);
    return { success: true, message: `Seeded ${data.length} roles` };

  } catch (error) {
    Logger.log(`Error seeding SYS_Roles: ${error.toString()}`);
    return { success: false, message: error.toString() };
  }
}

/**
 * Main seeding function - populates all ENG_ sheets and initial data
 */
function seedAllData() {
  Logger.log('Starting data seeding process...');

  const results = {
    ENG_Forms: seedENGForms(),
    ENG_Views: seedENGViews(),
    ENG_Buttons: seedENGButtons(),
    ENG_Dropdowns: seedENGDropdowns(),
    ENG_Settings: seedENGSettings(),
    HRM_Departments: seedDepartments(),
    SYS_Users: seedUsers(),
    SYS_Roles: seedRoles()
  };

  const successCount = Object.values(results).filter(r => r.success).length;
  const totalCount = Object.keys(results).length;

  Logger.log(`Data seeding completed: ${successCount}/${totalCount} operations successful`);

  return {
    success: successCount === totalCount,
    results: results,
    message: `Seeded ${successCount} out of ${totalCount} data tables successfully`
  };
}
