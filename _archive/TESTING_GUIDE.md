# Quick Testing Guide for Arabic Login

## Apps Script Project URL
Open this URL to access your Apps Script project:
https://script.google.com/home/projects/17E8FfWtuGyY7tULq54RUY0jTd2dcpgY0rTLuEuvR98d7YRsWZizXTAhb

## Step-by-Step Testing Process

### 1. First, verify the user exists and password is correct

1. Go to the Apps Script URL above
2. Click on `test_auth.js` file
3. Select function: `verifyUserInSheet` from the dropdown
4. Click "Run" (▶️)
5. Authorize if prompted
6. Check logs: View → Execution log or Ctrl+Enter

**If the user doesn't exist or password hash doesn't match:**
- Change function dropdown to: `recreateMkhoraibyUser`
- Click "Run" (▶️)
- This will create/update the user with correct credentials

### 2. Test backend authentication

1. In Apps Script, select function: `testAuthentication`
2. Click "Run" (▶️)
3. Check logs - should show "✅ Login SUCCESSFUL!"

### 3. Deploy and test the web app

1. Click "Deploy" → "Test deployments" or "Manage deployments"
2. If no deployment exists:
   - Click "New deployment"
   - Select type: "Web app"
   - Description: "Nijjara ERP - Arabic Login"
   - Execute as: Me (your email)
   - Who has access: Anyone
   - Click "Deploy"
3. If deployment exists:
   - Click pencil icon to edit
   - Change "Version" to "New version"
   - Click "Deploy"
4. Copy the Web app URL
5. Open URL in new browser tab

### 4. Test the login page

**Credentials:**
- Username: `mkhoraiby`
- Password: `210388`

**What to verify:**
- ✅ Page displays in Arabic with Cairo font
- ✅ Title shows "Nijjara" not "AETERNA"
- ✅ Subtitle shows "for Contracting & Woodcrafting"
- ✅ Username field label: "اسم المستخدم"
- ✅ Password field label: "كلمة السر"
- ✅ Login button: "تسجيل الدخول"
- ✅ RTL layout (labels on right, spinners on left)
- ✅ Top-right shows "ERP System"
- ✅ Bottom-right shows "الاتصال آمن"

**Test successful login:**
1. Enter: mkhoraiby / 210388
2. Click "تسجيل الدخول"
3. Button changes to "جاري تسجيل الدخول..."
4. Card animates and shrinks
5. Success message appears: "تم تسجيل الدخول بنجاح"
6. Redirects to Dashboard (may show blank/error if dashboard not ready)

**Test error messages:**
1. Leave fields empty → Click login
   - Should show: "خطأ: يرجى إدخال اسم المستخدم وكلمة السر"
2. Enter wrong password: mkhoraiby / wrongpass
   - Should show: "اسم المستخدم أو كلمة السر غير صحيحة"

## Troubleshooting Quick Fixes

### "اسم المستخدم أو كلمة السر غير صحيحة" (Wrong credentials error)

**Run this in Apps Script:**
```javascript
function fixMkhoraibyPassword() {
  const ss = SpreadsheetApp.openByName("TheERPv1");
  const sheet = ss.getSheetByName("SYS_Users");
  const data = sheet.getDataRange().getValues();
  
  // Find mkhoraiby row
  for (let i = 2; i < data.length; i++) {
    if (data[i][1] === "mkhoraiby") { // Column B = USR_Name
      const newHash = hashPassword("210388");
      sheet.getRange(i + 1, 7).setValue(newHash); // Column G = Password_Hash
      Logger.log("✅ Password updated!");
      Logger.log("New hash: " + newHash);
      return;
    }
  }
  Logger.log("❌ User not found!");
}
```

### Page shows English text or wrong font

1. Clear browser cache: Ctrl+Shift+Delete
2. Hard reload page: Ctrl+F5
3. Check browser console (F12) for errors
4. Verify clasp push completed successfully

### Can't see changes

1. Re-run: `clasp push --force`
2. Create NEW deployment version:
   - Deploy → Manage deployments → Edit → New version → Deploy
3. Use the new deployment URL

## Manual Password Hash Verification

If you want to manually verify the password hash in the sheet:

1. Open Google Sheet: https://docs.google.com/spreadsheets/
2. Find sheet named "TheERPv1"
3. Go to "SYS_Users" tab
4. Find row with mkhoraiby (usually row 4)
5. Check column G (Password_Hash)

The hash should be a long Base64 string like:
`MEzRjBmNzVhMTk2NTU4MTM1OWQ1ODZmMDhiMjc3NjE3N2RhZWZhMjk0YzhlNTA=` (example)

To get the correct hash, run this in Apps Script:
```javascript
function getCorrectHash() {
  Logger.log("Correct hash for '210388': " + hashPassword("210388"));
}
```

Then copy that hash and paste it into the Password_Hash column for mkhoraiby user.

## Current Status

All changes have been pushed to Google Apps Script. The files updated are:
- ✅ Login.html (Arabic UI, Cairo font, RTL layout)
- ✅ Code.js (Arabic error messages)
- ✅ test_auth.js (NEW - testing utilities)

**Next action required:** Open Apps Script project and run verification tests.
