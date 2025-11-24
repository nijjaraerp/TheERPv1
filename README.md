# Nijjara ERP System

**A serverless, metadata-driven ERP system built entirely on Google Apps Script + Google Sheets**

## 🎯 Overview

This is a complete Enterprise Resource Planning (ERP) system designed for Arabic-first businesses, featuring:

- **Serverless Architecture**: 100% Google Apps Script + Google Sheets (no external database)
- **Metadata-Driven UI**: Dynamic forms and views generated from configuration sheets
- **Bilingual Design**: Arabic UI with English backend code
- **Role-Based Access Control**: Comprehensive permissions system
- **Dark Animated 3D Theme**: Modern, elegant interface with Cairo font
- **35 Database Tables**: Covering HRM, Projects, Finance, and System Administration

---

## 📋 Table of Contents

- [Architecture](#architecture)
- [Core Concepts](#core-concepts)
- [File Structure](#file-structure)
- [Getting Started](#getting-started)
- [Database Schema](#database-schema)
- [Development Guidelines](#development-guidelines)
- [Configuration Sheets](#configuration-sheets)
- [Debugging System](#debugging-system)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Google Apps Script                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Code.js    │  │  Setup.js    │  │  Utils.js    │ │
│  │  (Backend    │  │  (Schema     │  │  (Helpers)   │ │
│  │   API)       │  │  Definition) │  │              │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                          │                              │
└──────────────────────────┼──────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│              Google Sheets (TheERPv1)                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ ENG_*    │ │ SYS_*    │ │ HRM_*    │ │ PRJ_*    │  │
│  │ (Config) │ │ (System) │ │ (HR)     │ │ (Project)│  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐               │
│  │ FIN_*    │ │ DBUG_*   │ │ ...      │               │
│  │ (Finance)│ │ (Debug)  │ │          │               │
│  └──────────┘ └──────────┘ └──────────┘               │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    HTML Frontend                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ Login.html   │  │Dashboard.html│  │ Forms.html   │ │
│  │              │  │              │  │ Views.html   │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
```

**Key Architecture Principles:**

1. **Single Source of Truth**: `ERP_SCHEMA` in `Setup.js` defines all 35 sheets
2. **Bilingual Headers**: Every data sheet has Row 1 (English) + Row 2 (Arabic) + Row 3+ (Data)
3. **Dynamic UI Generation**: Frontend reads `ENG_*` configuration sheets to build forms/views
4. **Session Management**: Custom authentication via `SYS_Sessions` sheet (8-hour timeout)

---

## 🔑 Core Concepts

### Bilingual Header Pattern (MANDATORY)

**Every data sheet MUST follow this structure:**

```
Row 1: EMP_ID | EMP_Name_EN | EMP_Department  (English headers - used by backend)
Row 2: معرّف   | اسم الموظف  | القسم           (Arabic headers - displayed in UI)
Row 3: E001   | John Smith  | HR              (Actual data starts here)
```

**Backend code ALWAYS skips first 2 rows:**

```javascript
const data = sheet.getRange(3, 1, sheet.getLastRow() - 2, sheet.getLastColumn()).getValues();
```

### Module Naming Convention

All sheets follow a prefix pattern:

- `ENG_*` - Configuration/Engine (Forms, Views, Buttons, Dropdowns, Settings)
- `SYS_*` - System Administration (Users, Roles, Permissions, Sessions, Audit_Log)
- `HRM_*` - Human Resources (Employees, Attendance, Leave, Departments)
- `PRJ_*` - Projects (Projects, Tasks, Materials, Clients)
- `FIN_*` - Finance (Invoices, Expenses, Payroll, Revenue)
- `DBUG_*` - Debugging/Monitoring (AppLog, WarnLog, ErrorLog)

---

## 📁 File Structure

```
TheERPv1/
├── Code.js                          # Backend API + Authentication
├── Setup.js                         # Database schema (ERP_SCHEMA) + initialization
├── Seed_Data.js                     # Initial data seeding (dropdowns, roles, demo data)
├── Utils.js                         # Shared utilities (dates, validation, strings)
├── Login.html                       # Login page (Arabic, Cairo font, 3D theme)
├── Dashboard.html                   # Main dashboard SPA (Arabic, RTL)
├── Forms.html                       # Dynamic form renderer (metadata-driven)
├── Views.html                       # Data list viewer (metadata-driven)
├── appsscript.json                  # Apps Script project config
├── .clasp.json                      # Clasp deployment config
├── FINAL UPDATED Master Instruction.md  # Complete system documentation
└── README.md                        # This file
```

### Essential Files

| File             | Purpose                                      | When to Edit                     |
| ---------------- | -------------------------------------------- | -------------------------------- |
| `Setup.js`       | Define `ERP_SCHEMA` - all table structures   | Adding/modifying sheets          |
| `Code.js`        | Backend API, authentication, CRUD operations | Adding endpoints, business logic |
| `Seed_Data.js`   | Initial data (dropdowns, roles, permissions) | Adding system configuration      |
| `Utils.js`       | Helper functions used across the system      | Adding reusable utilities        |
| `Login.html`     | User authentication interface                | Changing login flow/design       |
| `Dashboard.html` | Main application UI after login              | Modifying dashboard layout       |

---

## 🚀 Getting Started

### Prerequisites

- Google Account with access to Google Apps Script
- Google Sheets
- [Clasp CLI](https://github.com/google/clasp) (optional, for local development)

### Installation Steps

1. **Create Google Sheet**
   ```
   - Go to Google Sheets
   - Create new spreadsheet named "TheERPv1"
   - Note the Spreadsheet ID from URL
   ```

2. **Setup Apps Script Project**
   ```
   - Open Extensions > Apps Script
   - Copy all .js files from this repo
   - Copy all .html files from this repo
   - Update appsscript.json with correct timezone
   ```

3. **Initialize Database**
   ```javascript
   // In Apps Script editor, run this function:
   setupDatabase()
   ```
   This creates all 35 sheets with bilingual headers.

4. **Seed Initial Data**
   ```javascript
   // Run this function to populate configuration:
   seedAllData()
   ```
   This populates dropdowns, roles, permissions, and demo user.

5. **Deploy Web App**
   ```
   - Click "Deploy" > "New deployment"
   - Select type: "Web app"
   - Execute as: "Me"
   - Who has access: "Anyone" (or customize)
   - Click "Deploy"
   - Copy web app URL
   ```

6. **Test Login**
   ```
   Default credentials:
   Username: admin
   Password: admin123
   ```

### Local Development with Clasp

```bash
# Install clasp globally
npm install -g @google/clasp

# Login to Google
clasp login

# Clone this project
clasp clone <SCRIPT_ID>

# Make changes locally, then push
clasp push --force

# Open in browser
clasp open
```

---

## 🗄️ Database Schema

The system includes **35 sheets** organized into 6 categories:

### 1. Configuration Sheets (ENG_)

| Sheet           | Purpose                         | Arabic Headers     |
| --------------- | ------------------------------- | ------------------ |
| `ENG_Forms`     | Form definitions for data entry | ❌ No (config only) |
| `ENG_Views`     | Custom views for data display   | ❌ No (config only) |
| `ENG_Buttons`   | Action buttons in forms         | ❌ No (config only) |
| `ENG_Dropdowns` | Dropdown list values            | ❌ No (config only) |
| `ENG_Settings`  | System-wide settings            | ❌ No (config only) |

### 2. System Administration (SYS_)

| Sheet                  | Purpose                           | Arabic Headers |
| ---------------------- | --------------------------------- | -------------- |
| `SYS_Users`            | User accounts and credentials     | ✅ Yes          |
| `SYS_Roles`            | User roles (Admin, Manager, etc.) | ✅ Yes          |
| `SYS_Permissions`      | Available permissions             | ✅ Yes          |
| `SYS_Role_Permissions` | Role-permission mappings          | ✅ Yes          |
| `SYS_Sessions`         | Active user sessions              | ✅ Yes          |
| `SYS_Audit_Log`        | Audit trail for compliance        | ✅ Yes          |
| `SYS_Documents`        | File attachments metadata         | ✅ Yes          |
| `SYS_Dashboard`        | System metrics                    | ✅ Yes          |
| `SYS_PubHolidays`      | Public holidays calendar          | ✅ Yes          |
| `SYS_Analysis`         | System analysis data              | ✅ Yes          |

### 3. Human Resources (HRM_)

| Sheet             | Purpose                      | Arabic Headers |
| ----------------- | ---------------------------- | -------------- |
| `HRM_Employees`   | Employee master data         | ✅ Yes          |
| `HRM_Departments` | Organization departments     | ✅ Yes          |
| `HRM_Attendance`  | Daily attendance records     | ✅ Yes          |
| `HRM_Leave`       | Leave requests and approvals | ✅ Yes          |
| `HRM_Advances`    | Salary advances              | ✅ Yes          |
| `HRM_OverTime`    | Overtime tracking            | ✅ Yes          |
| `HRM_Deductions`  | Payroll deductions           | ✅ Yes          |
| `HRM_Dashboard`   | HR metrics                   | ✅ Yes          |
| `HRM_Analysis`    | HR analytics data            | ✅ Yes          |

### 4. Project Management (PRJ_)

| Sheet                       | Purpose                      | Arabic Headers |
| --------------------------- | ---------------------------- | -------------- |
| `PRJ_Main`                  | Project master records       | ✅ Yes          |
| `PRJ_Clients`               | Client information           | ✅ Yes          |
| `PRJ_Tasks`                 | Project tasks                | ✅ Yes          |
| `PRJ_Material`              | Materials catalog            | ✅ Yes          |
| `PRJ_IndirExp_Time_Alloc`   | Time-based indirect expenses | ✅ Yes          |
| `PRJ_IndirExp_NoTime_Alloc` | Non-time indirect expenses   | ✅ Yes          |
| `PRJ_Plan_vs_Actual`        | Project performance tracking | ✅ Yes          |
| `PRJ_Dashboard`             | Project metrics              | ✅ Yes          |
| `PRJ_Analysis`              | Project analytics            | ✅ Yes          |

### 5. Finance (FIN_)

| Sheet                         | Purpose              | Arabic Headers |
| ----------------------------- | -------------------- | -------------- |
| `FIN_DirectExpenses`          | Direct project costs | ✅ Yes          |
| `FIN_InDirectExpenses_Time`   | Time-based overhead  | ✅ Yes          |
| `FIN_InDirectExpenses_NoTime` | Fixed overhead       | ✅ Yes          |
| `FIN_PRJ_Revenue`             | Project revenue      | ✅ Yes          |
| `FIN_Custody`                 | Custodial funds      | ✅ Yes          |
| `FIN_HRM_Payroll`             | Employee payroll     | ✅ Yes          |
| `FIN_P&L_Statements`          | Profit & Loss        | ✅ Yes          |
| `FIN_Dashboard`               | Financial metrics    | ✅ Yes          |
| `FIN_Analysis`                | Financial analytics  | ✅ Yes          |

### 6. Debugging System (DBUG_)

| Sheet           | Purpose               | Arabic Headers     |
| --------------- | --------------------- | ------------------ |
| `DBUG_AppLog`   | Application event log | ❌ No (system only) |
| `DBUG_WarnLog`  | Warning messages log  | ❌ No (system only) |
| `DBUG_ErrorLog` | Error tracking log    | ❌ No (system only) |

---

## 💻 Development Guidelines

### Adding a New Sheet/Table

1. **Define in Setup.js**
   ```javascript
   const ERP_SCHEMA = {
     // ... existing sheets ...
     "NEW_SheetName": {
       headers_en: ["ID", "Name_EN", "Status"],
       headers_ar: ["المعرّف", "الاسم", "الحالة"],
       description: "What this sheet stores"
     }
   };
   ```

2. **Run Setup**
   ```javascript
   setupDatabase(); // Creates the new sheet
   ```

3. **Seed Data** (if needed)
   ```javascript
   // Add to Seed_Data.js
   function seedNewSheet() {
     const ss = getSpreadsheet();
     const sheet = ss.getSheetByName("NEW_SheetName");
     sheet.appendRow(["001", "Sample", "Active"]);
   }
   ```

4. **Configure Metadata** (for UI)
   - Add entries to `ENG_Forms` for data entry
   - Add entries to `ENG_Views` for data display

### Adding a New API Endpoint

1. **Add function in Code.js**
   ```javascript
   function doNewAction(params) {
     try {
       // Verify session
       const sessionCheck = verifySessionToken(params.token);
       if (!sessionCheck.valid) {
         return { success: false, message: "جلسة منتهية" };
       }
       
       // Business logic here
       const result = performAction(params.data);
       
       // Log the action
       logInfo_(params.userId, "NEW_ACTION", "ENTITY", entityId, "Details");
       
       return { success: true, data: result };
     } catch (e) {
       logError_(params.userId, "NEW_ACTION", "ENTITY", "", e.message, e);
       return { success: false, message: "حدث خطأ" };
     }
   }
   ```

2. **Add to router in doPost()**
   ```javascript
   function doPost(e) {
     const payload = JSON.parse(e.postData.contents);
     const action = payload.action;
     
     switch (action) {
       // ... existing cases ...
       case "newAction":
         result = doNewAction(payload.params);
         break;
     }
   }
   ```

3. **Call from frontend**
   ```javascript
   google.script.run
     .withSuccessHandler(handleSuccess)
     .withFailureHandler(handleFailure)
     .doNewAction({ token: sessionToken, data: formData });
   ```

### Debugging Best Practices

**Use the three DBUG sheets:**

```javascript
// Log successful operations
logInfo_("USR001", "SAVE", "EMPLOYEE", "EMP123", "Saved employee data");

// Log potential issues
logWarn_("USR001", "ACCESS", "FINANCE", "FIN456", "Attempted unauthorized access");

// Log errors
try {
  riskyOperation();
} catch (e) {
  logError_("USR001", "PROCESS", "PAYROLL", "PAY789", e.message, e);
}
```

---

## ⚙️ Configuration Sheets

### ENG_Forms Structure

Defines how forms are built dynamically:

```
FORM_ID: Unique form identifier (e.g., "ADD_EMPLOYEE", "VIEW_PROJECT")
Form_Label: Arabic title shown in popup (e.g., "إضافة موظف جديد")
TAB_ID: Tab identifier within form (e.g., "TAB_BASIC_INFO")
Tab_Label: Arabic tab label (e.g., "المعلومات الأساسية")
FIELD_ID: Field identifier (e.g., "FLD_EMP_NAME")
Field_Label: Arabic field label (e.g., "اسم الموظف")
Field_Type: Input type (text, number, dropdown, date)
Field_Can_Edit: Toggle between read-only and editable
Source_Sheet: Sheet to pull data from (for dropdowns/lookups)
Source_Columns: Specific columns to reference
Is_Mandatory: Required field validation
Default_Value: Placeholder text in Arabic
DD_ID: Dropdown list reference (from ENG_Dropdowns)
Target_Sheet: Where to save the data
Target_Column: Specific column to write to
ROL_ID: Role required to access this field
Is_Visible: Show/hide field based on permissions
BTN_ID: Associated action button
```

### ENG_Views Structure

Defines data list displays:

```
VIEW_ID: Unique view identifier (e.g., "VIEW_EMPLOYEES")
View_Title: Arabic title (e.g., "قائمة الموظفين")
Source_Sheet: Sheet to read from (e.g., "HRM_Employees")
Source_Columns: Columns to display (skip Row 1, show from Row 2)
```

### ENG_Dropdowns Structure

Dropdown values used in forms:

```
DD_ID: Dropdown category (e.g., "EMPLOYEE_STATUS")
DD_EN: English option (e.g., "Active")
DD_AR: Arabic option (e.g., "نشط")
DD_Is_Active: Enable/disable option
DD_Sort_Order: Display order
```

---

## 🐛 Debugging System

Three dedicated sheets track system health:

### DBUG_AppLog
**What happened during normal operation**

- User logins
- Data saves
- Report generation
- Background processes

### DBUG_WarnLog
**What looks suspicious**

- Validation failures
- Blocked unauthorized access
- Performance issues
- Data anomalies

### DBUG_ErrorLog
**What broke**

- Crashes
- Unhandled exceptions
- API failures
- Full stack traces

**All logging functions are in Code.js:**
- `logInfo_(actor, action, entity, entityId, details)`
- `logWarn_(actor, action, entity, entityId, details)`
- `logError_(actor, action, entity, entityId, message, errorObject)`

---

## 🎨 Theme Specification

### Color Palette

```css
--neon-cyan: #00f3ff      /* Primary accent */
--neon-magenta: #bc13fe   /* Secondary accent */
--void-dark: #050510      /* Background */
--glass-bg: rgba(10, 10, 25, 0.4)      /* Card backgrounds */
--glass-border: rgba(255, 255, 255, 0.1) /* Borders */
```

### Typography

- **Font Family**: Cairo (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700, 800, 900
- **Direction**: RTL (Right-to-Left)
- **Language**: Arabic primary, English secondary

### Animation Principles

- Smooth transitions (300-500ms)
- Subtle 3D depth effects
- Glow effects on interactive elements
- Quantum field particle background

---

## 📝 Important Constraints

1. **No External Database** - Google Sheets is the database
2. **Google Apps Script Quotas** - 6-minute execution time limit
3. **Sheet Cell Limit** - Max 10 million cells per spreadsheet
4. **Session Storage** - All sessions stored in `SYS_Sessions` sheet
5. **Timezone** - System uses Africa/Cairo (configurable in appsscript.json)
6. **No npm packages** - Pure Apps Script environment

---

## 🔐 Security Notes

- Passwords are SHA-256 hashed in `SYS_Users.Password_Hash`
- Session tokens are random UUIDs stored in `SYS_Sessions`
- All API calls must include valid session token
- Session timeout: 8 hours (480 minutes)
- Audit logging via `SYS_Audit_Log` for compliance

---

## 📚 Additional Resources

- **Master Instructions**: See `FINAL UPDATED Master Instruction.md` for complete system documentation
- **Google Apps Script Docs**: https://developers.google.com/apps-script
- **Clasp Documentation**: https://github.com/google/clasp

---

## 👥 Support

For issues, questions, or contributions, please contact the development team.

---

**Built with ❤️ for Arabic-first businesses**

*Last Updated: November 2025*

