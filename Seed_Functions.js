/**
 * Nijjara ERP - Seed_Functions.js
 * Programmatically inserts Google Sheet formulas into View columns
 * Links View columns to their Engine counterparts using ARRAYFORMULA
 */

/**
 * Set up bilingual headers (Arabic row 2) for all sheets
 * Links to ENG_ sheets for translation lookup
 */
function setupBilingualHeaders() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = spreadsheet.getSheets();

  Logger.log('Setting up bilingual headers...');

  sheets.forEach(sheet => {
    const sheetName = sheet.getName();

    // Skip ENG_ sheets as they don't need translation lookup
    if (sheetName.startsWith('ENG_')) return;

    try {
      const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

      // Create Arabic header formulas that lookup translations
      const arabicFormulas = headers.map(header => {
        if (!header) return '';

        // Formula to lookup Arabic translation from ENG_Translation sheet
        // This would be set up once ENG_Translation sheet exists
        return `=IFERROR(VLOOKUP("${header}", 'ENG_Translation'!$A:$B, 2, FALSE), "${header}")`;
      });

      if (arabicFormulas.some(formula => formula !== '')) {
        sheet.getRange(2, 1, 1, arabicFormulas.length).setFormulas([arabicFormulas]);
      }

      Logger.log(`Set up bilingual headers for ${sheetName}`);

    } catch (error) {
      Logger.log(`Error setting up bilingual headers for ${sheetName}: ${error.toString()}`);
    }
  });

  Logger.log('Bilingual headers setup completed');
}

/**
 * Set up auto-increment ID columns using ARRAYFORMULA
 */
function setupAutoIncrementIDs() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  Logger.log('Setting up auto-increment ID columns...');

  // Sheets that need auto-increment IDs
  const autoIncrementSheets = [
    'HRM_Employees', 'HRM_Departments', 'HRM_Attendance', 'HRM_Leave',
    'HRM_Advances', 'HRM_OverTime', 'HRM_Deductions',
    'PRJ_Main', 'PRJ_Clients', 'PRJ_Tasks', 'PRJ_Material',
    'FIN_DirectExpenses', 'FIN_InDirectExpenses_Time', 'FIN_InDirectExpenses_NoTime',
    'FIN_PRJ_Revenue', 'FIN_Custody', 'FIN_HRM_Payroll', 'FIN_P&L_Statements',
    'SYS_Users', 'SYS_Roles', 'SYS_Permissions', 'SYS_Role_Permissions',
    'SYS_Audit_Log', 'SYS_Sessions', 'SYS_Documents'
  ];

  autoIncrementSheets.forEach(sheetName => {
    try {
      const sheet = spreadsheet.getSheetByName(sheetName);
      if (!sheet) {
        Logger.log(`Sheet ${sheetName} not found, skipping auto-increment setup`);
        return;
      }

      // Find the ID column (usually first column)
      const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      const idColumnIndex = headers.findIndex(header => header && header.includes('_ID'));

      if (idColumnIndex !== -1) {
        // Set ARRAYFORMULA for auto-increment starting from row 3
        const formula = `=ARRAYFORMULA(IF(ROW(A:A)>=3, ROW(A:A)-2, ""))`;
        sheet.getRange(3, idColumnIndex + 1, 1, 1).setFormula(formula);

        Logger.log(`Set up auto-increment for ${sheetName} column ${headers[idColumnIndex]}`);
      }

    } catch (error) {
      Logger.log(`Error setting up auto-increment for ${sheetName}: ${error.toString()}`);
    }
  });

  Logger.log('Auto-increment ID setup completed');
}

/**
 * Set up dropdown validation using data from ENG_Dropdowns
 */
function setupDropdownValidations() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  Logger.log('Setting up dropdown validations...');

  // Define which columns in which sheets should have dropdowns
  const dropdownMappings = {
    'HRM_Employees': {
      'DEPT_Name': 'DD_DEPARTMENTS',
      'Gender': 'DD_GENDER',
      'Marital_Status': 'DD_MARITAL_STATUS',
      'Military_Status': 'DD_MILITARY_STATUS',
      'EMP_CONT_Type': 'DD_CONTRACT_TYPE',
      'EMP_Status': 'DD_EMPLOYEE_STATUS'
    },
    'PRJ_Main': {
      'PRJ_Status': 'DD_PROJECT_STATUS',
      'PRJ_Type': 'DD_PROJECT_TYPE'
    },
    'PRJ_Tasks': {
      'TSK_Priority': 'DD_TASK_PRIORITY',
      'TSK_Status': 'DD_TASK_STATUS'
    },
    'HRM_Leave': {
      'LV_Type': 'DD_LEAVE_TYPE',
      'LV_Status': 'DD_LEAVE_STATUS'
    }
  };

  Object.keys(dropdownMappings).forEach(sheetName => {
    try {
      const sheet = spreadsheet.getSheetByName(sheetName);
      if (!sheet) return;

      const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

      Object.keys(dropdownMappings[sheetName]).forEach(columnName => {
        const columnIndex = headers.indexOf(columnName);
        if (columnIndex === -1) return;

        const ddId = dropdownMappings[sheetName][columnName];

        // Create named range for dropdown data (assuming DD_* sheets exist)
        // This would create dynamic dropdown ranges
        const range = sheet.getRange(3, columnIndex + 1, 1000, 1); // From row 3 onwards

        // Set data validation - this would need the actual dropdown data
        // For now, we'll set a placeholder validation
        const rule = SpreadsheetApp.newDataValidation()
          .requireValueInRange(SpreadsheetApp.getActiveSpreadsheet().getRangeByName(ddId), true)
          .setAllowInvalid(false)
          .build();

        range.setDataValidation(rule);

        Logger.log(`Set up dropdown validation for ${sheetName}.${columnName} using ${ddId}`);
      });

    } catch (error) {
      Logger.log(`Error setting up dropdown validation for ${sheetName}: ${error.toString()}`);
    }
  });

  Logger.log('Dropdown validations setup completed');
}

/**
 * Set up calculated columns with formulas
 */
function setupCalculatedColumns() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  Logger.log('Setting up calculated columns...');

  // Define calculated columns for different sheets
  const calculatedColumns = {
    'HRM_Attendance': {
      'ATT_Hours': '=IF(AND(B:B<>"", C:C<>""), (C:C - B:B) * 24, "")', // Calculate hours from check-in/out
      'ATT_Late_Mints': '=IF(D:D > TIME(9,0,0), (D:D - TIME(9,0,0)) * 1440, 0)', // Late minutes if after 9 AM
      'ATT_EarlyLV_Mints': '=IF(AND(D:D < TIME(17,0,0), D:D <> ""), (TIME(17,0,0) - D:D) * 1440, 0)' // Early leave minutes if before 5 PM
    },
    'HRM_OverTime': {
      'OT_Amnt': '=IF(AND(D:D > 0, E:E > 0), D:D * E:E, 0)' // OT Hours * Rate
    },
    'FIN_DirectExpenses': {
      'DiEXP_Total_VAT_Exc': '=IF(AND(J:J > 0, K:K > 0), J:J * K:K, 0)', // Quantity * Price
      'DiEXP_Total_VAT_Inc': '=M:M * 1.14' // VAT Exclusive * 1.14 for 14% VAT
    },
    'FIN_HRM_Payroll': {
      'PAY_Net_Pay': '=Basic_Salary + Total_OT_Amnt - ADV_Instal - Total_DEDCT_Amnt' // Calculate net pay
    }
  };

  Object.keys(calculatedColumns).forEach(sheetName => {
    try {
      const sheet = spreadsheet.getSheetByName(sheetName);
      if (!sheet) return;

      const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

      Object.keys(calculatedColumns[sheetName]).forEach(columnName => {
        const columnIndex = headers.indexOf(columnName);
        if (columnIndex === -1) return;

        const formula = calculatedColumns[sheetName][columnName];

        // Set ARRAYFORMULA for the entire column starting from row 3
        const fullFormula = `=ARRAYFORMULA(IF(ROW(${String.fromCharCode(65 + columnIndex)}:${String.fromCharCode(65 + columnIndex)}) >= 3, ${formula}, ""))`;
        sheet.getRange(3, columnIndex + 1, 1, 1).setFormula(fullFormula);

        Logger.log(`Set up calculated column ${columnName} in ${sheetName}`);
      });

    } catch (error) {
      Logger.log(`Error setting up calculated columns for ${sheetName}: ${error.toString()}`);
    }
  });

  Logger.log('Calculated columns setup completed');
}

/**
 * Set up audit trail columns (Created/Updated timestamps and users)
 */
function setupAuditColumns() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  Logger.log('Setting up audit columns...');

  // Sheets that need audit columns
  const auditSheets = [
    'HRM_Employees', 'HRM_Departments', 'HRM_Attendance', 'HRM_Leave',
    'HRM_Advances', 'HRM_OverTime', 'HRM_Deductions',
    'PRJ_Main', 'PRJ_Clients', 'PRJ_Tasks', 'PRJ_Material',
    'PRJ_IndirExp_Time_Alloc', 'PRJ_IndirExp_NoTime_Alloc', 'PRJ_Plan_vs_Actual',
    'FIN_DirectExpenses', 'FIN_InDirectExpenses_Time', 'FIN_InDirectExpenses_NoTime',
    'FIN_PRJ_Revenue', 'FIN_Custody', 'FIN_HRM_Payroll', 'FIN_P&L_Statements',
    'SYS_Users', 'SYS_Roles', 'SYS_Permissions', 'SYS_Role_Permissions'
  ];

  auditSheets.forEach(sheetName => {
    try {
      const sheet = spreadsheet.getSheetByName(sheetName);
      if (!sheet) return;

      const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

      // Set up Crt_At column with NOW() formula for new records
      const crtAtIndex = headers.findIndex(h => h && h.includes('Crt_At'));
      if (crtAtIndex !== -1) {
        // For new records (when ID is just created), set current timestamp
        const formula = '=IF(ISBLANK(INDIRECT(ADDRESS(ROW(), 1))), NOW(), "")';
        sheet.getRange(3, crtAtIndex + 1, 1, 1).setFormula(formula);
      }

      // Set up Crt_By column with current user
      const crtByIndex = headers.findIndex(h => h && h.includes('Crt_By'));
      if (crtByIndex !== -1) {
        // This would need to be set by the application when creating records
        // For now, we'll leave it as a placeholder
      }

    } catch (error) {
      Logger.log(`Error setting up audit columns for ${sheetName}: ${error.toString()}`);
    }
  });

  Logger.log('Audit columns setup completed');
}

/**
 * Set up view columns that reference ENG_ configurations
 */
function setupViewColumns() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  Logger.log('Setting up view columns...');

  // Create view columns that pull data from ENG_ sheets
  // For example, form labels, button labels, etc.

  try {
    // Example: In HRM_Employees sheet, create a view column for Department Name in Arabic
    const empSheet = spreadsheet.getSheetByName('HRM_Employees');
    if (empSheet) {
      const headers = empSheet.getRange(1, 1, 1, empSheet.getLastColumn()).getValues()[0];
      const deptNameIndex = headers.indexOf('DEPT_Name');

      if (deptNameIndex !== -1) {
        // Add a view column next to DEPT_Name that shows Arabic department name
        const viewColumnIndex = deptNameIndex + 2; // Skip one column for the view

        // Add header for view column
        empSheet.getRange(1, viewColumnIndex, 1, 1).setValue('DEPT_Name_AR_View');
        empSheet.getRange(2, viewColumnIndex, 1, 1).setValue('اسم القسم');

        // Set formula to lookup Arabic name from HRM_Departments
        const formula = '=ARRAYFORMULA(IF(ROW(INDIRECT(ADDRESS(ROW(), COLUMN()))) >= 3, IFERROR(VLOOKUP(INDIRECT(ADDRESS(ROW(), COLUMN()-1)), HRM_Departments!$B:$C, 2, FALSE), INDIRECT(ADDRESS(ROW(), COLUMN()-1))), ""))';
        empSheet.getRange(3, viewColumnIndex, 1, 1).setFormula(formula);

        Logger.log('Set up department name view column in HRM_Employees');
      }
    }

  } catch (error) {
    Logger.log(`Error setting up view columns: ${error.toString()}`);
  }

  Logger.log('View columns setup completed');
}

/**
 * Set up conditional formatting rules
 */
function setupConditionalFormatting() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  Logger.log('Setting up conditional formatting...');

  try {
    // Example: Highlight active employees in green
    const empSheet = spreadsheet.getSheetByName('HRM_Employees');
    if (empSheet) {
      const headers = empSheet.getRange(1, 1, 1, empSheet.getLastColumn()).getValues()[0];
      const statusIndex = headers.indexOf('EMP_Status');

      if (statusIndex !== -1) {
        const range = empSheet.getRange(3, 1, 1000, empSheet.getLastColumn());

        // Conditional formatting for active employees
        const rule1 = SpreadsheetApp.newConditionalFormatRule()
          .whenFormulaSatisfied(`=$${String.fromCharCode(65 + statusIndex)}$ROW() = "نشط"`)
          .setBackground('#d4edda') // Light green
          .setRanges([range])
          .build();

        // Conditional formatting for inactive employees
        const rule2 = SpreadsheetApp.newConditionalFormatRule()
          .whenFormulaSatisfied(`=$${String.fromCharCode(65 + statusIndex)}$ROW() = "غير نشط"`)
          .setBackground('#f8d7da') // Light red
          .setRanges([range])
          .build();

        empSheet.setConditionalFormatRules([rule1, rule2]);

        Logger.log('Set up conditional formatting for employee status');
      }
    }

  } catch (error) {
    Logger.log(`Error setting up conditional formatting: ${error.toString()}`);
  }

  Logger.log('Conditional formatting setup completed');
}

/**
 * Main function to set up all formulas and validations
 */
function setupAllFormulas() {
  Logger.log('Starting formula setup process...');

  const results = {
    bilingualHeaders: setupBilingualHeaders(),
    autoIncrement: setupAutoIncrementIDs(),
    dropdowns: setupDropdownValidations(),
    calculated: setupCalculatedColumns(),
    audit: setupAuditColumns(),
    views: setupViewColumns(),
    formatting: setupConditionalFormatting()
  };

  Logger.log('Formula setup process completed');

  return {
    success: true,
    results: results,
    message: 'All formulas and validations have been set up'
  };
}
