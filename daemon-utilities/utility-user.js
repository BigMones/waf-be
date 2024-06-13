// ------------------------------------------------------------------------- //
//  FORCE STRICT MODE
// ------------------------------------------------------------------------- //

'use strict';

// ------------------------------------------------------------------------- //
//
//  DAEMON UTILITY: CMS
//
// ------------------------------------------------------------------------- //
//  COMMON MODULES
// ------------------------------------------------------------------------- //

// ------------------------------------------------------------------------- //
//  STATIC VALUES
// ------------------------------------------------------------------------- //

// ------------------------------------------------------------------------- //
//  COMMON ENUMS
// ------------------------------------------------------------------------- //

// ------------------------------------------------------------------------- //
//  EXPORT MODULES
// ------------------------------------------------------------------------- //

const moduleObj = Object.freeze({

    /**
     * @author:      mmarella
     * @version:     27/09/2021 (dd/mm/yyyy)
     * @description: Record dell'entità richiesta
     * @type:        Async Function
     *
     * @param {Object} dbHandler
     * @param {UUID} entity_id
     * @returns Object
     */
    getUserRecordData: async (dbHandler, ID_User) => {
        // Prepare statement
        let STMT_TO_EXEC = `
            SELECT 
            entity.ID as ID_User,
            entity.username as Username,
            entity.mail as Mail,
            entity.password as Password,
            entity.descrizione as Descrizione,
            entity.ruolo as Ruolo
          
            FROM user AS entity
            WHERE entity.ID = '`+ ID_User + `'
            LIMIT 1
        ;`;



        // Exec statement to conn-pool
        let entityData = await dbHandler.query(
            // SQL STATEMENT
            STMT_TO_EXEC,
            // NAMED PARAMETERS
            {
                p_req_entity_id: ID_User
            }
        )
            // DO NOT REMOVE FOR CLIENT RESULTS!
            .then((data) => { return { rowCount: data.length, rows: data, error: null } })
            // DO NOT REMOVE FOR CLIENT!
            .catch((err) => { return { rowCount: -1, rows: [], error: err.message } });

        // Send back
        return entityData;
    },



});

// Public scope
module.exports = moduleObj;

// ------------------------------------------------------------------------- //
//  END: MODULES
// ------------------------------------------------------------------------- //
