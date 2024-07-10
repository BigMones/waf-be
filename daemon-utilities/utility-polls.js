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
    getPollsRecordData: async (dbHandler, id_vote) => {
        // Prepare statement
        let STMT_TO_EXEC = `
            SELECT 
            entity.id_vote as id_vote,
            entity.poll_name as poll_name,
            entity.id_team as id_team,
            entity.first_choice_name as first_choice_name,
            entity.first_choice_id as first_choice_id,
            entity.first_choice_votes as first_choice_votes,
            entity.second_choice_name as second_choice_name,
            entity.second_choice_id as second_choice_id,
            entity.second_choice_votes as second_choice_votes,
            entity.total_votes as total_votes,
            entity.exp_poll as exp_poll
          
            FROM votes AS entity
            WHERE entity.id_vote = '`+ id_vote + `'
            LIMIT 1
        ;`;



        // Exec statement to conn-pool
        let entityData = await dbHandler.query(
            // SQL STATEMENT
            STMT_TO_EXEC,
            // NAMED PARAMETERS
            {
                p_req_entity_id: id_vote
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
