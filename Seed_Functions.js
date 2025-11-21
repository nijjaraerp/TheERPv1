/**
 * Nijjara ERP - Seed_Functions.js
 * Programmatically inserts Google Sheet formulas into View columns
 * Links View columns to their Engine counterparts using ARRAYFORMULA
 *
 * NOTE: Bilingual headers are handled by Setup.js and should not be modified here
 */

/**
 * Helper function to check if a cell already has a formula
 * Prevents overwriting existing formulas/data
 */
function hasFormula(sheet, row, col) {
  try {
    const cell = sheet.getRange(row, col);
    const formula = cell.getFormula();
    return formula && formula.trim() !== "";
  } catch (error) {
    return false;
  }
}

/**
 * Helper function to check if a cell already has data
 * Prevents overwriting seeded data
 */
function hasData(sheet, row, col) {
  try {
    const cell = sheet.getRange(row, col);
    const value = cell.getValue();
    return value !== null && value !== "";
  } catch (error) {
    return false;
  }
}

/**
 * Helper function to safely get headers with validation
 * Prevents errors on empty sheets
 */
function getHeaders(sheet) {
  try {
    const lastCol = sheet.getLastColumn();
    if (lastCol === 0) {
      Logger.log(`Sheet ${sheet.getName()} has no columns, skipping`);
      return null;
    }
    const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    return headers;
  } catch (error) {
    Logger.log(
      `Error getting headers for ${sheet.getName()}: ${error.toString()}`
    );
    return null;
  }
}

/**
 * Helper function to add delay between operations
 * Prevents rate limiting errors
 */
function addDelay(milliseconds) {
  if (milliseconds > 0) {
    Utilities.sleep(milliseconds);
  }
}

function toColumnLetter(index) {
  var num = index + 1;
  var letters = "";
  while (num > 0) {
    var rem = (num - 1) % 26;
    letters = String.fromCharCode(65 + rem) + letters;
    num = Math.floor((num - 1) / 26);
  }
  return letters;
}

/**
 * Set up auto-increment ID columns using ARRAYFORMULA
 * Validates existing formulas/data before overwriting
 */
function setupAutoIncrementIDs() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  Logger.log("Setting up auto-increment ID columns...");

  // Sheets that need auto-increment IDs
  const autoIncrementSheets = [
    "HRM_Employees",
    "HRM_Departments",
    "HRM_Attendance",
    "HRM_Leave",
    "HRM_Advances",
    "HRM_OverTime",
    "HRM_Deductions",
    "PRJ_Main",
    "PRJ_Clients",
    "PRJ_Tasks",
    "PRJ_Material",
    "FIN_DirectExpenses",
    "FIN_InDirectExpenses_Time",
    "FIN_InDirectExpenses_NoTime",
    "FIN_PRJ_Revenue",
    "FIN_Custody",
    "FIN_HRM_Payroll",
    "FIN_P&L_Statements",
    "SYS_Users",
    "SYS_Roles",
    "SYS_Permissions",
    "SYS_Role_Permissions",
    "SYS_Audit_Log",
    "SYS_Sessions",
    "SYS_Documents",
  ];

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  autoIncrementSheets.forEach((sheetName, index) => {
    try {
      // Add delay between operations to prevent rate limiting
      if (index > 0 && index % 5 === 0) {
        addDelay(200);
      }

      const sheet = spreadsheet.getSheetByName(sheetName);
      if (!sheet) {
        Logger.log(
          `Sheet ${sheetName} not found, skipping auto-increment setup`
        );
        skipCount++;
        return;
      }

      const headers = getHeaders(sheet);
      if (!headers) {
        skipCount++;
        return;
      }

      const idColumnIndex = headers.findIndex(
        (header) => header && header.includes("_ID")
      );

      if (idColumnIndex !== -1) {
        const targetRow = 3;
        const targetCol = idColumnIndex + 1;

        // Check if formula already exists
        if (hasFormula(sheet, targetRow, targetCol)) {
          Logger.log(
            `Auto-increment formula already exists for ${sheetName} column ${headers[idColumnIndex]}, skipping`
          );
          skipCount++;
          return;
        }

        // Check if there's existing data that shouldn't be overwritten
        // Only proceed if row 3 is empty or has no meaningful data
        const existingValue = sheet.getRange(targetRow, targetCol).getValue();
        if (
          existingValue !== null &&
          existingValue !== "" &&
          !isNaN(existingValue)
        ) {
          Logger.log(
            `Data exists in ${sheetName} row ${targetRow}, column ${headers[idColumnIndex]}, skipping to preserve data`
          );
          skipCount++;
          return;
        }

        const colLetter = toColumnLetter(idColumnIndex);
        const formula = `=ARRAYFORMULA(IF(ROW(${colLetter}:${colLetter})>=3, ROW(${colLetter}:${colLetter})-2, ""))`;

        sheet.getRange(targetRow, targetCol, 1, 1).setFormula(formula);
        successCount++;
        Logger.log(
          `Set up auto-increment for ${sheetName} column ${headers[idColumnIndex]}`
        );
      } else {
        Logger.log(`No ID column found in ${sheetName}, skipping`);
        skipCount++;
      }
    } catch (error) {
      errorCount++;
      Logger.log(
        `Error setting up auto-increment for ${sheetName}: ${error.toString()}`
      );
    }
  });

  Logger.log(
    `Auto-increment ID setup completed: ${successCount} successful, ${skipCount} skipped, ${errorCount} errors`
  );
}

/**
 * Set up dropdown validation using data from ENG_Dropdowns
 * Validates existing validations before overwriting
 */
function setupDropdownValidations() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  Logger.log("Setting up dropdown validations...");

  // Define which columns in which sheets should have dropdowns
  const dropdownMappings = {
    HRM_Employees: {
      DEPT_Name: "DD_DEPARTMENTS",
      Gender: "DD_GENDER",
      Marital_Status: "DD_MARITAL_STATUS",
      Military_Status: "DD_MILITARY_STATUS",
      EMP_CONT_Type: "DD_CONTRACT_TYPE",
      EMP_Status: "DD_EMPLOYEE_STATUS",
    },
    PRJ_Main: {
      PRJ_Status: "DD_PROJECT_STATUS",
      PRJ_Type: "DD_PROJECT_TYPE",
    },
    PRJ_Tasks: {
      TSK_Priority: "DD_TASK_PRIORITY",
      TSK_Status: "DD_TASK_STATUS",
    },
    HRM_Leave: {
      LV_Type: "DD_LEAVE_TYPE",
      LV_Status: "DD_LEAVE_STATUS",
    },
  };

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  Object.keys(dropdownMappings).forEach((sheetName) => {
    try {
      const sheet = spreadsheet.getSheetByName(sheetName);
      if (!sheet) {
        skipCount++;
        return;
      }

      const headers = getHeaders(sheet);
      if (!headers) {
        skipCount++;
        return;
      }

      Object.keys(dropdownMappings[sheetName]).forEach((columnName) => {
        try {
          const columnIndex = headers.indexOf(columnName);
          if (columnIndex === -1) {
            skipCount++;
            return;
          }

          const ddId = dropdownMappings[sheetName][columnName];
          const range = sheet.getRange(3, columnIndex + 1, 1000, 1);

          // Check if validation already exists
          const existingValidation = range.getDataValidation();
          if (
            existingValidation &&
            existingValidation.getCriteriaType() !==
              SpreadsheetApp.DataValidationCriteria.UNCHECKED
          ) {
            Logger.log(
              `Dropdown validation already exists for ${sheetName}.${columnName}, skipping`
            );
            skipCount++;
            return;
          }

          // Check if named range exists
          const named =
            SpreadsheetApp.getActiveSpreadsheet().getRangeByName(ddId);
          if (!named) {
            Logger.log(
              `Named range ${ddId} not found, skipping ${sheetName}.${columnName}`
            );
            skipCount++;
            return;
          }

          const rule = SpreadsheetApp.newDataValidation()
            .requireValueInRange(named, true)
            .setAllowInvalid(false)
            .build();

          range.setDataValidation(rule);
          successCount++;
          Logger.log(
            `Set up dropdown validation for ${sheetName}.${columnName} using ${ddId}`
          );
        } catch (error) {
          errorCount++;
          Logger.log(
            `Error setting up dropdown validation for ${sheetName}.${columnName}: ${error.toString()}`
          );
        }
      });
    } catch (error) {
      errorCount++;
      Logger.log(
        `Error setting up dropdown validation for ${sheetName}: ${error.toString()}`
      );
    }
  });

  Logger.log(
    `Dropdown validations setup completed: ${successCount} successful, ${skipCount} skipped, ${errorCount} errors`
  );
}

/**
 * Set up calculated columns with formulas
 * Validates existing formulas before overwriting
 */
function setupCalculatedColumns() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  Logger.log("Setting up calculated columns...");

  // Define calculated columns for different sheets
  const calculatedColumns = {
    HRM_Attendance: {
      ATT_Hours: '=IF(AND(B:B<>"", C:C<>""), (C:C - B:B) * 24, "")', // Calculate hours from check-in/out
      ATT_Late_Mints: "=IF(D:D > TIME(9,0,0), (D:D - TIME(9,0,0)) * 1440, 0)", // Late minutes if after 9 AM
      ATT_EarlyLV_Mints:
        '=IF(AND(D:D < TIME(17,0,0), D:D <> ""), (TIME(17,0,0) - D:D) * 1440, 0)', // Early leave minutes if before 5 PM
    },
    HRM_OverTime: {
      OT_Amnt: "=IF(AND(D:D > 0, E:E > 0), D:D * E:E, 0)", // OT Hours * Rate
    },
    FIN_DirectExpenses: {
      DiEXP_Total_VAT_Exc: "=IF(AND(J:J > 0, K:K > 0), J:J * K:K, 0)", // Quantity * Price
      DiEXP_Total_VAT_Inc: "=M:M * 1.14", // VAT Exclusive * 1.14 for 14% VAT
    },
    FIN_HRM_Payroll: {
      PAY_Net_Pay:
        "=Basic_Salary + Total_OT_Amnt - ADV_Instal - Total_DEDCT_Amnt", // Calculate net pay
    },
  };

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  Object.keys(calculatedColumns).forEach((sheetName) => {
    try {
      const sheet = spreadsheet.getSheetByName(sheetName);
      if (!sheet) {
        skipCount++;
        return;
      }

      const headers = getHeaders(sheet);
      if (!headers) {
        skipCount++;
        return;
      }

      Object.keys(calculatedColumns[sheetName]).forEach((columnName) => {
        try {
          const columnIndex = headers.indexOf(columnName);
          if (columnIndex === -1) {
            skipCount++;
            return;
          }

          const targetRow = 3;
          const targetCol = columnIndex + 1;

          // Check if formula already exists
          if (hasFormula(sheet, targetRow, targetCol)) {
            Logger.log(
              `Calculated formula already exists for ${sheetName}.${columnName}, skipping`
            );
            skipCount++;
            return;
          }

          const formula = calculatedColumns[sheetName][columnName];
          const colLetter = toColumnLetter(columnIndex);
          const fullFormula = `=ARRAYFORMULA(IF(ROW(${colLetter}:${colLetter})>=3, ${formula}, ""))`;

          sheet.getRange(targetRow, targetCol, 1, 1).setFormula(fullFormula);
          successCount++;
          Logger.log(`Set up calculated column ${columnName} in ${sheetName}`);
        } catch (error) {
          errorCount++;
          Logger.log(
            `Error setting up calculated column ${columnName} in ${sheetName}: ${error.toString()}`
          );
        }
      });
    } catch (error) {
      errorCount++;
      Logger.log(
        `Error setting up calculated columns for ${sheetName}: ${error.toString()}`
      );
    }
  });

  Logger.log(
    `Calculated columns setup completed: ${successCount} successful, ${skipCount} skipped, ${errorCount} errors`
  );
}

/**
 * Set up audit trail columns (Created/Updated timestamps and users)
 * Validates existing formulas before overwriting
 */
function setupAuditColumns() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  Logger.log("Setting up audit columns...");

  // Sheets that need audit columns
  const auditSheets = [
    "HRM_Employees",
    "HRM_Departments",
    "HRM_Attendance",
    "HRM_Leave",
    "HRM_Advances",
    "HRM_OverTime",
    "HRM_Deductions",
    "PRJ_Main",
    "PRJ_Clients",
    "PRJ_Tasks",
    "PRJ_Material",
    "PRJ_IndirExp_Time_Alloc",
    "PRJ_IndirExp_NoTime_Alloc",
    "PRJ_Plan_vs_Actual",
    "FIN_DirectExpenses",
    "FIN_InDirectExpenses_Time",
    "FIN_InDirectExpenses_NoTime",
    "FIN_PRJ_Revenue",
    "FIN_Custody",
    "FIN_HRM_Payroll",
    "FIN_P&L_Statements",
    "SYS_Users",
    "SYS_Roles",
    "SYS_Permissions",
    "SYS_Role_Permissions",
  ];

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  auditSheets.forEach((sheetName) => {
    try {
      const sheet = spreadsheet.getSheetByName(sheetName);
      if (!sheet) {
        skipCount++;
        return;
      }

      const headers = getHeaders(sheet);
      if (!headers) {
        skipCount++;
        return;
      }

      // Set up Crt_At column with NOW() formula for new records
      const crtAtIndex = headers.findIndex((h) => h && h.includes("Crt_At"));
      if (crtAtIndex !== -1) {
        const targetRow = 3;
        const targetCol = crtAtIndex + 1;

        // Check if formula already exists
        if (!hasFormula(sheet, targetRow, targetCol)) {
          // For new records (when ID is just created), set current timestamp
          const formula =
            '=IF(ISBLANK(INDIRECT(ADDRESS(ROW(), 1))), NOW(), "")';
          sheet.getRange(targetRow, targetCol, 1, 1).setFormula(formula);
          successCount++;
          Logger.log(`Set up Crt_At formula for ${sheetName}`);
        } else {
          Logger.log(
            `Crt_At formula already exists for ${sheetName}, skipping`
          );
          skipCount++;
        }
      }

      // Set up Crt_By column with current user
      const crtByIndex = headers.findIndex((h) => h && h.includes("Crt_By"));
      if (crtByIndex !== -1) {
        // This would need to be set by the application when creating records
        // For now, we'll leave it as a placeholder
        Logger.log(
          `Crt_By column found in ${sheetName}, but requires application-level implementation`
        );
      }
    } catch (error) {
      errorCount++;
      Logger.log(
        `Error setting up audit columns for ${sheetName}: ${error.toString()}`
      );
    }
  });

  Logger.log(
    `Audit columns setup completed: ${successCount} successful, ${skipCount} skipped, ${errorCount} errors`
  );
}

/**
 * Set up view columns that reference ENG_ configurations
 * Validates existing columns before creating new ones
 */
function setupViewColumns() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  Logger.log("Setting up view columns...");

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  try {
    // Example: In HRM_Employees sheet, create a view column for Department Name in Arabic
    const empSheet = spreadsheet.getSheetByName("HRM_Employees");
    if (empSheet) {
      const headers = getHeaders(empSheet);
      if (!headers) {
        skipCount++;
      } else {
        const deptNameIndex = headers.indexOf("DEPT_Name");

        if (deptNameIndex !== -1) {
          // Check if view column already exists
          const viewColumnName = "DEPT_Name_AR_View";
          const viewColumnIndex = headers.indexOf(viewColumnName);

          if (viewColumnIndex !== -1) {
            Logger.log(
              `View column ${viewColumnName} already exists in HRM_Employees, skipping`
            );
            skipCount++;
          } else {
            // Add a view column next to DEPT_Name that shows Arabic department name
            const newViewColumnIndex = deptNameIndex + 2; // Skip one column for the view

            // Check if headers row 1 and 2 already have data in this position
            if (
              !hasData(empSheet, 1, newViewColumnIndex) &&
              !hasData(empSheet, 2, newViewColumnIndex)
            ) {
              // Add header for view column
              empSheet
                .getRange(1, newViewColumnIndex, 1, 1)
                .setValue(viewColumnName);
              empSheet
                .getRange(2, newViewColumnIndex, 1, 1)
                .setValue("اسم القسم");

              // Set formula to lookup Arabic name from HRM_Departments
              const formula =
                '=ARRAYFORMULA(IF(ROW(INDIRECT(ADDRESS(ROW(), COLUMN()))) >= 3, IFERROR(VLOOKUP(INDIRECT(ADDRESS(ROW(), COLUMN()-1)), HRM_Departments!$B:$C, 2, FALSE), INDIRECT(ADDRESS(ROW(), COLUMN()-1))), ""))';

              // Check if formula already exists
              if (!hasFormula(empSheet, 3, newViewColumnIndex)) {
                empSheet
                  .getRange(3, newViewColumnIndex, 1, 1)
                  .setFormula(formula);
                successCount++;
                Logger.log(
                  "Set up department name view column in HRM_Employees"
                );
              } else {
                skipCount++;
                Logger.log(
                  "Formula already exists for view column in HRM_Employees, skipping"
                );
              }
            } else {
              skipCount++;
              Logger.log(
                `Data exists in view column position for HRM_Employees, skipping to preserve data`
              );
            }
          }
        } else {
          skipCount++;
          Logger.log(
            "DEPT_Name column not found in HRM_Employees, skipping view column setup"
          );
        }
      }
    } else {
      skipCount++;
      Logger.log("HRM_Employees sheet not found, skipping view column setup");
    }
  } catch (error) {
    errorCount++;
    Logger.log(`Error setting up view columns: ${error.toString()}`);
  }

  Logger.log(
    `View columns setup completed: ${successCount} successful, ${skipCount} skipped, ${errorCount} errors`
  );
}

/**
 * Set up conditional formatting rules
 * Validates existing rules before adding new ones
 */
function setupConditionalFormatting() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  Logger.log("Setting up conditional formatting...");

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  try {
    // Example: Highlight active employees in green
    const empSheet = spreadsheet.getSheetByName("HRM_Employees");
    if (empSheet) {
      const headers = getHeaders(empSheet);
      if (!headers) {
        skipCount++;
      } else {
        const statusIndex = headers.indexOf("EMP_Status");

        if (statusIndex !== -1) {
          // Check if conditional formatting already exists
          const existingRules = empSheet.getConditionalFormatRules();
          if (existingRules && existingRules.length > 0) {
            // Check if we already have rules for this sheet
            const hasStatusRules = existingRules.some((rule) => {
              try {
                const formula = rule.getBooleanCondition().getCriteriaValues();
                return (
                  formula &&
                  (formula.toString().includes("نشط") ||
                    formula.toString().includes("غير نشط"))
                );
              } catch (e) {
                return false;
              }
            });

            if (hasStatusRules) {
              Logger.log(
                "Conditional formatting rules already exist for employee status, skipping"
              );
              skipCount++;
            } else {
              // Add new rules
              const range = empSheet.getRange(
                3,
                1,
                1000,
                empSheet.getLastColumn()
              );

              const colLetter = toColumnLetter(statusIndex);
              const rule1 = SpreadsheetApp.newConditionalFormatRule()
                .whenFormulaSatisfied(`=$${colLetter}="نشط"`)
                .setBackground("#d4edda") // Light green
                .setRanges([range])
                .build();

              const rule2 = SpreadsheetApp.newConditionalFormatRule()
                .whenFormulaSatisfied(`=$${colLetter}="غير نشط"`)
                .setBackground("#f8d7da") // Light red
                .setRanges([range])
                .build();

              // Combine existing rules with new ones
              const allRules = [...existingRules, rule1, rule2];
              empSheet.setConditionalFormatRules(allRules);
              successCount++;
              Logger.log("Set up conditional formatting for employee status");
            }
          } else {
            // No existing rules, create new ones
            const range = empSheet.getRange(
              3,
              1,
              1000,
              empSheet.getLastColumn()
            );

            const colLetter = toColumnLetter(statusIndex);
            const rule1 = SpreadsheetApp.newConditionalFormatRule()
              .whenFormulaSatisfied(`=$${colLetter}="نشط"`)
              .setBackground("#d4edda") // Light green
              .setRanges([range])
              .build();

            const rule2 = SpreadsheetApp.newConditionalFormatRule()
              .whenFormulaSatisfied(`=$${colLetter}="غير نشط"`)
              .setBackground("#f8d7da") // Light red
              .setRanges([range])
              .build();

            empSheet.setConditionalFormatRules([rule1, rule2]);
            successCount++;
            Logger.log("Set up conditional formatting for employee status");
          }
        } else {
          skipCount++;
          Logger.log(
            "EMP_Status column not found in HRM_Employees, skipping conditional formatting"
          );
        }
      }
    } else {
      skipCount++;
      Logger.log(
        "HRM_Employees sheet not found, skipping conditional formatting"
      );
    }
  } catch (error) {
    errorCount++;
    Logger.log(`Error setting up conditional formatting: ${error.toString()}`);
  }

  Logger.log(
    `Conditional formatting setup completed: ${successCount} successful, ${skipCount} skipped, ${errorCount} errors`
  );
}

/**
 * Main function to set up all formulas and validations
 * NOTE: Bilingual headers are handled by Setup.js and are not included here
 */
function setupAllFormulas() {
  Logger.log("Starting formula setup process...");

  try {
    const results = {
      autoIncrement: setupAutoIncrementIDs(),
      dropdowns: setupDropdownValidations(),
      calculated: setupCalculatedColumns(),
      audit: setupAuditColumns(),
      views: setupViewColumns(),
      formatting: setupConditionalFormatting(),
    };

    Logger.log("Formula setup process completed");

    return {
      success: true,
      results: results,
      message:
        "All formulas and validations have been set up (bilingual headers are handled by Setup.js)",
    };
  } catch (error) {
    Logger.log(`Critical error in setupAllFormulas: ${error.toString()}`);
    return {
      success: false,
      error: error.toString(),
      message: "Formula setup process encountered an error",
    };
  }
}
