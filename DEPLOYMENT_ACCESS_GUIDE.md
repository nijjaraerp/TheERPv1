# 🚀 Deployment & Access Guide - Nijjara ERP

**Issue**: Login failing with "Script URL not configured" error  
**Root Cause**: Accessing HTML files locally instead of through Google Apps Script Web App deployment  
**Solution**: Deploy and access via Apps Script URL

---

## ❌ **Current Problem**

Your browser console shows:
```
[ERROR] [API] [Login error] Error: Script URL not configured. 
Please access via Apps Script deployment.
```

**Why this happens:**
- You're opening `Login.html` directly from your file system or local server
- The template tag `<?= scriptUrl ?>` is NOT being replaced by Google Apps Script
- The frontend can't communicate with the backend without the script URL

---

## ✅ **Correct Deployment Process**

### Step 1: Open Google Apps Script Editor

```bash
# Option A: Via Command Line (clasp)
clasp open

# Option B: Via Google Sheets
1. Open your "TheERPv1" spreadsheet
2. Click Extensions > Apps Script
```

---

### Step 2: Verify All Files Are Deployed

Check that these files appear in the Apps Script editor:

```
✅ Code.js
✅ Setup.js
✅ Seed_Data.js
✅ Utils.js
✅ Login.html
✅ Dashboard.html
✅ Forms.html
✅ Views.html
✅ appsscript.json
```

If any are missing, run:
```bash
clasp push --force
```

---

### Step 3: Initialize the Database (FIRST TIME ONLY)

**In the Apps Script editor:**

1. Select `Setup.js` from the file list
2. Select function: `setupDatabase`
3. Click ▶️ **Run**
4. Authorize the script when prompted
5. Wait for execution to complete (check Execution log)

**What this does:**
- Creates all 35 sheets in "TheERPv1" spreadsheet
- Sets up bilingual headers (Row 1: English, Row 2: Arabic)
- Creates DBUG sheets (AppLog, WarnLog, ErrorLog)

---

### Step 4: Seed Initial Data (FIRST TIME ONLY)

**In the Apps Script editor:**

1. Select `Seed_Data.js` from the file list
2. Select function: `seedAllData`
3. Click ▶️ **Run**
4. Wait for execution to complete

**What this does:**
- Populates ENG_Dropdowns with system values
- Creates default admin user (username: `admin`, password: `admin123`)
- Seeds roles and permissions
- Creates initial system configuration

---

### Step 5: Deploy as Web App

**In the Apps Script editor:**

1. Click **Deploy** button (top right)
2. Select **New deployment**
3. Configure deployment:
   ```
   Select type: ⚙️ Web app
   
   Description: Nijjara ERP v1.0
   
   Execute as: Me (your-email@gmail.com)
   
   Who has access: Anyone
   (or "Anyone with Google account" for restricted access)
   ```
4. Click **Deploy**
5. Click **Authorize access** when prompted
6. Review permissions and click **Allow**
7. **COPY THE WEB APP URL** that appears (very important!)
   ```
   Example: https://script.google.com/macros/s/AKfycbz.../exec
   ```

---

### Step 6: Access the Application

**Open the Web App URL in your browser:**

```
https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

**You should see:**
- ✅ The Nijjara ERP login page
- ✅ Dark animated 3D theme with particles
- ✅ Arabic interface
- ✅ No console errors about "Script URL not configured"

---

### Step 7: Test Login

**Default credentials:**
```
Username: admin
Password: admin123
```

**What should happen:**
1. Click "دخول" (Login) button
2. See loading animation
3. Login succeeds → redirects to Dashboard
4. DBUG sheets start recording logs

---

## 🐛 **Verifying DBUG Sheets Work**

After successful login, check the Google Sheets:

### 1. Open "TheERPv1" Spreadsheet

### 2. Check DBUG_AppLog Sheet
Should contain entries like:
```
DBG_ID              | Time_Stamp            | Actor  | Action | Entity | Entity_ID | Details
LOG_20251123101530  | 2025-11-23T10:15:30  | admin  | LOGIN  | USER   | USR001    | Login successful
```

### 3. Check DBUG_WarnLog Sheet
Should be empty unless there were warnings

### 4. Check DBUG_ErrorLog Sheet
Should be empty unless there were errors

---

## 🔄 **Updating After Code Changes**

Whenever you modify code locally:

```bash
# 1. Push changes to Apps Script
clasp push --force

# 2. Create new deployment (or use existing)
# Option A: New deployment (creates new URL)
#   - Follow Step 5 above

# Option B: Update existing deployment (keeps same URL)
#   - In Apps Script editor: Deploy > Manage deployments
#   - Click ✏️ Edit icon on active deployment
#   - Update version
#   - Click Deploy
```

---

## ⚠️ **Common Mistakes to Avoid**

### ❌ **DON'T: Open HTML files directly**
```
file:///C:/Users/.../TheERP/Login.html          ← WRONG
http://localhost:8080/Login.html                ← WRONG
```

### ✅ **DO: Use Apps Script deployment URL**
```
https://script.google.com/macros/s/.../exec     ← CORRECT
```

### ❌ **DON'T: Skip database initialization**
- Must run `setupDatabase()` before first use
- Must run `seedAllData()` before first login

### ✅ **DO: Follow deployment order**
1. Push code → 2. Setup database → 3. Seed data → 4. Deploy → 5. Access

---

## 🔍 **Troubleshooting**

### Issue: "Script URL not configured" Error
**Solution**: You're not accessing via Apps Script deployment URL

### Issue: "Spreadsheet not found" Error
**Solution**: 
- Verify spreadsheet name is exactly "TheERPv1"
- Or update `CONFIG.SHEET_NAME` in Code.js

### Issue: "SYS_Users sheet not found" Error
**Solution**: Run `setupDatabase()` function first

### Issue: "Username or password incorrect" Error
**Solution**: 
- Run `seedAllData()` to create admin user
- Or check SYS_Users sheet for correct credentials

### Issue: DBUG sheets empty
**Solution**:
- Verify sheets were created by `setupDatabase()`
- Check sheet names: `DBUG_AppLog`, `DBUG_WarnLog`, `DBUG_ErrorLog`
- Login must succeed for logs to be written

### Issue: "Authorization required" popup
**Solution**: 
- Click "Review Permissions"
- Click "Advanced"
- Click "Go to [Project Name] (unsafe)" (it's safe, it's your own script)
- Click "Allow"

---

## 📋 **Quick Deployment Checklist**

```
☐ 1. clasp push --force
☐ 2. Open Apps Script editor (clasp open)
☐ 3. Run setupDatabase() [First time only]
☐ 4. Run seedAllData() [First time only]
☐ 5. Deploy > New deployment > Web app
☐ 6. Execute as: Me
☐ 7. Who has access: Anyone
☐ 8. Copy deployment URL
☐ 9. Open deployment URL in browser
☐ 10. Login with admin/admin123
☐ 11. Verify DBUG sheets have log entries
```

---

## 🎯 **Expected Behavior After Correct Deployment**

### Browser Console (Success):
```
[INFO] [SYSTEM] [SYSTEM] Particles Initialized
[INFO] [SYSTEM] [SYSTEM] نظام Nijjara ERP جاهز للتشغيل
[INFO] [CONFIG] [Script URL] { url: "https://script.google.com/macros/s/.../exec" }
[INFO] [Auth] [Login attempt] { username: "admin" }
[REQUEST] [API] [login] { url: "...", params: {...} }
[SUCCESS] [API] [Login success] { token: "...", user: {...} }
```

### DBUG_AppLog Sheet (Success):
```
LOG_... | 2025-11-23T10:15:30 | admin | LOGIN  | USER | USR001 | Login successful
LOG_... | 2025-11-23T10:15:31 | admin | FETCH  | BOOTSTRAP | - | Generated bootstrap
```

---

## 🔗 **Quick Reference**

| Action      | Location    | Command/Steps           |
| ----------- | ----------- | ----------------------- |
| Push code   | Terminal    | `clasp push --force`    |
| Open editor | Terminal    | `clasp open`            |
| Setup DB    | Apps Script | Run `setupDatabase()`   |
| Seed data   | Apps Script | Run `seedAllData()`     |
| Deploy      | Apps Script | Deploy > New deployment |
| Access      | Browser     | Use deployment URL      |

---

## 💡 **Next Steps After Successful Login**

1. **Change default admin password**
   - Login as admin
   - Navigate to Settings
   - Update password

2. **Create additional users**
   - Add entries to SYS_Users sheet
   - Or use the HRM module

3. **Configure roles and permissions**
   - Edit SYS_Roles and SYS_Permissions sheets
   - Or use admin interface

4. **Start using modules**
   - HRM: Add employees, departments
   - Projects: Create projects, tasks
   - Finance: Track expenses, revenue

---

**⚠️ IMPORTANT: Never commit your deployment URL or spreadsheet ID to public repositories!**

---

*Last Updated: November 23, 2025*  
*Nijjara ERP System - Deployment Guide*
