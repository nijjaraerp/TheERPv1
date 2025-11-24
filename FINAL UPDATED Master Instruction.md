# Master Instruction Set for ERP Blueprint Creation (Google Apps Script + HTML + Google Sheets)

> **Directive for AI Agent:**  
> - Treat this as a **completely new ERP project implementation from ground zero**.  
> - Existing repository files (`Setup.js`, `Seed_Data.js`, etc.) are **only references** for schema, logic, and workflow.  
> - The final document must be **100% independent**, containing all necessary details to build the ERP system from scratch to full completion.  
> - All not-yet-implemented modules, script files, and HTML templates must be included.  
> - All functions required must be defined, including those in existing files and those not yet created.  
> - Any mention of “AI integration” refers only to **AI Agents assisting in implementation inside coding environments (VS Code, TARE, etc.)**. No AI is part of the ERP system itself.  
> - **Every section must document both implemented parts and modules, and also the parts that are still not yet done.**  
> - **Technology stack is restricted to Google Apps Script + HTML/CSS/JS, with Google Sheets (multi‑tab) as the database.**

---

## Sections to Include in the Final Document

1. **Revision Metadata**  
   - Author, date, version, status.  
   - Version history and changelog.

2. **Theme Specification**  
   - Dark animated 3D elegant theme.  
   - Colour palette with hex codes.  
   - Animation details (duration, easing, triggers).  
   - 3D element requirements (depth, shadows, perspective).  
   - Responsive design considerations.  
   - Cover both current theme assets and planned future enhancements.

3. **System Architecture Overview**  
   - ASCII diagram showing Google Apps Script backend, HTML/CSS/JS frontend, and Google Sheets tabs as database.  
   - Planned modules and their relationships.  
   - Technology stack: Apps Script services (SpreadsheetApp, HtmlService, PropertiesService).  
   - Infrastructure: Google Drive hosting, Google Sheets storage, Apps Script execution environment.  
   - Must include both implemented architecture and planned modules not yet built.

4. **System Walkthrough**  
   - Step-by-step ASCII flow diagrams for:  
     - Data flow (Apps Script ↔ Google Sheets ↔ HTML UI).  
     - Authentication process (custom login via Sheets tab).  
     - Permission hierarchy (role-based access stored in Sheets).  
   - Concrete examples for each flow.  
   - **Walkthrough must cover both implemented parts and modules/parts not yet done.**

5. **ERP Schema Documentation**  
   - Schema defined as Google Sheets tabs.  
   - Each tab = table (Users, Roles, Permissions, Organizations, Items, Inventory, Orders, Ledger, AuditLogs).  
   - Fields = columns; constraints enforced via Apps Script validation.  
   - Primary/foreign keys simulated via IDs in columns.  
   - Optimisation strategies: indexes simulated with lookup tables or cached PropertiesService.  
   - ASCII relation diagram.  
   - **Include schema for both existing tabs and those required for future modules.**

6. **Implementation Roadmap**  
   - Phased development plan with milestones.  
   - Dependencies between modules.  
   - Priority sequencing.  
   - **Roadmap must cover both completed phases and future phases not yet implemented.**

7. **Module Specifications**  
   - Detailed specs for each module/submodule: Purchasing, Sales, Inventory, Finance, Reporting.  
   - Required functions/methods (current and future).  
   - Interface definitions (Apps Script functions exposed to HTML via `google.script.run`).  
   - Data models and schemas (Sheets tabs).  
   - **Document both implemented modules and those not yet done.**

8. **File Inventory & Structure Blueprint**  
   - Catalogue all Apps Script `.js` files and HTML templates.  
   - Directory hierarchy inside Apps Script project.  
   - Dependencies: built‑in Google services only.  
   - HTML templates and UI components.  
   - Configuration files: PropertiesService for environment variables.  
   - **Include both existing files and those not yet created.**

9. **System Logic**  
   - Hybrid architecture: dynamic HTML forms bound to Apps Script functions; static layout in HTML.  
   - Two-language implementation: backend code in English, frontend UI in Arabic (Cairo font, RTL).  
   - Data binding and translation via JSON bundles stored in Sheets or PropertiesService.  
   - **Explain logic for both implemented and planned components.**

10. **Function Reference**  
    - Group functions by `.js` file/module/helper/utility.  
    - Document purpose, parameters, return values, dependencies, side effects.  
    - Example usage scenarios.  
    - **Include functions from both implemented files and those not yet created.**

11. **Dynamic Engine Architecture**  
    - Communication: `google.script.run` calls from HTML to Apps Script.  
    - Message formats: JSON request/response.  
    - Error handling: try/catch in Apps Script, error envelopes returned to UI.  
    - API contracts: Apps Script functions exposed to frontend.  
    - Data validation rules: enforced in Apps Script before writing to Sheets.  
    - Synchronisation: Sheets tabs act as source of truth; caches optional.  
    - **Cover both current interfaces and those required for future modules.**

12. **AI Implementation Rules (for coding environments only)**  
    - No fallback without explicit confirmation.  
    - Core-level bug resolution mandate.  
    - Validation and confirmation workflows.  
    - Error escalation protocols.  
    - Clarify: AI is **not integrated into ERP system**, only assists in implementation.

13. **Debugging System & Guide**  
    - Google Sheet integration (multi‑tab logging).  
    - Tabs: Logs_Raw, Errors, Metrics, Alerts.  
    - Logging functions in Apps Script (`logInfo`, `logError`, etc.).  
    - Monitoring thresholds defined in Sheets.  
    - Common error scenarios and solutions.  
    - Troubleshooting procedures.  
    - **Document debugging for both current modules and those not yet implemented.**

14. **Implementation Guidelines**  
    - Step-by-step development instructions using Apps Script + HTML.  
    - Coding standards: camelCase, JSDoc, modular `.js` files.  
    - Testing methodology: manual + Apps Script QUnit style tests.  
    - Deployment: publish as Web App, versioning via Apps Script IDE.  
    - **Guidelines must apply to both implemented and future modules.**

15. **Maintenance Plan**  
    - Version control: Apps Script project versions.  
    - Update procedures: migration scripts for Sheets tabs.  
    - Scaling: optimize Sheets formulas, caching, batch writes.  
    - Backup/recovery: export Sheets to Drive daily.  
    - **Plan must cover both current maintenance and future scaling needs.**

16. **Appendix**  
    - Consolidate markdown/text notes.  
    - ASCII art borders between sections.  
    - Visual diagrams for complex concepts.  
    - Version history and changelog.  
    - **Appendix must include references for both implemented and not-yet-implemented parts.**

---
============================================================
16.0 FULL FINAL ERP SCHEMA
============================================================
-------------------------------------------------------------------------------
# 16.1 Tabs that DO NOT require 2nd row Arabic headers:
-------------------------------------------------------------------------------
>DBUG_AppLog<  [DBG_ID, Time_Stamp, Actor, Action, Entity, Entity_ID, Details]
:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:...
>DBUG_WarnLog<  [DBG_WARN_ID, Time_Stamp, Actor, Action, Entity, Entity_ID, Details]
:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:...
>DBUG_ErrorLog<  [DBG_ERR_ID, Time_Stamp, Actor, Action, Entity, Entity_ID, Message, Error_Object]
:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:...
>ENG_Forms<  [FORM_ID, Form_Label, Tab_ID, Tab_Label, Field_ID, Field_Label, Field_Type, Source_Sheet, Source_Columns, Is_Mandatory, Default_Value, DD_ID, Target_Sheet, Target_Column, ROL_ID, Is_Visible, But_ID]
:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:...
>ENG_Views<  [VIEW_ID, View_Title, Source_Sheet, Source_Columns]
:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:...
>ENG_Buttons<  [BTN_ID, BTN_Label, BTN_Type, BTN_Description]
:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:...
>ENG_Dropdowns<  [DD_ID, DD_EN, DD_AR, DD_Is_Active, DD_Sort_Order]
:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:...
>ENG_Settings<  [Setting_Key, Setting_Value, Description_EN, Updated_By, Updated_At]
:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:...

--------------------------------------------------------------------
# 16.2 Tabs that Require 2nd row Arabic headers:
--------------------------------------------------------------------
>SYS_Dashboard<  [SYS_Dash_ID, SYS_Metric_Code, SYS_Metric_Value, SYS_Dash_Date, SYS_Dash_Notes]
:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:...
>SYS_Documents<  [DOC_ID, DOC_Entity, DOC_Entity_ID, DOC_File_Name, DOC_Label, DOC_Drive_File_ID, DOC_Drive_URL, DOC_Upload_By, DOC_Crt_At]
:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:...
>SYS_Users<  [USR_ID, EMP_Name_EN, USR_Name, EMP_Email, Job_Title, DEPT_Name, ROL_ID, USR_Is_Active, Password_Hash, Last_Login, USR_Crt_At, USR_Crt_By, USR_Upd_At, USR_Upd_By]
:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:...
>SYS_Roles<  [ROL_ID, ROL_Title, ROL_Notes, ROL_Is_System, ROL_Crt_At, ROL_Crt_By, ROL_Upd_At, ROL_Upd_By]
:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:...
>SYS_Permissions<  [PRM_ID, PRM_Name, PRM_Notes, PRM_Catg, PRM_Crt_At, PRM_Crt_By, PRM_Upd_At, PRM_Upd_By]
:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:...
>SYS_Role_Permissions<  [ROL_ID, PRM_ID, SRP_Scope, SRP_Is_Allowed, SRP_Constraints, SRP_Crt_At, SRP_Crt_By, SRP_Upd_At, SRP_Upd_By]
:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:...
>SYS_Audit_Log<  [AUD_ID, AUD_Time_Stamp, USR_ID, USR_Name, USR_Action, ACT_Details, AUD_Entity, AUD_Entity_ID, AUD_Scope, AUD_Sheet_ID, AUD_Sheet_Name, IP_Address]
:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:...
>SYS_Sessions<  [SESS_ID, USR_ID, EMP_Email, Actor_USR_ID, SESS_Type, SESS_Status, USR_Device, IP_Address, Auth_Token, SESS_Start_At, SESS_End_At, SESS_Crt_At, SESS_Crt_By, SESS_Last_Seen, SESS_Revoked_At, SESS_Revoked_By, SESS_Metadata]
:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:...
>SYS_PubHolidays<  [PUBHOL_ID, Pub_Holiday_Date, Pub_Holiday_Name]
:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:...
>SYS_Analysis<  [SYS_ANA_ID, SYS_ANA_Date, SYS_ANA_Start, SYS_ANA_End, SYS_ANA_Item1, SYS_ANA_Item2, SYS_ANA_Item3, SYS_ANA_Item4, SYS_ANA_Item5, SYS_ANA_Item6, SYS_ANA_Item7, SYS_ANA_Item8, SYS_ANA_Item9]
:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:...
>HRM_Dashboard<  [HR_Dash_ID, HR_Metric_Code, HR_Metric_Value, HR_Dash_Date, HR_Dash_Notes]
:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:...
>HRM_Departments<  [DEPT_ID, DEPT_Name, DEPT_Is_Active, DEPT_Sort_Order, DEPT_Crt_At, DEPT_Crt_By, DEPT_Upd_At, DEPT_Upd_By]
:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:...
>HRM_Employees<  [EMP_ID, EMP_Name_EN, EMP_Name_AR, Date_of_Birth, Gender, National_ID, Marital_Status, Military_Status, EMP_Mob_Main, EMP_Mob_Sub, Home_Address, EMP_Email, Emrgcy_Cont, EmrCont_Relation, EmrCont__Mob, Job_Title, DEPT_Name, Hire_Date, EMP_CONT_Type, EMP_Status, Basic_Salary, Allowances, Deducts, EMP_Crt_At, EMP_Crt_By]
:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:...
>HRM_Attendance<  [ATT_ID, EMP_ID, ATT_Date, ATT_Check_In, ATT_Check_Out, ATT_Hours, ATT_Late_Mints, ATT_EarlyLV_Mints, ATT_OT_Mints, ATT_Notes, ATT_Status, ATT_Crt_At, ATT_Crt_By, ATT_Upd_At, ATT_Upd_By]
:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:...
>HRM_Leave<  [LV_ID, EMP_ID, LV_Type, LV_Start_Date, LV_End_Date, LV_NumDays, LV_Status, LV_Reason, LV_Approved_By, LV_Notes, LV_Crt_At, LV_Crt_By, LV_Upd_At, LV_Upd_By]
:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:...
>HRM_Advances<  [ADV_ID, EMP_ID, ADV_Issue_Date, ADV_Amnt, ADV_Setlmnt_Period, ADV_Instal, ADV_Notes, ADV_Status, ADV_Crt_At, ADV_Crt_By, ADV_Upd_At, ADV_Upd_By]
:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:...
>HRM_OverTime<  [OT_ID, EMP_ID, POL_OT_ID, ATT_Date, ATT_OT_Mints, OT_Amnt, OT_Crt_At, OT_Crt_By, OT_Upd_At, OT_Upd_By]
:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:...
>HRM_Deductions<  [DEDCT_ID, PEN_ID, PEN_Name, EMP_ID, DEDCT_Date, DEDCT_Amnt, DEDCT_Crt_At, DEDCT_Crt_By, DEDCT_Upd_At, DEDCT_Upd_By]
:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:...
>HRM_Analysis<  [HR_ANA_ID, HR_ANA_Date, HR_ANA_Start, HR_ANA_End, HR_ANA_Item1, HR_ANA_Item2, HR_ANA_Item3, HR_ANA_Item4, HR_ANA_Item5, HR_ANA_Item6, HR_ANA_Item7, HR_ANA_Item8, HR_ANA_Item9]
:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:...
>PRJ_Dashboard<  [PRJ_Dash_ID, PRJ_Metric_Code, PRJ_Metric_Value, PRJ_Dash_Date, PRJ_Dash_Notes]
:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:...
>PRJ_Main<  [PRJ_ID, PRJ_Name, CLI_ID, CLI_Name, PRJ_Status, PRJ_Type, PRJ_Budget, Plan_Num_Days, Plan_Start_Date, PRJ_Location, ADV_Crt_At, ADV_Crt_By, ADV_Upd_At, ADV_Upd_By]
:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:...
>PRJ_Clients<  [CLI_ID, CLI_Name, CLI_Mob_1, CLI_Mob_2, CLI_Email, ADV_Crt_At, ADV_Crt_By, ADV_Upd_At, ADV_Upd_By]
:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:...
>PRJ_Tasks<  [TSK_ID, PRJ_ID, TSK_Name, TSK_Priority, EMP_ID, TSK_Plan_Start, TSK_Plan_End, TSK_Start, TSK_End, TSK_Status, ADV_Crt_At, ADV_Crt_By, ADV_Upd_At, ADV_Upd_By]
:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:...
>PRJ_Material<  [MAT_ID, MAT_Name, MAT_Catg, MAT_Sub1, MAT_Sub2, Default_Unit, Default_Price, MAT_Active, ADV_Crt_At, ADV_Crt_By, ADV_Upd_At, ADV_Upd_By]
:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:...
>PRJ_IndirExp_Time_Alloc<  [ALO_TM_ID, InDiEXP_TM_ID, PRJ_ID, ALO_TM_Methd, ALO_TM_Percnt, ALO_TM_Amnt, ADV_Crt_At, ADV_Crt_By, ADV_Upd_At, ADV_Upd_By]
:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:...
>PRJ_IndirExp_NoTime_Alloc<  [ALO_NT_ID, InDiEXP_NT_ID, PRJ_ID, ALO_NT_Methd, ALO_NT_Percnt, ALO_NT_Amnt, ADV_Crt_At, ADV_Crt_By, ADV_Upd_At, ADV_Upd_By]
:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:...
>PRJ_Plan_vs_Actual<  [PvA_ID, PRJ_ID, PRJ_Name, Plan_Start_Date, Actual_Start_Date, Plan_Num_Days, Actual_Num_Days, Plan_End_Date, Actual_End_Date, Plan_Direct_Exp, Actual_Direct_Exp, Plan_MATs, Actual_MATs, ADV_Crt_At, ADV_Crt_By, ADV_Upd_At, ADV_Upd_By]
:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:...
>PRJ_Analysis<  [PRJ_ANA_ID, PRJ_ANA_Date, PRJ_ANA_Start, PRJ_ANA_End, PRJ_ANA_Item1, PRJ_ANA_Item2, PRJ_ANA_Item3, PRJ_ANA_Item4, PRJ_ANA_Item5, PRJ_ANA_Item6, PRJ_ANA_Item7, PRJ_ANA_Item8, PRJ_ANA_Item9]
:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:...
>FIN_Dashboard<  [FIN_Dash_ID, FIN_Metric_Code, FIN_Metric_Value, FIN_Dash_Date, FIN_Dash_Notes]
:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:...
>FIN_DirectExpenses<  [DiEXP_ID, PRJ_ID, PRJ_Name, DiEXP_Date, MAT_ID, MAT_Name, MAT_Catg, MAT_Sub1, MAT_Sub2, Default_Unit, Default_Price, MAT_Quantity, DiEXP_Total_VAT_Exc, DiEXP_Total_VAT_Inc, DiEXP_Pay_Status, DiEXP_Pay_Methd, DiEXP_Notes, ADV_Crt_At, ADV_Crt_By, ADV_Upd_At, ADV_Upd_By]
:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:...
>FIN_InDirectExpenses_Time<  [InDiEXP_TM_ID, InDiEXP_TM_Catg, InDiEXP_TM_Sub1, InDiEXP_TM_Sub2, InDiEXP_Start, InDiEXP_End, InDiEXP_TM_Pay_Status, InDiEXP_TM_Pay_Methd, InDiEXP_TM_Notes, ADV_Crt_At, ADV_Crt_By, ADV_Upd_At, ADV_Upd_By]
:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:...
>FIN_InDirectExpenses_NoTime<  [InDiEXP_NT_ID, InDiEXP_NT_Catg, InDiEXP_NT_Sub1, InDiEXP_NT_Sub2, Useful_Life_Months, Depreciation_Start_Date, InDiEXP_NT_Pay_Status, InDiEXP_NT_Pay_Methd, InDiEXP_NT_Notes, ADV_Crt_At, ADV_Crt_By, ADV_Upd_At, ADV_Upd_By]
:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:...
>FIN_PRJ_Revenue<  [REV_ID, PRJ_ID, REV_Date, REV_Amnt, REV_Type, REV_Source, REV_Notes, REV_Pay_Methd, REV_Invoice_Number, REV_Pay_Status, REV_Total, REV_Remain, ADV_Crt_At, ADV_Crt_By, ADV_Upd_At, ADV_Upd_By]
:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:...
>FIN_Custody<  [CSTD_ID, EMP_ID, EMP_Name, PRJ_ID, PRJ_Name, CSTD_Issue_Date, CSTD_Settl_Date, CSTD_Amnt, CSTD_Purpose, CSTD_Status, CSTD_Notes, ADV_Crt_At, ADV_Crt_By, ADV_Upd_At, ADV_Upd_By]
:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:
>FIN_HRM_Payroll<  [PAY_ID, EMP_ID, EMP_Name, PAY_Start_Date, PAY_End_Date, Basic_Salary, Total_OT_Amnt, ADV_Instal, Total_DEDCT_Amnt, PAY_Net_Pay, PAY_Status, ADV_Crt_At, ADV_Crt_By, ADV_Upd_At, ADV_Upd_By]
:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:...
>FIN_P&L_Statements<  [P&L_ID, Rev_ID, DiEXP_ID, InDiEXP_TM_ID, InDiEXP_NT_ID, REV_Total, Total_DiEXP, Total_InDiEXP_TM, Total_InDiEXP_NT, P&L_Start_Date, P&L_End_Date, P&L_Amnt, ADV_Crt_At, ADV_Crt_By, ADV_Upd_At, ADV_Upd_By]
:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:...
>FIN_Analysis<  [FIN_ANA_ID, FIN_ANA_Date, FIN_ANA_Start, FIN_ANA_End, FIN_ANA_Item1, FIN_ANA_Item2, FIN_ANA_Item3, FIN_ANA_Item4, FIN_ANA_Item5, FIN_ANA_Item6, FIN_ANA_Item7, FIN_ANA_Item8, FIN_ANA_Item9]
:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:....:....:...:....:...

============================================================
17.0 SYS ENGINE HEADERS EXPLENATION
============================================================

--------------------------------------------------------------------
# 17.1 ENG_Forms
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
# 17.2 ENG_Views
--------------------------------------------------------------------

| View_ID | => ( Unique identifier for view of the complete list of data in each sub module page. (custom display or filter of data). )
| View_Title | => ( The Arabic title (Header) that will be displayed in the Sub-module page at the top. )
| Source_Sheet | => ( The name of the data source (sheet/table) from which the field pulls its data and display the full list of data for the related submodule, where dispaying the data will start from the second row (Arabic headers) then display all available data for the defined columns in the Source_Columns column. )
| Source_Columns | => ( The specific columns in the source sheet that are referenced to be displayed in the list. )

--------------------------------------------------------------------
# 17.3 ENG_Buttons
--------------------------------------------------------------------

| But_ID | => ( Identifier for an action button associated with the form/tab/field. )
| But_Label | => ( The Arabic label or caption shown on a button. )
| But_Type | => ( The type of button (e.g., Save, Edit, Delete, Toggle Switch). )
| But_Description | => ( A description of the button’s function or purpose. )

--------------------------------------------------------------------
# 17.4 ENG_Dropdowns
--------------------------------------------------------------------

| DD_ID | => ( Unique identifier for the dropdown list. )
| DD_EN | => ( The English title or name of the dropdown list. )
| DD_AR | => ( The Arabic title or name of the dropdown list. )
| DD_Is_Active | => ( Indicates whether the dropdown list is active (can be used in forms). )
| DD_Sort_Order | => ( The order in which the dropdown list appears or is sorted. )

============================================================
18.0 The 3 DBUG Tabs
============================================================

These tabs serve as the system's internal monitoring and diagnostic center. They are separate from the SYS_Audit_Log (which is for business compliance) and focus on technical system health.

--------------------------------------------------------------------
# 18.1 DBUG_AppLog (Application Log)
--------------------------------------------------------------------

*Purpose: Records successful system events, routine operations, and general information flow. It answers "What happened?" during normal operation.
*Content: Timestamps, User IDs, Actions (e.g., "LOGIN", "FETCH_DATA"), and context details.
*Usage: Used to trace a user's journey through the app or verify that background processes ran successfully.

--------------------------------------------------------------------
# 18.2 DBUG_WarnLog (Warning Log)
--------------------------------------------------------------------

*Purpose: Captures potential issues that didn't crash the system but require attention. It answers "What looks suspicious?"
*Content: Validation failures, unauthorized access attempts (that were blocked), or operations that took longer than expected.
*Usage: Proactive monitoring to prevent future errors. For example, if a user tries to access a restricted form, it might be logged here.

--------------------------------------------------------------------
# 18.3 DBUG_ErrorLog (Error Log)
--------------------------------------------------------------------

*Purpose: Captures critical failures, crashes, and unhandled exceptions. It answers "What broke?"
*Content: Full error stack traces, error messages, the specific line of code that failed, and the input data that caused the crash.
*Usage: The first place to look when a user reports a bug or a "Something went wrong" message.

==> How They Work

----> Trigger: When code executes (e.g., a user clicks "Save"), the backend functions call specific logging helpers.
----> Processing: The system captures the Actor (who did it), Action (what they did), Entity (what data was touched), and a Timestamp.
----> Storage: This data is formatted into a row and appended to the bottom of the respective Google Sheet tab.
----> Persistence: Since they are just Google Sheets, you can filter, sort, and analyze them using standard spreadsheet tools.

## What's Needed in the Code
To make these tabs functional, three main components are required in your files:

$$ Backend Logic (Code.js)
You need the core logging functions that other parts of the system can call.

logInfo_(actor, action, entity, id, details): Writes to DBUG_AppLog.
logWarn_(actor, action, entity, id, details): Writes to DBUG_WarnLog.
logError_(actor, action, entity, id, message, errorObject): Writes to DBUG_ErrorLog.
appendDebugRow(sheetName, dataObj): A helper function that handles the actual writing to the spreadsheet.

$$ Integration Points (Throughout Code.js)
You must sprinkle these log calls throughout your business logic.

Example: Inside a saveEmployee function:

try {
   // ... saving logic ...
   logInfo_(user.id, "SAVE", "EMPLOYEE", empId, "Successfully saved");
} catch (e) {
   logError_(user.id, "SAVE_try {
   // ... saving logic ...
   logInfo_(user.id, "SAVE", "EMPLOYEE", empId, "Successfully saved");
} catch (e) {
   logError_(user.id, "SAVE_
## Formatting Requirements

- Use ASCII-friendly numbering and lists.  
- Clear section headers and consistent formatting.  
- Monospace font for code/technical terms.  
- Concrete examples wherever applicable.  
- Professional documentation standards.  
- Document must be standalone, independent, and complete.  
- **Every section must explicitly cover both implemented and not-yet-implemented parts of the ERP system.**  
- **Technology stack is restricted to Google Apps Script + HTML/CSS/JS + Google Sheets (multi‑tab).**

---
