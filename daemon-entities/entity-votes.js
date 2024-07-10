// ------------------------------------------------------------------------- //
//
//  DAEMON ENTITY: GENERIC Utente
//
// ------------------------------------------------------------------------- //
//  COMMON MODULES
// ------------------------------------------------------------------------- //

// Kernel
const respSystem = require("../daemon-kernels/kernel-response");
const { SettingsMngSingleton } = require('../daemon-kernels/kernel-settings');
const moment = require('moment');
const jwtHandler = require("jsonwebtoken");

// Utilities
// const sysUtils = require("../daemon-utilities/utility-sys");
const sqlUtils = require("../daemon-utilities/utility-sql");

const pollsUtils = require("../daemon-utilities/utility-polls");

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
 *

 * @returns SQL String
 */

let __stmt_SearchView_PollView = (
     // eslint-disable-next-line no-unused-vars
    operateWithPrivilegies = null,
   
) => {

    let statement_file =  `
    SELECT * FROM votes where id_team= :p_req_entity_id_team ;`
    


    // Return statement


    return statement_file;

};

let __stmt_SearchView_PollSingleView = (
    // eslint-disable-next-line no-unused-vars
   operateWithPrivilegies = null,
  
) => {

   let statement_file =  `
   SELECT * FROM votes where id_vote= :p_req_entity_id_team ;`
   


   // Return statement


   return statement_file;

};
let __stmt_SearchView_PollCreate = (
    operateWithPrivilegies = null,
    // eslint-disable-next-line no-unused-vars


) => {


    // Debug visibility
    logger.debug("SQLRBAC<notices>.OperateWithPrivilegies():  " + JSON.stringify(
        operateWithPrivilegies, null, 4
    ));



    /*|-------------QUERY EXAMPLE-------------|
    
    poll_name           =               :p_req_entity_poll_name,
    id_team             =               :p_req_entity_id_team,
    first_choice_name   =               :p_req_entity_first_choice_name,
    first_choice_id     =               :p_req_entity_first_choice_id,
    first_choice_votes  =               :p_req_entity_first_choice_votes,
    second_choice_name  =               :p_req_entity_second_choice_name,
    second_choice_id    =               :p_req_entity_second_choice_id,
    second_choice_votes =               :p_req_entity_second_choice_votes,
    total_votes         =               :p_req_entity_total_votes,
    exp_poll            =               :p_req_entity_exp_poll
    
    */
    let statement_file =  `
      insert into votes (
        poll_name,
        id_team,
        first_choice_name,
        first_choice_id,
        first_choice_votes,
        second_choice_name,
        second_choice_id,
        second_choice_votes,
        total_votes,
        exp_poll
       ) 
        values(
            :p_req_entity_poll_name,
            :p_req_entity_id_team,
            :p_req_entity_first_choice_name,
            :p_req_entity_first_choice_id,
            :p_req_entity_first_choice_votes,
            :p_req_entity_second_choice_name,
            :p_req_entity_second_choice_id,
            :p_req_entity_second_choice_votes,
            :p_req_entity_total_votes,
            :p_req_entity_exp_poll

  
        )
        RETURNING id_vote
    ;`
    


    // Return statement


    return statement_file;

};
let __stmt_SearchView_PollDelete = (
    operateWithPrivilegies = null,
    // eslint-disable-next-line no-unused-vars


) => {


    // Debug visibility
    logger.debug("SQLRBAC<notices>.OperateWithPrivilegies():  " + JSON.stringify(
        operateWithPrivilegies, null, 4
    ));


    let statement_file =  `
   DELETE from votes where id_vote= :p_req_entity_id_vote`


    // Return statement
    return statement_file;

};
let __stmt_SearchView_PollStats = (
    operateWithPrivilegies = null,
    // eslint-disable-next-line no-unused-vars


) => {


    // Debug visibility
    logger.debug("SQLRBAC<notices>.OperateWithPrivilegies():  " + JSON.stringify(
        operateWithPrivilegies, null, 4
    ));



    /*|-------------QUERY EXAMPLE-------------|
    

    
    */
    let statement_file =  `
    SELECT id_vote,first_choice_name,first_choice_id,second_choice_name,second_choice_id, total_votes from votes where id_vote = :p_req_entity_id_vote
    ;`


    // Return statement
    return statement_file;

};
let __stmt_SearchView_VoteInsert = (
    operateWithPrivilegies = null
) => {
    // Debug visibility
    logger.debug("SQLRBAC<notices>.OperateWithPrivilegies():  " + JSON.stringify(
        operateWithPrivilegies, null, 4
    ));

    // Prepare predicate
    let statement_file = `
    UPDATE votes SET 
    poll_name           =               :p_req_entity_poll_name,
    id_team             =               :p_req_entity_id_team,
    first_choice_name   =               :p_req_entity_first_choice_name,
    first_choice_id     =               :p_req_entity_first_choice_id,
    first_choice_votes  =               :p_req_entity_first_choice_votes,
    second_choice_name  =               :p_req_entity_second_choice_name,
    second_choice_id    =               :p_req_entity_second_choice_id,
    second_choice_votes =               :p_req_entity_second_choice_votes,
    total_votes         =               :p_req_entity_total_votes,
    exp_poll            =               :p_req_entity_exp_poll
    
    WHERE id_vote = :p_req_entity_id_vote
    ;`;

    
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

    viewPoll: async (dbConnection, requestData, sessionData) => {
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
        const stmtSearchEntity = __stmt_SearchView_PollView(
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
                p_req_entity_id_team: requestData.id_team,
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
    viewSinglePoll: async (dbConnection, requestData, sessionData) => {
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
        const stmtSearchEntity = __stmt_SearchView_PollSingleView(
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
                p_req_entity_id_team: requestData.id_vote,
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
    deletePoll: async (dbConnection, requestData, sessionData) => {
        // Check requirements
        if (!(
            dbConnection &&
            requestData &&
            sessionData)) {
            // Propagate error
            return respSystem().reset(
                "One or more 'GenericDocument.GetAllFiles' requirements are not satisfied!",
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
        const stmtSearchEntity = __stmt_SearchView_PollDelete(
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
                p_req_entity_id_vote: requestData.id_vote,
                p_req_session_id: sessionData.id
            }
        )
            // DO NOT REMOVE FOR CLIENT RESULTS!
            .then((data) => { 
                
                 var messaggio_corretto = "Utente Eliminato Correttamente";


                return { rowCount: data.length, rows: [ {res:messaggio_corretto}], error: null }

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
    insertPoll: async (dbConnection, requestData, sessionData) => {
        // Check requirements
        if (!(
            dbConnection &&
            requestData &&
            sessionData)) {
            // Propagate error
            return respSystem().reset(
                "One or more 'User.InserUser' requirements are not satisfied!",
                400
            );
        }


        // Prepare visibility storage
        let operateWithPrivilegies = {
            superuser: false,
        }

        // Prepare statements
        const stmtSearchEntity = __stmt_SearchView_PollCreate(
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
                p_req_entity_poll_name : requestData.poll_name,
                p_req_entity_id_team : requestData.id_team,
                p_req_entity_first_choice_name : requestData.first_choice_name,
                p_req_entity_first_choice_id : requestData.first_choice_id,
                p_req_entity_first_choice_votes : requestData.first_choice_votes,
                p_req_entity_second_choice_name : requestData.second_choice_name,
                p_req_entity_second_choice_id : requestData.second_choice_id,
                p_req_entity_second_choice_votes : requestData.second_choice_votes,
                p_req_entity_total_votes : requestData.total_votes,
                p_req_entity_exp_poll : requestData.exp_poll,
                p_req_session_id: sessionData.id
            }
        )
            // DO NOT REMOVE FOR CLIENT RESULTS!
            .then((data) => { 
                
                 var messaggio_corretto = "Poll Creato";


                return { rowCount: data.length, rows: [ {res:messaggio_corretto}], error: null }

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
    insertVote: async (dbConnection, requestData, sessionData) => {
        // Check requirements
        if (!(
            dbConnection &&
            requestData &&
            sessionData)) {
            // Propagate error
            return respSystem().reset(
                "One or more 'User.UpdateUser' requirements are not satisfied!",
                400
            );
        }

        // Get highest role for current token
        // const highestWorkingGroup = sysUtils.resolveHighestWorkingRole(sessionData.roles);

        // Prepare visibility storage
        let operateWithPrivilegies = {
            superuser: false,
        }
        let entity_id = requestData.id_vote;

        // Get current entity data for merge
        let entityRecordData = await pollsUtils.getPollsRecordData(
            dbConnection,
            entity_id
        );
        // Backup parent for check
        let orig_post_parent = null;
        // Check for errors
        if (entityRecordData.rowCount < 0) {
            // Propagate error
            return respSystem().reset(entityRecordData.error);
        }
        else if (entityRecordData.rowCount <= 0) {
            // Propagate error
            return respSystem().reset("The requested resource could not be found!");
        }        else {
            // Replace value from DB
            // eslint-disable-next-line no-unused-vars
            orig_post_parent = entityRecordData.rows[0]["id_vote"];

            // Merge new data with old if exists
            entityRecordData.rows[0] = {
                ...entityRecordData.rows[0],
                ...requestData
            };
        }

        // Prepare statements
        const stmtSearchEntity = __stmt_SearchView_VoteInsert(
            operateWithPrivilegies,

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
            // NAMED PARAMETERS,

            {
                p_req_entity_id_vote: entity_id,
                p_req_entity_poll_name: entityRecordData.rows[0]["poll_name"],
                p_req_entity_id_team: entityRecordData.rows[0]["id_team"],
                p_req_entity_first_choice_name: entityRecordData.rows[0]["first_choice_name"],
                p_req_entity_first_choice_id: entityRecordData.rows[0]["first_choice_id"],
                p_req_entity_first_choice_votes: entityRecordData.rows[0]["first_choice_votes"],
                p_req_entity_second_choice_name: entityRecordData.rows[0]["second_choice_name"],
                p_req_entity_second_choice_id: entityRecordData.rows[0]["second_choice_id"],
                p_req_entity_second_choice_votes: entityRecordData.rows[0]["second_choice_votes"],
                p_req_entity_total_votes: entityRecordData.rows[0]["total_votes"],
                p_req_entity_exp_poll: entityRecordData.rows[0]["exp_poll"],
                p_req_session_id: sessionData.id
            }
        )
            // DO NOT REMOVE FOR CLIENT RESULTS!
            .then((data) => {
                //var messaggio_corretto = "Inserimento avvenuto con successo.";

                return { rowCount: data.affectedRaws, rows: [], error: null }
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
        }        else {
            // Get current entity data for merge
            ({ rows, rowCount, error } = await pollsUtils.getPollsRecordData(
                dbConnection,
                entity_id
            ));

            // Set errors
            if (rowCount < 0) {
                // Propagate error
                errnmsg = error;
            }
            else if (rowCount <= 0) {
                // Propagate error
                errnmsg = "Unable to complete update of the current entity!";
            }
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
    viewStats: async (dbConnection, requestData, sessionData) => {
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
        const stmtSearchEntity = __stmt_SearchView_PollStats(
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
                p_req_entity_id_vote : requestData.id_vote,
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
});

// Public scope
module.exports = moduleObj;

// ------------------------------------------------------------------------- //
//  END: ENTITY
// ------------------------------------------------------------------------- //

/* global logger */
