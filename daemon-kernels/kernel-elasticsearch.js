// ------------------------------------------------------------------------- //
//  FORCE STRICT MODE
// ------------------------------------------------------------------------- //

'use strict';

// ------------------------------------------------------------------------- //
//
//  CORE MODULE: ELASTICSEARCH
//
// ------------------------------------------------------------------------- //
//  ESLINT CONFIGURATION
// ------------------------------------------------------------------------- //

/* eslint-disable no-empty */

// ------------------------------------------------------------------------- //
//  COMMON MODULES
// ------------------------------------------------------------------------- //

// Load modules
const { Client } = require('@elastic/elasticsearch');

// Load utilities
const sysUtils = require("../daemon-utilities/utility-sys");

// ------------------------------------------------------------------------- //
//  COMMON DATA
// ------------------------------------------------------------------------- //

// ------------------------------------------------------------------------- //
//  CREATE CLASSES: BASE CALL
// ------------------------------------------------------------------------- //

// Create base class
class __ElasticSearch {
    constructor() {
        // -------------------------------------------------------------------|
        //  PREPARE ID
        // -------------------------------------------------------------------|

        // Create id
        this.instanceId = "elasticsearch-mng-" + Date.now();

        // -------------------------------------------------------------------|
        //  PREPARE STORAGE
        // -------------------------------------------------------------------|

        // Save default values
        this.__elk_instance = null;
        this.__elk_settings = null;

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

    init (p_configs, p_logger = {}) {
        // -------------------------------------------------------------------|
        //  PREPARE SETTINGS
        // -------------------------------------------------------------------|

        // Save default settings
        let __settings = {
            enable:             false,
            name:               null,
            node:               null,
            proxy:              null,
            maxRetries:         null,
            requestTimeout:     null,
            pingTimeout:        null,
            resurrectStrategy:  null,
            suggestCompression: null,
            compression:        null,
            sniffOnStart:       null
        };

        // -------------------------------------------------------------------|
        //  MERGE SETTINGS
        // -------------------------------------------------------------------|

        // Save new settings
        this.__elk_settings = {
            ...__settings,
            ...(p_configs ? p_configs : {})
        };
        // -------------------------------------------------------------------|
        //  MERGE LOGGER
        // -------------------------------------------------------------------|

        // Save new logger
        this.logger = {
            ...this.logger,
            ...(p_logger ? p_logger : {})
        };

        // -------------------------------------------------------------------|
        //  SPAWN INSTANCE
        // -------------------------------------------------------------------|

        // Check if enabled from settings
        if (!this.__elk_settings.enable) {
            return;
        }

        // Spawn client instance
        this.__elk_instance = new Client({
            name:               "creo-messaging-elk",
            node:               this.__elk_settings.node,
            proxy:              this.__elk_settings.proxy,
            maxRetries:         this.__elk_settings.maxRetries,
            requestTimeout:     this.__elk_settings.requestTimeout,
            pingTimeout:        this.__elk_settings.pingTimeout,
            resurrectStrategy:  this.__elk_settings.resurrectStrategy,
            suggestCompression: this.__elk_settings.suggestCompression,
            compression:        this.__elk_settings.compression,
            sniffOnStart:       this.__elk_settings.sniffOnStart,
            ssl:                { rejectUnauthorized: false }
        });

        // Check for connection OK
        this.__elk_instance.ping().catch((err) => {
            // Send debug message
            this.logger.error("ElasticSearch.ConnectionStatus():  ERROR  ::-->>  " + JSON.stringify(
                err, null, 4
            ));

            // Block execution
            return false;
        });
    }

    log(docIndex, docType, docPayload) {
        return (new Promise((resolve, reject) => {
            // Check if enabled from settings
            if (!this.__elk_settings.enable) {
                // Set as OK and return
                return resolve();
            }
            // Check if client exists
            else if (this.__elk_instance) {
                // Prepare index
                let refIndexElastic = null;
                let refTypeElastic  = null;

                // Check for type: SYSTEM
                if (docType == sysUtils.getEnums.IOMessageTypes.System) {
                    // Generate index and type
                    refIndexElastic = "gs_" + docIndex + "-eventlogs";
                    refTypeElastic  = "PRIORITY";
                }
                // Always classic index
                else {
                    // Generate index and type
                    refIndexElastic = "gs_" + docIndex + "-messaging";
                    refTypeElastic  = "INFO";
                }

                // Generate epoch
                const epochDoc = Date.now();

                // Try to send document...
                this.__elk_instance.index({
                    index:   refIndexElastic,
                    op_type: 'create',
                    body:    {
                        "type":      refTypeElastic,
                        "message":   docPayload,
                        "epoch":     epochDoc,
                        "timestamp": (new Date(epochDoc)).toString(),
                        "source":    "creo-messaging-nodejs"
                    }
                })
                // Check for OK
                .then((response) => {
                    // Send response
                    resolve(response);
                })
                // Check for KO
                .catch((error) => {
                    // Send error
                    reject(error);
                });
            }
            // Throw error
            else return reject(new Error(
                "Uninitialized ElasticSearch: Try to call instance.init() first."
            ));
        }));
    }
}

// ------------------------------------------------------------------------- //
//  CREATE CLASSES: SINGLETON CALL
// ------------------------------------------------------------------------- //

// Create singleton class
class __ElasticSearch_Singleton {
    constructor() {
        // Check for instance
        if (!__ElasticSearch_Singleton.instance) {
            // ... Create new
            __ElasticSearch_Singleton.instance = new __ElasticSearch();
        }
    }

    // Get existing instance
    getInstance() {
        return __ElasticSearch_Singleton.instance;
    }
}

// ------------------------------------------------------------------------- //
//  EXPORT SINGLETON
// ------------------------------------------------------------------------- //

/**
 * @author:      mmarella
 * @version:     31/03/2021
 * @description: Object with classic and singleton version of settings.
 */
module.exports = Object.freeze({
    ElasticSearchSingleton:  (new __ElasticSearch_Singleton()),
    ElasticSearchClass:      __ElasticSearch
});

// ------------------------------------------------------------------------- //
//  EOF - END OF FILE
// ------------------------------------------------------------------------- //
