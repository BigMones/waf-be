// ------------------------------------------------------------------------- //
//  FORCE STRICT MODE
// ------------------------------------------------------------------------- //

'use strict';

// ------------------------------------------------------------------------- //
//
//  DAEMON UTILITY: JSON
//
// ------------------------------------------------------------------------- //
//  COMMON MODULES
// ------------------------------------------------------------------------- //

// Get all settings and log
let commonUtils = require("./utility-commons");

// ------------------------------------------------------------------------- //
//  COMMON ENTITIES
// ------------------------------------------------------------------------- //

// ------------------------------------------------------------------------- //
//  COMMON ENUMS
// ------------------------------------------------------------------------- //

/**
 * @author:      mmarella
 * @version:     18/01/2021 (dd/mm/yyyy)
 * @description: Selettore dei tipi di mappatura.
 * @type:        Enum
 */
const __enum_MapSchemas = {
    ObjectCard:   10,
    Template:     20
}

// ------------------------------------------------------------------------- //
//  HELPER FUNCTIONS
// ------------------------------------------------------------------------- //

/**
 * @author:      mmarella
 * @version:     18/01/2021 (dd/mm/yyyy)
 * @description: Encode valori JSON
 * @type:        Sync Function
 *
 * @param {String} k
 * @param {Any} v
 * @returns Any
 */
let __jsonEncoder = function (k, v)
{
    // Check type
    if (typeof v === "string") {
        // Send modified
        return commonUtils.textEscape(v);
    }
    // Return as-is
    else return v;
};

// ------------------------------------------------------------------------- //

/**
 * @author:      mmarella
 * @version:     18/01/2021 (dd/mm/yyyy)
 * @description: Decode valori JSON
 * @type:        Sync Function
 *
 * @param {String} k
 * @param {Any} v
 * @returns Any
 */
let __jsonDecoder = function (k, v) {
    // Check type
    if (typeof v === "string") {
        // Send modified
        return commonUtils.textUnescape(v);
    }
    // Return as-is
    else return v;
};

// ------------------------------------------------------------------------- //
//  EXPORT MODULES
// ------------------------------------------------------------------------- //

const moduleObj = Object.freeze({
    /**
     * @author:      mmarella
     * @version:     18/01/2021 (dd/mm/yyyy)
     * @description: Permette l'accesso ai vari enums dell'entità.
     * @type:        Object
     */
    getEnums: {
        /**
         * @author:      mmarella
         * @version:     18/01/2021 (dd/mm/yyyy)
         * @description: Permette l'accesso ai vari enums dell'entità.
         * @type:        Enum
         */
        MapSchemas: __enum_MapSchemas
    },
    /**
     * @author:      mmarella
     * @version:     18/01/2021 (dd/mm/yyyy)
     * @description: Encode valori JSON
     * @type:        Sync Function
     *
     * @param {String} k
     * @param {Any} v
     * @returns Any
     */
    jsonEncoder: __jsonEncoder,
    /**
     * @author:      mmarella
     * @version:     18/01/2021 (dd/mm/yyyy)
     * @description: Decode valori JSON
     * @type:        Sync Function
     *
     * @param {String} k
     * @param {Any} v
     * @returns Any
     */
    jsonDecoder: __jsonDecoder,
    /**
     * @author:      mmarella
     * @version:     18/01/2021 (dd/mm/yyyy)
     * @description: Controlla se è un json/oggetto vuoto
     * @type:        Sync Function
     *
     * @param {Object} obj
     * @returns Boolean
     */
    jsonEmpty: function (obj) {
        // NodeJS compatible
        return !Object.keys(obj).length;
    },
    /**
     * @author:      mmarella
     * @version:     18/01/2021 (dd/mm/yyyy)
     * @description: Compara due path JSON + wildcards indice
     * @type:        Sync Function
     *
     * @param {String} str
     * @param {Rule Path} rule
     * @returns Boolean
     */
    jsonPathCompare: function (str, rule) {
        // Normalize rule
        let ruleNormalize = rule + "";
        ruleNormalize = ruleNormalize.replace((new RegExp("/", "gi")), "/");
        ruleNormalize = ruleNormalize.replace((new RegExp("#",  "gi")), "([0-9]+)");

        // Matches any string that contains zero or more number
        return (new RegExp(ruleNormalize, "gi")).test(str);
    },
    /**
     * @author:      mmarella
     * @version:     18/01/2021 (dd/mm/yyyy)
     * @description: Normalizzazione del codice univoco privo di TIPOLOGIA (A, AUT, ...)
     * @type:        Sync Function
     *
     * @param {String} uniqueKey
     * @returns String
     */
    normalizeTplUniqueCode: function (uniqueKey) {
        // Get array from UniqueID
        let tmpID = uniqueKey.split("-");

        // Check size of array => 3 OK!
        if (tmpID.length == 3) {
            tmpID.splice(0, 1);
            return tmpID.join("-");
        }
        // Return unmodified
        else return uniqueKey;
    },
    /**
     * @author:      mmarella
     * @version:     18/01/2021 (dd/mm/yyyy)
     * @description: Escape automatico dei caratteri per oggetti e stringhe JSON
     * @type:        Sync Function
     *
     * @param {Object} obj
     * @returns Object
     */
    jsonToEscaped: function (obj) {
        // Prepare temp let
        let tmpUnescaped = null;

        try {
            // Start check and escaping
            if (typeof v !== "string")
                tmpUnescaped =  JSON.parse(
                    JSON.stringify(obj, __jsonEncoder),
                    __jsonDecoder
                );
            else
                tmpUnescaped =  JSON.stringify(
                    JSON.parse(obj, __jsonEncoder),
                    __jsonDecoder
                );
        }
        catch (e)
        {
            // Log error and force NULL
            tmpUnescaped = null
        }

        // Check and return
        return ((tmpUnescaped != null && tmpUnescaped != undefined) ? tmpUnescaped : obj);
    },
    /**
     * @author:      mmarella
     * @version:     18/01/2021 (dd/mm/yyyy)
     * @description: Applica una funzione ad ogni coppia di (K,V) del JSON
     * @type:        Sync Function
    /**
     *
     *
     * @param {Object} obj
     * @param {Function} callback
     * @returns Object
     */
    jsonApply: function (obj, callback) {
        // Prepare temp let
        let tmpUnescaped = null;

        try {
            // Start check and escaping
            if (typeof v !== "string")
                tmpUnescaped = JSON.parse(
                    JSON.stringify(obj),
                    callback
                );
            else
                tmpUnescaped = JSON.stringify(
                    JSON.parse(obj),
                    callback
                );
        }
        catch (e) {
            // Log error and force NULL
            tmpUnescaped = null
        }

        // Check and return
        return ((tmpUnescaped != null && tmpUnescaped != undefined) ? tmpUnescaped : obj);
    }
});

// Public scope
module.exports = moduleObj;

// ------------------------------------------------------------------------- //
//  END: MODULES
// ------------------------------------------------------------------------- //
