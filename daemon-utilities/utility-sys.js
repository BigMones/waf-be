// ------------------------------------------------------------------------- //
//  FORCE STRICT MODE
// ------------------------------------------------------------------------- //

'use strict';

// ------------------------------------------------------------------------- //
//
//  DAEMON UTILITY: SYSTEM
//
// ------------------------------------------------------------------------- //
//  COMMON ENUMS
// ------------------------------------------------------------------------- //

/**
 * @author:      mmarella
 * @version:     17/03/2021 (dd/mm/yyyy)
 * @description: Selettore stati di ruolo, l'ordine indica la priorità.
 * @type:        Enum
 */
 const __Enum_Profile_Role_Codes = {
    Administrator: "ROLE_CODE_FROM_DB_OR_TOKEN_ADMIN",
    Operator:      "ROLE_CODE_FROM_DB_OR_TOKEN_USER"
};

// ------------------------------------------------------------------------- //
//  EXPORT MODULES
// ------------------------------------------------------------------------- //

const moduleObj = Object.freeze({
    /**
     * @author:      mmarella
     * @version:     17/03/2021 (dd/mm/yyyy)
     * @description: Permette l'accesso ai vari enums dell'entità.
     * @type:        Object
     */
    getEnums: {
        /**
         * @author:      mmarella
         * @version:     17/03/2021 (dd/mm/yyyy)
         * @description: Permette l'accesso ai vari enums dell'entità.
         * @type:        Enum
         */
        UserRoles: __Enum_Profile_Role_Codes
    },
    /**
     * @author:      mmarella
     * @version:     17/03/2021 (dd/mm/yyyy)
     * @description: Permette di estrarre l'ordine di priorità.
     * @type:        Sync Function
     *
     * @param {Object} dbHandler
     * @returns Boolean
     */
     resolveHighestWorkingRole: (roles) => {
        // Check for non array
        if (!Array.isArray(roles)) {
            // Always null
            return null;
        }

        // Get all keys from enum
        const enumOrder = Object.keys(__Enum_Profile_Role_Codes);

        // Extract role codes
        let roleCodes = roles.map((item) => {
            return item; // TODO: Inject logic
        });

        // Loop all keys
        for (let i = 0; i < enumOrder.length; i++) {
            // Check if exists
            if (roleCodes.includes(__Enum_Profile_Role_Codes[enumOrder[i]])) {
                // Return highest groups
                return __Enum_Profile_Role_Codes[enumOrder[i]];
            }
        }

        // Always null
        return null;
    }
});

// Public scope
module.exports = moduleObj;

// ------------------------------------------------------------------------- //
//  END: UTILITY
// ------------------------------------------------------------------------- //
