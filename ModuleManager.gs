/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * NIJJARA ERP - ModuleManager.gs
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Module management system for ERP modules
 * Created: 2025-11-23
 * Purpose: Manage ERP modules (HRM, PRJ, FIN, SYS) and their components
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

/**
 * Module Manager Class
 * Handles module registration, configuration, and lifecycle management
 */
class ModuleManager {
  constructor() {
    this.modules = {};
    this.moduleConfigs = {};
    this.moduleDependencies = {};
  }

  /**
   * Register a new module
   * @param {string} moduleId - Module identifier (HRM, PRJ, FIN, SYS)
   * @param {Object} moduleConfig - Module configuration
   * @return {Object} Registration result
   */
  registerModule(moduleId, moduleConfig) {
    try {
      logInfo_('SYSTEM', 'REGISTER_MODULE', 'MODULE', moduleId, 'Starting module registration');
      
      // Validate module configuration
      this.validateModuleConfig(moduleConfig);
      
      // Check dependencies
      this.checkDependencies(moduleConfig.dependencies);
      
      // Register module
      this.modules[moduleId] = {
        id: moduleId,
        config: moduleConfig,
        status: 'registered',
        registeredAt: new Date(),
        components: {}
      };
      
      // Store configuration
      this.moduleConfigs[moduleId] = moduleConfig;
      
      logInfo_('SYSTEM', 'REGISTER_MODULE', 'MODULE', moduleId, 'Module registration completed');
      return {
        success: true,
        message: `Module ${moduleId} registered successfully`
      };
    } catch (error) {
      logError_('SYSTEM', 'REGISTER_MODULE', 'MODULE', moduleId, 'Module registration failed', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Validate module configuration
   * @param {Object} moduleConfig - Module configuration
   */
  validateModuleConfig(moduleConfig) {
    const requiredFields = ['name', 'version', 'components'];
    for (const field of requiredFields) {
      if (!moduleConfig[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
  }

  /**
   * Check module dependencies
   * @param {Array} dependencies - Module dependencies
   */
  checkDependencies(dependencies) {
    if (!dependencies || dependencies.length === 0) return;
    
    for (const dependency of dependencies) {
      if (!this.modules[dependency] || this.modules[dependency].status !== 'active') {
        throw new Error(`Dependency not satisfied: ${dependency}`);
      }
    }
  }

  /**
   * Initialize a module
   * @param {string} moduleId - Module identifier
   * @return {Object} Initialization result
   */
  initializeModule(moduleId) {
    try {
      logInfo_('SYSTEM', 'INIT_MODULE', 'MODULE', moduleId, 'Starting module initialization');
      
      if (!this.modules[moduleId]) {
        throw new Error(`Module not registered: ${moduleId}`);
      }
      
      const module = this.modules[moduleId];
      const config = this.moduleConfigs[moduleId];
      
      // Initialize components
      for (const componentId in config.components) {
        this.initializeComponent(moduleId, componentId, config.components[componentId]);
      }
      
      module.status = 'active';
      module.initializedAt = new Date();
      
      logInfo_('SYSTEM', 'INIT_MODULE', 'MODULE', moduleId, 'Module initialization completed');
      return {
        success: true,
        message: `Module ${moduleId} initialized successfully`
      };
    } catch (error) {
      logError_('SYSTEM', 'INIT_MODULE', 'MODULE', moduleId, 'Module initialization failed', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Initialize a module component
   * @param {string} moduleId - Module identifier
   * @param {string} componentId - Component identifier
   * @param {Object} componentConfig - Component configuration
   */
  initializeComponent(moduleId, componentId, componentConfig) {
    logInfo_('SYSTEM', 'INIT_COMPONENT', 'COMPONENT', `${moduleId}.${componentId}`, 'Initializing component');
    
    // TODO: Implement component initialization based on type
    // This could be forms, views, dashboards, etc.
    
    this.modules[moduleId].components[componentId] = {
      config: componentConfig,
      status: 'initialized',
      initializedAt: new Date()
    };
  }

  /**
   * Get module information
   * @param {string} moduleId - Module identifier
   * @return {Object} Module information
   */
  getModuleInfo(moduleId) {
    if (!this.modules[moduleId]) {
      return {
        success: false,
        error: `Module not found: ${moduleId}`
      };
    }
    
    const module = this.modules[moduleId];
    return {
      success: true,
      module: {
        id: module.id,
        name: this.moduleConfigs[moduleId].name,
        version: this.moduleConfigs[moduleId].version,
        status: module.status,
        registeredAt: module.registeredAt,
        initializedAt: module.initializedAt,
        componentCount: Object.keys(module.components).length
      }
    };
  }

  /**
   * Get all registered modules
   * @return {Object} Modules list
   */
  getAllModules() {
    const modules = [];
    
    for (const moduleId in this.modules) {
      const moduleInfo = this.getModuleInfo(moduleId);
      if (moduleInfo.success) {
        modules.push(moduleInfo.module);
      }
    }
    
    return {
      success: true,
      modules: modules,
      total: modules.length
    };
  }

  /**
   * Get module components
   * @param {string} moduleId - Module identifier
   * @return {Object} Components list
   */
  getModuleComponents(moduleId) {
    if (!this.modules[moduleId]) {
      return {
        success: false,
        error: `Module not found: ${moduleId}`
      };
    }
    
    const module = this.modules[moduleId];
    const components = [];
    
    for (const componentId in module.components) {
      components.push({
        id: componentId,
        ...module.components[componentId]
      });
    }
    
    return {
      success: true,
      components: components,
      total: components.length
    };
  }

  /**
   * Deactivate a module
   * @param {string} moduleId - Module identifier
   * @return {Object} Deactivation result
   */
  deactivateModule(moduleId) {
    try {
      logInfo_('SYSTEM', 'DEACTIVATE_MODULE', 'MODULE', moduleId, 'Deactivating module');
      
      if (!this.modules[moduleId]) {
        throw new Error(`Module not found: ${moduleId}`);
      }
      
      this.modules[moduleId].status = 'inactive';
      this.modules[moduleId].deactivatedAt = new Date();
      
      logInfo_('SYSTEM', 'DEACTIVATE_MODULE', 'MODULE', moduleId, 'Module deactivated');
      return {
        success: true,
        message: `Module ${moduleId} deactivated successfully`
      };
    } catch (error) {
      logError_('SYSTEM', 'DEACTIVATE_MODULE', 'MODULE', moduleId, 'Module deactivation failed', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Load ERP modules from configuration
   * @return {Object} Load result
   */
  loadERPMModules() {
    try {
      logInfo_('SYSTEM', 'LOAD_ERP_MODULES', 'SYSTEM', 'MODULES', 'Loading ERP modules');
      
      // Define standard ERP modules
      const erpModules = {
        'SYS': {
          name: 'System Administration',
          version: '1.0.0',
          description: 'System configuration and administration',
          components: {
            'dashboard': { type: 'dashboard', priority: 'high' },
            'users': { type: 'form', priority: 'high' },
            'roles': { type: 'form', priority: 'high' },
            'permissions': { type: 'form', priority: 'high' },
            'audit': { type: 'view', priority: 'medium' }
          }
        },
        'HRM': {
          name: 'Human Resource Management',
          version: '1.0.0',
          description: 'Employee and HR management',
          dependencies: ['SYS'],
          components: {
            'dashboard': { type: 'dashboard', priority: 'high' },
            'employees': { type: 'form', priority: 'high' },
            'attendance': { type: 'view', priority: 'high' },
            'leave': { type: 'form', priority: 'high' },
            'advances': { type: 'form', priority: 'medium' },
            'overtime': { type: 'form', priority: 'medium' }
          }
        },
        'PRJ': {
          name: 'Project Management',
          version: '1.0.0',
          description: 'Project and task management',
          dependencies: ['SYS', 'HRM'],
          components: {
            'dashboard': { type: 'dashboard', priority: 'high' },
            'projects': { type: 'form', priority: 'high' },
            'tasks': { type: 'form', priority: 'high' },
            'clients': { type: 'form', priority: 'medium' },
            'materials': { type: 'form', priority: 'medium' }
          }
        },
        'FIN': {
          name: 'Financial Management',
          version: '1.0.0',
          description: 'Financial and accounting management',
          dependencies: ['SYS', 'HRM', 'PRJ'],
          components: {
            'dashboard': { type: 'dashboard', priority: 'high' },
            'direct_expenses': { type: 'form', priority: 'high' },
            'indirect_expenses': { type: 'form', priority: 'high' },
            'revenue': { type: 'form', priority: 'high' },
            'custody': { type: 'form', priority: 'medium' },
            'payroll': { type: 'view', priority: 'high' },
            'pnl': { type: 'view', priority: 'high' }
          }
        }
      };
      
      // Register all modules
      for (const moduleId in erpModules) {
        this.registerModule(moduleId, erpModules[moduleId]);
      }
      
      // Initialize modules in dependency order
      const initializationOrder = ['SYS', 'HRM', 'PRJ', 'FIN'];
      for (const moduleId of initializationOrder) {
        this.initializeModule(moduleId);
      }
      
      logInfo_('SYSTEM', 'LOAD_ERP_MODULES', 'SYSTEM', 'MODULES', 'ERP modules loaded successfully');
      return {
        success: true,
        message: 'ERP modules loaded and initialized',
        modules: Object.keys(erpModules)
      };
    } catch (error) {
      logError_('SYSTEM', 'LOAD_ERP_MODULES', 'SYSTEM', 'MODULES', 'Failed to load ERP modules', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Global instance
const moduleManager = new ModuleManager();

/**
 * Apps Script exposed functions for HTML interface
 */

/**
 * Load and initialize ERP modules
 * @return {Object} Load result
 */
function loadERPMModules() {
  return moduleManager.loadERPMModules();
}

/**
 * Get module information
 * @param {string} moduleId - Module identifier
 * @return {Object} Module information
 */
function getModuleInfo(moduleId) {
  return moduleManager.getModuleInfo(moduleId);
}

/**
 * Get all modules
 * @return {Object} Modules list
 */
function getAllModules() {
  return moduleManager.getAllModules();
}

/**
 * Get module components
 * @param {string} moduleId - Module identifier
 * @return {Object} Components list
 */
function getModuleComponents(moduleId) {
  return moduleManager.getModuleComponents(moduleId);
}