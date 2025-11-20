# Nijjara ERP - Quick Start Guide

## 🚀 دليل البدء السريع

Get your ERP system up and running in **15 minutes**!

---

## 📝 Quick Setup (TL;DR)

```bash
1. Create Google Sheet named "TheERPv1"
2. Open Extensions → Apps Script
3. Copy 5 backend files (.js)
4. Copy 2 frontend files (.html)
5. Run setupDatabase()
6. Run seedAllData()
7. Deploy as Web App
8. Login: mkhoraiby / 210388
```

---

## 🎯 5-Minute Version

### Step 1: Create Sheet (1 min)
- Go to [sheets.google.com](https://sheets.google.com)
- New Blank Sheet → Name it "TheERPv1"

### Step 2: Setup Scripts (5 min)
- Extensions → Apps Script
- Add these files:
  - **Setup.js** → Name: `Setup`
  - **Code.js** → Name: `Code`
  - **Seed_Data.js** → Name: `Seed_Data`
  - **Seed_Functions.js** → Name: `Seed_Functions`
  - **Utils.js** → Name: `Utils`
  - **Login.html** → Name: `Login`
  - **Dashboard.html** → Name: `Dashboard`

### Step 3: Initialize (3 min)
1. Select function: `setupDatabase`
2. Click Run → Grant permissions
3. Wait for completion
4. Select function: `seedAllData`
5. Click Run
6. Wait for completion

### Step 4: Deploy (2 min)
1. Click Deploy → New deployment
2. Type: Web app
3. Execute as: Me
4. Who has access: Choose appropriate option
5. Deploy → Copy URL

### Step 5: Test (1 min)
1. Open Web App URL
2. Login: **mkhoraiby** / **210388**
3. ✅ Done!

---

## 📋 File Checklist

Copy these files to Apps Script:

### Backend Scripts (.gs)
- [ ] Setup.js
- [ ] Code.js
- [ ] Seed_Data.js
- [ ] Seed_Functions.js
- [ ] Utils.js

### Frontend HTML
- [ ] Login.html
- [ ] Dashboard.html

---

## ⚡ Command Sequence

Execute these in order:

```javascript
// 1. Setup database structure
setupDatabase()

// 2. Seed initial data
seedAllData()

// 3. Verify (optional)
validateDatabase()

// 4. Change admin password
changePassword('mkhoraiby', 'YourNewPassword')
```

---

## 🎨 What You'll Get

After setup, you'll have:

### Database (42+ Sheets)
- ✅ 5 Engine sheets (ENG_*)
- ✅ 9 System sheets (SYS_*)
- ✅ 9 HR sheets (HRM_*)
- ✅ 9 Project sheets (PRJ_*)
- ✅ 9 Finance sheets (FIN_*)

### Initial Data
- ✅ 80+ dropdown options
- ✅ 30+ button definitions
- ✅ 8 user roles
- ✅ 35+ permissions
- ✅ 1 admin user
- ✅ 6 departments

### Features
- ✅ Login system with authentication
- ✅ Dashboard with navigation
- ✅ Role-based access control
- ✅ Audit logging
- ✅ Arabic interface (Cairo font)
- ✅ Responsive design

---

## 🔐 Default Credentials

```
Username: mkhoraiby
Password: 210388
Role: System Administrator
```

⚠️ **Change password immediately after first login!**

---

## 🧪 Testing Checklist

After deployment, verify:

- [ ] Login page loads
- [ ] Can login with default credentials
- [ ] Dashboard displays
- [ ] Sidebar navigation works
- [ ] Arabic text displays correctly
- [ ] Can logout
- [ ] Can login again

---

## 🐛 Quick Troubleshooting

### "Cannot find sheet"
→ Run `setupDatabase()` again

### "Login failed"
→ Check username/password (case-sensitive)

### "Permission denied"
→ Grant all permissions in Apps Script

### "Page not loading"
→ Check deployment settings, use incognito window

---

## 📚 Next Steps

After successful deployment:

1. **Change admin password**
   ```javascript
   changePassword('mkhoraiby', 'NewSecurePassword123')
   ```

2. **Add your first employee**
   - Login → HRM → Employees → Add New

3. **Create additional users**
   - Login → System → Users → Add User

4. **Customize settings**
   - Edit `ENG_Settings` sheet

5. **Read full documentation**
   - See `README.md` for detailed guide

---

## 🎓 Learning Path

### Day 1: Setup
- Complete deployment
- Test login
- Explore dashboard

### Day 2: Configuration
- Add users
- Configure roles
- Set system settings

### Day 3: Data Entry
- Add employees
- Create projects
- Enter expenses

### Week 2: Training
- Train team members
- Establish workflows
- Create custom reports

---

## 📊 Success Metrics

You'll know setup is successful when:

1. ✅ All 42+ sheets exist
2. ✅ Can login successfully
3. ✅ Dashboard loads with stats
4. ✅ Navigation works
5. ✅ Arabic displays properly
6. ✅ No console errors

---

## 🆘 Need Help?

### Resources
- **Full Guide**: `README.md`
- **Deployment Details**: `DEPLOYMENT_GUIDE.md`
- **System Overview**: `Project Overview & ERP Schema.md`

### Common Issues
- Check Apps Script execution logs
- Verify all files are saved
- Ensure permissions granted
- Clear browser cache

---

## ✨ Pro Tips

1. **Bookmark the Web App URL** for easy access
2. **Create desktop shortcut** to web app
3. **Use Chrome/Firefox** for best experience
4. **Enable auto-save** in Apps Script (Ctrl+S frequently)
5. **Backup before making changes** (`backupSpreadsheet()`)

---

## 🎉 You're Ready!

Your Nijjara ERP system is now live and ready to use.

**Start adding your business data and enjoy the efficiency!**

---

**Questions? Check the full README.md or contact your administrator.**

© 2024 Nijjara ERP

