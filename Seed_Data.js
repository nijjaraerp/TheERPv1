/**
 * Seed_Data.js
 * ============
 * Single Source of Truth for ERP Initial Data
 * This file contains functions to populate the ENG_ sheets and initial system data
 */

/**
 * Main function to seed all initial data
 */
function seedAllData() {
  Logger.log('🌱 Starting data seeding...');
  
  seedDropdowns();
  seedButtons();
  seedRoles();
  seedPermissions();
  seedRolePermissions();
  seedDefaultUser();
  seedSettings();
  seedDepartments();
  
  Logger.log('✅ Data seeding complete!');
}

/**
 * Seed ENG_Dropdowns with initial dropdown options
 */
function seedDropdowns() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('ENG_Dropdowns');
  
  if (!sheet) {
    Logger.log('❌ ENG_Dropdowns sheet not found');
    return;
  }
  
  Logger.log('📝 Seeding dropdowns...');
  
  const dropdowns = [
    // Gender
    ['DD_GENDER_MALE', 'Male', 'ذكر', true, 1],
    ['DD_GENDER_FEMALE', 'Female', 'أنثى', true, 2],
    
    // Marital Status
    ['DD_MARITAL_SINGLE', 'Single', 'أعزب', true, 1],
    ['DD_MARITAL_MARRIED', 'Married', 'متزوج', true, 2],
    ['DD_MARITAL_DIVORCED', 'Divorced', 'مطلق', true, 3],
    ['DD_MARITAL_WIDOWED', 'Widowed', 'أرمل', true, 4],
    
    // Military Status
    ['DD_MIL_EXEMPT', 'Exempt', 'معفى', true, 1],
    ['DD_MIL_COMPLETED', 'Completed', 'أدى الخدمة', true, 2],
    ['DD_MIL_POSTPONED', 'Postponed', 'مؤجل', true, 3],
    ['DD_MIL_NA', 'Not Applicable', 'لا ينطبق', true, 4],
    
    // Employee Status
    ['DD_EMP_ACTIVE', 'Active', 'نشط', true, 1],
    ['DD_EMP_INACTIVE', 'Inactive', 'غير نشط', true, 2],
    ['DD_EMP_ON_LEAVE', 'On Leave', 'في إجازة', true, 3],
    ['DD_EMP_SUSPENDED', 'Suspended', 'موقوف', true, 4],
    ['DD_EMP_TERMINATED', 'Terminated', 'مفصول', true, 5],
    
    // Contract Type
    ['DD_CONT_PERMANENT', 'Permanent', 'دائم', true, 1],
    ['DD_CONT_TEMPORARY', 'Temporary', 'مؤقت', true, 2],
    ['DD_CONT_CONTRACTOR', 'Contractor', 'متعاقد', true, 3],
    ['DD_CONT_INTERN', 'Intern', 'متدرب', true, 4],
    
    // Leave Types
    ['DD_LEAVE_ANNUAL', 'Annual Leave', 'إجازة سنوية', true, 1],
    ['DD_LEAVE_SICK', 'Sick Leave', 'إجازة مرضية', true, 2],
    ['DD_LEAVE_EMERGENCY', 'Emergency Leave', 'إجازة طارئة', true, 3],
    ['DD_LEAVE_UNPAID', 'Unpaid Leave', 'إجازة بدون مرتب', true, 4],
    ['DD_LEAVE_MATERNITY', 'Maternity Leave', 'إجازة وضع', true, 5],
    
    // Leave Status
    ['DD_LV_PENDING', 'Pending', 'قيد الانتظار', true, 1],
    ['DD_LV_APPROVED', 'Approved', 'موافق عليها', true, 2],
    ['DD_LV_REJECTED', 'Rejected', 'مرفوضة', true, 3],
    ['DD_LV_CANCELLED', 'Cancelled', 'ملغاة', true, 4],
    
    // Attendance Status
    ['DD_ATT_PRESENT', 'Present', 'حاضر', true, 1],
    ['DD_ATT_ABSENT', 'Absent', 'غائب', true, 2],
    ['DD_ATT_LATE', 'Late', 'متأخر', true, 3],
    ['DD_ATT_HALF_DAY', 'Half Day', 'نصف يوم', true, 4],
    ['DD_ATT_HOLIDAY', 'Holiday', 'عطلة', true, 5],
    
    // Project Status
    ['DD_PRJ_PLANNING', 'Planning', 'تخطيط', true, 1],
    ['DD_PRJ_IN_PROGRESS', 'In Progress', 'قيد التنفيذ', true, 2],
    ['DD_PRJ_ON_HOLD', 'On Hold', 'متوقف', true, 3],
    ['DD_PRJ_COMPLETED', 'Completed', 'مكتمل', true, 4],
    ['DD_PRJ_CANCELLED', 'Cancelled', 'ملغى', true, 5],
    
    // Project Type
    ['DD_PRJ_TYPE_CONSTRUCTION', 'Construction', 'إنشاءات', true, 1],
    ['DD_PRJ_TYPE_RENOVATION', 'Renovation', 'تجديد', true, 2],
    ['DD_PRJ_TYPE_MAINTENANCE', 'Maintenance', 'صيانة', true, 3],
    ['DD_PRJ_TYPE_CONSULTING', 'Consulting', 'استشارات', true, 4],
    
    // Task Priority
    ['DD_TSK_LOW', 'Low', 'منخفضة', true, 1],
    ['DD_TSK_MEDIUM', 'Medium', 'متوسطة', true, 2],
    ['DD_TSK_HIGH', 'High', 'عالية', true, 3],
    ['DD_TSK_URGENT', 'Urgent', 'عاجلة', true, 4],
    
    // Task Status
    ['DD_TSK_NOT_STARTED', 'Not Started', 'لم تبدأ', true, 1],
    ['DD_TSK_IN_PROGRESS', 'In Progress', 'قيد التنفيذ', true, 2],
    ['DD_TSK_COMPLETED', 'Completed', 'مكتملة', true, 3],
    ['DD_TSK_BLOCKED', 'Blocked', 'محظورة', true, 4],
    
    // Payment Status
    ['DD_PAY_PENDING', 'Pending', 'قيد الانتظار', true, 1],
    ['DD_PAY_PARTIAL', 'Partial', 'جزئي', true, 2],
    ['DD_PAY_PAID', 'Paid', 'مدفوع', true, 3],
    ['DD_PAY_OVERDUE', 'Overdue', 'متأخر', true, 4],
    
    // Payment Method
    ['DD_PAY_CASH', 'Cash', 'نقدي', true, 1],
    ['DD_PAY_BANK_TRANSFER', 'Bank Transfer', 'تحويل بنكي', true, 2],
    ['DD_PAY_CHECK', 'Check', 'شيك', true, 3],
    ['DD_PAY_CREDIT_CARD', 'Credit Card', 'بطاقة ائتمان', true, 4],
    
    // Revenue Type
    ['DD_REV_CONTRACT', 'Contract Payment', 'دفعة تعاقدية', true, 1],
    ['DD_REV_MILESTONE', 'Milestone Payment', 'دفعة مراحل', true, 2],
    ['DD_REV_FINAL', 'Final Payment', 'دفعة نهائية', true, 3],
    ['DD_REV_ADVANCE', 'Advance Payment', 'دفعة مقدمة', true, 4],
    
    // Material Unit
    ['DD_UNIT_PC', 'Piece', 'قطعة', true, 1],
    ['DD_UNIT_KG', 'Kilogram', 'كيلوجرام', true, 2],
    ['DD_UNIT_METER', 'Meter', 'متر', true, 3],
    ['DD_UNIT_M2', 'Square Meter', 'متر مربع', true, 4],
    ['DD_UNIT_M3', 'Cubic Meter', 'متر مكعب', true, 5],
    ['DD_UNIT_TON', 'Ton', 'طن', true, 6],
    ['DD_UNIT_LITER', 'Liter', 'لتر', true, 7],
    ['DD_UNIT_BOX', 'Box', 'صندوق', true, 8],
    
    // Material Category
    ['DD_MAT_RAW', 'Raw Materials', 'مواد خام', true, 1],
    ['DD_MAT_FINISHED', 'Finished Products', 'منتجات جاهزة', true, 2],
    ['DD_MAT_TOOLS', 'Tools & Equipment', 'أدوات ومعدات', true, 3],
    ['DD_MAT_CONSUMABLES', 'Consumables', 'مواد استهلاكية', true, 4],
    
    // Session Type
    ['DD_SESS_WEB', 'Web', 'ويب', true, 1],
    ['DD_SESS_MOBILE', 'Mobile', 'موبايل', true, 2],
    ['DD_SESS_API', 'API', 'API', true, 3],
    
    // Session Status
    ['DD_SESS_ACTIVE', 'Active', 'نشطة', true, 1],
    ['DD_SESS_EXPIRED', 'Expired', 'منتهية', true, 2],
    ['DD_SESS_REVOKED', 'Revoked', 'ملغاة', true, 3]
  ];
  
  // Start from row 3 (after headers)
  sheet.getRange(3, 1, dropdowns.length, 5).setValues(dropdowns);
  
  Logger.log(`✅ Seeded ${dropdowns.length} dropdown options`);
}

/**
 * Seed ENG_Buttons with system buttons
 */
function seedButtons() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('ENG_Buttons');
  
  if (!sheet) {
    Logger.log('❌ ENG_Buttons sheet not found');
    return;
  }
  
  Logger.log('📝 Seeding buttons...');
  
  const buttons = [
    // Common buttons
    ['BTN_SAVE', 'حفظ', 'submit', 'Save data to database'],
    ['BTN_CANCEL', 'إلغاء', 'cancel', 'Cancel and close form'],
    ['BTN_EDIT', 'تعديل', 'edit', 'Edit existing record'],
    ['BTN_DELETE', 'حذف', 'delete', 'Delete record'],
    ['BTN_ADD', 'إضافة', 'add', 'Add new record'],
    ['BTN_SEARCH', 'بحث', 'search', 'Search records'],
    ['BTN_FILTER', 'تصفية', 'filter', 'Filter data'],
    ['BTN_EXPORT', 'تصدير', 'export', 'Export data to Excel'],
    ['BTN_PRINT', 'طباعة', 'print', 'Print report'],
    ['BTN_REFRESH', 'تحديث', 'refresh', 'Refresh data'],
    
    // HRM Module
    ['BTN_HRM_EMP_ADD', 'إضافة موظف جديد', 'add', 'Add new employee'],
    ['BTN_HRM_EMP_EDIT', 'تعديل بيانات الموظف', 'edit', 'Edit employee data'],
    ['BTN_HRM_ATT_CHECKIN', 'تسجيل حضور', 'submit', 'Check-in attendance'],
    ['BTN_HRM_ATT_CHECKOUT', 'تسجيل انصراف', 'submit', 'Check-out attendance'],
    ['BTN_HRM_LEAVE_REQUEST', 'طلب إجازة', 'add', 'Request leave'],
    ['BTN_HRM_LEAVE_APPROVE', 'الموافقة على الإجازة', 'approve', 'Approve leave request'],
    ['BTN_HRM_ADV_REQUEST', 'طلب سلفة', 'add', 'Request advance payment'],
    
    // PRJ Module
    ['BTN_PRJ_ADD', 'إضافة مشروع جديد', 'add', 'Add new project'],
    ['BTN_PRJ_EDIT', 'تعديل المشروع', 'edit', 'Edit project'],
    ['BTN_PRJ_TASK_ADD', 'إضافة مهمة', 'add', 'Add project task'],
    ['BTN_PRJ_CLIENT_ADD', 'إضافة عميل', 'add', 'Add new client'],
    ['BTN_PRJ_MAT_ADD', 'إضافة مادة', 'add', 'Add new material'],
    
    // FIN Module
    ['BTN_FIN_EXP_ADD', 'إضافة مصروف', 'add', 'Add expense'],
    ['BTN_FIN_REV_ADD', 'إضافة إيراد', 'add', 'Add revenue'],
    ['BTN_FIN_CSTD_ADD', 'إضافة عهدة', 'add', 'Add custody'],
    ['BTN_FIN_CSTD_SETTLE', 'تسوية عهدة', 'submit', 'Settle custody'],
    ['BTN_FIN_PAY_GENERATE', 'إنشاء كشف المرتبات', 'submit', 'Generate payroll'],
    
    // SYS Module
    ['BTN_SYS_USER_ADD', 'إضافة مستخدم', 'add', 'Add new user'],
    ['BTN_SYS_ROLE_ADD', 'إضافة دور', 'add', 'Add new role'],
    ['BTN_SYS_LOGOUT', 'تسجيل الخروج', 'logout', 'Logout from system']
  ];
  
  sheet.getRange(3, 1, buttons.length, 4).setValues(buttons);
  
  Logger.log(`✅ Seeded ${buttons.length} buttons`);
}

/**
 * Seed SYS_Roles with default roles
 */
function seedRoles() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('SYS_Roles');
  
  if (!sheet) {
    Logger.log('❌ SYS_Roles sheet not found');
    return;
  }
  
  Logger.log('📝 Seeding roles...');
  
  const now = new Date();
  const roles = [
    ['ROLE_ADMIN', 'مدير النظام', 'Full system access and control', true, now, 'SYSTEM', now, 'SYSTEM'],
    ['ROLE_HR_MANAGER', 'مدير الموارد البشرية', 'HR module full access', false, now, 'SYSTEM', now, 'SYSTEM'],
    ['ROLE_HR_OFFICER', 'موظف موارد بشرية', 'HR module limited access', false, now, 'SYSTEM', now, 'SYSTEM'],
    ['ROLE_PRJ_MANAGER', 'مدير المشاريع', 'Projects module full access', false, now, 'SYSTEM', now, 'SYSTEM'],
    ['ROLE_PRJ_OFFICER', 'موظف مشاريع', 'Projects module limited access', false, now, 'SYSTEM', now, 'SYSTEM'],
    ['ROLE_FIN_MANAGER', 'مدير المالية', 'Finance module full access', false, now, 'SYSTEM', now, 'SYSTEM'],
    ['ROLE_FIN_OFFICER', 'موظف مالية', 'Finance module limited access', false, now, 'SYSTEM', now, 'SYSTEM'],
    ['ROLE_EMPLOYEE', 'موظف', 'Basic employee access', false, now, 'SYSTEM', now, 'SYSTEM']
  ];
  
  sheet.getRange(3, 1, roles.length, 8).setValues(roles);
  
  Logger.log(`✅ Seeded ${roles.length} roles`);
}

/**
 * Seed SYS_Permissions with system permissions
 */
function seedPermissions() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('SYS_Permissions');
  
  if (!sheet) {
    Logger.log('❌ SYS_Permissions sheet not found');
    return;
  }
  
  Logger.log('📝 Seeding permissions...');
  
  const now = new Date();
  const permissions = [
    // System permissions
    ['PRM_SYS_USERS_VIEW', 'View Users', 'View system users', 'SYS', now, 'SYSTEM', now, 'SYSTEM'],
    ['PRM_SYS_USERS_ADD', 'Add Users', 'Add new users', 'SYS', now, 'SYSTEM', now, 'SYSTEM'],
    ['PRM_SYS_USERS_EDIT', 'Edit Users', 'Edit user data', 'SYS', now, 'SYSTEM', now, 'SYSTEM'],
    ['PRM_SYS_USERS_DELETE', 'Delete Users', 'Delete users', 'SYS', now, 'SYSTEM', now, 'SYSTEM'],
    ['PRM_SYS_ROLES_MANAGE', 'Manage Roles', 'Manage roles and permissions', 'SYS', now, 'SYSTEM', now, 'SYSTEM'],
    ['PRM_SYS_SETTINGS', 'System Settings', 'Manage system settings', 'SYS', now, 'SYSTEM', now, 'SYSTEM'],
    ['PRM_SYS_AUDIT', 'View Audit Log', 'View system audit log', 'SYS', now, 'SYSTEM', now, 'SYSTEM'],
    
    // HRM permissions
    ['PRM_HRM_EMP_VIEW', 'View Employees', 'View employee list', 'HRM', now, 'SYSTEM', now, 'SYSTEM'],
    ['PRM_HRM_EMP_ADD', 'Add Employees', 'Add new employees', 'HRM', now, 'SYSTEM', now, 'SYSTEM'],
    ['PRM_HRM_EMP_EDIT', 'Edit Employees', 'Edit employee data', 'HRM', now, 'SYSTEM', now, 'SYSTEM'],
    ['PRM_HRM_EMP_DELETE', 'Delete Employees', 'Delete employees', 'HRM', now, 'SYSTEM', now, 'SYSTEM'],
    ['PRM_HRM_ATT_VIEW', 'View Attendance', 'View attendance records', 'HRM', now, 'SYSTEM', now, 'SYSTEM'],
    ['PRM_HRM_ATT_MANAGE', 'Manage Attendance', 'Manage attendance records', 'HRM', now, 'SYSTEM', now, 'SYSTEM'],
    ['PRM_HRM_LEAVE_VIEW', 'View Leave', 'View leave requests', 'HRM', now, 'SYSTEM', now, 'SYSTEM'],
    ['PRM_HRM_LEAVE_REQUEST', 'Request Leave', 'Submit leave request', 'HRM', now, 'SYSTEM', now, 'SYSTEM'],
    ['PRM_HRM_LEAVE_APPROVE', 'Approve Leave', 'Approve/reject leave', 'HRM', now, 'SYSTEM', now, 'SYSTEM'],
    ['PRM_HRM_PAYROLL_VIEW', 'View Payroll', 'View payroll data', 'HRM', now, 'SYSTEM', now, 'SYSTEM'],
    ['PRM_HRM_PAYROLL_MANAGE', 'Manage Payroll', 'Generate and manage payroll', 'HRM', now, 'SYSTEM', now, 'SYSTEM'],
    
    // PRJ permissions
    ['PRM_PRJ_VIEW', 'View Projects', 'View project list', 'PRJ', now, 'SYSTEM', now, 'SYSTEM'],
    ['PRM_PRJ_ADD', 'Add Projects', 'Add new projects', 'PRJ', now, 'SYSTEM', now, 'SYSTEM'],
    ['PRM_PRJ_EDIT', 'Edit Projects', 'Edit project data', 'PRJ', now, 'SYSTEM', now, 'SYSTEM'],
    ['PRM_PRJ_DELETE', 'Delete Projects', 'Delete projects', 'PRJ', now, 'SYSTEM', now, 'SYSTEM'],
    ['PRM_PRJ_TASKS_MANAGE', 'Manage Tasks', 'Manage project tasks', 'PRJ', now, 'SYSTEM', now, 'SYSTEM'],
    ['PRM_PRJ_CLIENTS_MANAGE', 'Manage Clients', 'Manage clients', 'PRJ', now, 'SYSTEM', now, 'SYSTEM'],
    ['PRM_PRJ_MATERIALS_MANAGE', 'Manage Materials', 'Manage materials', 'PRJ', now, 'SYSTEM', now, 'SYSTEM'],
    
    // FIN permissions
    ['PRM_FIN_EXP_VIEW', 'View Expenses', 'View expenses', 'FIN', now, 'SYSTEM', now, 'SYSTEM'],
    ['PRM_FIN_EXP_ADD', 'Add Expenses', 'Add expenses', 'FIN', now, 'SYSTEM', now, 'SYSTEM'],
    ['PRM_FIN_EXP_EDIT', 'Edit Expenses', 'Edit expenses', 'FIN', now, 'SYSTEM', now, 'SYSTEM'],
    ['PRM_FIN_REV_VIEW', 'View Revenue', 'View revenue', 'FIN', now, 'SYSTEM', now, 'SYSTEM'],
    ['PRM_FIN_REV_ADD', 'Add Revenue', 'Add revenue', 'FIN', now, 'SYSTEM', now, 'SYSTEM'],
    ['PRM_FIN_CSTD_VIEW', 'View Custody', 'View custody records', 'FIN', now, 'SYSTEM', now, 'SYSTEM'],
    ['PRM_FIN_CSTD_MANAGE', 'Manage Custody', 'Manage custody records', 'FIN', now, 'SYSTEM', now, 'SYSTEM'],
    ['PRM_FIN_REPORTS', 'Financial Reports', 'View financial reports', 'FIN', now, 'SYSTEM', now, 'SYSTEM']
  ];
  
  sheet.getRange(3, 1, permissions.length, 8).setValues(permissions);
  
  Logger.log(`✅ Seeded ${permissions.length} permissions`);
}

/**
 * Seed SYS_Role_Permissions with default mappings
 */
function seedRolePermissions() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('SYS_Role_Permissions');
  
  if (!sheet) {
    Logger.log('❌ SYS_Role_Permissions sheet not found');
    return;
  }
  
  Logger.log('📝 Seeding role permissions...');
  
  const now = new Date();
  const rolePerms = [];
  
  // Admin gets all permissions
  const allPerms = [
    'PRM_SYS_USERS_VIEW', 'PRM_SYS_USERS_ADD', 'PRM_SYS_USERS_EDIT', 'PRM_SYS_USERS_DELETE',
    'PRM_SYS_ROLES_MANAGE', 'PRM_SYS_SETTINGS', 'PRM_SYS_AUDIT',
    'PRM_HRM_EMP_VIEW', 'PRM_HRM_EMP_ADD', 'PRM_HRM_EMP_EDIT', 'PRM_HRM_EMP_DELETE',
    'PRM_HRM_ATT_VIEW', 'PRM_HRM_ATT_MANAGE', 'PRM_HRM_LEAVE_VIEW', 'PRM_HRM_LEAVE_APPROVE',
    'PRM_HRM_PAYROLL_VIEW', 'PRM_HRM_PAYROLL_MANAGE',
    'PRM_PRJ_VIEW', 'PRM_PRJ_ADD', 'PRM_PRJ_EDIT', 'PRM_PRJ_DELETE',
    'PRM_PRJ_TASKS_MANAGE', 'PRM_PRJ_CLIENTS_MANAGE', 'PRM_PRJ_MATERIALS_MANAGE',
    'PRM_FIN_EXP_VIEW', 'PRM_FIN_EXP_ADD', 'PRM_FIN_EXP_EDIT',
    'PRM_FIN_REV_VIEW', 'PRM_FIN_REV_ADD', 'PRM_FIN_CSTD_VIEW', 'PRM_FIN_CSTD_MANAGE', 'PRM_FIN_REPORTS'
  ];
  
  allPerms.forEach(perm => {
    rolePerms.push(['ROLE_ADMIN', perm, 'ALL', true, null, now, 'SYSTEM', now, 'SYSTEM']);
  });
  
  Logger.log(`✅ Seeded ${rolePerms.length} role-permission mappings`);
  
  if (rolePerms.length > 0) {
    sheet.getRange(3, 1, rolePerms.length, 9).setValues(rolePerms);
  }
}

/**
 * Seed default admin user
 */
function seedDefaultUser() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('SYS_Users');
  
  if (!sheet) {
    Logger.log('❌ SYS_Users sheet not found');
    return;
  }
  
  Logger.log('📝 Seeding default admin user...');
  
  const now = new Date();
  // Simple hash for initial setup - should be improved with proper hashing
  const passwordHash = Utilities.base64Encode(Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256, 
    '210388'
  ));
  
  const user = [
    'USR001', 
    'Mohammed Khoraiby', 
    'mkhoraiby', 
    'mkhoraiby@example.com', 
    'System Administrator', 
    'IT',
    'ROLE_ADMIN', 
    true, 
    passwordHash, 
    null, 
    now, 
    'SYSTEM', 
    now, 
    'SYSTEM'
  ];
  
  sheet.getRange(3, 1, 1, 14).setValues([user]);
  
  Logger.log('✅ Created default admin user: mkhoraiby / 210388');
}

/**
 * Seed ENG_Settings with system settings
 */
function seedSettings() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('ENG_Settings');
  
  if (!sheet) {
    Logger.log('❌ ENG_Settings sheet not found');
    return;
  }
  
  Logger.log('📝 Seeding system settings...');
  
  const now = new Date();
  const settings = [
    ['SYSTEM_NAME', 'Nijjara ERP', 'System display name', 'SYSTEM', now],
    ['SYSTEM_VERSION', '1.0.0', 'Current system version', 'SYSTEM', now],
    ['DEFAULT_LANGUAGE', 'AR', 'Default interface language', 'SYSTEM', now],
    ['DATE_FORMAT', 'YYYY-MM-DD', 'System date format', 'SYSTEM', now],
    ['CURRENCY', 'EGP', 'System currency', 'SYSTEM', now],
    ['VAT_RATE', '14', 'VAT percentage rate', 'SYSTEM', now],
    ['SESSION_TIMEOUT', '480', 'Session timeout in minutes', 'SYSTEM', now],
    ['PASSWORD_MIN_LENGTH', '6', 'Minimum password length', 'SYSTEM', now],
    ['WORKING_HOURS_START', '08:00', 'Working hours start time', 'SYSTEM', now],
    ['WORKING_HOURS_END', '17:00', 'Working hours end time', 'SYSTEM', now],
    ['WEEKEND_FRIDAY', 'true', 'Friday is weekend', 'SYSTEM', now],
    ['WEEKEND_SATURDAY', 'true', 'Saturday is weekend', 'SYSTEM', now]
  ];
  
  sheet.getRange(3, 1, settings.length, 5).setValues(settings);
  
  Logger.log(`✅ Seeded ${settings.length} system settings`);
}

/**
 * Seed HRM_Departments with default departments
 */
function seedDepartments() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('HRM_Departments');
  
  if (!sheet) {
    Logger.log('❌ HRM_Departments sheet not found');
    return;
  }
  
  Logger.log('📝 Seeding departments...');
  
  const now = new Date();
  const departments = [
    ['DEPT001', 'الإدارة', true, 1, now, 'SYSTEM', now, 'SYSTEM'],
    ['DEPT002', 'الموارد البشرية', true, 2, now, 'SYSTEM', now, 'SYSTEM'],
    ['DEPT003', 'المالية', true, 3, now, 'SYSTEM', now, 'SYSTEM'],
    ['DEPT004', 'المشاريع', true, 4, now, 'SYSTEM', now, 'SYSTEM'],
    ['DEPT005', 'الجودة', true, 5, now, 'SYSTEM', now, 'SYSTEM'],
    ['DEPT006', 'تقنية المعلومات', true, 6, now, 'SYSTEM', now, 'SYSTEM']
  ];
  
  sheet.getRange(3, 1, departments.length, 8).setValues(departments);
  
  Logger.log(`✅ Seeded ${departments.length} departments`);
}

