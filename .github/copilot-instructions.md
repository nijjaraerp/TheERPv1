# Nijjara ERP - AI Coding Agent Instructions

## Architecture Overview

This is a **serverless, metadata-driven ERP system** built entirely on Google Apps Script + Google Sheets. The system dynamically generates UI from configuration sheets rather than hardcoded views.

**Critical Pattern**: The entire UI/UX is driven by `ENG_*` configuration sheets (`ENG_Forms`, `ENG_Views`, `ENG_Buttons`, `ENG_Dropdowns`, `ENG_Settings`). Backend reads this metadata and serves it to the frontend, which builds the UI dynamically.

### Core Architecture Flow

```
Google Sheet (Database) → Backend (Code.js) → Frontend (Dashboard.html) → User
     ↑                          ↓
     └─── ERP_SCHEMA (Setup.js) defines all 35 tables
```

## Critical Conventions

### 1. Bilingual Header Pattern (MANDATORY)

**Every data sheet MUST have this exact structure:**

- **Row 1**: English headers (used by backend JavaScript code)
- **Row 2**: Arabic headers (displayed in frontend UI)  
- **Row 3+**: Actual data rows

```javascript
// Example: HRM_Employees sheet
Row 1: EMP_ID | EMP_Name_EN | EMP_Department
Row 2: معرّف   | اسم الموظف  | القسم
Row 3: E001   | John Smith  | HR
```

**When accessing sheets in backend code, ALWAYS skip first 2 rows:**

```javascript
const data = sheet.getRange(3, 1, sheet.getLastRow() - 2, sheet.getLastColumn()).getValues();
```

### 2. Single Source of Truth Files

- **`Setup.js`**: Contains `ERP_SCHEMA` object - the definitive schema for all 35 sheets. Edit schema here ONLY.
- **`Seed_Data.js`**: All initial data (dropdowns, roles, permissions). Defines system configuration.
- **`Code.js`**: Backend API router with authentication, CRUD operations, and session management.
- **`Utils.js`**: Shared utility functions (dates, validation, string manipulation).

### 3. Module Naming Convention

All tables follow a prefix pattern:
- `ENG_*`: Configuration/Engine tables (Forms, Views, Buttons, Dropdowns, Settings)
- `SYS_*`: System Administration (Users, Roles, Permissions, Sessions, Audit_Log)
- `HRM_*`: Human Resources Module (Employees, Attendance, Leave, Departments)
- `PRJ_*`: Projects Module (Projects, Tasks, Materials)
- `FIN_*`: Finance Module (Invoices, Expenses, Payroll)

## Development Workflows

### Adding a New Sheet/Table

1. **Define schema in `Setup.js`** - Add to `ERP_SCHEMA` object with `headers_en`, `headers_ar`, `description`
2. **Run `setupDatabase()`** function in Apps Script editor to create the sheet
3. **Seed initial data** (if needed) in `Seed_Data.js` and run `seedAllData()`
4. **Configure metadata** in `ENG_Forms` or `ENG_Views` to make it accessible in UI

### Adding a New API Endpoint

1. **Add function in `Code.js`** following naming pattern: `doAction()`, `getResource()`, `saveRecord()`, `deleteRecord()`
2. **Add to `doPost()` router** - Parse action from request and call your function
3. **Always call `logAudit()`** for any data modification operations
4. **Return standardized response**: `{ success: boolean, message: string, data?: any }`

### Session & Authentication Flow

- **Login**: `doLogin(username, password)` → validates credentials → generates session token → returns bootstrap object with all config
- **Session Tokens**: Stored in `SYS_Sessions` sheet with 8-hour timeout (`CONFIG.SESSION_TIMEOUT_MINUTES = 480`)
- **All API calls**: Must include `sessionToken` parameter, validated via `verifySessionToken(token)`
- **Logout**: `doLogout(sessionToken)` → invalidates session → clears from `SYS_Sessions`

## Key Technical Patterns

### Accessing the Spreadsheet

```javascript
const ss = SpreadsheetApp.openByName(CONFIG.SHEET_NAME); // "TheERPv1"
const sheet = ss.getSheetByName("SYS_Users");
```

### Reading Data with Headers

```javascript
// Get headers from Row 1
const headerRow = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
const nameIdx = headerRow.indexOf("EMP_Name_EN");

// Get data rows (skip rows 1-2)
const data = sheet.getRange(3, 1, sheet.getLastRow() - 2, sheet.getLastColumn()).getValues();
const employeeName = data[0][nameIdx];
```

### Password Hashing

```javascript
// Uses SHA-256 via Utilities.computeDigest()
const passwordHash = Utilities.computeDigest(
  Utilities.DigestAlgorithm.SHA_256,
  password,
  Utilities.Charset.UTF_8
)
  .map(byte => ('0' + (byte & 0xFF).toString(16)).slice(-2))
  .join('');
```

### Audit Logging (Required for All Modifications)

```javascript
function logAudit(userId, action, details, entity, entityId) {
  // Writes to SYS_Audit_Log sheet
  // Always call after CREATE/UPDATE/DELETE operations
}
```

## Frontend Architecture

**Dashboard.html** is a Single Page Application (SPA) with:

- **RTL layout** (`<html lang="ar" dir="rtl">`) for Arabic-first design
- **Cairo font** from Google Fonts for Arabic text rendering
- **Vanilla JavaScript** (no frameworks) - all UI built dynamically from bootstrap data
- **Sidebar navigation** generated from user permissions and available modules

### Bootstrap Object Structure

The login response includes a complete bootstrap object containing:
- All forms (`ENG_Forms`)
- All views (`ENG_Views`)
- All buttons (`ENG_Buttons`)
- All dropdowns (`ENG_Dropdowns`)
- User's role permissions

Frontend uses this to build the entire UI without additional API calls.

## Common Operations

### Deploy/Test Locally

1. **Open Apps Script**: Go to Google Sheet → Extensions → Apps Script
2. **Deploy as Web App**: Deploy → New deployment → Select type: Web app
3. **Run Setup**: Execute `setupDatabase()` to create all sheets
4. **Seed Data**: Execute `seedAllData()` to populate configuration
5. **Test Login**: Access web app URL and use seeded credentials

### Debugging

```javascript
// Use Logger for Apps Script logs
Logger.log("Debug message: " + JSON.stringify(data));

// Use Utils.js logging functions
logWithTimestamp("Operation started");
logObject(userData, "User Data");
```

### Configuration Management

System settings stored in `ENG_Settings` sheet, accessed via:

```javascript
const settings = getAllSettings(); // Returns all key-value pairs
// Common settings: company_name, fiscal_year, language_default
```

## Important Constraints

1. **No external database** - Google Sheets is the database. Design for sheet limitations (max 10M cells).
2. **Session storage** - All sessions in `SYS_Sessions` sheet. Clean up expired sessions periodically.
3. **Google Apps Script quotas** - 6 min execution time limit, rate limits on sheet operations.
4. **Timezone**: System uses `Africa/Cairo` timezone (set in `appsscript.json`).
5. **No npm packages** - Pure Apps Script environment. Use Utilities built-ins for crypto, HTTP, etc.

## Testing Credentials (from Seed_Data.js)

Default admin user created during seeding:
- Username: `admin`
- Password: `admin123` (hashed in `SYS_Users`)
- Role: `ROLE_ADMIN` (full system access)

## File Dependencies

When modifying code, consider these dependencies:

- **Setup.js** → defines schema used by Code.js for validation
- **Seed_Data.js** → depends on Setup.js having created sheets first
- **Code.js** → depends on Utils.js for helper functions
- **Dashboard.html** → depends on Code.js API returning bootstrap data
- **Login.html** → depends on Code.js doLogin() endpoint

## Best Practices

1. **Always preserve bilingual headers** when modifying sheets
2. **Use `ERP_SCHEMA` as source of truth** - don't manually create sheets
3. **Test with `setupDatabase()` first** before running seed scripts
4. **Log all data modifications** via `logAudit()` for compliance
5. **Validate session tokens** on every backend function call
6. **Use dropdown IDs** from `ENG_Dropdowns` rather than hardcoding values
7. **Follow RTL design patterns** in frontend (right-to-left layout)
