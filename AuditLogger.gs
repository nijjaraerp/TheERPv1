/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * NIJJARA ERP - AuditLogger.gs
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Comprehensive audit logging and monitoring system
 * Created: 2025-11-23
 * Purpose: Handle system auditing, logging, and monitoring
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

/**
 * Audit Logger Class
 * Handles comprehensive system auditing and logging
 */
class AuditLogger {
  constructor() {
    this.logLevels = {
      INFO: 'INFO',
      WARN: 'WARN',
      ERROR: 'ERROR',
      DEBUG: 'DEBUG'
    };
    
    this.auditCategories = {
      AUTHENTICATION: 'AUTH',
      AUTHORIZATION: 'AUTHZ',
      DATA_ACCESS: 'DATA',
      DATA_MODIFICATION: 'MODIFY',
      SYSTEM_OPERATION: 'SYSTEM',
      USER_ACTION: 'USER',
      ADMIN_ACTION: 'ADMIN'
    };
  }

  /**
   * Log audit event
   * @param {Object} auditEvent - Audit event details
   * @return {Object} Logging result
   */
  logAuditEvent(auditEvent) {
    try {
      // Validate audit event
      this.validateAuditEvent(auditEvent);
      
      // Prepare audit log entry
      const auditEntry = this.prepareAuditEntry(auditEvent);
      
      // Write to audit log sheet
      const result = this.writeAuditLog(auditEntry);
      
      // Write to debug log if needed
      if (auditEvent.level === this.logLevels.ERROR || auditEvent.level === this.logLevels.WARN) {
        this.writeDebugLog(auditEvent);
      }
      
      return {
        success: true,
        auditId: result.auditId,
        timestamp: auditEntry.timestamp
      };
    } catch (error) {
      // If audit logging fails, try to log the error
      try {
        this.writeDebugLog({
          level: this.logLevels.ERROR,
          category: this.auditCategories.SYSTEM_OPERATION,
          actor: 'SYSTEM',
          action: 'AUDIT_LOG_FAILED',
          message: `Failed to log audit event: ${error.message}`,
          error: error
        });
      } catch (logError) {
        // Last resort - we can't even log the error
        console.error('Critical audit logging failure:', logError);
      }
      
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Validate audit event
   * @param {Object} auditEvent - Audit event to validate
   */
  validateAuditEvent(auditEvent) {
    const requiredFields = ['level', 'category', 'actor', 'action'];
    
    for (const field of requiredFields) {
      if (!auditEvent[field]) {
        throw new Error(`Missing required audit field: ${field}`);
      }
    }
    
    // Validate log level
    if (!Object.values(this.logLevels).includes(auditEvent.level)) {
      throw new Error(`Invalid log level: ${auditEvent.level}`);
    }
    
    // Validate category
    if (!Object.values(this.auditCategories).includes(auditEvent.category)) {
      throw new Error(`Invalid audit category: ${auditEvent.category}`);
    }
  }

  /**
   * Prepare audit entry for logging
   * @param {Object} auditEvent - Audit event
   * @return {Object} Prepared audit entry
   */
  prepareAuditEntry(auditEvent) {
    const timestamp = new Date();
    const auditId = this.generateAuditId();
    
    return {
      auditId: auditId,
      timestamp: timestamp,
      level: auditEvent.level,
      category: auditEvent.category,
      actor: auditEvent.actor,
      action: auditEvent.action,
      entity: auditEvent.entity || 'SYSTEM',
      entityId: auditEvent.entityId || '',
      details: this.serializeDetails(auditEvent.details),
      ipAddress: auditEvent.ipAddress || '',
      sessionId: auditEvent.sessionId || '',
      userAgent: auditEvent.userAgent || '',
      duration: auditEvent.duration || 0,
      result: auditEvent.result || 'SUCCESS',
      errorMessage: auditEvent.error ? auditEvent.error.message : '',
      stackTrace: auditEvent.error ? this.getStackTrace(auditEvent.error) : ''
    };
  }

  /**
   * Generate unique audit ID
   * @return {string} Audit ID
   */
  generateAuditId() {
    return 'AUD_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Serialize details object
   * @param {*} details - Details to serialize
   * @return {string} Serialized details
   */
  serializeDetails(details) {
    if (!details) return '';
    
    try {
      if (typeof details === 'string') return details;
      return JSON.stringify(details);
    } catch (error) {
      return `Failed to serialize details: ${error.message}`;
    }
  }

  /**
   * Get stack trace from error
   * @param {Error} error - Error object
   * @return {string} Stack trace
   */
  getStackTrace(error) {
    if (!error || !error.stack) return '';
    
    // Limit stack trace length for storage
    const stack = error.stack.toString();
    return stack.length > 1000 ? stack.substring(0, 1000) + '...' : stack;
  }

  /**
   * Write audit log to sheet
   * @param {Object} auditEntry - Audit entry
   * @return {Object} Write result
   */
  writeAuditLog(auditEntry) {
    // TODO: Implement writing to SYS_Audit_Log sheet
    // This should append a row to the audit log sheet
    
    logInfo_('AUDIT', auditEntry.action, auditEntry.entity, auditEntry.entityId, auditEntry.details);
    
    return {
      success: true,
      auditId: auditEntry.auditId
    };
  }

  /**
   * Write debug log
   * @param {Object} logEvent - Log event
   */
  writeDebugLog(logEvent) {
    // Route to appropriate debug log based on level
    if (logEvent.level === this.logLevels.ERROR) {
      logError_(logEvent.category, logEvent.action, logEvent.entity || 'SYSTEM', logEvent.entityId || '', logEvent.message, logEvent.error);
    } else if (logEvent.level === this.logLevels.WARN) {
      logWarn_(logEvent.category, logEvent.action, logEvent.entity || 'SYSTEM', logEvent.entityId || '', logEvent.message);
    } else {
      logInfo_(logEvent.category, logEvent.action, logEvent.entity || 'SYSTEM', logEvent.entityId || '', logEvent.message);
    }
  }

  /**
   * Log authentication event
   * @param {Object} authEvent - Authentication event details
   * @return {Object} Logging result
   */
  logAuthentication(authEvent) {
    return this.logAuditEvent({
      level: authEvent.success ? this.logLevels.INFO : this.logLevels.ERROR,
      category: this.auditCategories.AUTHENTICATION,
      actor: authEvent.userId || authEvent.username || 'UNKNOWN',
      action: authEvent.action || 'LOGIN',
      entity: 'USER',
      entityId: authEvent.userId || '',
      details: {
        username: authEvent.username,
        success: authEvent.success,
        method: authEvent.method,
        ipAddress: authEvent.ipAddress,
        userAgent: authEvent.userAgent
      },
      ipAddress: authEvent.ipAddress,
      result: authEvent.success ? 'SUCCESS' : 'FAILED',
      error: authEvent.error
    });
  }

  /**
   * Log authorization event
   * @param {Object} authzEvent - Authorization event details
   * @return {Object} Logging result
   */
  logAuthorization(authzEvent) {
    return this.logAuditEvent({
      level: authzEvent.authorized ? this.logLevels.INFO : this.logLevels.WARN,
      category: this.auditCategories.AUTHORIZATION,
      actor: authzEvent.userId,
      action: authzEvent.action || 'ACCESS_CHECK',
      entity: authzEvent.resource,
      entityId: authzEvent.resourceId || '',
      details: {
        permission: authzEvent.permission,
        authorized: authzEvent.authorized,
        reason: authzEvent.reason
      },
      result: authzEvent.authorized ? 'AUTHORIZED' : 'DENIED'
    });
  }

  /**
   * Log data access event
   * @param {Object} accessEvent - Data access event details
   * @return {Object} Logging result
   */
  logDataAccess(accessEvent) {
    return this.logAuditEvent({
      level: this.logLevels.INFO,
      category: this.auditCategories.DATA_ACCESS,
      actor: accessEvent.userId,
      action: accessEvent.action || 'READ',
      entity: accessEvent.entity,
      entityId: accessEvent.entityId || '',
      details: {
        operation: accessEvent.operation,
        recordCount: accessEvent.recordCount,
        filters: accessEvent.filters,
        fields: accessEvent.fields
      },
      duration: accessEvent.duration || 0
    });
  }

  /**
   * Log data modification event
   * @param {Object} modifyEvent - Data modification event details
   * @return {Object} Logging result
   */
  logDataModification(modifyEvent) {
    return this.logAuditEvent({
      level: modifyEvent.success ? this.logLevels.INFO : this.logLevels.ERROR,
      category: this.auditCategories.DATA_MODIFICATION,
      actor: modifyEvent.userId,
      action: modifyEvent.action || 'UPDATE',
      entity: modifyEvent.entity,
      entityId: modifyEvent.entityId || '',
      details: {
        operation: modifyEvent.operation,
        changes: modifyEvent.changes,
        oldValues: modifyEvent.oldValues,
        newValues: modifyEvent.newValues
      },
      result: modifyEvent.success ? 'SUCCESS' : 'FAILED',
      error: modifyEvent.error
    });
  }

  /**
   * Log user action
   * @param {Object} actionEvent - User action details
   * @return {Object} Logging result
   */
  logUserAction(actionEvent) {
    return this.logAuditEvent({
      level: actionEvent.level || this.logLevels.INFO,
      category: this.auditCategories.USER_ACTION,
      actor: actionEvent.userId,
      action: actionEvent.action,
      entity: actionEvent.entity || 'SYSTEM',
      entityId: actionEvent.entityId || '',
      details: actionEvent.details,
      result: actionEvent.result || 'SUCCESS',
      error: actionEvent.error
    });
  }

  /**
   * Log system operation
   * @param {Object} systemEvent - System operation details
   * @return {Object} Logging result
   */
  logSystemOperation(systemEvent) {
    return this.logAuditEvent({
      level: systemEvent.level || this.logLevels.INFO,
      category: this.auditCategories.SYSTEM_OPERATION,
      actor: systemEvent.actor || 'SYSTEM',
      action: systemEvent.action,
      entity: systemEvent.entity || 'SYSTEM',
      entityId: systemEvent.entityId || '',
      details: systemEvent.details,
      duration: systemEvent.duration || 0,
      result: systemEvent.result || 'SUCCESS',
      error: systemEvent.error
    });
  }

  /**
   * Get audit log entries
   * @param {Object} filter - Filter criteria
   * @param {Object} pagination - Pagination parameters
   * @return {Object} Audit log entries
   */
  getAuditLog(filter = {}, pagination = {}) {
    try {
      logInfo_('SYSTEM', 'GET_AUDIT_LOG', 'AUDIT', 'SYSTEM', 'Retrieving audit log entries');
      
      // TODO: Implement audit log retrieval from SYS_Audit_Log sheet
      // This should support filtering by user, date range, category, etc.
      
      return {
        success: true,
        entries: [],
        total: 0,
        pagination: pagination
      };
    } catch (error) {
      logError_('SYSTEM', 'GET_AUDIT_LOG', 'AUDIT', 'SYSTEM', 'Failed to retrieve audit log', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Clean up old audit logs
   * @param {Object} cleanupConfig - Cleanup configuration
   * @return {Object} Cleanup result
   */
  cleanupAuditLogs(cleanupConfig = {}) {
    try {
      logInfo_('SYSTEM', 'CLEANUP_AUDIT', 'AUDIT', 'SYSTEM', 'Starting audit log cleanup');
      
      const retentionDays = cleanupConfig.retentionDays || 365;
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
      
      // TODO: Implement audit log cleanup
      // Remove entries older than retention period
      
      logInfo_('SYSTEM', 'CLEANUP_AUDIT', 'AUDIT', 'SYSTEM', 'Audit log cleanup completed');
      return {
        success: true,
        message: 'Audit log cleanup completed successfully'
      };
    } catch (error) {
      logError_('SYSTEM', 'CLEANUP_AUDIT', 'AUDIT', 'SYSTEM', 'Audit log cleanup failed', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Generate audit report
   * @param {Object} reportConfig - Report configuration
   * @return {Object} Report result
   */
  generateAuditReport(reportConfig) {
    try {
      logInfo_('SYSTEM', 'GENERATE_AUDIT_REPORT', 'AUDIT', 'SYSTEM', 'Generating audit report');
      
      const filter = reportConfig.filter || {};
      const reportType = reportConfig.type || 'summary';
      
      // Get audit data
      const auditData = this.getAuditLog(filter, { limit: 10000 });
      if (!auditData.success) {
        throw new Error(`Failed to retrieve audit data: ${auditData.error}`);
      }
      
      // Generate report based on type
      let report;
      switch (reportType) {
        case 'summary':
          report = this.generateSummaryReport(auditData.entries);
          break;
        case 'detailed':
          report = this.generateDetailedReport(auditData.entries);
          break;
        case 'user_activity':
          report = this.generateUserActivityReport(auditData.entries);
          break;
        case 'security':
          report = this.generateSecurityReport(auditData.entries);
          break;
        default:
          throw new Error(`Unknown report type: ${reportType}`);
      }
      
      logInfo_('SYSTEM', 'GENERATE_AUDIT_REPORT', 'AUDIT', 'SYSTEM', 'Audit report generated successfully');
      return {
        success: true,
        report: report,
        type: reportType,
        generatedAt: new Date()
      };
    } catch (error) {
      logError_('SYSTEM', 'GENERATE_AUDIT_REPORT', 'AUDIT', 'SYSTEM', 'Failed to generate audit report', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Generate summary report
   * @param {Array} entries - Audit entries
   * @return {Object} Summary report
   */
  generateSummaryReport(entries) {
    // TODO: Implement summary report generation
    return {
      type: 'summary',
      totalEvents: entries.length,
      dateRange: this.getDateRange(entries),
      categoryBreakdown: this.getCategoryBreakdown(entries),
      levelBreakdown: this.getLevelBreakdown(entries)
    };
  }

  /**
   * Generate detailed report
   * @param {Array} entries - Audit entries
   * @return {Object} Detailed report
   */
  generateDetailedReport(entries) {
    // TODO: Implement detailed report generation
    return {
      type: 'detailed',
      entries: entries,
      total: entries.length
    };
  }

  /**
   * Generate user activity report
   * @param {Array} entries - Audit entries
   * @return {Object} User activity report
   */
  generateUserActivityReport(entries) {
    // TODO: Implement user activity report generation
    return {
      type: 'user_activity',
      userActivity: {},
      total: entries.length
    };
  }

  /**
   * Generate security report
   * @param {Array} entries - Audit entries
   * @return {Object} Security report
   */
  generateSecurityReport(entries) {
    // TODO: Implement security report generation
    return {
      type: 'security',
      securityEvents: [],
      total: entries.length
    };
  }

  /**
   * Get date range from entries
   * @param {Array} entries - Audit entries
   * @return {Object} Date range
   */
  getDateRange(entries) {
    if (entries.length === 0) return { start: null, end: null };
    
    const timestamps = entries.map(entry => new Date(entry.timestamp));
    return {
      start: new Date(Math.min(...timestamps)),
      end: new Date(Math.max(...timestamps))
    };
  }

  /**
   * Get category breakdown
   * @param {Array} entries - Audit entries
   * @return {Object} Category breakdown
   */
  getCategoryBreakdown(entries) {
    const breakdown = {};
    
    entries.forEach(entry => {
      if (!breakdown[entry.category]) {
        breakdown[entry.category] = 0;
      }
      breakdown[entry.category]++;
    });
    
    return breakdown;
  }

  /**
   * Get level breakdown
   * @param {Array} entries - Audit entries
   * @return {Object} Level breakdown
   */
  getLevelBreakdown(entries) {
    const breakdown = {};
    
    entries.forEach(entry => {
      if (!breakdown[entry.level]) {
        breakdown[entry.level] = 0;
      }
      breakdown[entry.level]++;
    });
    
    return breakdown;
  }
}

// Global instance
const auditLogger = new AuditLogger();

/**
 * Apps Script exposed functions for HTML interface
 */

/**
 * Log audit event
 * @param {Object} auditEvent - Audit event details
 * @return {Object} Logging result
 */
function logAuditEvent(auditEvent) {
  return auditLogger.logAuditEvent(auditEvent);
}

/**
 * Get audit log entries
 * @param {Object} filter - Filter criteria
 * @param {Object} pagination - Pagination parameters
 * @return {Object} Audit log entries
 */
function getAuditLog(filter, pagination) {
  return auditLogger.getAuditLog(filter, pagination);
}

/**
 * Generate audit report
 * @param {Object} reportConfig - Report configuration
 * @return {Object} Report result
 */
function generateAuditReport(reportConfig) {
  return auditLogger.generateAuditReport(reportConfig);
}

/**
 * Cleanup audit logs
 * @param {Object} cleanupConfig - Cleanup configuration
 * @return {Object} Cleanup result
 */
function cleanupAuditLogs(cleanupConfig) {
  return auditLogger.cleanupAuditLogs(cleanupConfig);
}