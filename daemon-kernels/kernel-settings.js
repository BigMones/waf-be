// ------------------------------------------------------------------------- //
//
//  CORE MODULE: SETTING FROM INI/ENV
//
// ------------------------------------------------------------------------- //
//  ESLINT CONFIGURATION
// ------------------------------------------------------------------------- //

/* eslint-disable no-empty */

// ------------------------------------------------------------------------- //
//  COMMON MODULES
// ------------------------------------------------------------------------- //

// Load modules
const modFs  = require('fs');
const modIni = require('ini');

// ------------------------------------------------------------------------- //
//  COMMON DATA
// ------------------------------------------------------------------------- //

// ------------------------------------------------------------------------- //
//  CREATE CLASSES: BASE CALL
// ------------------------------------------------------------------------- //

// Create base class
class __SettingsManager {
    constructor() {
        // -------------------------------------------------------------------|
        //  PREPARE ID
        // -------------------------------------------------------------------|

        // Create id
        this.instanceId = "settings-mng-" + Date.now();

        // -------------------------------------------------------------------|
        //  PREPARE STORAGE
        // -------------------------------------------------------------------|

        // Save default values
        this.__intSMData  = null;
        this.__intENVData = null;

        // -------------------------------------------------------------------|
        //  PREPARE LOGGER
        // -------------------------------------------------------------------|

        // Set default functions
        this.logger = {
            info:  () => {},
            warn:  () => {},
            error: () => {}
        };
    }

    // Init all settings system
    init (p_cfgini_path, p_envmap_path, p_logger = {}) {
        // -------------------------------------------------------------------|
        //  MERGE LOGGER
        // -------------------------------------------------------------------|

        // Save new logger
        this.logger = {
            ...this.logger,
            ...(p_logger ? p_logger : {})
        };

        // -------------------------------------------------------------------|
        //  SPAWN CFG INSTANCE
        // -------------------------------------------------------------------|

        // Try open and parse
        try {
            // Load from file system
            this.__intSMData = modIni.parse(
                modFs.readFileSync(
                    p_cfgini_path,
                    'utf-8'
                )
            );

            // Load from file system
            this.__intENVData = modFs.readFileSync(
                p_envmap_path,
                'utf-8'
            );

            // Parse to JSON Object
            this.__intENVData = JSON.parse(
                this.__intENVData
            );
        }
        // Intercept error
        catch (err) {
            // Reset data
            this.__intSMData  = false;
            this.__intENVData = false;

            // Send error
            this.logger.error(
                "SettingsManager<" + this.instanceId + ">.ThrowError():  " +
                JSON.stringify(err, null, 4)
            );

            // Force exit
            process.exit(0);
        }

        // Create chain
        return this;
    }

    // Get value as-is
    getProperty (__section, __field) {
        // Get mapper logic
        const isFirst = this.isEnvironFirst();

        // Check ini value
        const iniCfgVal = this.getPropertyFromINI(
            __section,
            __field
        );

        // Check environ value
        const envMapVal = this.getPropertyFromENV(
            __section,
            __field
        );

        // Check existence
        if (iniCfgVal != false || envMapVal != false) {
            // Return section value
            return (
                // Envs first
                (isFirst) ? (
                    envMapVal ? envMapVal : iniCfgVal
                )
                // Settings first
                : (
                    iniCfgVal ? iniCfgVal : envMapVal
                )
            );
        }

        // Otherwise...
        return false;
    }

    // Get value as-is
    getPropertyFromINI (__section, __field) {
        // Check existence
        if (this.__intSMData            &&
            this.__intSMData[__section] &&
            this.__intSMData[__section][__field]) {
            // Get settings value
            return this.__intSMData[__section][__field];
        }

        // Otherwise...
        return false;
    }

    // Get environ settings
    getPropertyFromENV (__section, __field) {
        // Prepare scope of evaluation
        const __evalStr = (pattern) => {
            return Function(`
                'use strict';
                return (${pattern});
            `)();
        }

        // Check existence
        if (this.__intENVData                            &&
            this.__intENVData["isEnabled"]               &&
            this.__intENVData["mappingRules"]            &&
            this.__intENVData["mappingRules"][__section] &&
            this.__intENVData["mappingRules"][__section][__field]) {
            // Get value from evaluate env
            const valENV = __evalStr(
                this.__intENVData["mappingRules"][__section][__field]
            );

            // Return section value
            return valENV ? valENV : false;
        }
        // Otherwise...
        else return false;
    }

    // Get value as boolean data
    getAsBoolean (__section, __field) {
        // Delegate to previous fn
        let tmpCheck = this.getProperty(__section, __field);

        // Check if string type
        if (typeof tmpCheck === 'string') {
            // Search for YES or ON
            if (tmpCheck == "yes" ||
                tmpCheck == "on") {
                // Always true
                return true;
            }
        }

        // Always false
        return false;
    }

    // Get environ logic
    isEnvironFirst () {
        // Check existence
        if (this.__intENVData              &&
            this.__intENVData["isEnabled"] &&
            this.__intENVData["mappingFirst"]) {
            // Return section value
            return true;
        }
        // Otherwise...
        else return false;
    }
}

// ------------------------------------------------------------------------- //
//  CREATE CLASSES: SINGLETON CALL
// ------------------------------------------------------------------------- //

// Create singleton class
class __SettingsMng_Singleton {
    constructor() {
        // Check for instance
        if (!__SettingsMng_Singleton.instance) {
            // ... Create new
            __SettingsMng_Singleton.instance = new __SettingsManager();
        }
    }

    // Get existing instance
    getInstance() {
        return __SettingsMng_Singleton.instance;
    }
}

// ------------------------------------------------------------------------- //
//  EXPORT SINGLETON
// ------------------------------------------------------------------------- //

/**
 * @author:      mmarella
 * @version:     18/01/2021
 * @description: Object with classic and singleton version of settings.
 */
module.exports = Object.freeze({
    SettingsMngSingleton:  (new __SettingsMng_Singleton()),
    SettingsMngClass:      __SettingsManager
});

// ------------------------------------------------------------------------- //
//  EOF - END OF FILE
// ------------------------------------------------------------------------- //
