# Nijjara ERP System

## نظام نجارة لإدارة موارد المؤسسة

A comprehensive, serverless ERP system built on Google Workspace platform using Google Apps Script, Google Sheets, and modern web technologies.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Installation & Setup](#installation--setup)
- [File Structure](#file-structure)
- [Usage Guide](#usage-guide)
- [Security](#security)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## 🌟 Overview

Nijjara ERP is a **fully Arabic**, **serverless**, **metadata-driven** ERP system designed for small to medium businesses. It centralizes all core business operations across four main modules:

- **HRM (الموارد البشرية)**: Human Resources Management
- **PRJ (المشاريع)**: Project Management
- **FIN (المالية)**: Finance & Accounting
- **SYS (الإدارة)**: System Administration

### Key Highlights

✅ **100% Serverless** - No infrastructure needed  
✅ **Bilingual Support** - English backend + Arabic frontend  
✅ **Metadata-Driven UI** - Dynamic forms and views  
✅ **Single Page Application** - Fast, responsive UX  
✅ **Role-Based Access Control** - Granular permissions  
✅ **Comprehensive Audit Trail** - Track all changes  
✅ **Cairo Font Family** - Beautiful Arabic typography  

---

## 🚀 Features

### Human Resources Module (HRM)
- Employee management with comprehensive profiles
- Attendance tracking (check-in/check-out)
- Leave management (annual, sick, emergency)
- Salary advances tracking
- Overtime calculations
- Deductions and penalties
- Department management

### Projects Module (PRJ)
- Project lifecycle management
- Client relationship management
- Task assignment and tracking
- Material inventory
- Plan vs. Actual analysis
- Indirect expense allocation

### Finance Module (FIN)
- Direct expenses tracking
- Indirect expenses (time-based & non-time)
- Revenue management
- Custody management
- Payroll generation
- P&L statements
- Multi-payment methods support

### System Administration (SYS)
- User management
- Role & permission system
- Audit logging
- Session management
- Document storage (Google Drive integration)
- Public holidays calendar
- System settings

---

## 🛠️ Technology Stack

### Backend
- **Google Apps Script** (JavaScript)
- Server-side logic, authentication, data processing

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling with Cairo font
- **Vanilla JavaScript** - Client-side interactivity

### Database
- **Google Sheets** - Each tab acts as a database table
- Bilingual headers (Row 1: English, Row 2: Arabic)

### Infrastructure
- **Google Workspace** - Fully serverless environment
- **Google Drive** - Document storage

---

## 🏗️ System Architecture

### Metadata-Driven UI Concept

The system uses **configuration sheets** (ENG_* sheets) to dynamically generate the entire user interface:

1. **ENG_Forms**: Defines form structure, fields, validation
2. **ENG_Views**: Defines data display views and filters
3. **ENG_Buttons**: Defines action buttons and behaviors
4. **ENG_Dropdowns**: Defines all dropdown options
5. **ENG_Settings**: System-wide configuration

### Bilingual Header Standard (CRITICAL)

Every data sheet follows this exact pattern:

```
Row 1: English Backend Column Names (e.g., EMP_ID, EMP_Name_EN)
Row 2: Arabic Frontend Column Names (e.g., كود الموظف, اسم الموظف)
Row 3+: Data rows
```

### Authentication Flow

1. User enters credentials in `Login.html`
2. `Code.js` validates against `SYS_Users` sheet
3. Password hashed using SHA-256
4. Session created in `SYS_Sessions`
5. Bootstrap object (metadata) sent to frontend
6. Dynamic UI rendered based on user permissions

---

## 📦 Installation & Setup

### Prerequisites

- Google Account
- Access to Google Sheets and Google Apps Script

### Step 1: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it: **TheERPv1**

### Step 2: Open Apps Script Editor

1. In your spreadsheet, click **Extensions** > **Apps Script**
2. Delete any existing code

### Step 3: Add Script Files

Copy and paste each file from this repository into the Apps Script editor:

**Backend Files (.gs):**
1. `Setup.js` - Database schema
2. `Seed_Data.js` - Initial data
3. `Seed_Functions.js` - Formula utilities
4. `Code.js` - Main backend logic
5. `Utils.js` - Helper functions

**Frontend Files (.html):**
1. `Login.html` - Login interface
2. `Dashboard.html` - Main application

### Step 4: Run Setup

1. In Apps Script editor, select `setupDatabase` from function dropdown
2. Click **Run** (▶️)
3. Grant necessary permissions when prompted
4. Wait for completion (check **Execution log**)

### Step 5: Seed Initial Data

1. Select `seedAllData` from function dropdown
2. Click **Run** (▶️)
3. This creates default roles, permissions, dropdowns, and admin user

### Step 6: Deploy as Web App

1. Click **Deploy** > **New deployment**
2. Select type: **Web app**
3. Settings:
   - Description: "Nijjara ERP v1.0"
   - Execute as: **Me**
   - Who has access: **Anyone** (or restrict as needed)
4. Click **Deploy**
5. Copy the **Web app URL**

### Step 7: Test Login

1. Open the web app URL
2. Login with default credentials:
   - **Username**: `mkhoraiby`
   - **Password**: `210388`
3. You should see the dashboard

---

## 📁 File Structure

```
nijjara-erp/
├── Setup.js                 # Database schema definition
├── Seed_Data.js            # Initial data population
├── Seed_Functions.js       # Formula utilities
├── Code.js                 # Main backend API
├── Utils.js                # Helper functions
├── Login.html              # Login interface
├── Dashboard.html          # Main SPA interface
├── README.md               # This file
└── Project Overview & ERP Schema.md  # Detailed documentation
```

### Google Sheet Structure

```
TheERPv1 (Google Sheet)
├── ENG_Forms              # Form configurations
├── ENG_Views              # View configurations
├── ENG_Buttons            # Button definitions
├── ENG_Dropdowns          # Dropdown options
├── ENG_Settings           # System settings
├── SYS_Users              # User accounts
├── SYS_Roles              # Role definitions
├── SYS_Permissions        # Permission definitions
├── SYS_Role_Permissions   # Role-permission mapping
├── SYS_Audit_Log          # Audit trail
├── SYS_Sessions           # Active sessions
├── SYS_Documents          # Document references
├── SYS_PubHolidays        # Public holidays
├── HRM_Employees          # Employee records
├── HRM_Attendance         # Attendance logs
├── HRM_Leave              # Leave requests
├── HRM_Advances           # Salary advances
├── HRM_Departments        # Departments
├── PRJ_Main               # Projects
├── PRJ_Clients            # Clients
├── PRJ_Tasks              # Project tasks
├── PRJ_Material           # Materials inventory
├── FIN_DirectExpenses     # Direct expenses
├── FIN_InDirectExpenses_Time    # Time-based indirect expenses
├── FIN_InDirectExpenses_NoTime  # Non-time indirect expenses
├── FIN_PRJ_Revenue        # Project revenue
├── FIN_Custody            # Custody tracking
├── FIN_HRM_Payroll        # Payroll records
└── FIN_P&L_Statements     # Profit & Loss
```

---

## 📖 Usage Guide

### Default Admin Access

- **Username**: `mkhoraiby`
- **Password**: `210388`
- **Role**: System Administrator

⚠️ **IMPORTANT**: Change the default password immediately after first login!

### Creating New Users

1. Log in as admin
2. Navigate to: **الإدارة** (System) → **المستخدمين** (Users)
3. Click **إضافة مستخدم** (Add User)
4. Fill in user details
5. Assign appropriate role
6. Save

### Managing Roles & Permissions

1. Navigate to: **الإدارة** → **الأدوار** (Roles)
2. Create new role or edit existing
3. Assign permissions from **SYS_Permissions**
4. Map role-permission in **SYS_Role_Permissions**

### Adding Employees

1. Navigate to: **الموارد البشرية** → **الموظفين**
2. Click **إضافة موظف جديد**
3. Fill in all required fields across tabs:
   - بيانات أساسية (Basic Info)
   - الوظيفة (Job Info)
   - التواصل (Contact Info)
4. Click **حفظ** (Save)

### Recording Attendance

1. Navigate to: **الموارد البشرية** → **الحضور**
2. Click **تسجيل حضور** (Check In)
3. Select employee
4. System records timestamp
5. Later, click **تسجيل انصراف** (Check Out)

### Creating Projects

1. Navigate to: **المشاريع** → **المشاريع**
2. Click **إضافة مشروع جديد**
3. Fill in project details
4. Assign client
5. Set budget and timeline
6. Save

### Adding Expenses

1. Navigate to: **المالية** → **المصروفات**
2. Click **إضافة مصروف**
3. Select expense type (direct/indirect)
4. Link to project (if applicable)
5. Enter amount and details
6. Save

---

## 🔒 Security

### Password Security

- Passwords are hashed using **SHA-256**
- Never stored in plain text
- Change default passwords immediately

### Session Management

- Tokens generated using UUID
- 8-hour session timeout
- Automatic expiration on inactivity
- Logout revokes session immediately

### Permission System

- **Role-Based Access Control (RBAC)**
- Granular permissions per module
- Admin role: `ROLE_ADMIN` has full access
- Custom roles can be created with specific permissions

### Audit Trail

All actions are logged in `SYS_Audit_Log`:
- User ID and username
- Action type (ADD, UPDATE, DELETE, LOGIN, LOGOUT)
- Entity and entity ID
- Timestamp
- IP address (when available)

---

## 🐛 Troubleshooting

### Issue: "Cannot find sheet"

**Solution**: Run `setupDatabase()` function to create all required sheets

### Issue: "Authentication failed"

**Solution**: 
1. Check username/password
2. Verify user is active in `SYS_Users`
3. Check browser console for errors

### Issue: "Permission denied"

**Solution**:
1. Verify user has required permissions
2. Check `SYS_Role_Permissions` mapping
3. Ensure role is assigned to user

### Issue: "Data not loading"

**Solution**:
1. Check browser console for errors
2. Verify sheet names match schema
3. Check Apps Script execution logs
4. Ensure headers are in correct format (Row 1: EN, Row 2: AR)

### Issue: "Session expired"

**Solution**: Sessions expire after 8 hours. Simply log in again.

---

## 🔄 Backup & Maintenance

### Creating Backups

Use the built-in backup function:

```javascript
backupSpreadsheet()
```

This creates a timestamped copy in Google Drive.

### Clearing Data (Caution!)

To clear all data while preserving headers:

```javascript
clearAllData()
```

⚠️ **WARNING**: This is irreversible! Always backup first.

### Validating Database

To check database structure integrity:

```javascript
validateDatabase()
```

---

## 📊 Reporting & Analytics

### Dashboard Metrics

The dashboard displays:
- Total employees
- Active projects
- Monthly revenue
- Pending tasks

### Custom Reports

Create custom reports by:
1. Adding entries to `*_Analysis` sheets
2. Using built-in Google Sheets charts
3. Exporting data to CSV using `exportToCSV(sheetName)`

---

## 🤝 Contributing

This is a proprietary system for Nijjara. For internal development:

1. Create a new branch for features
2. Test thoroughly in development environment
3. Document all changes
4. Get approval before merging to main

---

## 📞 Support

For questions or issues:
- Check this README first
- Review `Project Overview & ERP Schema.md`
- Contact system administrator

---

## 📄 License

© 2024 Nijjara ERP - All Rights Reserved  
Proprietary Software - Internal Use Only

---

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Core database structure
- ✅ Authentication system
- ✅ Basic CRUD operations
- ✅ Dashboard interface

### Phase 2 (Planned)
- ⏳ Complete forms for all modules
- ⏳ Advanced filtering and search
- ⏳ Report generation
- ⏳ Mobile-responsive design

### Phase 3 (Future)
- ⏳ Email notifications
- ⏳ WhatsApp integration
- ⏳ Advanced analytics
- ⏳ API for third-party integrations

---

## 📝 Changelog

### Version 1.0.0 (2024-11-21)
- Initial release
- Core ERP modules implemented
- Bilingual support (EN/AR)
- Role-based access control
- Audit logging system

---

**Built with ❤️ for Nijjara**

