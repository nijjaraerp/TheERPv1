# 🏗️ Nijjara ERP - Enterprise Resource Planning System

A modern, serverless, metadata-driven ERP system built entirely on Google Workspace. Single-Page Application (SPA) with bilingual Arabic/English support.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Installation & Setup](#installation--setup)
- [System Structure](#system-structure)
- [Core Modules](#core-modules)
- [API Documentation](#api-documentation)
- [Development Guide](#development-guide)

---

## 🎯 Overview

**Nijjara ERP** is a comprehensive enterprise resource planning solution designed for organizations operating in Arabic-speaking regions. It manages four core business domains:

- 👥 **Human Resources (HRM)** - Employee management, payroll, attendance, leave management
- 💰 **Finance (FIN)** - Project revenue, expenses, payroll, P&L statements
- 📊 **Projects (PRJ)** - Project tracking, tasks, materials, resource allocation
- ⚙️ **System Administration (SYS)** - User management, permissions, audit logging, security

### Key Characteristics

✅ **100% Serverless** - Built on Google Apps Script (no servers to maintain)  
✅ **Metadata-Driven** - UI dynamically generated from configuration sheets  
✅ **Bilingual** - Full Arabic/English support with Cairo font  
✅ **No Database Needed** - Google Sheets as the database  
✅ **Real-time** - Single Google Sheet, all data in sync  
✅ **Audit Trail** - Complete action logging for compliance  
✅ **Role-Based Access** - Permission-based module and field-level access  

---

## 🏛️ Architecture

### Metadata-Driven Pattern

The system uses a **metadata-driven UI** architecture where:

1. **Configuration Sheets (ENG_)** define how the system behaves
2. **Backend (Code.js)** reads this configuration and serves it to the frontend
3. **Frontend (Dashboard.html)** dynamically builds UI from the configuration

```
┌─────────────────────┐
│   Google Sheet      │
├─────────────────────┤
│  ENG_Forms          │ ← Form definitions
│  ENG_Views          │ ← View configurations  
│  ENG_Buttons        │ ← Button definitions
│  ENG_Dropdowns      │ ← Dropdown lists
│  ENG_Settings       │ ← System settings
│  ─────────────────  │
│  SYS_Users          │ ← User data
│  HRM_Employees      │ ← HR data
│  PRJ_Main           │ ← Projects data
│  FIN_Invoices       │ ← Finance data
└─────────────────────┘
        ↓
   Code.js (Backend)
        ↓
 Dashboard.html (Frontend)
```

### Bilingual Header Standard

**CRITICAL REQUIREMENT:** Every data table follows this pattern:

```
Row 1: ENG_ID      │ EMP_Name_EN    │ EMP_Department
       (English headers for backend)

Row 2: معرّف        │ اسم الموظف     │ القسم
       (Arabic headers for frontend display)

Row 3+: [Data rows]
```

- **Row 1** used by backend (JavaScript code)
- **Row 2** used by frontend (Arabic UI labels)
- **Row 3+** contains actual data

---

## 🛠️ Technology Stack

| Component | Technology |
|-----------|-----------|
| **Backend** | Google Apps Script (JavaScript) |
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Database** | Google Sheets |
| **Hosting** | Google Apps Script Web App |
| **UI Framework** | Custom SPA framework |
| **Font** | Cairo (Google Fonts) |

---

## 🚀 Installation & Setup

### Prerequisites

- Google Workspace account (with Google Sheets and Google Apps Script access)
- A Google Sheet named `TheERPv1`

### Step 1: Create the Google Sheet

1. Go to [Google Drive](https://drive.google.com)
2. Create a new Google Sheet named **`TheERPv1`**
3. Note the Sheet ID from the URL: `docs.google.com/spreadsheets/d/{SHEET_ID}/edit`

### Step 2: Create Google Apps Script Project

1. In the Google Sheet, go to **Extensions → Apps Script**
2. Delete the default code
3. Copy and paste each JavaScript file:
   - `Setup.js` - Schema definition
   - `Code.js` - Backend API
   - `Utils.js` - Helper functions
   - `Seed_Data.js` - Initial data (coming)
   - `Seed_Functions.js` - Formula handling (coming)

### Step 3: Initialize the Database

1. In Apps Script editor, look for the function list on the left
2. Select `setupERPSystem` function
3. Click **Run**
4. When prompted, authorize the script
5. Check your Google Sheet - all tables should now be created with bilingual headers

### Step 4: Deploy as Web App

1. In Apps Script, click **Deploy → New deployment**
2. Select type: **Web app**
3. Configure:
   - **Execute as:** Your Google Account
   - **Who has access:** Anyone
4. Click **Deploy**
5. Copy the deployment URL
6. Paste this URL in **Login.html** as `CONFIG.SCRIPT_URL`

### Step 5: Add HTML Files

1. In Apps Script, click **+ → HTML**
2. Create file `Login.html` and paste the content
3. Create file `Dashboard.html` (coming soon)

### Step 6: Access the System

1. In Apps Script, click **Deploy → Select deployment**
2. Copy the current deployment URL
3. Open it in your browser - you should see the login page

---

## 📦 System Structure

### Core Files

```
TheERPv1/
├── 📄 Setup.js              # Schema definition
├── 📄 Code.js               # Backend API & authentication
├── 📄 Utils.js              # Utility functions
├── 📄 Seed_Data.js          # Initial data population
├── 📄 Seed_Functions.js     # Cell formulas
│
├── 🌐 Login.html            # Authentication UI
├── 🌐 Dashboard.html        # Main SPA container
│
└── 📊 [Google Sheet Tabs]
    ├── ENG_Forms
    ├── ENG_Views
    ├── ENG_Buttons
    ├── ENG_Dropdowns
    ├── ENG_Settings
    ├── SYS_Users
    ├── SYS_Roles
    ├── SYS_Permissions
    ├── SYS_Sessions
    ├── SYS_Audit_Log
    ├── HRM_Employees
    ├── PRJ_Main
    ├── FIN_Invoices
    └── ... [more sheets]
```

### Schema Overview

| Prefix | Purpose | Examples |
|--------|---------|----------|
| **ENG_** | System configuration | Forms, Views, Buttons, Dropdowns |
| **SYS_** | System administration | Users, Roles, Permissions, Sessions |
| **HRM_** | Human resources | Employees, Attendance, Leave, Payroll |
| **PRJ_** | Project management | Projects, Tasks, Materials, Clients |
| **FIN_** | Finance management | Invoices, Expenses, Revenue, P&L |

---

## 👥 Core Modules

### 1. Human Resources (HRM)

**Manages:**
- Employee master data
- Attendance tracking
- Leave management
- Overtime records
- Salary advances
- Deductions
- Payroll processing

**Key Sheets:**
- `HRM_Employees` - Employee master
- `HRM_Attendance` - Daily attendance
- `HRM_Leave` - Leave requests
- `HRM_OverTime` - Overtime records

### 2. Finance (FIN)

**Manages:**
- Project revenue tracking
- Direct expenses
- Indirect expenses
- Payroll
- Profit & Loss statements
- Custody/advances

**Key Sheets:**
- `FIN_DirectExpenses` - Project expenses
- `FIN_PRJ_Revenue` - Revenue tracking
- `FIN_HRM_Payroll` - Employee payroll
- `FIN_P&L_Statements` - Financial reports

### 3. Projects (PRJ)

**Manages:**
- Project master data
- Client management
- Task tracking
- Material allocation
- Resource planning
- Plan vs. Actual tracking

**Key Sheets:**
- `PRJ_Main` - Projects
- `PRJ_Tasks` - Project tasks
- `PRJ_Clients` - Client management
- `PRJ_Material` - Materials master

### 4. System Administration (SYS)

**Manages:**
- User accounts
- Role definitions
- Permissions
- Session management
- Audit logging
- System settings

**Key Sheets:**
- `SYS_Users` - User accounts
- `SYS_Roles` - Role definitions
- `SYS_Permissions` - Permission definitions
- `SYS_Audit_Log` - Action audit trail

---

## 📡 API Documentation

### Authentication Endpoints

#### Login
```javascript
// Request
action: "login"
params: {
    username: "mkhoraiby",
    password: "210388"
}

// Response
{
    success: true,
    message: "Login successful",
    bootstrap: { /* complete UI configuration */ },
    token: "abc123...",
    sessionId: "SESS_..."
}
```

#### Logout
```javascript
// Request
action: "logout"
params: {
    token: "abc123..."
}

// Response
{
    success: true,
    message: "Logout successful"
}
```

### Data Endpoints

#### Get View Data
```javascript
// Request
action: "getViewData"
params: {
    viewId: "HRM_EMP_LIST"
}

// Response
{
    viewId: "HRM_EMP_LIST",
    title: "قائمة الموظفين",
    data: [ /* array of employee records */ ]
}
```

#### Save Record
```javascript
// Request (CREATE)
action: "saveRecord"
params: {
    action: "CREATE",
    sheet: "HRM_Employees",
    data: {
        EMP_Name_EN: "Ahmed Mohamed",
        EMP_Name_AR: "أحمد محمد",
        // ... other fields
    }
}

// Request (UPDATE)
action: "saveRecord"
params: {
    action: "UPDATE",
    sheet: "HRM_Employees",
    data: {
        EMP_ID: "EMP_12345",
        EMP_Name_EN: "Ahmed Mohamed",
        // ... updated fields
    }
}

// Response
{
    success: true,
    message: "Record saved successfully",
    id: "EMP_12345"
}
```

#### Delete Record
```javascript
// Request
action: "deleteRecord"
params: {
    sheet: "HRM_Employees",
    id: "EMP_12345"
}

// Response
{
    success: true,
    message: "Record deleted successfully"
}
```

---

## 👨‍💻 Development Guide

### Adding a New Form

1. **Add row to `ENG_Forms`:**
   ```
   FORM_ID: HRM_SALARY_FORM
   Form_Label: إضافة راتب جديد
   TAB_ID: TAB_SALARY_BASIC
   Tab_Label: البيانات الأساسية
   FIELD_ID: SALARY_AMOUNT
   Field_Label: المبلغ
   Field_Type: number
   Is_Mandatory: TRUE
   Target_Sheet: FIN_HRM_Payroll
   Target_Column: Basic_Salary
   ```

2. Frontend automatically generates the form UI from this configuration

### Adding a New View

1. **Add row to `ENG_Views`:**
   ```
   VIEW_ID: FIN_REVENUE_LIST
   View_Title: قائمة الإيرادات
   Source_Sheet: FIN_PRJ_Revenue
   Source_Columns: REV_ID, REV_Date, REV_Amnt, REV_Status
   ```

2. Frontend automatically generates the list view

### Validation Rules

All validation is defined in `ENG_Forms`:
- `Is_Mandatory` - Field must have value
- `Field_Type` - Constraints type (text, number, date, email, phone, dropdown)
- `Default_Value` - Placeholder/hint text
- `DD_ID` - Dropdown list for selection fields

### Using Utilities

```javascript
// Date utilities
getCurrentDateTime()                    // ISO format timestamp
daysBetween(date1, date2)             // Days between dates
addDaysToDate(date, days)             // Add days to date

// Validation
isValidEmail(email)                    // Validate email
isValidPhone(phone)                    // Validate phone
isValidEgyptianID(nid)                // Validate EG ID
isValidDate(dateStr)                   // Validate date format

// Array operations
groupBy(array, property)               // Group by property
sortByProperty(array, property)        // Sort by property
sumByProperty(array, property)         // Sum values
filterByProperties(array, filterObj)   // Filter by multiple properties

// Calculations
calculatePercentage(value, total)      // Calculate percentage
calculateDiscount(price, percent)      // Calculate discount
calculateOvertimePayment(rate, hours)  // Calculate OT pay
```

### Extending the Backend

1. Add new function in `Code.js`
2. Call it from `doPost()` switch statement
3. Return JSON response
4. Frontend receives it as response

Example:
```javascript
// In Code.js
function getEmployeeDashboard(empId) {
    // Get employee data
    // Calculate metrics
    // Return summary
}

// Call from frontend
const dashboard = await callBackend('getEmployeeDashboard', { empId: 'EMP_123' });
```

---

## 🔐 Security Considerations

1. **Session Management** - Sessions stored in `SYS_Sessions` with timeout
2. **Role-Based Access** - Permissions defined in `SYS_Role_Permissions`
3. **Audit Logging** - All actions logged in `SYS_Audit_Log`
4. **Password Hashing** - SHA-256 hashing (upgrade to bcrypt in production)
5. **Sanitization** - Input sanitization via `sanitizeInput()` utility

---

## 📝 Default Demo Credentials

| Field | Value |
|-------|-------|
| **Username** | `mkhoraiby` |
| **Password** | `210388` |

*Note: These should be changed immediately in production*

---

## 🐛 Troubleshooting

### Setup.js Fails
- Ensure Google Sheet is named `TheERPv1`
- Check that you have permission to create sheets
- Try running with a simpler Google account (not workspace admin)

### Login Page Won't Load
- Verify the `CONFIG.SCRIPT_URL` in Login.html matches your deployment URL
- Check browser console for CORS errors
- Ensure deployment is set to "Execute as:" your account and "Who has access:" Anyone

### Data Not Saving
- Verify target sheet exists and has correct headers
- Check `SYS_Audit_Log` for error messages
- Ensure user has necessary permissions in `SYS_Role_Permissions`

### Bilingual Headers Not Working
- Verify Row 1 has English names
- Verify Row 2 has Arabic names
- Frontend reads from Row 2 (Arabic) for display
- Backend uses Row 1 (English) for operations

---

## 📚 Resources

- [Google Apps Script Documentation](https://developers.google.com/apps-script)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [Cairo Font](https://fonts.google.com/specimen/Cairo)

---

## 📄 License

Built for Nijjara Company - 2024

---

## 🤝 Support

For issues or questions:
1. Check the Troubleshooting section
2. Review the SYS_Audit_Log for errors
3. Check browser console (F12) for JavaScript errors
4. Review Google Apps Script execution logs

---

**Last Updated:** November 21, 2024  
**Version:** 1.0 Alpha  
**Status:** In Development

