/**
 * Nijjara ERP - Setup.js
 * Single source of truth for database schema
 * Defines every sheet and every header in the ERP system
 */

// ERP_SCHEMA - Complete database schema definition
const ERP_SCHEMA = {
  // ENGINE SHEETS (ENG_) - System Configuration & Metadata
  ENG_Forms: [
    'FORM_ID', 'Form_Label', 'Tab_ID', 'Tab_Label', 'Field_ID', 'Field_Label',
    'Field_Type', 'Field_Can_Edit', 'Source_Sheet', 'Source_Columns', 'Is_Mandatory',
    'Default_Value', 'DD_ID', 'Target_Sheet', 'Target_Column', 'ROL_ID', 'Is_Visible', 'But_ID'
  ],

  ENG_Views: [
    'VIEW_ID', 'View_Title', 'Source_Sheet', 'Source_Columns'
  ],

  ENG_Buttons: [
    'BTN_ID', 'BTN_Label', 'BTN_Type', 'BTN_Description'
  ],

  ENG_Dropdowns: [
    'DD_ID', 'DD_EN', 'DD_AR', 'DD_Is_Active', 'DD_Sort_Order'
  ],

  ENG_Settings: [
    'Setting_Key', 'Setting_Value', 'Description_EN', 'Updated_By', 'Updated_At'
  ],

  // SYSTEM ADMINISTRATION MODULE (SYS_)
  SYS_Dashboard: [
    'SYS_Dash_ID', 'SYS_Metric_Code', 'SYS_Metric_Value', 'SYS_Dash_Date', 'SYS_Dash_Notes'
  ],

  SYS_Documents: [
    'DOC_ID', 'DOC_Entity', 'DOC_Entity_ID', 'DOC_File_Name', 'DOC_Label',
    'DOC_Drive_File_ID', 'DOC_Drive_URL', 'DOC_Upload_By', 'DOC_Crt_At'
  ],

  SYS_Users: [
    'USR_ID', 'EMP_Name_EN', 'USR_Name', 'EMP_Email', 'Job_Title', 'DEPT_Name',
    'ROL_ID', 'USR_Is_Active', 'Password_Hash', 'Last_Login', 'USR_Crt_At',
    'USR_Crt_By', 'USR_Upd_At', 'USR_Upd_By'
  ],

  SYS_Roles: [
    'ROL_ID', 'ROL_Title', 'ROL_Notes', 'ROL_Is_System', 'ROL_Crt_At',
    'ROL_Crt_By', 'ROL_Upd_At', 'ROL_Upd_By'
  ],

  SYS_Permissions: [
    'PRM_ID', 'PRM_Name', 'PRM_Notes', 'PRM_Catg', 'PRM_Crt_At',
    'PRM_Crt_By', 'PRM_Upd_At', 'PRM_Upd_By'
  ],

  SYS_Role_Permissions: [
    'ROL_ID', 'PRM_ID', 'SRP_Scope', 'SRP_Is_Allowed', 'SRP_Constraints',
    'SRP_Crt_At', 'SRP_Crt_By', 'SRP_Upd_At', 'SRP_Upd_By'
  ],

  SYS_Audit_Log: [
    'AUD_ID', 'AUD_Time_Stamp', 'USR_ID', 'USR_Name', 'USR_Action',
    'ACT_Details', 'AUD_Entity', 'AUD_Entity_ID', 'AUD_Scope',
    'AUD_Sheet_ID', 'AUD_Sheet_Name', 'IP_Address'
  ],

  SYS_Sessions: [
    'SESS_ID', 'USR_ID', 'EMP_Email', 'Actor_USR_ID', 'SESS_Type',
    'SESS_Status', 'USR_Device', 'IP_Address', 'Auth_Token',
    'SESS_Start_At', 'SESS_End_At', 'SESS_Crt_At', 'SESS_Crt_By',
    'SESS_Last_Seen', 'SESS_Revoked_At', 'SESS_Revoked_By', 'SESS_Metadata'
  ],

  SYS_PubHolidays: [
    'PUBHOL_ID', 'Pub_Holiday_Date', 'Pub_Holiday_Name'
  ],

  SYS_Analysis: [
    'SYS_ANA_ID', 'SYS_ANA_Date', 'SYS_ANA_Start', 'SYS_ANA_End',
    'SYS_ANA_Item1', 'SYS_ANA_Item2', 'SYS_ANA_Item3', 'SYS_ANA_Item4',
    'SYS_ANA_Item5', 'SYS_ANA_Item6', 'SYS_ANA_Item7', 'SYS_ANA_Item8', 'SYS_ANA_Item9'
  ],

  // HUMAN RESOURCES MODULE (HRM_)
  HRM_Dashboard: [
    'HR_Dash_ID', 'HR_Metric_Code', 'HR_Metric_Value', 'HR_Dash_Date', 'HR_Dash_Notes'
  ],

  HRM_Departments: [
    'DEPT_ID', 'DEPT_Name', 'DEPT_Is_Active', 'DEPT_Sort_Order',
    'DEPT_Crt_At', 'DEPT_Crt_By', 'DEPT_Upd_At', 'DEPT_Upd_By'
  ],

  HRM_Employees: [
    'EMP_ID', 'EMP_Name_EN', 'EMP_Name_AR', 'Date_of_Birth', 'Gender',
    'National_ID', 'Marital_Status', 'Military_Status', 'EMP_Mob_Main',
    'EMP_Mob_Sub', 'Home_Address', 'EMP_Email', 'Emrgcy_Cont',
    'EmrCont_Relation', 'EmrCont__Mob', 'Job_Title', 'DEPT_Name',
    'Hire_Date', 'EMP_CONT_Type', 'EMP_Status', 'Basic_Salary',
    'Allowances', 'Deducts', 'EMP_Crt_At', 'EMP_Crt_By'
  ],

  HRM_Attendance: [
    'ATT_ID', 'EMP_ID', 'ATT_Date', 'ATT_Check_In', 'ATT_Check_Out',
    'ATT_Hours', 'ATT_Late_Mints', 'ATT_EarlyLV_Mints', 'ATT_OT_Mints',
    'ATT_Notes', 'ATT_Status', 'ATT_Crt_At', 'ATT_Crt_By',
    'ATT_Upd_At', 'ATT_Upd_By'
  ],

  HRM_Leave: [
    'LV_ID', 'EMP_ID', 'LV_Type', 'LV_Start_Date', 'LV_End_Date',
    'LV_NumDays', 'LV_Status', 'LV_Reason', 'LV_Approved_By',
    'LV_Notes', 'LV_Crt_At', 'LV_Crt_By', 'LV_Upd_At', 'LV_Upd_By'
  ],

  HRM_Advances: [
    'ADV_ID', 'EMP_ID', 'ADV_Issue_Date', 'ADV_Amnt', 'ADV_Setlmnt_Period',
    'ADV_Instal', 'ADV_Notes', 'ADV_Status', 'ADV_Crt_At', 'ADV_Crt_By',
    'ADV_Upd_At', 'ADV_Upd_By'
  ],

  HRM_OverTime: [
    'OT_ID', 'EMP_ID', 'POL_OT_ID', 'ATT_Date', 'ATT_OT_Mints',
    'OT_Amnt', 'OT_Crt_At', 'OT_Crt_By', 'OT_Upd_At', 'OT_Upd_By'
  ],

  HRM_Deductions: [
    'DEDCT_ID', 'PEN_ID', 'PEN_Name', 'EMP_ID', 'DEDCT_Date',
    'DEDCT_Amnt', 'DEDCT_Crt_At', 'DEDCT_Crt_By', 'DEDCT_Upd_At', 'DEDCT_Upd_By'
  ],

  HRM_Analysis: [
    'HR_ANA_ID', 'HR_ANA_Date', 'HR_ANA_Start', 'HR_ANA_End',
    'HR_ANA_Item1', 'HR_ANA_Item2', 'HR_ANA_Item3', 'HR_ANA_Item4',
    'HR_ANA_Item5', 'HR_ANA_Item6', 'HR_ANA_Item7', 'HR_ANA_Item8', 'HR_ANA_Item9'
  ],

  // PROJECT MANAGEMENT MODULE (PRJ_)
  PRJ_Dashboard: [
    'PRJ_Dash_ID', 'PRJ_Metric_Code', 'PRJ_Metric_Value', 'PRJ_Dash_Date', 'PRJ_Dash_Notes'
  ],

  PRJ_Main: [
    'PRJ_ID', 'PRJ_Name', 'CLI_ID', 'CLI_Name', 'PRJ_Status', 'PRJ_Type',
    'PRJ_Budget', 'Plan_Num_Days', 'Plan_Start_Date', 'PRJ_Location',
    'ADV_Crt_At', 'ADV_Crt_By', 'ADV_Upd_At', 'ADV_Upd_By'
  ],

  PRJ_Clients: [
    'CLI_ID', 'CLI_Name', 'CLI_Mob_1', 'CLI_Mob_2', 'CLI_Email',
    'ADV_Crt_At', 'ADV_Crt_By', 'ADV_Upd_At', 'ADV_Upd_By'
  ],

  PRJ_Tasks: [
    'TSK_ID', 'PRJ_ID', 'TSK_Name', 'TSK_Priority', 'EMP_ID',
    'TSK_Plan_Start', 'TSK_Plan_End', 'TSK_Start', 'TSK_End',
    'TSK_Status', 'ADV_Crt_At', 'ADV_Crt_By', 'ADV_Upd_At', 'ADV_Upd_By'
  ],

  PRJ_Material: [
    'MAT_ID', 'MAT_Name', 'MAT_Catg', 'MAT_Sub1', 'MAT_Sub2',
    'Default_Unit', 'Default_Price', 'MAT_Active', 'ADV_Crt_At',
    'ADV_Crt_By', 'ADV_Upd_At', 'ADV_Upd_By'
  ],

  PRJ_IndirExp_Time_Alloc: [
    'ALO_TM_ID', 'InDiEXP_TM_ID', 'PRJ_ID', 'ALO_TM_Methd',
    'ALO_TM_Percnt', 'ALO_TM_Amnt', 'ADV_Crt_At', 'ADV_Crt_By',
    'ADV_Upd_At', 'ADV_Upd_By'
  ],

  PRJ_IndirExp_NoTime_Alloc: [
    'ALO_NT_ID', 'InDiEXP_NT_ID', 'PRJ_ID', 'ALO_NT_Methd',
    'ALO_NT_Percnt', 'ALO_NT_Amnt', 'ADV_Crt_At', 'ADV_Crt_By',
    'ADV_Upd_At', 'ADV_Upd_By'
  ],

  PRJ_Plan_vs_Actual: [
    'PvA_ID', 'PRJ_ID', 'PRJ_Name', 'Plan_Start_Date', 'Actual_Start_Date',
    'Plan_Num_Days', 'Actual_Num_Days', 'Plan_End_Date', 'Actual_End_Date',
    'Plan_Direct_Exp', 'Actual_Direct_Exp', 'Plan_MATs', 'Actual_MATs',
    'ADV_Crt_At', 'ADV_Crt_By', 'ADV_Upd_At', 'ADV_Upd_By'
  ],

  PRJ_Analysis: [
    'PRJ_ANA_ID', 'PRJ_ANA_Date', 'PRJ_ANA_Start', 'PRJ_ANA_End',
    'PRJ_ANA_Item1', 'PRJ_ANA_Item2', 'PRJ_ANA_Item3', 'PRJ_ANA_Item4',
    'PRJ_ANA_Item5', 'PRJ_ANA_Item6', 'PRJ_ANA_Item7', 'PRJ_ANA_Item8', 'PRJ_ANA_Item9'
  ],

  // FINANCE MODULE (FIN_)
  FIN_Dashboard: [
    'FIN_Dash_ID', 'FIN_Metric_Code', 'FIN_Metric_Value', 'FIN_Dash_Date', 'FIN_Dash_Notes'
  ],

  FIN_DirectExpenses: [
    'DiEXP_ID', 'PRJ_ID', 'PRJ_Name', 'DiEXP_Date', 'MAT_ID', 'MAT_Name',
    'MAT_Catg', 'MAT_Sub1', 'MAT_Sub2', 'Default_Unit', 'Default_Price',
    'MAT_Quantity', 'DiEXP_Total_VAT_Exc', 'DiEXP_Total_VAT_Inc',
    'DiEXP_Pay_Status', 'DiEXP_Pay_Methd', 'DiEXP_Notes', 'ADV_Crt_At',
    'ADV_Crt_By', 'ADV_Upd_At', 'ADV_Upd_By'
  ],

  FIN_InDirectExpenses_Time: [
    'InDiEXP_TM_ID', 'InDiEXP_TM_Catg', 'InDiEXP_TM_Sub1', 'InDiEXP_TM_Sub2',
    'InDiEXP_Start', 'InDiEXP_End', 'InDiEXP_TM_Pay_Status',
    'InDiEXP_TM_Pay_Methd', 'InDiEXP_TM_Notes', 'ADV_Crt_At', 'ADV_Crt_By',
    'ADV_Upd_At', 'ADV_Upd_By'
  ],

  FIN_InDirectExpenses_NoTime: [
    'InDiEXP_NT_ID', 'InDiEXP_NT_Catg', 'InDiEXP_NT_Sub1', 'InDiEXP_NT_Sub2',
    'Useful_Life_Months', 'Depreciation_Start_Date', 'InDiEXP_NT_Pay_Status',
    'InDiEXP_NT_Pay_Methd', 'InDiEXP_NT_Notes', 'ADV_Crt_At', 'ADV_Crt_By',
    'ADV_Upd_At', 'ADV_Upd_By'
  ],

  FIN_PRJ_Revenue: [
    'REV_ID', 'PRJ_ID', 'REV_Date', 'REV_Amnt', 'REV_Type', 'REV_Source',
    'REV_Notes', 'REV_Pay_Methd', 'REV_Invoice_Number', 'REV_Pay_Status',
    'REV_Total', 'REV_Remain', 'ADV_Crt_At', 'ADV_Crt_By', 'ADV_Upd_At', 'ADV_Upd_By'
  ],

  FIN_Custody: [
    'CSTD_ID', 'EMP_ID', 'EMP_Name', 'PRJ_ID', 'PRJ_Name', 'CSTD_Issue_Date',
    'CSTD_Settl_Date', 'CSTD_Amnt', 'CSTD_Purpose', 'CSTD_Status',
    'CSTD_Notes', 'ADV_Crt_At', 'ADV_Crt_By', 'ADV_Upd_At', 'ADV_Upd_By'
  ],

  FIN_HRM_Payroll: [
    'PAY_ID', 'EMP_ID', 'EMP_Name', 'PAY_Start_Date', 'PAY_End_Date',
    'Basic_Salary', 'Total_OT_Amnt', 'ADV_Instal', 'Total_DEDCT_Amnt',
    'PAY_Net_Pay', 'PAY_Status', 'ADV_Crt_At', 'ADV_Crt_By', 'ADV_Upd_At', 'ADV_Upd_By'
  ],

  'FIN_P&L_Statements': [
    'P&L_ID', 'Rev_ID', 'DiEXP_ID', 'InDiEXP_TM_ID', 'InDiEXP_NT_ID',
    'REV_Total', 'Total_DiEXP', 'Total_InDiEXP_TM', 'Total_InDiEXP_NT',
    'P&L_Start_Date', 'P&L_End_Date', 'P&L_Amnt', 'ADV_Crt_At',
    'ADV_Crt_By', 'ADV_Upd_At', 'ADV_Upd_By'
  ],

  FIN_Analysis: [
    'FIN_ANA_ID', 'FIN_ANA_Date', 'FIN_ANA_Start', 'FIN_ANA_End',
    'FIN_ANA_Item1', 'FIN_ANA_Item2', 'FIN_ANA_Item3', 'FIN_ANA_Item4',
    'FIN_ANA_Item5', 'FIN_ANA_Item6', 'FIN_ANA_Item7', 'FIN_ANA_Item8', 'FIN_ANA_Item9'
  ]
};

/**
 * Initialize the ERP database schema
 * Creates all required sheets with proper headers
 */
function initializeERPSchema() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  Logger.log('Starting ERP Schema Initialization...');

  // Process each sheet in the schema
  Object.keys(ERP_SCHEMA).forEach(sheetName => {
    try {
      // Check if sheet exists, create if not
      let sheet = spreadsheet.getSheetByName(sheetName);
      if (!sheet) {
        sheet = spreadsheet.insertSheet(sheetName);
        Logger.log(`Created sheet: ${sheetName}`);
      }

      // Clear existing content
      sheet.clear();

      // Set English headers (Row 1)
      const headers = ERP_SCHEMA[sheetName];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

      // Set Arabic headers (Row 2) - Placeholder for now, will be filled by seed data
      const arabicHeaders = headers.map(() => ''); // Empty for now
      sheet.getRange(2, 1, 1, arabicHeaders.length).setValues([arabicHeaders]);

      // Format headers
      const headerRange = sheet.getRange(1, 1, 2, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#f0f0f0');
      headerRange.setBorder(true, true, true, true, true, true);

      Logger.log(`Initialized sheet: ${sheetName} with ${headers.length} columns`);

    } catch (error) {
      Logger.log(`Error initializing sheet ${sheetName}: ${error.toString()}`);
    }
  });

  Logger.log('ERP Schema Initialization Complete!');
  return { success: true, message: 'All sheets initialized successfully' };
}

/**
 * Validate schema integrity
 * Checks if all required sheets exist with correct headers
 */
function validateERPSchema() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const issues = [];

  Logger.log('Validating ERP Schema...');

  Object.keys(ERP_SCHEMA).forEach(sheetName => {
    try {
      const sheet = spreadsheet.getSheetByName(sheetName);
      if (!sheet) {
        issues.push(`Missing sheet: ${sheetName}`);
        return;
      }

      // Check English headers (Row 1)
      const expectedHeaders = ERP_SCHEMA[sheetName];
      const actualHeaders = sheet.getRange(1, 1, 1, expectedHeaders.length).getValues()[0];

      for (let i = 0; i < expectedHeaders.length; i++) {
        if (actualHeaders[i] !== expectedHeaders[i]) {
          issues.push(`Header mismatch in ${sheetName}, column ${i+1}: expected '${expectedHeaders[i]}', found '${actualHeaders[i]}'`);
        }
      }

    } catch (error) {
      issues.push(`Error validating ${sheetName}: ${error.toString()}`);
    }
  });

  if (issues.length === 0) {
    Logger.log('Schema validation passed!');
    return { success: true, issues: [] };
  } else {
    Logger.log(`Schema validation failed with ${issues.length} issues`);
    return { success: false, issues: issues };
  }
}
