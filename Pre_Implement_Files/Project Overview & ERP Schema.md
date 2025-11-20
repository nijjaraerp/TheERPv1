# Nijjara ERP: System Overview & Architecture

## Table of Contents

- 【 CONCEPT 】
- [1.0 MASTER GOOGLE SHEET STRUCTURE]
- [2.0 TECHNOLOGY STACK]
- [3.0 CORE ARCHITECTURE & LOGIC]
- [4.0 SHEET NAMING CONVENTION]
- [5.0 SYSTEM ENGINES (ENG_)]
- [6.0 WALK-THROUGH EXAMPLE]
- [7.0 DATABASE INTERACTION LAYER]
- [8.0 ERP SCHEMA]
- [9.0 SYS ENGINE HEADERS EXPLENATION]
	━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


━━━━━━━━━━━━
【 CONCEPT 】
━━━━━━━━━━━━
This document outlines the architecture for the Nijjara ERP, a custom, serverless, web-based platform. It is designed as a Single-Page Application (SPA) to provide a fast, dynamic, and responsive user experience without page reloads.

The system's primary function is to centralize and manage all core business operations across four main modules:

- Project Management (PRJ)
- Finance (FIN)
- Human Resources (HRM)
- System Administration (SYS)

============================================================
1.0 MASTER GOOGLE SHEET STRUCTURE
============================================================

We use **one Google Sheet only** named:
```
TheERPv1
```
All modules live inside this file as **tabs**, NOT separate sheets.
Tabs are grouped and named using prefixes:
- HR_...
- FIN_...
- PRJ_...
- SYS_...
- ENG_...

This keeps everything consistent and easy for setup.js.

============================================================
2.0 TECHNOLOGY STACK
============================================================

The entire system is built on the Google Workspace platform, leveraging its integrated, serverless environment.

- **BACKEND**: Google Apps Script (.js)
  Handles all server-side logic, data processing, authentication, permission handling, and database communication.

- **FRONTEND**: HTML / CSS / JavaScript (.html)
  Several html files serves as the SPA container. All UI components (HTML), styling (CSS), and client-side interactivity (JavaScript) will be present in these files.

- **DATABASE**: Google Sheets
  Each TAB (e.g., `SYS_Users`) acts as a database table. This model provides a transparent and auditable data store.

============================================================
3.0 CORE ARCHITECTURE & LOGIC
============================================================

The system's core principle is a **Metadata-Driven UI**. The frontend is not static; it is dynamically built at runtime based on configurations defined in the `ENG_` sheets.

--------------------------------------------------------------------
# 3.1 BILINGUAL HEADER STANDARD (CRITICAL)
--------------------------------------------------------------------

Every data tab follows EXACTLY this pattern:

Row 1 → English Backend Column Names
Row 2 → Arabic Frontend Column Names
Row 3+ → Data

Example:
```
A1: EMP_ID        | B1: EMP_Name_EN     | C1: EMP_Department
A2: كود الموظف    | B2: اسم الموظف      | C2: القسم
```
setup.js must ALWAYS write bilingual headers for the Modules Tabs.
All forms + views read from **row 2** (Arabic) when generating UI.
All backend logic uses **row 1** (English).

--------------------------------------------------------------------
# 3.2 BOOTSTRAP & DYNAMIC RENDERING
--------------------------------------------------------------------

1. **AUTHENTICATION**: User logs in via `Login.html`. The backend `Code.js` verifies credentials against the `SYS_Users` sheet.

2. **BOOTSTRAP**: On success, the backend gathers ALL metadata into a single "bootstrap object" from the `ENG_` sheets.

3. **RENDERING**: This object is sent to the frontend. Client-side JavaScript parses it to build the *entire* UI.

--------------------------------------------------------------------
# 3.3 UI/UX & FONT REQUIREMENTS
--------------------------------------------------------------------

- All user-facing text, labels, buttons, and headers **must** be displayed in **Arabic**.
- The entire interface **must** use the **Cairo Family font**.

============================================================
4.0 SHEET NAMING CONVENTION
============================================================

All sheets begin with one of the following 5-category prefixes:

- **ENG_**: System Engine & Configuration (e.g., `ENG_Views`).
- **SYS_**: System Administration Module (e.g., `SYS_Users`).
- **HRM_**: Human Resources Module (e.g., `HRM_Employees`).
- **PRJ_**: Projects Module (e.g., `PRJ_Clients`).
- **FIN_**: Finance Module (e.g., `FIN_Invoices`).

============================================================
5.0 SYSTEM ENGINES (ENG_)
============================================================

These sheets are the "brain" of the ERP system, containing configurations that drive the UI and logic.

- **ENG_Forms**: Defines the structure and properties of forms used throughout the ERP system for data entry and display.
- **ENG_Views**: Defines custom views for displaying lists of data in submodules or pages.
- **ENG_Buttons**: Defines the action buttons available in forms, tabs, or fields.
- **ENG_Dropdowns**: Defines dropdown lists used in forms for user selection.
- **ENG_Settings**: Stores system-wide configuration settings and metadata for the ERP application.

============================================================
6.0 WALK-THROUGH EXAMPLE
============================================================

Below is a complete, realistic end-to-end flow showing how a typical user interacts with the system.
This example demonstrates exactly how the ENG_ sheets, the setup.js, and the Google Sheet database work together to generate screens, forms, validation, saving, views, and audit logs.

The scenario selected is:
HR Officer logs in → Views Employees → Adds New Employee → System Saves Data → Views Updated Table

--------------------------------------------------------------------

6.1 USER LOGS IN

--------------------------------------------------------------------

STEP 1 — User Action:
User opens system URL → sees Login.html.

STEP 2 — User Input:

Username: mkhoraiby  
Password: 210388


STEP 3 — Backend Logic:

Code.js receives credentials.

System searches in:
SYS_Users → [USR_Name, Password_Hash, USR_Is_Active]

If match found → validate:

Is password hash correct?

Is user active?

Is role assigned?

If all good → generate Session Token.

Write row into SYS_Sessions.

Return: BOOTSTRAP_OBJECT.

BOOTSTRAP_OBJECT includes:

Allowed ENG_Forms

Allowed ENG_Views

Allowed ENG_Buttons

Allowed ENG_Dropdowns

User role & permissions

Arabic labels for UI building

STEP 4 — Frontend:
UI builds automatically → Dashboard loads in Arabic.

--------------------------------------------------------------------

6.2 USER NAVIGATES TO: HR → Employees

--------------------------------------------------------------------

STEP 1 — User Action:
Clicks:

الموارد البشرية → الموظفين


STEP 2 — UI Logic:
SPA framework checks ENG_Views for:

VIEW_ID: HRM_EMP_LIST
Source_Sheet: HRM_Employees
Source_Columns: [EMP_ID, EMP_Name_AR, Job_Title, DEPT_Name, EMP_Status]


STEP 3 — Backend Data Pull:
System reads sheet:

HRM_Employees!A2:Z (Arabic row + data rows)

STEP 4 — Display:
UI builds a dynamic grid using the Arabic names from row 2 only.

Example:

┌────────┬──────────────┬───────────┬───────────┬────────────┐
│ كود الموظف │ اسم الموظف │ الوظيفة │ القسم │ الحالة │
├────────┼──────────────┼───────────┼───────────┼────────────┤
│  101   │ محمد سالم    │ مهندس    │ الجودة  │ نشط     │
│  102   │ علي شعبان    │ محاسب    │ المالية │ نشط     │
└────────┴──────────────┴───────────┴───────────┴────────────┘


--------------------------------------------------------------------

6.3 USER CLICKS: “إضافة موظف جديد”

--------------------------------------------------------------------

The "Add Employee" button is defined in:

ENG_Buttons → BTN_ID: HRM_EMP_ADD

The form structure is defined in:

ENG_Forms → FORM_ID: HRM_EMP_ADD_FORM

The popup loads automatically.

FORM TABS:

[ بيانات أساسية ]   [ الوظيفة ]   [ التواصل ]


FIELDS retrieved dynamically from ENG_Forms:
Example row from ENG_Forms:

FORM_ID: HRM_EMP_ADD_FORM
TAB_ID: HRM_EMP_TAB_BASIC
Field_ID: EMP_Name_AR
Field_Label: اسم الموظف
Field_Type: text
Is_Mandatory: TRUE
Target_Sheet: HRM_Employees
Target_Column: EMP_Name_AR


UI builds exactly as defined.

--------------------------------------------------------------------

6.4 USER FILLS THE FORM

--------------------------------------------------------------------

User enters:

اسم الموظف: كريم إبراهيم
الوظيفة: مهندس موقع
القسم: المشاريع
البريد الإلكتروني: karim@company.com
الموبايل: 01002003004
تاريخ التعيين: 2024-12-01
الراتب الأساسي: 15000


--------------------------------------------------------------------

6.5 USER CLICKS: حفظ

--------------------------------------------------------------------

Backend Logic Runs:

Read all fields from form.

Validate ENG_Forms rules:

Mandatory fields

Field types

Dropdown validity

Generate next ID:
Read last value from HRM_Employees!EMP_ID, e.g. 102 → 103.

Append row to HRM_Employees:

EMP_ID: 103
EMP_Name_EN: Karim Ibrahim
EMP_Name_AR: كريم إبراهيم
Job_Title: مهندس موقع
DEPT_Name: المشاريع
EMP_Email: karim@company.com
EMP_Mob_Main: 01002003004
Hire_Date: 2024-12-01
Basic_Salary: 15000
...
Crt_At: NOW()
Crt_By: mkhoraiby


Write audit log entry in SYS_Audit_Log:

AUD_ID: auto
USR_ID: mkhoraiby
USR_Action: ADD
ACT_Details: Added new employee (EMP_ID = 103)
AUD_Entity: HRM_Employees
AUD_Entity_ID: 103
Time_Stamp: NOW()


Return status: {"status":"success","msg":"Employee saved"}

Frontend shows toast:

✔ تم حفظ الموظف بنجاح


--------------------------------------------------------------------

6.6 UI AUTO-REFRESHES EMPLOYEE TABLE

--------------------------------------------------------------------

Frontend re-requests the view:

ENG_Views → VIEW_ID: HRM_EMP_LIST

System reads HRM_Employees!A2:Z again.

Updated list now shows:

│ 103 │ كريم إبراهيم │ مهندس موقع │ المشاريع │ نشط │


--------------------------------------------------------------------

6.7 USER CLICKS ON THE EMPLOYEE (VIEW DETAILS)

--------------------------------------------------------------------

Popup generated via:

ENG_Forms → FORM_ID: HRM_EMP_VIEW_FORM

Fields such as department, salary, job title appear as read-only.

If the user’s role allows editing, "تعديل" button (BTN_ID: HRM_EMP_EDIT) appears.

--------------------------------------------------------------------

6.8 USER UPDATES EMPLOYEE (EDIT)

--------------------------------------------------------------------

Example update:

Basic Salary: 15000 → 17000

Backend Logic:

Check permission via SYS_Role_Permissions.

Update the same row in HRM_Employees.

Log into SYS_Audit_Log:

Action: UPDATE  
Entity: HRM_Employees  
Entity_ID: 103  
Details: Updated salary from 15000 to 17000  


--------------------------------------------------------------------

6.9 SESSION END

--------------------------------------------------------------------

When user logs out:

Update SYS_Sessions → SESS_End_At

Revoke token

Clear browser storage

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
END OF WALK-THROUGH EXAMPLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

============================================================
7.0 DATABASE INTERACTION LAYER
============================================================

To ensure 100% database integrity and eliminate all manual errors, developers (including the system owner) **DO NOT** interact with the Google Sheet database directly.

All interactions are programmatic and controlled by three files:

- **Setup.js**: The single source of truth for the database **schema**. This file contains an `ERP_SCHEMA` object that defines every sheet and every header. Running this file builds, validates, and updates the entire sheet structure.

- **Seed_Data.js**: The single source of truth for database **initial data**. This file contains functions to populate the `ENG_` sheets (like `ENG_Dropdowns`) with their required initial values.

- **Seed_Functions.js**: The single source of truth for all **cell formulas**. This file is used to programmatically insert Google Sheet formulas (e.g., `ARRAYFORMULA`) into the "View" columns to link them to their "Engine" counterparts.

============================================================
8.0 ERP SCHEMA
============================================================

>ENG_Forms<  [FORM_ID, Form_Label, Tab_ID, Tab_Label, Field_ID, Field_Label, Field_Type, Source_Sheet, Source_Columns, Is_Mandatory, Default_Value, DD_ID, Target_Sheet, Target_Column, ROL_ID, Is_Visible, But_ID]
:-------------------------------------------------------------------------:
>ENG_Views<  [VIEW_ID, View_Title, Source_Sheet, Source_Columns]
:-------------------------------------------------------------------------:
>ENG_Buttons<  [BTN_ID, BTN_Label, BTN_Type, BTN_Description]
:-------------------------------------------------------------------------:
>ENG_Dropdowns<  [DD_ID, DD_EN, DD_AR, DD_Is_Active, DD_Sort_Order]
:-------------------------------------------------------------------------:
>ENG_Settings<  [Setting_Key, Setting_Value, Description_EN, Updated_By, Updated_At]
:-------------------------------------------------------------------------:
>SYS_Dashboard<  [SYS_Dash_ID, SYS_Metric_Code, SYS_Metric_Value, SYS_Dash_Date, SYS_Dash_Notes]
:-------------------------------------------------------------------------:
>SYS_Documents<  [DOC_ID, DOC_Entity, DOC_Entity_ID, DOC_File_Name, DOC_Label, DOC_Drive_File_ID, DOC_Drive_URL, DOC_Upload_By, DOC_Crt_At]
:-------------------------------------------------------------------------:
>SYS_Users<  [USR_ID, EMP_Name_EN, USR_Name, EMP_Email, Job_Title, DEPT_Name, ROL_ID, USR_Is_Active, Password_Hash, Last_Login, USR_Crt_At, USR_Crt_By, USR_Upd_At, USR_Upd_By]
:-------------------------------------------------------------------------:
>SYS_Roles<  [ROL_ID, ROL_Title, ROL_Notes, ROL_Is_System, ROL_Crt_At, ROL_Crt_By, ROL_Upd_At, ROL_Upd_By]
:-------------------------------------------------------------------------:
>SYS_Permissions<  [PRM_ID, PRM_Name, PRM_Notes, PRM_Catg, PRM_Crt_At, PRM_Crt_By, PRM_Upd_At, PRM_Upd_By]
:-------------------------------------------------------------------------:
>SYS_Role_Permissions<  [ROL_ID, PRM_ID, SRP_Scope, SRP_Is_Allowed, SRP_Constraints, SRP_Crt_At, SRP_Crt_By, SRP_Upd_At, SRP_Upd_By]
:-------------------------------------------------------------------------:
>SYS_Audit_Log<  [AUD_ID, AUD_Time_Stamp, USR_ID, USR_Name, USR_Action, ACT_Details, AUD_Entity, AUD_Entity_ID, AUD_Scope, AUD_Sheet_ID, AUD_Sheet_Name, IP_Address]
:-------------------------------------------------------------------------:
>SYS_Sessions<  [SESS_ID, USR_ID, EMP_Email, Actor_USR_ID, SESS_Type, SESS_Status, USR_Device, IP_Address, Auth_Token, SESS_Start_At, SESS_End_At, SESS_Crt_At, SESS_Crt_By, SESS_Last_Seen, SESS_Revoked_At, SESS_Revoked_By, SESS_Metadata]
:-------------------------------------------------------------------------:
>SYS_PubHolidays<  [PUBHOL_ID, Pub_Holiday_Date, Pub_Holiday_Name]
:-------------------------------------------------------------------------:
>SYS_Analysis<  [SYS_ANA_ID, SYS_ANA_Date, SYS_ANA_Start, SYS_ANA_End, SYS_ANA_Item1, SYS_ANA_Item2, SYS_ANA_Item3, SYS_ANA_Item4, SYS_ANA_Item5, SYS_ANA_Item6, SYS_ANA_Item7, SYS_ANA_Item8, SYS_ANA_Item9]
:-------------------------------------------------------------------------:
>HRM_Dashboard<  [HR_Dash_ID, HR_Metric_Code, HR_Metric_Value, HR_Dash_Date, HR_Dash_Notes]
:-------------------------------------------------------------------------:
>HRM_Departments<  [DEPT_ID, DEPT_Name, DEPT_Is_Active, DEPT_Sort_Order, DEPT_Crt_At, DEPT_Crt_By, DEPT_Upd_At, DEPT_Upd_By]
:-------------------------------------------------------------------------:
>HRM_Employees<  [EMP_ID, EMP_Name_EN, EMP_Name_AR, Date_of_Birth, Gender, National_ID, Marital_Status, Military_Status, EMP_Mob_Main, EMP_Mob_Sub, Home_Address, EMP_Email, Emrgcy_Cont, EmrCont_Relation, EmrCont__Mob, Job_Title, DEPT_Name, Hire_Date, EMP_CONT_Type, EMP_Status, Basic_Salary, Allowances, Deducts, EMP_Crt_At, EMP_Crt_By]
:-------------------------------------------------------------------------:
>HRM_Attendance<  [ATT_ID, EMP_ID, ATT_Date, ATT_Check_In, ATT_Check_Out, ATT_Hours, ATT_Late_Mints, ATT_EarlyLV_Mints, ATT_OT_Mints, ATT_Notes, ATT_Status, ATT_Crt_At, ATT_Crt_By, ATT_Upd_At, ATT_Upd_By]
:-------------------------------------------------------------------------:
>HRM_Leave<  [LV_ID, EMP_ID, LV_Type, LV_Start_Date, LV_End_Date, LV_NumDays, LV_Status, LV_Reason, LV_Approved_By, LV_Notes, LV_Crt_At, LV_Crt_By, LV_Upd_At, LV_Upd_By]
:-------------------------------------------------------------------------:
>HRM_Advances<  [ADV_ID, EMP_ID, ADV_Issue_Date, ADV_Amnt, ADV_Setlmnt_Period, ADV_Instal, ADV_Notes, ADV_Status, ADV_Crt_At, ADV_Crt_By, ADV_Upd_At, ADV_Upd_By]
:-------------------------------------------------------------------------:
>HRM_OverTime<  [OT_ID, EMP_ID, POL_OT_ID, ATT_Date, ATT_OT_Mints, OT_Amnt, OT_Crt_At, OT_Crt_By, OT_Upd_At, OT_Upd_By]
:-------------------------------------------------------------------------:
>HRM_Deductions<  [DEDCT_ID, PEN_ID, PEN_Name, EMP_ID, DEDCT_Date, DEDCT_Amnt, DEDCT_Crt_At, DEDCT_Crt_By, DEDCT_Upd_At, DEDCT_Upd_By]
:-------------------------------------------------------------------------:
>HRM_Analysis<  [HR_ANA_ID, HR_ANA_Date, HR_ANA_Start, HR_ANA_End, HR_ANA_Item1, HR_ANA_Item2, HR_ANA_Item3, HR_ANA_Item4, HR_ANA_Item5, HR_ANA_Item6, HR_ANA_Item7, HR_ANA_Item8, HR_ANA_Item9]
:-------------------------------------------------------------------------:
>PRJ_Dashboard<  [PRJ_Dash_ID, PRJ_Metric_Code, PRJ_Metric_Value, PRJ_Dash_Date, PRJ_Dash_Notes]
:-------------------------------------------------------------------------:
>PRJ_Main<  [PRJ_ID, PRJ_Name, CLI_ID, CLI_Name, PRJ_Status, PRJ_Type, PRJ_Budget, Plan_Num_Days, Plan_Start_Date, PRJ_Location, ADV_Crt_At, ADV_Crt_By, ADV_Upd_At, ADV_Upd_By]
:-------------------------------------------------------------------------:
>PRJ_Clients<  [CLI_ID, CLI_Name, CLI_Mob_1, CLI_Mob_2, CLI_Email, ADV_Crt_At, ADV_Crt_By, ADV_Upd_At, ADV_Upd_By]
:-------------------------------------------------------------------------:
>PRJ_Tasks<  [TSK_ID, PRJ_ID, TSK_Name, TSK_Priority, EMP_ID, TSK_Plan_Start, TSK_Plan_End, TSK_Start, TSK_End, TSK_Status, ADV_Crt_At, ADV_Crt_By, ADV_Upd_At, ADV_Upd_By]
:-------------------------------------------------------------------------:
>PRJ_Material<  [MAT_ID, MAT_Name, MAT_Catg, MAT_Sub1, MAT_Sub2, Default_Unit, Default_Price, MAT_Active, ADV_Crt_At, ADV_Crt_By, ADV_Upd_At, ADV_Upd_By]
:-------------------------------------------------------------------------:
>PRJ_IndirExp_Time_Alloc<  [ALO_TM_ID, InDiEXP_TM_ID, PRJ_ID, ALO_TM_Methd, ALO_TM_Percnt, ALO_TM_Amnt, ADV_Crt_At, ADV_Crt_By, ADV_Upd_At, ADV_Upd_By]
:-------------------------------------------------------------------------:
>PRJ_IndirExp_NoTime_Alloc<  [ALO_NT_ID, InDiEXP_NT_ID, PRJ_ID, ALO_NT_Methd, ALO_NT_Percnt, ALO_NT_Amnt, ADV_Crt_At, ADV_Crt_By, ADV_Upd_At, ADV_Upd_By]
:-------------------------------------------------------------------------:
>PRJ_Plan_vs_Actual<  [PvA_ID, PRJ_ID, PRJ_Name, Plan_Start_Date, Actual_Start_Date, Plan_Num_Days, Actual_Num_Days, Plan_End_Date, Actual_End_Date, Plan_Direct_Exp, Actual_Direct_Exp, Plan_MATs, Actual_MATs, ADV_Crt_At, ADV_Crt_By, ADV_Upd_At, ADV_Upd_By]
:-------------------------------------------------------------------------:
>PRJ_Analysis<  [PRJ_ANA_ID, PRJ_ANA_Date, PRJ_ANA_Start, PRJ_ANA_End, PRJ_ANA_Item1, PRJ_ANA_Item2, PRJ_ANA_Item3, PRJ_ANA_Item4, PRJ_ANA_Item5, PRJ_ANA_Item6, PRJ_ANA_Item7, PRJ_ANA_Item8, PRJ_ANA_Item9]
:-------------------------------------------------------------------------:
>FIN_Dashboard<  [FIN_Dash_ID, FIN_Metric_Code, FIN_Metric_Value, FIN_Dash_Date, FIN_Dash_Notes]
:-------------------------------------------------------------------------:
>FIN_DirectExpenses<  [DiEXP_ID, PRJ_ID, PRJ_Name, DiEXP_Date, MAT_ID, MAT_Name, MAT_Catg, MAT_Sub1, MAT_Sub2, Default_Unit, Default_Price, MAT_Quantity, DiEXP_Total_VAT_Exc, DiEXP_Total_VAT_Inc, DiEXP_Pay_Status, DiEXP_Pay_Methd, DiEXP_Notes, ADV_Crt_At, ADV_Crt_By, ADV_Upd_At, ADV_Upd_By]
:-------------------------------------------------------------------------:
>FIN_InDirectExpenses_Time<  [InDiEXP_TM_ID, InDiEXP_TM_Catg, InDiEXP_TM_Sub1, InDiEXP_TM_Sub2, InDiEXP_Start, InDiEXP_End, InDiEXP_TM_Pay_Status, InDiEXP_TM_Pay_Methd, InDiEXP_TM_Notes, ADV_Crt_At, ADV_Crt_By, ADV_Upd_At, ADV_Upd_By]
:-------------------------------------------------------------------------:
>FIN_InDirectExpenses_NoTime<  [InDiEXP_NT_ID, InDiEXP_NT_Catg, InDiEXP_NT_Sub1, InDiEXP_NT_Sub2, Useful_Life_Months, Depreciation_Start_Date, InDiEXP_NT_Pay_Status, InDiEXP_NT_Pay_Methd, InDiEXP_NT_Notes, ADV_Crt_At, ADV_Crt_By, ADV_Upd_At, ADV_Upd_By]
:-------------------------------------------------------------------------:
>FIN_PRJ_Revenue<  [REV_ID, PRJ_ID, REV_Date, REV_Amnt, REV_Type, REV_Source, REV_Notes, REV_Pay_Methd, REV_Invoice_Number, REV_Pay_Status, REV_Total, REV_Remain, ADV_Crt_At, ADV_Crt_By, ADV_Upd_At, ADV_Upd_By]
:-------------------------------------------------------------------------:
>FIN_Custody<  [CSTD_ID, EMP_ID, EMP_Name, PRJ_ID, PRJ_Name, CSTD_Issue_Date, CSTD_Settl_Date, CSTD_Amnt, CSTD_Purpose, CSTD_Status, CSTD_Notes, ADV_Crt_At, ADV_Crt_By, ADV_Upd_At, ADV_Upd_By]
:-------------------------------------------------------------------------:
>FIN_HRM_Payroll<  [PAY_ID, EMP_ID, EMP_Name, PAY_Start_Date, PAY_End_Date, Basic_Salary, Total_OT_Amnt, ADV_Instal, Total_DEDCT_Amnt, PAY_Net_Pay, PAY_Status, ADV_Crt_At, ADV_Crt_By, ADV_Upd_At, ADV_Upd_By]
:-------------------------------------------------------------------------:
>FIN_P&L_Statements<  [P&L_ID, Rev_ID, DiEXP_ID, InDiEXP_TM_ID, InDiEXP_NT_ID, REV_Total, Total_DiEXP, Total_InDiEXP_TM, Total_InDiEXP_NT, P&L_Start_Date, P&L_End_Date, P&L_Amnt, ADV_Crt_At, ADV_Crt_By, ADV_Upd_At, ADV_Upd_By]
:-------------------------------------------------------------------------:
>FIN_Analysis<  [FIN_ANA_ID, FIN_ANA_Date, FIN_ANA_Start, FIN_ANA_End, FIN_ANA_Item1, FIN_ANA_Item2, FIN_ANA_Item3, FIN_ANA_Item4, FIN_ANA_Item5, FIN_ANA_Item6, FIN_ANA_Item7, FIN_ANA_Item8, FIN_ANA_Item9]
:-------------------------------------------------------------------------:

============================================================
9.0 SYS ENGINE HEADERS EXPLENATION
============================================================

--------------------------------------------------------------------
# 9.1 ENG_Forms
--------------------------------------------------------------------

| Form_ID | => ( Unique identifier for each popup form in the system weather for data entry ( IDs assosiated with Add ) or for viewing the details of any entry ( IDs assosiated with View) )
| Form_Label | => ( The Arabic title (Header) that will be displayed in the popup form at the top. )
| Tab_ID | => ( Unique identifier for each tab within a form. )
| Tab_Label | => ( The Arabic label that will be displayed on each Tab in the form. )
| Field_ID | => ( Unique identifier for each field (input or display element) on a form. )
| Field_Label | => ( The Arabic label that will be displayed above each field in the form. )
| Field_Type | => ( The type of field (e.g., text, number, dropdown, date). )
| Field_Can_Edit | => ( Defines weather a certain field can change from Read Only state to Read/Write state when the user clicks on Edit when viewing the details in a View Forms or for the auto populated data in the Add Forms. )
| Source_Sheet | => ( The name of the data source (sheet/table) from which the field pulls its data for the View forms or the Add forms that contain fields that are auto populated from other data sheets. )
| Source_Columns | => ( The specific columns in the source sheet that are referenced or displayed. )
| Is_Mandatory | => ( Indicates whether the field is required (must be filled in). )
| Default_Value | => ( The fainted text inside each field that acts as guidence for the user on what kind of data should he input in each field. It will be in arabic and whenever the user starts typing, the fainted text should disapere completely. )
| DD_ID | => ( Identifier for the dropdown list (if the field uses a dropdown).  )
| Target_Sheet | => ( The sheet/table where the field’s data will be saved or updated. )
| Target_Column | => ( The specific column in the target sheet where the field’s value is stored. )
| ROL_ID | => ( Identifier for the user role that can access or edit the field/tab. )
| Is_Visible | => ( Indicates whether the field/tab is visible to users. )

--------------------------------------------------------------------
# 9.2 ENG_Views
--------------------------------------------------------------------

| View_ID | => ( Unique identifier for view of the complete list of data in each sub module page. (custom display or filter of data). )
| View_Title | => ( The Arabic title (Header) that will be displayed in the Sub-module page at the top. )
| Source_Sheet | => ( The name of the data source (sheet/table) from which the field pulls its data and display the full list of data for the related submodule, where dispaying the data will start from the second row (Arabic headers) then display all available data for the defined columns in the Source_Columns column. )
| Source_Columns | => ( The specific columns in the source sheet that are referenced to be displayed in the list. )

--------------------------------------------------------------------
# 9.3 ENG_Buttons
--------------------------------------------------------------------

| But_ID | => ( Identifier for an action button associated with the form/tab/field. )
| But_Label | => ( The Arabic label or caption shown on a button. )
| But_Type | => ( The type of button (e.g., Save, Edit, Delete, Toggle Switch). )
| But_Description | => ( A description of the button’s function or purpose. )

--------------------------------------------------------------------
# 9.4 ENG_Dropdowns
--------------------------------------------------------------------

| DD_ID | => ( Unique identifier for the dropdown list. )
| DD_EN | => ( The English title or name of the dropdown list. )
| DD_AR | => ( The Arabic title or name of the dropdown list. )
| DD_Is_Active | => ( Indicates whether the dropdown list is active (can be used in forms). )
| DD_Sort_Order | => ( The order in which the dropdown list appears or is sorted. )
