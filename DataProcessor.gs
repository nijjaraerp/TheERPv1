/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * NIJJARA ERP - DataProcessor.gs
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Data processing and validation utilities
 * Created: 2025-11-23
 * Purpose: Handle data transformation, validation, and processing
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

/**
 * Data Processor Class
 * Handles data transformation, validation, and processing operations
 */
class DataProcessor {
  constructor() {
    this.validationRules = {};
    this.transformationRules = {};
    this.dataCache = {};
  }

  /**
   * Validate data against rules
   * @param {Object} data - Data to validate
   * @param {Object} rules - Validation rules
   * @return {Object} Validation result
   */
  validateData(data, rules) {
    try {
      logInfo_('SYSTEM', 'VALIDATE_DATA', 'DATA', 'PROCESSING', 'Starting data validation');
      
      const errors = [];
      const warnings = [];
      
      for (const field in rules) {
        const fieldRules = rules[field];
        const fieldValue = data[field];
        
        // Required field validation
        if (fieldRules.required && (fieldValue === undefined || fieldValue === null || fieldValue === '')) {
          errors.push({
            field: field,
            message: `${field} is required`,
            type: 'required'
          });
          continue;
        }
        
        // Skip further validation if field is empty and not required
        if (!fieldValue && !fieldRules.required) continue;
        
        // Type validation
        if (fieldRules.type) {
          const typeResult = this.validateType(fieldValue, fieldRules.type, field);
          if (!typeResult.valid) {
            errors.push(typeResult.error);
          }
        }
        
        // Length validation
        if (fieldRules.length) {
          const lengthResult = this.validateLength(fieldValue, fieldRules.length, field);
          if (!lengthResult.valid) {
            errors.push(lengthResult.error);
          }
        }
        
        // Pattern validation
        if (fieldRules.pattern) {
          const patternResult = this.validatePattern(fieldValue, fieldRules.pattern, field);
          if (!patternResult.valid) {
            errors.push(patternResult.error);
          }
        }
        
        // Range validation
        if (fieldRules.range) {
          const rangeResult = this.validateRange(fieldValue, fieldRules.range, field);
          if (!rangeResult.valid) {
            errors.push(rangeResult.error);
          }
        }
        
        // Custom validation
        if (fieldRules.custom && typeof fieldRules.custom === 'function') {
          const customResult = fieldRules.custom(fieldValue, data);
          if (!customResult.valid) {
            errors.push(customResult.error);
          }
        }
      }
      
      const result = {
        isValid: errors.length === 0,
        errors: errors,
        warnings: warnings
      };
      
      if (result.isValid) {
        logInfo_('SYSTEM', 'VALIDATE_DATA', 'DATA', 'PROCESSING', 'Data validation successful');
      } else {
        logWarn_('SYSTEM', 'VALIDATE_DATA', 'DATA', 'PROCESSING', `Data validation failed with ${errors.length} errors`);
      }
      
      return result;
    } catch (error) {
      logError_('SYSTEM', 'VALIDATE_DATA', 'DATA', 'PROCESSING', 'Data validation error', error);
      return {
        isValid: false,
        errors: [{ field: 'system', message: error.message, type: 'system' }]
      };
    }
  }

  /**
   * Validate data type
   * @param {*} value - Value to validate
   * @param {string} type - Expected type
   * @param {string} field - Field name
   * @return {Object} Validation result
   */
  validateType(value, type, field) {
    switch (type) {
      case 'string':
        return {
          valid: typeof value === 'string',
          error: { field: field, message: `${field} must be a string`, type: 'type' }
        };
      case 'number':
        return {
          valid: typeof value === 'number' && !isNaN(value),
          error: { field: field, message: `${field} must be a number`, type: 'type' }
        };
      case 'integer':
        return {
          valid: Number.isInteger(value),
          error: { field: field, message: `${field} must be an integer`, type: 'type' }
        };
      case 'boolean':
        return {
          valid: typeof value === 'boolean',
          error: { field: field, message: `${field} must be a boolean`, type: 'type' }
        };
      case 'date':
        return {
          valid: value instanceof Date && !isNaN(value),
          error: { field: field, message: `${field} must be a valid date`, type: 'type' }
        };
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return {
          valid: emailRegex.test(value),
          error: { field: field, message: `${field} must be a valid email address`, type: 'type' }
        };
      case 'phone':
        const phoneRegex = /^[\+]?[0-9\-\s()]+$/;
        return {
          valid: phoneRegex.test(value),
          error: { field: field, message: `${field} must be a valid phone number`, type: 'type' }
        };
      default:
        return { valid: true };
    }
  }

  /**
   * Validate field length
   * @param {*} value - Value to validate
   * @param {Object} lengthRules - Length validation rules
   * @param {string} field - Field name
   * @return {Object} Validation result
   */
  validateLength(value, lengthRules, field) {
    const valueLength = String(value).length;
    
    if (lengthRules.min && valueLength < lengthRules.min) {
      return {
        valid: false,
        error: { field: field, message: `${field} must be at least ${lengthRules.min} characters`, type: 'length' }
      };
    }
    
    if (lengthRules.max && valueLength > lengthRules.max) {
      return {
        valid: false,
        error: { field: field, message: `${field} must be no more than ${lengthRules.max} characters`, type: 'length' }
      };
    }
    
    return { valid: true };
  }

  /**
   * Validate field pattern
   * @param {string} value - Value to validate
   * @param {string|RegExp} pattern - Pattern to match
   * @param {string} field - Field name
   * @return {Object} Validation result
   */
  validatePattern(value, pattern, field) {
    const regex = pattern instanceof RegExp ? pattern : new RegExp(pattern);
    
    return {
      valid: regex.test(value),
      error: { field: field, message: `${field} format is invalid`, type: 'pattern' }
    };
  }

  /**
   * Validate field range
   * @param {number} value - Value to validate
   * @param {Object} rangeRules - Range validation rules
   * @param {string} field - Field name
   * @return {Object} Validation result
   */
  validateRange(value, rangeRules, field) {
    const numValue = Number(value);
    
    if (isNaN(numValue)) {
      return {
        valid: false,
        error: { field: field, message: `${field} must be a number`, type: 'range' }
      };
    }
    
    if (rangeRules.min !== undefined && numValue < rangeRules.min) {
      return {
        valid: false,
        error: { field: field, message: `${field} must be at least ${rangeRules.min}`, type: 'range' }
      };
    }
    
    if (rangeRules.max !== undefined && numValue > rangeRules.max) {
      return {
        valid: false,
        error: { field: field, message: `${field} must be no more than ${rangeRules.max}`, type: 'range' }
      };
    }
    
    return { valid: true };
  }

  /**
   * Transform data according to rules
   * @param {Object} data - Data to transform
   * @param {Object} rules - Transformation rules
   * @return {Object} Transformed data
   */
  transformData(data, rules) {
    try {
      logInfo_('SYSTEM', 'TRANSFORM_DATA', 'DATA', 'PROCESSING', 'Starting data transformation');
      
      const transformed = { ...data };
      
      for (const field in rules) {
        const fieldRules = rules[field];
        
        if (fieldRules.transform && typeof fieldRules.transform === 'function') {
          transformed[field] = fieldRules.transform(data[field], data);
        }
        
        if (fieldRules.default && (transformed[field] === undefined || transformed[field] === null)) {
          transformed[field] = fieldRules.default;
        }
        
        if (fieldRules.format) {
          transformed[field] = this.formatValue(transformed[field], fieldRules.format);
        }
      }
      
      logInfo_('SYSTEM', 'TRANSFORM_DATA', 'DATA', 'PROCESSING', 'Data transformation completed');
      return transformed;
    } catch (error) {
      logError_('SYSTEM', 'TRANSFORM_DATA', 'DATA', 'PROCESSING', 'Data transformation error', error);
      throw error;
    }
  }

  /**
   * Format value according to format rules
   * @param {*} value - Value to format
   * @param {string} format - Format type
   * @return {*} Formatted value
   */
  formatValue(value, format) {
    if (value === null || value === undefined) return value;
    
    switch (format) {
      case 'uppercase':
        return String(value).toUpperCase();
      case 'lowercase':
        return String(value).toLowerCase();
      case 'trim':
        return String(value).trim();
      case 'date':
        return new Date(value).toISOString().split('T')[0];
      case 'datetime':
        return new Date(value).toISOString();
      case 'currency':
        return Number(value).toFixed(2);
      case 'percentage':
        return (Number(value) * 100).toFixed(2) + '%';
      default:
        return value;
    }
  }

  /**
   * Process bulk data operations
   * @param {Array} dataArray - Array of data objects
   * @param {Object} operationConfig - Operation configuration
   * @return {Object} Processing result
   */
  processBulkData(dataArray, operationConfig) {
    try {
      logInfo_('SYSTEM', 'PROCESS_BULK', 'DATA', 'PROCESSING', `Starting bulk processing of ${dataArray.length} records`);
      
      const results = [];
      const errors = [];
      
      for (let i = 0; i < dataArray.length; i++) {
        try {
          const data = dataArray[i];
          let result;
          
          switch (operationConfig.operation) {
            case 'validate':
              result = this.validateData(data, operationConfig.rules);
              break;
            case 'transform':
              result = this.transformData(data, operationConfig.rules);
              break;
            case 'process':
              result = this.processDataRecord(data, operationConfig);
              break;
            default:
              throw new Error(`Unknown operation: ${operationConfig.operation}`);
          }
          
          results.push({
            index: i,
            success: true,
            data: result
          });
        } catch (error) {
          errors.push({
            index: i,
            success: false,
            error: error.message
          });
        }
      }
      
      logInfo_('SYSTEM', 'PROCESS_BULK', 'DATA', 'PROCESSING', `Bulk processing completed: ${results.length} success, ${errors.length} errors`);
      return {
        success: true,
        results: results,
        errors: errors,
        summary: {
          total: dataArray.length,
          success: results.length,
          failed: errors.length
        }
      };
    } catch (error) {
      logError_('SYSTEM', 'PROCESS_BULK', 'DATA', 'PROCESSING', 'Bulk processing error', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Process individual data record
   * @param {Object} data - Data record
   * @param {Object} operationConfig - Operation configuration
   * @return {Object} Processing result
   */
  processDataRecord(data, operationConfig) {
    // TODO: Implement specific data processing logic
    throw new Error('processDataRecord not yet implemented');
  }
}

// Global instance
const dataProcessor = new DataProcessor();

/**
 * Apps Script exposed functions for HTML interface
 */

/**
 * Validate data against rules
 * @param {Object} data - Data to validate
 * @param {Object} rules - Validation rules
 * @return {Object} Validation result
 */
function validateData(data, rules) {
  return dataProcessor.validateData(data, rules);
}

/**
 * Transform data according to rules
 * @param {Object} data - Data to transform
 * @param {Object} rules - Transformation rules
 * @return {Object} Transformed data
 */
function transformData(data, rules) {
  return dataProcessor.transformData(data, rules);
}

/**
 * Process bulk data operations
 * @param {Array} dataArray - Array of data objects
 * @param {Object} operationConfig - Operation configuration
 * @return {Object} Processing result
 */
function processBulkData(dataArray, operationConfig) {
  return dataProcessor.processBulkData(dataArray, operationConfig);
}