/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * NIJJARA ERP - PermissionManager.gs
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Role-based access control and permission management
 * Created: 2025-11-23
 * Purpose: Manage user permissions and role-based access control
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

/**
 * Permission Manager Class
 * Handles role-based access control and permission validation
 */
class PermissionManager {
  constructor() {
    this.roleCache = {};
    this.permissionCache = {};
    this.userRoles = {};
  }

  /**
   * Check if user has permission
   * @param {string} userId - User identifier
   * @param {string} permission - Permission identifier
   * @param {Object} context - Additional context
   * @return {Object} Permission check result
   */
  hasPermission(userId, permission, context = {}) {
    try {
      logInfo_('SYSTEM', 'CHECK_PERMISSION', 'PERMISSION', permission, `Checking permission for user ${userId}`);
      
      // Get user roles
      const userRoles = this.getUserRoles(userId);
      if (!userRoles || userRoles.length === 0) {
        return {
          success: false,
          hasPermission: false,
          message: 'User has no assigned roles'
        };
      }
      
      // Check permission for each role
      for (const roleId of userRoles) {
        const rolePermission = this.checkRolePermission(roleId, permission, context);
        if (rolePermission.hasPermission) {
          return {
            success: true,
            hasPermission: true,
            role: roleId,
            scope: rolePermission.scope,
            constraints: rolePermission.constraints
          };
        }
      }
      
      logWarn_('SYSTEM', 'CHECK_PERMISSION', 'PERMISSION', permission, `Permission denied for user ${userId}`);
      return {
        success: true,
        hasPermission: false,
        message: 'Permission denied'
      };
    } catch (error) {
      logError_('SYSTEM', 'CHECK_PERMISSION', 'PERMISSION', permission, 'Permission check error', error);
      return {
        success: false,
        hasPermission: false,
        error: error.message
      };
    }
  }

  /**
   * Get user roles
   * @param {string} userId - User identifier
   * @return {Array} User roles
   */
  getUserRoles(userId) {
    // Check cache first
    if (this.userRoles[userId]) {
      return this.userRoles[userId];
    }
    
    // TODO: Fetch user roles from SYS_Users and SYS_Role_Permissions sheets
    // This should query the database for user's assigned roles
    
    // For now, return empty array (placeholder)
    return [];
  }

  /**
   * Check role permission
   * @param {string} roleId - Role identifier
   * @param {string} permission - Permission identifier
   * @param {Object} context - Additional context
   * @return {Object} Permission check result
   */
  checkRolePermission(roleId, permission, context) {
    // Get role permissions
    const rolePermissions = this.getRolePermissions(roleId);
    
    // Check if permission exists for role
    const permissionConfig = rolePermissions[permission];
    if (!permissionConfig) {
      return {
        hasPermission: false
      };
    }
    
    // Check scope constraints
    if (permissionConfig.scope) {
      const scopeCheck = this.checkScopeConstraints(permissionConfig.scope, context);
      if (!scopeCheck.valid) {
        return {
          hasPermission: false,
          reason: scopeCheck.reason
        };
      }
    }
    
    // Check additional constraints
    if (permissionConfig.constraints) {
      const constraintCheck = this.checkConstraints(permissionConfig.constraints, context);
      if (!constraintCheck.valid) {
        return {
          hasPermission: false,
          reason: constraintCheck.reason
        };
      }
    }
    
    return {
      hasPermission: true,
      scope: permissionConfig.scope,
      constraints: permissionConfig.constraints
    };
  }

  /**
   * Get role permissions
   * @param {string} roleId - Role identifier
   * @return {Object} Role permissions
   */
  getRolePermissions(roleId) {
    // Check cache first
    if (this.permissionCache[roleId]) {
      return this.permissionCache[roleId];
    }
    
    // TODO: Fetch role permissions from SYS_Role_Permissions sheet
    // This should query the database for role's assigned permissions
    
    // For now, return empty object (placeholder)
    const permissions = {};
    
    // Cache the result
    this.permissionCache[roleId] = permissions;
    
    return permissions;
  }

  /**
   * Check scope constraints
   * @param {string} scope - Scope definition
   * @param {Object} context - Context data
   * @return {Object} Scope check result
   */
  checkScopeConstraints(scope, context) {
    // TODO: Implement scope constraint checking
    // Examples: department-based, project-based, own-records-only, etc.
    
    switch (scope) {
      case 'own':
        // User can only access their own records
        if (!context.userId || !context.recordUserId || context.userId !== context.recordUserId) {
          return {
            valid: false,
            reason: 'Can only access own records'
          };
        }
        break;
      case 'department':
        // User can access records within their department
        if (!context.userDepartment || !context.recordDepartment || context.userDepartment !== context.recordDepartment) {
          return {
            valid: false,
            reason: 'Can only access records within your department'
          };
        }
        break;
      case 'all':
        // No scope restrictions
        break;
      default:
        // Custom scope logic
        if (typeof scope === 'function') {
          return scope(context);
        }
    }
    
    return {
      valid: true
    };
  }

  /**
   * Check additional constraints
   * @param {Object} constraints - Constraint definitions
   * @param {Object} context - Context data
   * @return {Object} Constraint check result
   */
  checkConstraints(constraints, context) {
    // TODO: Implement additional constraint checking
    // Examples: time-based, status-based, conditional logic, etc.
    
    for (const constraint of constraints) {
      switch (constraint.type) {
        case 'time':
          if (!this.checkTimeConstraint(constraint, context)) {
            return {
              valid: false,
              reason: constraint.message || 'Time constraint not satisfied'
            };
          }
          break;
        case 'status':
          if (!this.checkStatusConstraint(constraint, context)) {
            return {
              valid: false,
              reason: constraint.message || 'Status constraint not satisfied'
            };
          }
          break;
        default:
          // Custom constraint logic
          if (typeof constraint.check === 'function') {
            const result = constraint.check(context);
            if (!result.valid) {
              return result;
            }
          }
      }
    }
    
    return {
      valid: true
    };
  }

  /**
   * Check time constraint
   * @param {Object} constraint - Time constraint
   * @param {Object} context - Context data
   * @return {boolean} Constraint result
   */
  checkTimeConstraint(constraint, context) {
    // TODO: Implement time-based constraint checking
    return true;
  }

  /**
   * Check status constraint
   * @param {Object} constraint - Status constraint
   * @param {Object} context - Context data
   * @return {boolean} Constraint result
   */
  checkStatusConstraint(constraint, context) {
    // TODO: Implement status-based constraint checking
    return true;
  }

  /**
   * Get user permissions summary
   * @param {string} userId - User identifier
   * @return {Object} Permissions summary
   */
  getUserPermissionsSummary(userId) {
    try {
      logInfo_('SYSTEM', 'GET_USER_PERMISSIONS', 'USER', userId, 'Getting user permissions summary');
      
      const userRoles = this.getUserRoles(userId);
      const permissions = {};
      
      for (const roleId of userRoles) {
        const rolePermissions = this.getRolePermissions(roleId);
        for (const permission in rolePermissions) {
          if (!permissions[permission]) {
            permissions[permission] = {
              permission: permission,
              roles: [],
              scope: rolePermissions[permission].scope,
              constraints: rolePermissions[permission].constraints
            };
          }
          permissions[permission].roles.push(roleId);
        }
      }
      
      return {
        success: true,
        userId: userId,
        roles: userRoles,
        permissions: Object.values(permissions),
        totalPermissions: Object.keys(permissions).length
      };
    } catch (error) {
      logError_('SYSTEM', 'GET_USER_PERMISSIONS', 'USER', userId, 'Failed to get user permissions', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Check form access permission
   * @param {string} userId - User identifier
   * @param {string} formId - Form identifier
   * @param {string} action - Action type (view, edit, create)
   * @return {Object} Access check result
   */
  checkFormAccess(userId, formId, action) {
    const permission = `FORM_${formId}_${action.toUpperCase()}`;
    return this.hasPermission(userId, permission, { formId, action });
  }

  /**
   * Check view access permission
   * @param {string} userId - User identifier
   * @param {string} viewId - View identifier
   * @param {string} action - Action type (view, export)
   * @return {Object} Access check result
   */
  checkViewAccess(userId, viewId, action) {
    const permission = `VIEW_${viewId}_${action.toUpperCase()}`;
    return this.hasPermission(userId, permission, { viewId, action });
  }

  /**
   * Clear permission caches
   */
  clearCaches() {
    this.roleCache = {};
    this.permissionCache = {};
    this.userRoles = {};
    
    logInfo_('SYSTEM', 'CLEAR_CACHES', 'SYSTEM', 'PERMISSIONS', 'Permission caches cleared');
  }
}

// Global instance
const permissionManager = new PermissionManager();

/**
 * Apps Script exposed functions for HTML interface
 */

/**
 * Check user permission
 * @param {string} userId - User identifier
 * @param {string} permission - Permission identifier
 * @param {Object} context - Additional context
 * @return {Object} Permission check result
 */
function checkUserPermission(userId, permission, context) {
  return permissionManager.hasPermission(userId, permission, context);
}

/**
 * Get user permissions summary
 * @param {string} userId - User identifier
 * @return {Object} Permissions summary
 */
function getUserPermissionsSummary(userId) {
  return permissionManager.getUserPermissionsSummary(userId);
}

/**
 * Check form access permission
 * @param {string} userId - User identifier
 * @param {string} formId - Form identifier
 * @param {string} action - Action type
 * @return {Object} Access check result
 */
function checkFormAccess(userId, formId, action) {
  return permissionManager.checkFormAccess(userId, formId, action);
}

/**
 * Check view access permission
 * @param {string} userId - User identifier
 * @param {string} viewId - View identifier
 * @param {string} action - Action type
 * @return {Object} Access check result
 */
function checkViewAccess(userId, viewId, action) {
  return permissionManager.checkViewAccess(userId, viewId, action);
}

/**
 * Clear permission caches
 * @return {Object} Clear result
 */
function clearPermissionCaches() {
  permissionManager.clearCaches();
  return {
    success: true,
    message: 'Permission caches cleared successfully'
  };
}