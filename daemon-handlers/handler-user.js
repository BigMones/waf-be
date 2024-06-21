// ------------------------------------------------------------------------- //
//  FORCE STRICT MODE
// ------------------------------------------------------------------------- //

'use strict';

// ------------------------------------------------------------------------- //
//
//  DAEMON HANDLE: NOTICEBOARDS
//
// ------------------------------------------------------------------------- //
//  PATHS SCHEMA
// ------------------------------------------------------------------------- //

// Generate new schema from kernel default
const __pathSchema_POST_RegisterToken = {
    // ---------------------------------------------------------->
    //  SWAGGER INFORMATIONS
    // ---------------------------------------------------------->
        hide:        false,
        tags:        ["Login/Register Services"],
        summary:     "Servizio Per la Login e la registrazione utenti",
        description: "",
    // ---------------------------------------------------------->
    //  OPERATION ID
    // ---------------------------------------------------------->
        operationId: "RegisterDetails_post",
    // ---------------------------------------------------------->
    //  REQUEST SCHEMAS
    // ---------------------------------------------------------->
        query: { $ref: "SchemaRequestQueryPagination#"},
         //params: {},
         body:   {$ref:"SchemaRequestRegister#" },
    // ---------------------------------------------------------->
    //  RESPONSE SCHEMAS
    // ---------------------------------------------------------->
        response: {
            200: {            type: "object",
            properties: {
                rowCount: {
                    type: 'integer'
                },
                message: {
                    type: ['string', 'object'],
                    nullable: true
                },
                rows: {ref$:"schema_login_validation#"}
            }},
            400: { $ref: "SchemaResponseError400#" },
            401: { $ref: "SchemaResponseError401#" },
            403: { $ref: "SchemaResponseError403#" },
            429: { $ref: "SchemaResponseError429#" },
            500: { $ref: "SchemaResponseError500#" }
        },
    // ---------------------------------------------------------->
    //  SECURITY SCHEMAS
    // ---------------------------------------------------------->
        /*security: [
             { "bearer_jwt_token": [] }
        ]*/
    // ---------------------------------------------------------->
    //  END
    // ---------------------------------------------------------->
};
const __pathSchema_POST_LoginToken = {
    // ---------------------------------------------------------->
    //  SWAGGER INFORMATIONS
    // ---------------------------------------------------------->
        hide:        false,
        tags:        ["Login/Register Services"],
        summary:     "Servizio Per la Login e la registrazione utenti",
        description: "",
    // ---------------------------------------------------------->
    //  OPERATION ID
    // ---------------------------------------------------------->
        operationId: "LoginDetails_post",
    // ---------------------------------------------------------->
    //  REQUEST SCHEMAS
    // ---------------------------------------------------------->
        query: { $ref: "SchemaRequestQueryPagination#"},
         //params: {},
         body:   {$ref:"SchemaLoginPost#" },
    // ---------------------------------------------------------->
    //  RESPONSE SCHEMAS
    // ---------------------------------------------------------->
        response: {
            200: {            type: "object",
            properties: {
                rowCount: {
                    type: 'integer'
                },
                message: {
                    type: ['string', 'object'],
                    nullable: true
                },
                rows: {ref$:"schema_login_validation#"}
            }},
            400: { $ref: "SchemaResponseError400#" },
            401: { $ref: "SchemaResponseError401#" },
            403: { $ref: "SchemaResponseError403#" },
            429: { $ref: "SchemaResponseError429#" },
            500: { $ref: "SchemaResponseError500#" }
        },
    // ---------------------------------------------------------->
    //  SECURITY SCHEMAS
    // ---------------------------------------------------------->
        /*security: [
             { "bearer_jwt_token": [] }
        ]*/
    // ---------------------------------------------------------->
    //  END
    // ---------------------------------------------------------->
};
const __pathSchema_PUT_PasswordChange = {
    // ---------------------------------------------------------->
    //  SWAGGER INFORMATIONS
    // ---------------------------------------------------------->
        hide:        false,
        tags:        ["Login/Register Services"],
        summary:     "Servizio Per la Login e la registrazione utenti",
        description: "",
    // ---------------------------------------------------------->
    //  OPERATION ID
    // ---------------------------------------------------------->
        operationId: "ChangePassword_put",
    // ---------------------------------------------------------->
    //  REQUEST SCHEMAS
    // ---------------------------------------------------------->
        query: { $ref: "SchemaRequestQueryPagination#"},
         //params: {},
         body:   {$ref:"SchemaRequestChangeToken#" },
    // ---------------------------------------------------------->
    //  RESPONSE SCHEMAS
    // ---------------------------------------------------------->
        response: {
            200: {            type: "object",
            properties: {
                rowCount: {
                    type: 'integer'
                },
                message: {
                    type: ['string', 'object'],
                    nullable: true
                },
                rows: {ref$:"schema_login_validation#"}
            }},
            400: { $ref: "SchemaResponseError400#" },
            401: { $ref: "SchemaResponseError401#" },
            403: { $ref: "SchemaResponseError403#" },
            429: { $ref: "SchemaResponseError429#" },
            500: { $ref: "SchemaResponseError500#" }
        },
    // ---------------------------------------------------------->
    //  SECURITY SCHEMAS
    // ---------------------------------------------------------->
        /*security: [
             { "bearer_jwt_token": [] }
        ]*/
    // ---------------------------------------------------------->
    //  END
    // ---------------------------------------------------------->
};
const __pathSchema_DELETE_User = {
    // ---------------------------------------------------------->
    //  SWAGGER INFORMATIONS
    // ---------------------------------------------------------->
        hide:        false,
        tags:        ["Login/Register Services"],
        summary:     "Servizio Per la Login e la registrazione utenti",
        description: "",
    // ---------------------------------------------------------->
    //  OPERATION ID
    // ---------------------------------------------------------->
        operationId: "User_delete",
    // ---------------------------------------------------------->
    //  REQUEST SCHEMAS
    // ---------------------------------------------------------->
        query: { $ref: "SchemaRequestQueryPagination#"},
         //params: {},
         body:   {$ref:"SchemaRequestDeleteUser#" },
    // ---------------------------------------------------------->
    //  RESPONSE SCHEMAS
    // ---------------------------------------------------------->
        response: {
            200: {            type: "object",
            properties: {
                rowCount: {
                    type: 'integer'
                },
                message: {
                    type: ['string', 'object'],
                    nullable: true
                },
                rows: {ref$:"schema_login_validation#"}
            }},
            400: { $ref: "SchemaResponseError400#" },
            401: { $ref: "SchemaResponseError401#" },
            403: { $ref: "SchemaResponseError403#" },
            429: { $ref: "SchemaResponseError429#" },
            500: { $ref: "SchemaResponseError500#" }
        },
    // ---------------------------------------------------------->
    //  SECURITY SCHEMAS
    // ---------------------------------------------------------->
        /*security: [
             { "bearer_jwt_token": [] }
        ]*/
    // ---------------------------------------------------------->
    //  END
    // ---------------------------------------------------------->
};
// ------------------------------------------------------------------------- //


// ------------------------------------------------------------------------- //
//  EXPORT MODULES
// ------------------------------------------------------------------------- //

/**
 * @author:      mmmarella
 * @version:     06/08/2021 (dd/mm/yyyy)
 * @description: Fornisce informazioni sul servizio
 * @type:        Sync Function
 *
 * @param {Object} fastify
 * @returns Route Object
 */
const moduleObj = Object.freeze((/*fastify*/) => {
    // --------------------------------------------------------------------- |

    // Generate object with handlers
    return {
        // ----------------------------------------------------------------- |
        //  SEARCH
        // ----------------------------------------------------------------- |
        "/api/v2/register": [
            {
                // --------------------------------------------------------- #
                method: "POST",
                // --------------------------------------------------------- #
                schema: __pathSchema_POST_RegisterToken,
                // --------------------------------------------------------- #
                preHandler: null /*fastify.auth([
                    fastify.authorizationBearerJWT
                ])*/,
                // --------------------------------------------------------- #
                handler: require("../daemon-services/users/service-postuser"),
                // --------------------------------------------------------- #
                postHandler: null
                // --------------------------------------------------------- #
            }
        ],
        "/api/v2/login": [
            {
                // --------------------------------------------------------- #
                method: "POST",
                // --------------------------------------------------------- #
                schema: __pathSchema_POST_LoginToken,
                // --------------------------------------------------------- #
                preHandler: null /*fastify.auth([
                    fastify.authorizationBearerJWT
                ])*/,
                // --------------------------------------------------------- #
                handler: require("../daemon-services/users/service-login"),
                // --------------------------------------------------------- #
                postHandler: null
                // --------------------------------------------------------- #
            }
        ],
        "/api/v2/reset_pw": [
            {
                // --------------------------------------------------------- #
                method: "PUT",
                // --------------------------------------------------------- #
                schema: __pathSchema_PUT_PasswordChange,
                // --------------------------------------------------------- #
                preHandler: null /*fastify.auth([
                    fastify.authorizationBearerJWT
                ])*/,
                // --------------------------------------------------------- #
                handler: require("../daemon-services/users/service-changepassword"),
                // --------------------------------------------------------- #
                postHandler: null
                // --------------------------------------------------------- #
            }
        ],
        "/api/v2/delete_pw": [
            {
                // --------------------------------------------------------- #
                method: "DELETE",
                // --------------------------------------------------------- #
                schema: __pathSchema_DELETE_User,
                // --------------------------------------------------------- #
                preHandler: null /*fastify.auth([
                    fastify.authorizationBearerJWT
                ])*/,
                // --------------------------------------------------------- #
                handler: require("../daemon-services/users/service-deleteuser"),
                // --------------------------------------------------------- #
                postHandler: null
                // --------------------------------------------------------- #
            }
        ],


        // ----------------------------------------------------------------- |
    };

    // --------------------------------------------------------------------- |
});

// Public scope
module.exports = moduleObj;

// ------------------------------------------------------------------------- //
//  END: ENTITY
// ------------------------------------------------------------------------- //
