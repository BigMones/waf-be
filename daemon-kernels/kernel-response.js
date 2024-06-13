// ------------------------------------------------------------------------- //
//  FORCE STRICT MODE
// ------------------------------------------------------------------------- //

'use strict';

// ------------------------------------------------------------------------- //
//
//  DAEMON KERNEL: RESPONSE
//
// ------------------------------------------------------------------------- //
//  COMMON MODULES
// ------------------------------------------------------------------------- //

const commonUtils = require("../daemon-utilities/utility-commons");
const jsonUtils   = require("../daemon-utilities/utility-json");

// ------------------------------------------------------------------------- //
//  COMMON UTILITIES
// ------------------------------------------------------------------------- //

// ------------------------------------------------------------------------- //
//  HELPER FUNCTION
// ------------------------------------------------------------------------- //

// ------------------------------------------------------------------------- //
//  COMMON FUNCTIONS
// ------------------------------------------------------------------------- //

// ------------------------------------------------------------------------- //
//  EXPORT MODULES
// ------------------------------------------------------------------------- //

/**
 * @author:      lsvanzo
 * @version:     18/01/2021 (dd/mm/yyyy)
 * @description: Genera una Response manipolabile per invio al client.
 * @type:        Sync Function
 *
 * @param {Number} pRowCountOrFactory [0]
 * @param {String} pErrorOrNull [null]
 * @param {Array} pRowsOrNull [array()]
 * @param {Object} pPayloadOrNull [null]
 * @param {Boolean} pStrictDoneFlag [false]
 * @returns Response Object
 */
const moduleObj = Object.freeze((
    pRowCountOrFactory = 0,
    pErrorOrNull       = null,
    pRowsOrNull        = [],
    pPayloadOrNull     = null) => {
    // Prepare data for raw object
    let __pRowCount = pRowCountOrFactory;
    let __pError    = pErrorOrNull;
    let __pRows     = pRowsOrNull;
    let __pPayload  = pPayloadOrNull;
    let __pHttpCode = 200;

    // Check for factory existence
    if (commonUtils.typeOfObject(pRowCountOrFactory) === "Object" &&
        commonUtils.typeOfObject(pErrorOrNull) === "Null"         &&
        commonUtils.typeOfObject(pRowsOrNull) === "Null") {
        // Inject data from factory
        __pRowCount = pRowCountOrFactory.rowCount;
        __pError    = pRowCountOrFactory.message;
        __pRows     = pRowCountOrFactory.rows;
    }

    // Check type of ROW_COUNT
    if (commonUtils.typeOfObject(__pRowCount) !== "Number") {
        __pRowCount = -1;
        __pError    = "ERROR: Property 'rowCount' is not a 'Number'!";
    }
    // Check type of MESSAGE
    else if (
        commonUtils.typeOfObject(__pError) !== "String" &&
        commonUtils.typeOfObject(__pError) !== "Null") {
        __pRowCount = -1;
        __pError    = "ERROR: Property 'message' is not a 'String|Null'!";
    }
    // Check type of ROWS
    else if (commonUtils.typeOfObject(__pRows) !== "Array") {
        __pRowCount = -1;
        __pError    = "ERROR: Property 'rows' is not an 'Array'!";
    }
    // Check type of PAYLOAD
    else if (
        commonUtils.typeOfObject(__pPayload) !== "Object" &&
        commonUtils.typeOfObject(__pPayload) !== "Null") {
        __pRowCount = -1;
        __pError    = "ERROR: Property 'payload' is not an 'Object|Null'!";
    }

    // Normalize rows based to rowCount
    if (__pRowCount <= 0) {
        // Force reset data for security
        __pRows    = [];
        __pPayload = null;
    }

    // Prepare response object
    return Object.freeze({
        /**
         * @author:      lsvanzo
         * @version:     18/01/2021 (dd/mm/yyyy)
         * @description: Istanza privata raw della response generata
         * @type:        Object
         */
        __raw: {
            "rowCount": __pRowCount,
            "message":  __pError,
            "rows":     __pRows,
            "payload":  __pPayload,
            "httpCode": __pHttpCode
        },
        /**
         * @author:      lsvanzo
         * @version:     18/01/2021 (dd/mm/yyyy)
         * @description: Verifica se è flaggato come "COMPLETO"
         * @type:        Sync Function
         *
         * @returns Boolean
         */
        isDone: function (pStrictDoneFlag = false) {
            // Normalize done flag
            if (pStrictDoneFlag) {
                // Greater or equal => strict
                return ((__pRowCount >= 0) ? true : false);
            }

            // Only greater => default
            return ((__pRowCount > 0) ? true : false);
        },
        /**
         * @author:      lsvanzo
         * @version:     18/01/2021 (dd/mm/yyyy)
         * @description: Permette di rispristinare lo stato della response
         * @type:        Sync Function
         *
         * @param {String} error [null]
         */
        reset: function (error = null, httpCode = 200) {
            // Check for reset with error
            if (error) {
                this.__raw.rowCount = -1;
                this.__raw.message  = error;
                this.__raw.rows     = [];
            }
            // Otherwise...
            else {
                this.__raw.rowCount = 0;
                this.__raw.message  = null;
                this.__raw.rows     = [];
            }

            // Save http code
            this.__raw.httpCode = httpCode;

            // Return instance for chain block
            return Object.freeze(this);
        },
        /**
         * @author:      lsvanzo
         * @version:     18/01/2021 (dd/mm/yyyy)
         * @description: Permette di sostituire la response prima dell'invio
         * @type:        Sync Function
         *
         * @param {Array} rows
         */
        replace: function (newRows) {
            // Append or edit a property into raw response
            this.__raw.rows = newRows;

            // Calculate the new size
            this.__raw.rowCount = this.__raw.rows.length;

            // Return instance for chain block
            return Object.freeze(this);
        },
        /**
         * @author:      lsvanzo
         * @version:     18/01/2021 (dd/mm/yyyy)
         * @description: Permette di manipolare la response prima dell'invio
         * @type:        Sync Function
         *
         * @param {String} propName
         * @param {Any} propValue [null]
         * @param {Number} rowIndex [0]
         */
        manipulate: function (propName, propValue = null, rowIndex = 0) {
            // Append or edit a property into raw response
            this.__raw.rows[rowIndex][propName] = propValue;

            // Calculate the new size
            this.__raw.rowCount = this.__raw.rows.length;

            // Return instance for chain block
            return Object.freeze(this);
        },
        /**
         * @author:      lsvanzo
         * @version:     18/01/2021 (dd/mm/yyyy)
         * @description: Permette di manipolare il payload della response prima dell'invio
         * @type:        Sync Function
         *
         * @param {String} propName
         * @param {Any} propValue [null]
         */
        manipulatePayload: function (propName, propValue = null) {
            // Append or edit a property into raw response
            this.__raw.payload[propName] = propValue;

            // Return instance for chain block
            return Object.freeze(this);
        },
        /**
         * @author:      lsvanzo
         * @version:     19/03/2021 (dd/mm/yyyy)
         * @description: Modifica l'HttpStatusCode
         * @type:        Sync Function
         *
         * @returns Object
         */
        setHttpCode: function (httpCode) {
            // Save new code
            this.__raw.httpCode = httpCode;

            // Return instance for chain block
            return Object.freeze(this);
        },
        /**
         * @author:      lsvanzo
         * @version:     19/03/2021 (dd/mm/yyyy)
         * @description: Ritorna l'HttpStatusCode
         * @type:        Sync Function
         *
         * @returns Integer
         */
        getHttpCode: function () {
            // Send back
            return this.__raw.httpCode;
        },
        /**
         * @author:      lsvanzo
         * @version:     18/01/2021 (dd/mm/yyyy)
         * @description: Ritorna, se esistono, i records associati alla response
         * @type:        Sync Function
         *
         * @returns Any
         */
        getRows: function () {
            // Get and return payload for response
            return Array.isArray(this.__raw.rows) ? this.__raw.rows : [];
        },
        /**
         * @author:      lsvanzo
         * @version:     18/01/2021 (dd/mm/yyyy)
         * @description: Ritorna, se esiste, il payload associato alla response
         * @type:        Sync Function
         *
         * @returns Any
         */
        getPayload: function () {
            // Get and return payload for response
            return this.__raw.payload;
        },
        /**
         * @author:      lsvanzo
         * @version:     18/01/2021 (dd/mm/yyyy)
         * @description: Ritorna la response nella forma standard della piattaforma
         * @type:        Sync Function
         *
         * @returns Platform RESTful Response (Standard)
         */
        serialize: function (pStrictDoneFlag = false) {
            // Freeze and return response
            return Object.freeze({
                "done":     this.isDone(pStrictDoneFlag),
                "rowCount": this.__raw.rowCount,
                "message":  this.__raw.message,
                "rows":     JSON.parse(
                    JSON.stringify(
                        this.__raw.rows
                    ),
                    jsonUtils.jsonDecoder
                )
            });
        },
        /**
         * @author:      lsvanzo
         * @version:     18/01/2021 (dd/mm/yyyy)
         * @description: Ritorna la response nella forma ridotta della piattaforma
         * @type:        Sync Function
         *
         * @returns Platform RESTful Response (Standard)
         */
        serializeWithoutDone: function () {
            // Freeze and return response
            return Object.freeze({
                "rowCount": this.__raw.rowCount,
                "message":  this.__raw.message,
                "rows":     JSON.parse(
                    JSON.stringify(
                        this.__raw.rows
                    ),
                    jsonUtils.jsonDecoder
                )
            });
        }
    });
});

// Public scope
module.exports = moduleObj;

// ------------------------------------------------------------------------- //
//  END: KERNEL
// ------------------------------------------------------------------------- //
