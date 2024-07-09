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
const userUtils = require("../daemon-utilities/utility-user");

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
    operateWithPrivilegies = null,
    // eslint-disable-next-line no-unused-vars

    //FileName = ""
) => {


    // Debug visibility
    logger.debug("SQLRBAC<notices>.OperateWithPrivilegies():  " + JSON.stringify(
        operateWithPrivilegies, null, 4
    ));

    // Get flag
    let whereExist = false;

    // Prepare predicate
    const __getPredicate = () => {
        // Get term
        const term = ((
            EntityCodicePadre
        ) ? (whereExist ? "AND " : "WHERE ") : "");

        // Set true
        if (!whereExist && term != "") {
            whereExist = true;
        }

        // Send back
        return term;
    };

    // Prepare filter
    const filterStmtEntityID = EntityCodicePadre ? "entity.CodicePadre = :p_req_entity_CodicePadre" : "";
    const filterOrderBy = order == 'DESC' ? 'DESC': 'ASC';
    

    // Preapre privilegies management
    let filterByGrpPerms = true; // DEFAULT ENABLED FOR ALL
    let filterStmtGrpPerms = '';   // DEFAULT EMPTY FOR ALL

    // Populate privilegies for: ADMIN
    /*if (operateWithPrivilegies &&
        operateWithPrivilegies.superuser) {
        // DISABLED FOR ADMIN!!!!
        filterByGrpPerms = false;
    }
    // ...otherwise for: COMMON
    else {
        // Add filter for current role
        filterStmtGrpPerms = `AND entity.ID_STR IN (
            -- FILTER DATASET BY :p_req_session_id
        )`;
    }*/

    // Prepare statement

    /*|-------------QUERY EXAMPLE-------------|
    

    
    */
    let statement_file =  `
    SELECT * FROM votes ;`
    


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
    

    
    */
    let statement_file =  `
    DELETE from users where mail= :p_req_entity_mail RETURNING '1' ;`
    


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
    UPDATE users
    SET 
    username = :p_req_entity_username,
    descrizione = :p_req_entity_descrizione,
    ruolo= :p_req_entity_ruolo,
    id_favourite= :p_req_entity_favourite,
    is_mvf = :p_req_entity_mvf,
    pubkey = :p_req_entity_pubkey

    where email = :p_req_entity_mail;`


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
    insert into users (
        username,
        password,
        mail,
        regdate,
        descrizione,
        ruolo,
        id_favourite
       ) 
        values(
            :p_req_entity_username,
            md5(:p_req_entity_password),
            :p_req_entity_mail,
            :p_req_entity_regdate,
            :p_req_entity_descrizione,
            :p_req_entity_ruolo,
            :p_req_entity_fav
        )
        RETURNING id
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
        SELECT
            id as id,
            username,
            regdate,
            descrizione,
            ruolo,
            id_favourite
        FROM users
        WHERE
            username= :p_req_entity_user AND
            password= md5(:p_req_entity_Password)
        LIMIT 1
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
        const stmtSearchEntity = __stmt_SearchView_UsersDelete(
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
                p_req_entity_mail: requestData.mail,
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
    updatePoll: async (dbConnection, requestData, sessionData) => {
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
        let entity_id = requestData.email;

        // Get current entity data for merge
        let entityRecordData = await userUtils.getCioRecordData(
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
            orig_post_parent = entityRecordData.rows[0]["mail"];

            // Merge new data with old if exists
            entityRecordData.rows[0] = {
                ...entityRecordData.rows[0],
                ...requestData
            };
        }

        // Prepare statements
        const stmtSearchEntity = __stmt_SearchView_UsersUpdate(
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
                p_req_entity_id: entity_id,
                p_req_entity_username: entityRecordData.rows[0]["username"],
                p_req_entity_descrizione: entityRecordData.rows[0]["descrizione"],
                p_req_entity_ruolo: entityRecordData.rows[0]["ruolo"],
                p_req_entity_favourite: entityRecordData.rows[0]["id_favourite"],
                p_req_entity_mvf: entityRecordData.rows[0]["is_mvf"],
                p_req_entity_pubkey: entityRecordData.rows[0]["pubkey"],
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
            ({ rows, rowCount, error } = await userUtils.getUserRecordData(
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
        const stmtSearchEntity = __stmt_SearchView_UsersInsert(
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
                p_req_entity_username: requestData.username,
                p_req_entity_password: requestData.password,
                p_req_entity_mail: requestData.mail,
                p_req_entity_regdate: requestData.regdate   ?   requestData.regdate : moment().format("YYYY-MM-DD HH:mm:ss"),
                p_req_entity_descrizione: requestData.descrizione,
                p_req_entity_ruolo: requestData.ruolo,
                p_req_entity_fav : requestData.id_favourite ? requestData.id_favourite : '0',
                p_req_session_id: sessionData.id
            }
        )
            // DO NOT REMOVE FOR CLIENT RESULTS!
            .then((data) => { 
                
                 var messaggio_corretto = "Registrazione Completata";


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
    loginCheck: async (dbConnection, requestData, sessionData) => {
        // Check requirements
        if (!(
            dbConnection &&
            requestData  &&
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
        const stmtSearchEntity = __stmt_SearchView_Login(
            operateWithPrivilegies

        );
        // Prepare error storage
        let errnmsg = null;

        // Get paginator options if exist
        const paginator = sqlUtils.extractPaginator(
            requestData
        );

        // STEP.1: Exec query as sync-call
        let {rows, rowCount, error} = await dbConnection.query(
            // SQL STATEMENT
            sqlUtils.injectPagination(
                stmtSearchEntity,
                paginator
            ),
            // NAMED PARAMETERS
            {
                p_req_entity_user: requestData.username,
                p_req_entity_Password: requestData.password,
                p_req_session_id: sessionData.id
            }
        )
        // DO NOT REMOVE FOR CLIENT RESULTS!
        .then((data) => { return { rowCount: data.length, rows: data, error: null } })
        // DO NOT REMOVE FOR CLIENT!
        .catch((err) => { return { rowCount: -1, rows: [], error: err.message } });

        // Set errors
        if (rowCount < 0) {
            // Propagate error
            errnmsg = error;
        }
        else if (rowCount <= 0) {
            // Propagate error
            errnmsg = "Invalid Login or Password";
        }
        else{
            let JWT_TOKEN = jwtHandler.sign(
                rows[0],
                SettingsMngSingleton.getInstance().getProperty("authentication", "auth-jwt-jwt-secret"),
                {
                    algorithm: SettingsMngSingleton.getInstance().getProperty("authentication", "auth-jwt-algorithm"),
                    expiresIn: SettingsMngSingleton.getInstance().getProperty("authentication", "auth-jwt-expire-in"),
                    audience:  SettingsMngSingleton.getInstance().getProperty("authentication", "auth-jwt-verify-audience"),
                    issuer:    SettingsMngSingleton.getInstance().getProperty("authentication", "auth-jwt-verify-issuer")
                }
            );
            rows = [{
                token:JWT_TOKEN,
                creation_time:Date.now(),
                expiresIn:"about 2 hours",
                //amm_trasp_type: rows.data.amm_trasp_type
            }]
        }

        // Normalize rowCount based to paginator
        ({rows, rowCount, errnmsg} = sqlUtils.normalizePaginatorResults(
            rows,
            rowCount,
            errnmsg
        ));

        // Return response object
        return respSystem(rowCount, errnmsg, rows);
    },
    loginWalletCheck: async (dbConnection, requestData, sessionData) => {
        // Check requirements
        if (!(
            dbConnection &&
            requestData  &&
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
        const stmtSearchEntity = __stmt_SearchView_PubKeyLogin(
            operateWithPrivilegies

        );
        // Prepare error storage
        let errnmsg = null;

        // Get paginator options if exist
        const paginator = sqlUtils.extractPaginator(
            requestData
        );

        // STEP.1: Exec query as sync-call
        let {rows, rowCount, error} = await dbConnection.query(
            // SQL STATEMENT
            sqlUtils.injectPagination(
                stmtSearchEntity,
                paginator
            ),
            // NAMED PARAMETERS
            {
                p_req_entity_publickey: requestData.pubkey,
                p_req_session_id: sessionData.id
            }
        )
        // DO NOT REMOVE FOR CLIENT RESULTS!
        .then((data) => { return { rowCount: data.length, rows: data, error: null } })
        // DO NOT REMOVE FOR CLIENT!
        .catch((err) => { return { rowCount: -1, rows: [], error: err.message } });

        // Set errors
        if (rowCount < 0) {
            // Propagate error
            errnmsg = error;
        }
        else if (rowCount <= 0) {
            // Propagate error
            errnmsg = "Phantom Wallet not Found";
        }
        else{
            let JWT_TOKEN = jwtHandler.sign(
                rows[0],
                SettingsMngSingleton.getInstance().getProperty("authentication", "auth-jwt-jwt-secret"),
                {
                    algorithm: SettingsMngSingleton.getInstance().getProperty("authentication", "auth-jwt-algorithm"),
                    expiresIn: SettingsMngSingleton.getInstance().getProperty("authentication", "auth-jwt-expire-in"),
                    audience:  SettingsMngSingleton.getInstance().getProperty("authentication", "auth-jwt-verify-audience"),
                    issuer:    SettingsMngSingleton.getInstance().getProperty("authentication", "auth-jwt-verify-issuer")
                }
            );
            rows = [{
                token:JWT_TOKEN,
                creation_time:Date.now(),
                expiresIn:"about 2 hours",
                //amm_trasp_type: rows.data.amm_trasp_type
            }]
        }

        // Normalize rowCount based to paginator
        ({rows, rowCount, errnmsg} = sqlUtils.normalizePaginatorResults(
            rows,
            rowCount,
            errnmsg
        ));

        // Return response object
        return respSystem(rowCount, errnmsg, rows);
    },
    changePassword: async (dbConnection, requestData, sessionData) => {
        // Check requirements
        if (!(
            dbConnection &&
            requestData  &&
            sessionData)) {
            // Propagate error
            return respSystem().reset(
                "One or more 'Users.ChangePassw' requirements are not satisfied!",
                400
            );
        }

       let Email=requestData.mail;
        let Password = requestData.password;
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
        const stmtSearchEntity = __stmt_SearchView_ChangePassword(
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
        let {rows, rowCount, error} = await dbConnection.query(
            // SQL STATEMENT
            sqlUtils.injectPagination(
                stmtSearchEntity,
                paginator
            ),
            // NAMED PARAMETERS
            {
                p_req_entity_Email: Email,
                p_req_entity_Password: Password,
                p_req_session_id: sessionData.id
            }
        )
        .then((data) => {

            return { rowCount: data.length, rows: data, error: null } })
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
        else{
            rows = [{
                mail:requestData.email,
                creation_time:Date.now(),
                alert:"Password Changed"
            }]
        }

        // Normalize rowCount based to paginator
        ({rows, rowCount, errnmsg} = sqlUtils.normalizePaginatorResults(
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
