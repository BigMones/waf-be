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
const __pathSchema_GET_LoginToken = {
    // ---------------------------------------------------------->
    //  SWAGGER INFORMATIONS
    // ---------------------------------------------------------->
        hide:        false,
        tags:        ["Login Service"],
        summary:     "Servizio Per la Login",
        description: "",
    // ---------------------------------------------------------->
    //  OPERATION ID
    // ---------------------------------------------------------->
        operationId: "LoginDetails_get",
    // ---------------------------------------------------------->
    //  REQUEST SCHEMAS
    // ---------------------------------------------------------->
        query: { $ref: "SchemaRequestQueryPagination#"},
         //params: {},
         body:   {$ref:"SchemaRequestLogin#" },
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
        security: [
             { "bearer_jwt_token": [] }
        ]
    // ---------------------------------------------------------->
    //  END
    // ---------------------------------------------------------->
};
const __pathSchema_GET_Login = {
    // ---------------------------------------------------------->
    //  SWAGGER INFORMATIONS
    // ---------------------------------------------------------->
        hide:        false,
        tags:        ["Login Service"],
        summary:     "Servizio Per la Login",
        description: "",
    // ---------------------------------------------------------->
    //  OPERATION ID
    // ---------------------------------------------------------->
        operationId: "LoginDetails_login",
    // ---------------------------------------------------------->
    //  REQUEST SCHEMAS
    // ---------------------------------------------------------->
        query: { $ref: "SchemaRequestQueryPagination#"},
         //params: {},
         body:   {$ref:"SchemaRequestLoginToken#" },
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
                rows: {ref$:"schema_login_token_validation#"}
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
        security: [
             { "bearer_jwt_token": [] }
        ]
    // ---------------------------------------------------------->
    //  END
    // ---------------------------------------------------------->
};
// ------------------------------------------------------------------------- //


// ------------------------------------------------------------------------- //
//  EXPORT MODULES
// ------------------------------------------------------------------------- //

/**
 * @author:      lsvanzo
 * @version:     06/08/2021 (dd/mm/yyyy)
 * @description: Fornisce informazioni sul servizio
 * @type:        Sync Function
 *
 * @param {Object} fastify
 * @returns Route Object
 */
const moduleObj = Object.freeze((fastify) => {
    // --------------------------------------------------------------------- |

    // Generate object with handlers
    return {
        // ----------------------------------------------------------------- |
        //  SEARCH
        // ----------------------------------------------------------------- |
        "/register": [
            {
                // --------------------------------------------------------- #
                method: "POST",
                // --------------------------------------------------------- #
                schema: __pathSchema_GET_LoginToken,
                // --------------------------------------------------------- #
                preHandler: fastify.auth([
                    fastify.authorizationBearerJWT
                ]),
                // --------------------------------------------------------- #
                handler: require("../daemon-services/users/service-postuser"),
                // --------------------------------------------------------- #
                postHandler: null
                // --------------------------------------------------------- #
            }
        ],
        "/login/": [
            {
                // --------------------------------------------------------- #
                method: "POST",
                // --------------------------------------------------------- #
                schema: __pathSchema_GET_Login,
                // --------------------------------------------------------- #
                preHandler: null /*fastify.auth([
                    fastify.authorizationBearerJWT
                ])*/,
                // --------------------------------------------------------- #
                handler: require("../daemon-services/login/service-login"),
                // --------------------------------------------------------- #
                postHandler: null
                // --------------------------------------------------------- #
            }
        ],
        "/:ID_User/reset": [
            {
                // --------------------------------------------------------- #
                method: "POST",
                // --------------------------------------------------------- #
                schema: __pathSchema_GET_Login,
                // --------------------------------------------------------- #
                preHandler: null /*fastify.auth([
                    fastify.authorizationBearerJWT
                ])*/,
                // --------------------------------------------------------- #
                handler: require("../daemon-services/login/service-change_password"),
                // --------------------------------------------------------- #
                postHandler: null
                // --------------------------------------------------------- #
            }
        ]

        // ----------------------------------------------------------------- |
    };

    // --------------------------------------------------------------------- |
});

// Public scope
module.exports = moduleObj;

// ------------------------------------------------------------------------- //
//  END: ENTITY
// ------------------------------------------------------------------------- //
