# 🚀 Nijjara ERP - Implementation Guide

Complete step-by-step guide to implement and deploy the Nijjara ERP system.

## 📋 Prerequisites Checklist

- [ ] Google Workspace account (Gmail, Drive, Sheets, Apps Script access)
- [ ] A web browser (Chrome recommended)
- [ ] Basic knowledge of Google Sheets
- [ ] Permission to create Google Sheets and Apps Scripts

---

## 🔧 Implementation Steps

### Phase 1: Google Sheet Setup (5 minutes)

#### Step 1.1: Create the Master Sheet

1. Go to [Google Drive](https://drive.google.com)
2. Click **"+ New" → "Google Sheets" → "Blank spreadsheet"**
3. Name it exactly: **`TheERPv1`**
4. Press Enter
5. Copy the Sheet ID from the URL bar
   - URL: `docs.google.com/spreadsheets/d/{SHEET_ID}/edit`
   - Save this ID somewhere

#### Step 1.2: Create Google Apps Script Project

1. In your new Google Sheet, go to **Extensions → Apps Script**
2. A new browser tab will open
3. Delete any default code in the editor
4. You're now ready to add the system files

---

### Phase 2: Deploy Backend Files (10 minutes)

#### Step 2.1: Add Setup.js

1. In Apps Script editor, click the **Code.gs** file
2. Select all content and delete it
3. Create a new file: Click **+ → Script**
4. Name it: **`Setup`**
5. Copy the entire content from `Setup.js` file and paste it
6. Press **Ctrl+S** to save

#### Step 2.2: Add Code.js (Backend API)

1. Create a new file: Click **+ → Script**
2. Name it: **`Code`**
3. Copy the entire content from `Code.js` file and paste it
4. Press **Ctrl+S** to save

#### Step 2.3: Add Utils.js (Utilities)

1. Create a new file: Click **+ → Script**
2. Name it: **`Utils`**
3. Copy the entire content from `Utils.js` file and paste it
4. Press **Ctrl+S** to save

#### Step 2.4: Add Seed_Data.js (Initial Data)

1. Create a new file: Click **+ → Script**
2. Name it: **`Seed_Data`**
3. Copy the entire content from `Seed_Data.js` file and paste it
4. Press **Ctrl+S** to save

---

### Phase 3: Initialize Database Schema (5 minutes)

#### Step 3.1: Run Setup Function

1. In Apps Script editor, look at the left panel
2. Find the function dropdown that says **"Select function"**
3. Click the dropdown and select **`setupERPSystem`**
4. Click the **Play (Run)** button
5. A dialog will ask for permissions:
   - Review the requested permissions
   - Click **"Review permissions"**
   - Select your Google account
   - Click **"Allow"**

#### Step 3.2: Verify Schema Creation

1. Go back to your Google Sheet (in the first tab)
2. You should see multiple new sheets created at the bottom
3. Check if sheets like:
   - `ENG_Forms`
   - `ENG_Views`
   - `SYS_Users`
   - `HRM_Employees`
   - etc. are present
4. Click on any sheet to verify it has bilingual headers (English row 1, Arabic row 2)

**Expected Result:** Blue headers with white text, two rows of headers, then empty data rows.

---

### Phase 4: Populate Initial Data (3 minutes)

#### Step 4.1: Run Seed Data Function

1. In Apps Script editor, select **`seedAllData`** from the function dropdown
2. Click the **Play (Run)** button
3. Wait for completion (should be quick)

#### Step 4.2: Verify Data Population

1. Go back to your Google Sheet
2. Check these sheets for data:
   - `ENG_Dropdowns` - Should have dropdown definitions
   - `SYS_Users` - Should have demo users
   - `SYS_Roles` - Should have system roles
   - `HRM_Departments` - Should have departments
3. All should show data starting from row 3 (after headers)

---

### Phase 5: Deploy as Web App (10 minutes)

#### Step 5.1: Create Web App Deployment

1. In Apps Script, click **"Deploy"** button at top right
2. Click **"New deployment"**
3. A dialog opens:
   - Select type: Choose **"Web app"** from dropdown
   - Execute as: Keep as **"[your email]"**
   - Who has access: Select **"Anyone"**
4. Click **"Deploy"**
5. **COPY THE DEPLOYMENT URL** - You'll need it soon
   - It should look like: `https://script.google.com/macros/d/{DEPLOYMENT_ID}/userweb`

#### Step 5.2: Add HTML Files

1. In Apps Script, click **"+ (plus icon)"** → **"HTML"**
2. Name it: **`Login`**
3. Paste the content from `Login.html`
4. Find this line: `SCRIPT_URL: 'YOUR_SCRIPT_URL_HERE'`
5. Replace with your deployment URL
   - Example: `SCRIPT_URL: 'https://script.google.com/macros/d/abc123/userweb'`
6. Click **"Ctrl+S"** to save

#### Step 5.3: Deploy Frontend

1. In Apps Script, click **"Deploy"** → Select the existing deployment
2. The deployment is now live!
3. To access it, click the deployment URL
4. **You should see the login page!**

---

### Phase 6: Test Login (5 minutes)

#### Step 6.1: Use Demo Credentials

On the login page, enter:

| Field | Value |
|-------|-------|
| **Username** | `mkhoraiby` |
| **Password** | `210388` |

#### Step 6.2: Verify Authentication

1. Click **"تسجيل الدخول"** (Login button)
2. You should see: **"جاري تحميل النظام..."** (Loading system...)
3. After a moment, you should be redirected

**Note:** Dashboard.html is coming in the next phase, so you might see an error. This is expected.

---

### Phase 7: Verify System Integration (5 minutes)

#### Step 7.1: Check Backend Functions

1. Go back to Apps Script
2. Click **"Execution Log"** at the bottom
3. You should see logs from the login attempt
4. Look for successful execution indicators

#### Step 7.2: Check Audit Log

1. Go to your Google Sheet
2. Click on the **`SYS_Audit_Log`** sheet
3. You should see a row recording your login
4. This confirms the system is tracking actions

---

## 📊 Common Issues & Solutions

### Issue: "Invalid SCRIPT_URL"

**Solution:**
1. Copy the exact deployment URL from Apps Script
2. It should include the `/userweb` at the end
3. Update `Login.html` in the HTML file section with the correct URL
4. Redeploy the web app

### Issue: "Sheet 'TheERPv1' not found"

**Solution:**
1. Verify your sheet is named exactly: `TheERPv1` (case-sensitive)
2. Make sure the Sheet ID in `Code.js` (CONFIG.SHEET_NAME) matches
3. The sheet must be in the same Google Drive account

### Issue: Setup.js won't run

**Solution:**
1. Make sure all files are saved (Ctrl+S)
2. Check for any syntax errors (red indicators in editor)
3. Try running from a simpler account (not workspace admin)
4. Check browser console (F12) for error messages

### Issue: Authentication fails even with correct credentials

**Solution:**
1. Check the password hash matches (should be in `SYS_Users` sheet)
2. Verify user is active (`USR_Is_Active` = TRUE)
3. Check `SYS_Audit_Log` for error messages
4. Look at Apps Script execution logs (Extensions → Apps Script → Executions)

### Issue: "Deployment not found" error

**Solution:**
1. Create a new deployment
2. Click Deploy → New deployment
3. Select "Web app"
4. Copy the URL again
5. Update Login.html with the new URL

---

## 🔐 Production Hardening Checklist

### Security

- [ ] Change demo user passwords in `SYS_Users` sheet
- [ ] Change admin password immediately
- [ ] Set all demo users to inactive except your account
- [ ] Review `SYS_Audit_Log` regularly
- [ ] Enable 2FA on your Google account

### Configuration

- [ ] Update system settings in `ENG_Settings`
- [ ] Review and customize roles in `SYS_Roles`
- [ ] Adjust permissions in `SYS_Role_Permissions`
- [ ] Add real departments in `HRM_Departments`
- [ ] Configure email notifications (coming soon)

### Data

- [ ] Backup your Google Sheet before production use
- [ ] Set up automatic backups
- [ ] Plan data migration from legacy systems
- [ ] Create user accounts for all staff
- [ ] Import historical data if needed

---

## 📈 Next Steps

### Immediate (Week 1)

1. ✅ Test all login scenarios
2. ✅ Verify all sheets have correct headers
3. ✅ Check audit logging works
4. ✅ Change all demo passwords

### Short Term (Week 2-3)

1. Create user accounts for team members
2. Configure departments and roles
3. Set up proper role-permission mappings
4. Start entering initial master data

### Medium Term (Month 1-2)

1. Build Dashboard.html (SPA main interface)
2. Create forms for all modules
3. Set up reports and analytics
4. Configure automation and workflows

### Long Term (Ongoing)

1. Customization based on business needs
2. Performance optimization
3. Integration with other systems
4. Advanced analytics and reporting

---

## 🎓 Key Concepts to Remember

### Metadata-Driven Architecture

The system reads configuration from sheets to dynamically generate UI:

```
ENG_Forms sheet → Define form structure
Frontend reads it → Automatically builds form UI
User fills form → Backend saves to target sheet
```

### Bilingual Headers Standard

```
Row 1: EMP_ID, EMP_Name_EN, EMP_Department    (English - backend)
Row 2: معرّف, اسم الموظف, القسم             (Arabic - frontend)
Row 3+: Actual data
```

### Permission System

```
Users → have → Roles → have → Permissions
SYS_Users → ROL_ID → SYS_Role_Permissions → PRM_ID
```

---

## 📞 Support Resources

### Google Apps Script Documentation
- [Official Docs](https://developers.google.com/apps-script)
- [Google Sheets API](https://developers.google.com/sheets/api)

### Troubleshooting
1. Check browser console (F12)
2. Check Apps Script logs (Extensions → Apps Script)
3. Review `SYS_Audit_Log` sheet
4. Look for error patterns

### Getting Help
- Review error messages carefully
- Check `SYS_Audit_Log` for what the system tried to do
- Test individual functions in Apps Script editor

---

## ✅ Implementation Verification Checklist

- [ ] Sheet created and named `TheERPv1`
- [ ] All .js files added to Apps Script
- [ ] setupERPSystem completed successfully
- [ ] seedAllData completed successfully
- [ ] Web app deployed with correct URL
- [ ] Login.html updated with deployment URL
- [ ] Can access login page in browser
- [ ] Can login with demo credentials
- [ ] Audit log shows login action
- [ ] Database schema verified (all sheets exist)
- [ ] Bilingual headers verified (Row 1 English, Row 2 Arabic)
- [ ] Demo users present in `SYS_Users` sheet
- [ ] Demo roles present in `SYS_Roles` sheet

---

**Congratulations! 🎉 Your Nijjara ERP system is now deployed and ready for customization!**

Next phase: Build Dashboard.html for the main user interface.

---

**Last Updated:** November 21, 2024  
**Version:** 1.0  
**Status:** Alpha Release

