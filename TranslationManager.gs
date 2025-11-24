/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * NIJJARA ERP - TranslationManager.gs
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Arabic/English translation management system
 * Created: 2025-11-23
 * Purpose: Handle bilingual translation for UI elements
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

/**
 * Translation Manager Class
 * Handles bilingual translation management for Arabic/English UI
 */
class TranslationManager {
  constructor() {
    this.translationCache = {};
    this.currentLanguage = 'ar'; // Default to Arabic
    this.fallbackLanguage = 'en';
    this.translationSheets = {};
  }

  /**
   * Initialize translation manager
   * @return {Object} Initialization result
   */
  initialize() {
    try {
      logInfo_('SYSTEM', 'INIT_TRANSLATION', 'TRANSLATION', 'SYSTEM', 'Initializing translation manager');
      
      // Load translation configurations
      this.loadTranslationConfigurations();
      
      // Load translation data from sheets
      this.loadTranslationData();
      
      // Set default language
      this.setLanguage('ar');
      
      logInfo_('SYSTEM', 'INIT_TRANSLATION', 'TRANSLATION', 'SYSTEM', 'Translation manager initialized successfully');
      return {
        success: true,
        message: 'Translation manager initialized',
        currentLanguage: this.currentLanguage,
        availableLanguages: this.getAvailableLanguages()
      };
    } catch (error) {
      logError_('SYSTEM', 'INIT_TRANSLATION', 'TRANSLATION', 'SYSTEM', 'Failed to initialize translation manager', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Load translation configurations
   */
  loadTranslationConfigurations() {
    // TODO: Load configuration from ENG_Settings or dedicated translation config sheet
    logInfo_('SYSTEM', 'LOAD_TRANSLATION_CONFIG', 'TRANSLATION', 'SYSTEM', 'Loading translation configurations');
  }

  /**
   * Load translation data from sheets
   */
  loadTranslationData() {
    // TODO: Load translations from translation sheets
    // This would load from sheets like ENG_Forms, ENG_Views, ENG_Buttons, etc.
    logInfo_('SYSTEM', 'LOAD_TRANSLATION_DATA', 'TRANSLATION', 'SYSTEM', 'Loading translation data');
  }

  /**
   * Set current language
   * @param {string} language - Language code ('ar' or 'en')
   * @return {Object} Result
   */
  setLanguage(language) {
    try {
      if (!this.isLanguageSupported(language)) {
        throw new Error(`Unsupported language: ${language}`);
      }
      
      this.currentLanguage = language;
      
      logInfo_('SYSTEM', 'SET_LANGUAGE', 'TRANSLATION', 'SYSTEM', `Language set to ${language}`);
      return {
        success: true,
        language: language
      };
    } catch (error) {
      logError_('SYSTEM', 'SET_LANGUAGE', 'TRANSLATION', 'SYSTEM', 'Failed to set language', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get current language
   * @return {string} Current language code
   */
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  /**
   * Check if language is supported
   * @param {string} language - Language code
   * @return {boolean} Support status
   */
  isLanguageSupported(language) {
    const supportedLanguages = ['ar', 'en'];
    return supportedLanguages.includes(language);
  }

  /**
   * Get available languages
   * @return {Array} Available languages
   */
  getAvailableLanguages() {
    return [
      { code: 'ar', name: 'العربية', direction: 'rtl' },
      { code: 'en', name: 'English', direction: 'ltr' }
    ];
  }

  /**
   * Translate text
   * @param {string} key - Translation key
   * @param {Object} params - Translation parameters
   * @param {string} fallback - Fallback text
   * @return {string} Translated text
   */
  translate(key, params = {}, fallback = '') {
    try {
      // Get translation for current language
      let translation = this.getTranslation(key, this.currentLanguage);
      
      // Fallback to English if translation not found
      if (!translation && this.currentLanguage !== 'en') {
        translation = this.getTranslation(key, 'en');
      }
      
      // Use fallback if still no translation
      if (!translation) {
        translation = fallback || key;
        logWarn_('SYSTEM', 'MISSING_TRANSLATION', 'TRANSLATION', key, `Missing translation for key: ${key}`);
      }
      
      // Apply parameters
      if (params && Object.keys(params).length > 0) {
        translation = this.applyTranslationParameters(translation, params);
      }
      
      return translation;
    } catch (error) {
      logError_('SYSTEM', 'TRANSLATE', 'TRANSLATION', key, 'Translation error', error);
      return fallback || key;
    }
  }

  /**
   * Get translation for key and language
   * @param {string} key - Translation key
   * @param {string} language - Language code
   * @return {string|null} Translation or null
   */
  getTranslation(key, language) {
    // Check cache first
    const cacheKey = `${key}_${language}`;
    if (this.translationCache[cacheKey]) {
      return this.translationCache[cacheKey];
    }
    
    // TODO: Load from translation sheets
    // This would query the appropriate sheet for the translation
    
    // For now, return null (placeholder)
    return null;
  }

  /**
   * Apply translation parameters
   * @param {string} translation - Translation text
   * @param {Object} params - Parameters
   * @return {string} Processed translation
   */
  applyTranslationParameters(translation, params) {
    let result = translation;
    
    for (const param in params) {
      const placeholder = `{${param}}`;
      const value = String(params[param]);
      result = result.replace(new RegExp(placeholder, 'g'), value);
    }
    
    return result;
  }

  /**
   * Translate form labels
   * @param {Object} formConfig - Form configuration
   * @return {Object} Translated form configuration
   */
  translateForm(formConfig) {
    try {
      const translated = JSON.parse(JSON.stringify(formConfig)); // Deep clone
      
      // Translate form title
      if (translated.formLabel) {
        translated.formLabel = this.translate(`form.${translated.id}.title`, {}, translated.formLabel);
      }
      
      // Translate tabs
      if (translated.tabs) {
        for (const tab of translated.tabs) {
          if (tab.tabLabel) {
            tab.tabLabel = this.translate(`form.${translated.id}.tab.${tab.tabId}`, {}, tab.tabLabel);
          }
          
          // Translate fields
          if (tab.fields) {
            for (const field of tab.fields) {
              if (field.fieldLabel) {
                field.fieldLabel = this.translate(`form.${translated.id}.field.${field.fieldId}`, {}, field.fieldLabel);
              }
              
              // Translate default values if they're placeholders
              if (field.defaultValue && field.defaultValue.startsWith('{{') && field.defaultValue.endsWith('}}')) {
                const translationKey = field.defaultValue.slice(2, -2);
                field.defaultValue = this.translate(translationKey, {}, field.defaultValue);
              }
            }
          }
        }
      }
      
      return translated;
    } catch (error) {
      logError_('SYSTEM', 'TRANSLATE_FORM', 'TRANSLATION', formConfig.id, 'Form translation error', error);
      return formConfig;
    }
  }

  /**
   * Translate view configuration
   * @param {Object} viewConfig - View configuration
   * @return {Object} Translated view configuration
   */
  translateView(viewConfig) {
    try {
      const translated = JSON.parse(JSON.stringify(viewConfig)); // Deep clone
      
      // Translate view title
      if (translated.viewTitle) {
        translated.viewTitle = this.translate(`view.${translated.id}.title`, {}, translated.viewTitle);
      }
      
      // Translate column headers
      if (translated.columns) {
        for (const column of translated.columns) {
          if (column.header) {
            column.header = this.translate(`view.${translated.id}.column.${column.fieldId}`, {}, column.header);
          }
        }
      }
      
      return translated;
    } catch (error) {
      logError_('SYSTEM', 'TRANSLATE_VIEW', 'TRANSLATION', viewConfig.id, 'View translation error', error);
      return viewConfig;
    }
  }

  /**
   * Translate button configuration
   * @param {Object} buttonConfig - Button configuration
   * @return {Object} Translated button configuration
   */
  translateButton(buttonConfig) {
    try {
      const translated = JSON.parse(JSON.stringify(buttonConfig)); // Deep clone
      
      // Translate button label
      if (translated.btnLabel) {
        translated.btnLabel = this.translate(`button.${translated.btnId}`, {}, translated.btnLabel);
      }
      
      // Translate button description
      if (translated.btnDescription) {
        translated.btnDescription = this.translate(`button.${translated.btnId}.description`, {}, translated.btnDescription);
      }
      
      return translated;
    } catch (error) {
      logError_('SYSTEM', 'TRANSLATE_BUTTON', 'TRANSLATION', buttonConfig.btnId, 'Button translation error', error);
      return buttonConfig;
    }
  }

  /**
   * Translate dropdown options
   * @param {Object} dropdownConfig - Dropdown configuration
   * @return {Object} Translated dropdown configuration
   */
  translateDropdown(dropdownConfig) {
    try {
      const translated = JSON.parse(JSON.stringify(dropdownConfig)); // Deep clone
      
      // Translate dropdown title based on current language
      if (this.currentLanguage === 'ar' && translated.ddAR) {
        translated.title = translated.ddAR;
      } else if (this.currentLanguage === 'en' && translated.ddEN) {
        translated.title = translated.ddEN;
      }
      
      return translated;
    } catch (error) {
      logError_('SYSTEM', 'TRANSLATE_DROPDOWN', 'TRANSLATION', dropdownConfig.ddId, 'Dropdown translation error', error);
      return dropdownConfig;
    }
  }

  /**
   * Get language direction
   * @param {string} language - Language code
   * @return {string} Language direction (ltr or rtl)
   */
  getLanguageDirection(language) {
    const languageInfo = this.getAvailableLanguages().find(lang => lang.code === language);
    return languageInfo ? languageInfo.direction : 'ltr';
  }

  /**
   * Get current language direction
   * @return {string} Current language direction
   */
  getCurrentLanguageDirection() {
    return this.getLanguageDirection(this.currentLanguage);
  }

  /**
   * Add translation to cache
   * @param {string} key - Translation key
   * @param {string} language - Language code
   * @param {string} translation - Translation text
   */
  addToCache(key, language, translation) {
    const cacheKey = `${key}_${language}`;
    this.translationCache[cacheKey] = translation;
  }

  /**
   * Clear translation cache
   */
  clearCache() {
    this.translationCache = {};
    logInfo_('SYSTEM', 'CLEAR_TRANSLATION_CACHE', 'TRANSLATION', 'SYSTEM', 'Translation cache cleared');
  }
}

// Global instance
const translationManager = new TranslationManager();

/**
 * Apps Script exposed functions for HTML interface
 */

/**
 * Initialize translation manager
 * @return {Object} Initialization result
 */
function initializeTranslationManager() {
  return translationManager.initialize();
}

/**
 * Set current language
 * @param {string} language - Language code
 * @return {Object} Result
 */
function setCurrentLanguage(language) {
  return translationManager.setLanguage(language);
}

/**
 * Get current language
 * @return {string} Current language code
 */
function getCurrentLanguage() {
  return translationManager.getCurrentLanguage();
}

/**
 * Translate text
 * @param {string} key - Translation key
 * @param {Object} params - Translation parameters
 * @param {string} fallback - Fallback text
 * @return {string} Translated text
 */
function translateText(key, params, fallback) {
  return translationManager.translate(key, params, fallback);
}

/**
 * Translate form configuration
 * @param {Object} formConfig - Form configuration
 * @return {Object} Translated form configuration
 */
function translateFormConfig(formConfig) {
  return translationManager.translateForm(formConfig);
}

/**
 * Translate view configuration
 * @param {Object} viewConfig - View configuration
 * @return {Object} Translated view configuration
 */
function translateViewConfig(viewConfig) {
  return translationManager.translateView(viewConfig);
}

/**
 * Get current language direction
 * @return {string} Language direction
 */
function getCurrentLanguageDirection() {
  return translationManager.getCurrentLanguageDirection();
}