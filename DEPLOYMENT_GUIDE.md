# Nijjara ERP - Deployment Guide

## دليل نشر نظام نجارة ERP

This guide walks you through the complete deployment process step-by-step.

---

## 📋 Prerequisites Checklist

Before starting, ensure you have:

- ✅ Google Account with access to Google Sheets
- ✅ Google Apps Script access
- ✅ Basic understanding of Google Workspace
- ✅ All system files ready

---

## 🚀 Step-by-Step Deployment

### STEP 1: Create Google Sheet

1. Open [Google Sheets](https://sheets.google.com)
2. Click **Blank** to create new spreadsheet
3. Click on sheet name (top-left) and rename to: **TheERPv1**
4. Keep this tab open

### STEP 2: Open Apps Script Editor

1. In TheERPv1 spreadsheet, click menu: **Extensions**
2. Click **Apps Script**
3. New tab will open with Apps Script editor
4. You'll see default code - **DELETE IT ALL**

### STEP 3: Create Backend Script Files

For each `.js` file, you need to:

1. In Apps Script editor, click **+** next to Files
2. Select **Script**
3. Name the file (e.g., `Setup`)
4. Copy the entire content from source file
5. Paste into the editor
6. Click **Save** (💾 icon) or `Ctrl+S`

**Files to create** (in this order):

| File Name | Content Source |
|-----------|---------------|
| `Setup` | Copy from `Setup.js` |
| `Seed_Data` | Copy from `Seed_Data.js` |
| `Seed_Functions` | Copy from `Seed_Functions.js` |
| `Code` | Copy from `Code.js` |
| `Utils` | Copy from `Utils.js` |

**⚠️ Note**: Apps Script automatically adds `.gs` extension

### STEP 4: Create Frontend HTML Files

For each `.html` file:

1. In Apps Script editor, click **+** next to Files
2. Select **HTML**
3. Name the file (e.g., `Login`)
4. Copy the entire content from source file
5. Paste into the editor
6. Click **Save**

**Files to create**:

| File Name | Content Source |
|-----------|---------------|
| `Login` | Copy from `Login.html` |
| `Dashboard` | Copy from `Dashboard.html` |

### STEP 5: Add Helper Function to Code.gs

Add this function to the **Code.gs** file at the top (after the existing functions):

```javascript
/**
 * Get script URL for redirects
 */
function getScriptUrl() {
  return ScriptApp.getService().getUrl();
}
```

### STEP 6: Grant Permissions

1. In Apps Script editor, make sure **Setup.gs** is selected
2. Find function dropdown (near ▶️ Run button)
3. Select `setupDatabase`
4. Click **Run** (▶️)
5. **Authorization Required** dialog will appear
6. Click **Review Permissions**
7. Choose your Google Account
8. Click **Advanced**
9. Click **Go to [Project Name] (unsafe)**
10. Review permissions and click **Allow**

**Permissions needed:**
- View and manage spreadsheets
- Connect to external service
- Display and run web content

### STEP 7: Run Database Setup

1. With `setupDatabase` still selected
2. Click **Run** (▶️) again
3. Watch **Execution log** at bottom
4. Should see messages like:
   ```
   🚀 Starting ERP Database Setup...
   ✅ Created sheet: ENG_Forms
   ✅ Created sheet: ENG_Views
   ...
   📊 Setup Complete!
   ```
5. **Go back to your spreadsheet tab** and refresh
6. You should now see **30+ new tabs**

### STEP 8: Verify Database Structure

1. Check that all sheets exist:
   - ENG_* sheets (5 sheets)
   - SYS_* sheets (9 sheets)
   - HRM_* sheets (9 sheets)
   - PRJ_* sheets (9 sheets)
   - FIN_* sheets (9 sheets)

2. Open any sheet and verify:
   - Row 1 has English headers
   - Row 2 has Arabic headers
   - Both rows are formatted and frozen

### STEP 9: Seed Initial Data

1. Go back to Apps Script editor
2. From function dropdown, select `seedAllData`
3. Click **Run** (▶️)
4. Wait for completion (check log)
5. You should see:
   ```
   🌱 Starting data seeding...
   📝 Seeding dropdowns...
   ✅ Seeded 80+ dropdown options
   📝 Seeding buttons...
   ✅ Seeded 30+ buttons
   ...
   ✅ Data seeding complete!
   ```

### STEP 10: Verify Seeded Data

Go to spreadsheet and check:

1. **ENG_Dropdowns** sheet should have ~80 rows
2. **ENG_Buttons** sheet should have ~30 rows
3. **SYS_Roles** sheet should have 8 roles
4. **SYS_Permissions** sheet should have ~35 permissions
5. **SYS_Users** sheet should have 1 user (admin)
6. **HRM_Departments** sheet should have 6 departments

### STEP 11: Deploy as Web App

1. In Apps Script editor, click **Deploy** (top-right)
2. Select **New deployment**
3. Click **⚙️ Select type**
4. Choose **Web app**
5. Fill in deployment settings:
   - **Description**: `Nijjara ERP v1.0 - Initial Deployment`
   - **Execute as**: `Me (your email)`
   - **Who has access**: Choose one:
     - `Only myself` - For testing
     - `Anyone with Google account` - For team access
     - `Anyone` - Public access (not recommended)
6. Click **Deploy**
7. **IMPORTANT**: Copy the **Web app URL**
   - It looks like: `https://script.google.com/macros/s/[LONG-ID]/exec`
   - Save it somewhere safe!

### STEP 12: Test Login

1. Open the **Web app URL** in a **new incognito/private browser window**
2. You should see the login page with:
   - Purple gradient header
   - "نظام Nijjara ERP" title
   - Username and password fields
   - "تسجيل الدخول" button

3. Try logging in with default credentials:
   - **Username**: `mkhoraiby`
   - **Password**: `210388`

4. If successful, you should see:
   - Success message
   - Dashboard loads

### STEP 13: Security - Change Default Password

⚠️ **CRITICAL**: Change the default admin password immediately!

1. Go to spreadsheet tab **SYS_Users**
2. Find row with `mkhoraiby`
3. **DO NOT** change the password directly in the sheet
4. Instead, use the **Change Password** function:

Add this to Code.gs:

```javascript
function changePassword(username, newPassword) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const usersSheet = ss.getSheetByName('SYS_Users');
  const data = usersSheet.getDataRange().getValues();
  const headers = data[0];
  const usernameCol = headers.indexOf('USR_Name');
  const passwordCol = headers.indexOf('Password_Hash');
  
  for (let i = 2; i < data.length; i++) {
    if (data[i][usernameCol] === username) {
      const newHash = Utilities.base64Encode(
        Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, newPassword)
      );
      usersSheet.getRange(i + 1, passwordCol + 1).setValue(newHash);
      Logger.log('Password changed successfully');
      return;
    }
  }
}
```

Then run:
```javascript
changePassword('mkhoraiby', 'YourNewStrongPassword123');
```

---

## ✅ Deployment Verification Checklist

Check all of these before considering deployment complete:

### Database
- [ ] All 42+ sheets created
- [ ] Bilingual headers present (EN + AR)
- [ ] Headers are frozen (rows 1-2)
- [ ] Proper formatting applied

### Initial Data
- [ ] ENG_Dropdowns populated (~80 items)
- [ ] ENG_Buttons populated (~30 items)
- [ ] SYS_Roles populated (8 roles)
- [ ] SYS_Permissions populated (~35 permissions)
- [ ] SYS_Users has admin user
- [ ] HRM_Departments populated (6 departments)

### Web App
- [ ] Web app deployed successfully
- [ ] Login page loads without errors
- [ ] Can login with default credentials
- [ ] Dashboard displays correctly
- [ ] Sidebar navigation works
- [ ] Arabic text displays properly (Cairo font)

### Security
- [ ] Default admin password changed
- [ ] Permissions granted correctly
- [ ] Web app access level set appropriately

---

## 🔧 Post-Deployment Configuration

### 1. Create Additional Users

1. Log in as admin
2. Go to: **الإدارة** → **المستخدمين**
3. Add users for your team
4. Assign appropriate roles

### 2. Customize Departments

1. Go to: **الموارد البشرية** → **الأقسام**
2. Edit or add departments based on your organization

### 3. Set System Settings

Go to spreadsheet → **ENG_Settings** tab and customize:
- `SYSTEM_NAME`: Your company name
- `CURRENCY`: Your currency (default: EGP)
- `VAT_RATE`: Your tax rate
- `WORKING_HOURS_START`: Office start time
- `WORKING_HOURS_END`: Office end time

### 4. Add Public Holidays

1. Go to **SYS_PubHolidays** sheet
2. Add holidays relevant to your country
3. Format: Date, Holiday Name (Arabic)

---

## 🐛 Common Deployment Issues

### Issue 1: "Script function not found"

**Cause**: Files not saved or named incorrectly

**Solution**:
1. Ensure all files are saved (Ctrl+S)
2. Check file names match exactly (Setup, Code, etc.)
3. Refresh Apps Script editor

### Issue 2: "Cannot find sheet X"

**Cause**: setupDatabase() not run or failed

**Solution**:
1. Check execution log for errors
2. Re-run setupDatabase()
3. Grant all permissions if prompted

### Issue 3: "Authorization Required" loop

**Cause**: Permissions not granted properly

**Solution**:
1. Go to Apps Script editor
2. Click on ⚙️ (Project Settings)
3. Scroll to "Google Cloud Platform (GCP) Project"
4. Click on project link
5. Enable required APIs

### Issue 4: Login page not loading

**Cause**: Web app not deployed or wrong URL

**Solution**:
1. Verify deployment was successful
2. Check you're using the **Web app URL** (not Script URL)
3. Try opening in incognito window

### Issue 5: "Permission denied" on login

**Cause**: Execute as / Access settings incorrect

**Solution**:
1. Go to Apps Script → Deploy → Manage deployments
2. Click ✏️ Edit on active deployment
3. Change "Execute as" to "Me"
4. Change "Who has access" as needed
5. Click "Deploy" (new version)

### Issue 6: Arabic text shows as boxes

**Cause**: Font not loading

**Solution**:
1. Check internet connection (Cairo font loads from Google Fonts)
2. Clear browser cache
3. Try different browser

---

## 📊 Monitoring & Maintenance

### Check Execution Logs

1. Apps Script editor → **Executions** (left sidebar)
2. Review any failed executions
3. Check error messages

### Monitor Usage

1. Apps Script editor → **Project Settings**
2. View quotas and usage
3. Daily limits:
   - Script runtime: 6 hours/day
   - Email quota: varies by account type

### Backup Schedule

Set up automatic backups:

1. Create a time-driven trigger
2. Run `backupSpreadsheet()` daily
3. Store backups in specific Drive folder

---

## 🔄 Updating the System

When you need to update code:

### Option 1: Version Deployment (Recommended)

1. Make changes in Apps Script editor
2. Test thoroughly
3. Click **Deploy** → **Manage deployments**
4. Click **✏️ Edit** on active deployment
5. **IMPORTANT**: Change to **New version**
6. Add version description
7. Click **Deploy**

### Option 2: Test Deployment

1. Click **Deploy** → **Test deployments**
2. Install add-on for testing
3. Test changes
4. When satisfied, create new version

---

## 🎓 Training Users

### Admin Training Checklist

- [ ] How to add/edit users
- [ ] How to manage roles and permissions
- [ ] How to view audit logs
- [ ] How to backup system
- [ ] How to export data

### End User Training Checklist

- [ ] How to login
- [ ] How to navigate the system
- [ ] How to add/edit records
- [ ] How to search and filter
- [ ] How to generate reports

---

## 📞 Getting Help

### Apps Script Documentation
- [Official Docs](https://developers.google.com/apps-script)
- [Reference](https://developers.google.com/apps-script/reference)

### Google Sheets API
- [Sheets Service](https://developers.google.com/apps-script/reference/spreadsheet)

### Community Resources
- [Stack Overflow](https://stackoverflow.com/questions/tagged/google-apps-script)
- [Google Apps Script Community](https://support.google.com/groups/answer/46601)

---

## ✨ Congratulations!

If you've completed all steps, your Nijjara ERP system is now fully deployed and ready to use!

**Next steps:**
1. Add your team members
2. Start entering data
3. Customize to your needs
4. Provide feedback for improvements

---

**Need assistance? Contact your system administrator.**

© 2024 Nijjara ERP - All Rights Reserved

