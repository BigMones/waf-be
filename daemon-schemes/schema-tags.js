// ------------------------------------------------------------------------- //
//  FORCE STRICT MODE
// ------------------------------------------------------------------------- //

'use strict';

// ------------------------------------------------------------------------- //
//
//  DAEMON SCHEMA: TAGS
//
// ------------------------------------------------------------------------- //

// ------------------------------------------------------------------------- //
//  EXPORT MODULES
// ------------------------------------------------------------------------- //

/**
 * @author:      mmarella
 * @version:     18/01/2021 (dd/mm/yyyy)
 * @description: Ritorna la lista dei tags (categorie) di swagger.
 * @type:        Sync Function
 *
 * @returns Swagger Tags - Array
 */
const moduleObj = Object.freeze(() => {
    // --------------------------------------------------------------------- |

    return [
        {
            name: "Welcome"
        },
    ];

    // --------------------------------------------------------------------- |
});

// Public scope
module.exports = moduleObj;

// ------------------------------------------------------------------------- //
//  END: ENTITY
// ------------------------------------------------------------------------- //
