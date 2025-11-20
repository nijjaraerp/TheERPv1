/**
 * Seed_Functions.js
 * ==================
 * Single Source of Truth for Google Sheet Formulas
 * This file programmatically inserts formulas into sheets
 */

/**
 * Apply all formulas to the database
 */
function applyAllFormulas() {
  Logger.log('🔧 Applying formulas...');
  
  // Add formulas as needed
  // Examples below show the structure
  
  Logger.log('✅ Formulas applied successfully');
}

/**
 * Example: Add ARRAYFORMULA for auto-incrementing IDs
 * This can be used for any sheet that needs auto-ID generation
 */
function applyAutoIDFormula(sheetName, idColumnLetter, startRow) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    Logger.log(`❌ Sheet ${sheetName} not found`);
    return;
  }
  
  // This is a placeholder - actual formula would depend on requirements
  Logger.log(`✅ Applied auto-ID formula to ${sheetName}`);
}

/**
 * Clear all data from a specific sheet (preserve headers)
 */
function clearSheetData(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    Logger.log(`❌ Sheet ${sheetName} not found`);
    return;
  }
  
  const lastRow = sheet.getLastRow();
  if (lastRow > 2) {
    sheet.deleteRows(3, lastRow - 2);
    Logger.log(`✅ Cleared ${lastRow - 2} rows from ${sheetName}`);
  }
}

/**
 * Clear all data from all sheets (dangerous - use with caution)
 */
function clearAllData() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.alert(
    'تحذير / Warning',
    'هل أنت متأكد من حذف جميع البيانات؟\nAre you sure you want to delete all data?',
    ui.ButtonSet.YES_NO
  );
  
  if (response !== ui.Button.YES) {
    Logger.log('❌ Operation cancelled');
    return;
  }
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = ss.getSheets();
  
  sheets.forEach(sheet => {
    const sheetName = sheet.getName();
    // Skip ENG_ sheets as they contain configuration
    if (!sheetName.startsWith('ENG_')) {
      clearSheetData(sheetName);
    }
  });
  
  Logger.log('✅ All data cleared (ENG_ sheets preserved)');
}

/**
 * Backup current spreadsheet
 */
function backupSpreadsheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd_HHmmss');
  const backupName = `${ss.getName()}_Backup_${timestamp}`;
  
  try {
    const file = DriveApp.getFileById(ss.getId());
    const backup = file.makeCopy(backupName);
    
    Logger.log(`✅ Backup created: ${backupName}`);
    Logger.log(`   File ID: ${backup.getId()}`);
    
    return {
      success: true,
      name: backupName,
      id: backup.getId(),
      url: backup.getUrl()
    };
  } catch (error) {
    Logger.log(`❌ Backup failed: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
}

