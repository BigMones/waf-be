// ------------------------------------------------------------------------- //
//
//  DAEMON ENTITY: GENERIC Utente
//
// ------------------------------------------------------------------------- //
//  COMMON MODULES
// ------------------------------------------------------------------------- //

// Kernel
const respSystem = require("../daemon-kernels/kernel-response");
// eslint-disable-next-line no-unused-vars
const { SettingsMngSingleton } = require('../daemon-kernels/kernel-settings');


// Utilities
// const sysUtils = require("../daemon-utilities/utility-sys");
const sqlUtils = require("../daemon-utilities/utility-sql");


// ------------------------------------------------------------------------- //
//  STATIC VALUES
// ------------------------------------------------------------------------- //

// ------------------------------------------------------------------------- //
//  COMMON STATEMENTS
// ------------------------------------------------------------------------- //

/**
 * @author:      mmarella
 * @version:     
 * @description: Permette di ricercare l'entità.
 * @type:        Sync Function

 * @returns SQL String
 */

let __stmt_SearchView_UsersList = (
    operateWithPrivilegies = null,
    // eslint-disable-next-line no-unused-vars

    //FileName = ""
) => {


    // Debug visibility
    logger.debug("SQLRBAC<notices>.OperateWithPrivilegies():  " + JSON.stringify(
        operateWithPrivilegies, null, 4
    ));



    /*|-------------QUERY EXAMPLE-------------|
    

    
    */
    let statement_file =  `
    SELECT username,mail,descrizione,ruolo,pubkey FROM users ;`
    


    // Return statement


    return statement_file;

};
let __stmt_SearchView_TeamInfo = (
    operateWithPrivilegies = null,
    // eslint-disable-next-line no-unused-vars

    //FileName = ""
) => {


    // Debug visibility
    logger.debug("SQLRBAC<notices>.OperateWithPrivilegies():  " + JSON.stringify(
        operateWithPrivilegies, null, 4
    ));

    // Prepare predicate


    // Prepare filter    



    /*|-------------QUERY EXAMPLE-------------|
    

    
    */
    let statement_file =  `
    SELECT team.nome as nome,
    team.id_campionato as id_campionato,
    team.anno_creazione as anno_creazione,
    team.status as status,
    championship.nome_champ as nome_champ,
    championship.paese as paese 
    FROM team 
    JOIN championship
    ON team.id_campionato = championship.id_champ
    where id_team = :p_req_entity_id ;`
    


    // Return statement


    return statement_file;

};


const moduleObj = Object.freeze({
    /**
     * @author:      mmarella
     * @version:     
     * @description: Permette di ricercare l'entità.
     * @type:        Async Function
     *
     * @param {Object} dbConnection
     * @param {Object} requestData
     * @param {Object} sessionData
     * @returns Response Object
     */
     viewTeams: async (dbConnection, requestData, sessionData) => {
        // Check requirements
        if (!(
            dbConnection &&
            requestData &&
            sessionData)) {
            // Propagate error
            return respSystem().reset(
                "One or more 'Users.GetUser' requirements are not satisfied!",
                400
            );
        }


        // Get highest role for current token
        // const highestWorkingGroup = sysUtils.resolveHighestWorkingRole(sessionData.roles);

        // Prepare visibility storage
        let operateWithPrivilegies = {
            superuser: false,
        }

        // Update visibility based to roles
        /*switch (highestWorkingGroup) {
            // ADMIN
            case sysUtils.getEnums.UserRoles.Administrator:
                // Set statement director
                operateWithPrivilegies.superuser = true;
                break;

            // GENERIC
            case sysUtils.getEnums.UserRoles.Generic:
                // DEFAULT LOGIC, DO NOTHING
                break;

            // UNKNOWN => BLOCK!
            default:
                // Propagate error
                return respSystem().reset(
                    "Permission call requirements are not satisfied!",
                    403
                );
        }*/

        // Prepare data to insert and send
  

        // Prepare statements
        const stmtSearchEntity = __stmt_SearchView_UsersList(
            operateWithPrivilegies,
            true,

        );


        // Prepare error storage
        let errnmsg = null;

        // Get paginator options if exist
        const paginator = sqlUtils.extractPaginator(
            requestData
        );


        // STEP.1: Exec query as sync-call
        let { rows, rowCount, error } = await dbConnection.query(
            // SQL STATEMENT
            sqlUtils.injectPagination(
                stmtSearchEntity,
                paginator
            ),
            // NAMED PARAMETERS
            {
                p_req_session_id: sessionData.id
            }
        )
            // DO NOT REMOVE FOR CLIENT RESULTS!
            .then((data) => { return { rowCount: data.length, rows: data, error: null }

            })
            // DO NOT REMOVE FOR CLIENT!
            .catch((err) => { return { rowCount: -1, rows: [], error: err.message } });

        // Set errors
        if (rowCount < 0) {
            // Propagate error
            errnmsg = error;
        }
        else if (rowCount <= 0) {
            // Propagate error
            errnmsg = "The requested resource could not be found!";
        }

        // Normalize rowCount based to paginator
        ({ rows, rowCount, errnmsg } = sqlUtils.normalizePaginatorResults(
            rows,
            rowCount,
            errnmsg
        ));

        // Return response object
        return respSystem(rowCount, errnmsg, rows);
    },
    viewTeamInfo: async (dbConnection, requestData, sessionData) => {
        // Check requirements
        if (!(
            dbConnection &&
            requestData &&
            sessionData)) {
            // Propagate error
            return respSystem().reset(
                "One or more 'Users.GetUser' requirements are not satisfied!",
                400
            );
        }


        // Get highest role for current token
        // const highestWorkingGroup = sysUtils.resolveHighestWorkingRole(sessionData.roles);

        // Prepare visibility storage
        let operateWithPrivilegies = {
            superuser: false,
        }

        // Update visibility based to roles
        /*switch (highestWorkingGroup) {
            // ADMIN
            case sysUtils.getEnums.UserRoles.Administrator:
                // Set statement director
                operateWithPrivilegies.superuser = true;
                break;

            // GENERIC
            case sysUtils.getEnums.UserRoles.Generic:
                // DEFAULT LOGIC, DO NOTHING
                break;

            // UNKNOWN => BLOCK!
            default:
                // Propagate error
                return respSystem().reset(
                    "Permission call requirements are not satisfied!",
                    403
                );
        }*/


        // Prepare statements
        const stmtSearchEntity = __stmt_SearchView_TeamInfo(
            operateWithPrivilegies,
            true,

        );


        // Prepare error storage
        let errnmsg = null;

        // Get paginator options if exist
        const paginator = sqlUtils.extractPaginator(
            requestData
        );


        // STEP.1: Exec query as sync-call
        let { rows, rowCount, error } = await dbConnection.query(
            // SQL STATEMENT
            sqlUtils.injectPagination(
                stmtSearchEntity,
                paginator
            ),
            // NAMED PARAMETERS
            {
                p_req_entity_id: requestData.id_team,
                p_req_session_id: sessionData.id
            }
        )
            // DO NOT REMOVE FOR CLIENT RESULTS!
            .then((data) => { return { rowCount: data.length, rows: data, error: null }

            })
            // DO NOT REMOVE FOR CLIENT!
            .catch((err) => { return { rowCount: -1, rows: [], error: err.message } });

        // Set errors
        if (rowCount < 0) {
            // Propagate error
            errnmsg = error;
        }
        else if (rowCount <= 0) {
            // Propagate error
            errnmsg = "The requested resource could not be found!";
        }

        // Normalize rowCount based to paginator
        ({ rows, rowCount, errnmsg } = sqlUtils.normalizePaginatorResults(
            rows,
            rowCount,
            errnmsg
        ));

        // Return response object
        return respSystem(rowCount, errnmsg, rows);
    }

});

// Public scope
module.exports = moduleObj;

// ------------------------------------------------------------------------- //
//  END: ENTITY
// ------------------------------------------------------------------------- //

/* global logger */
