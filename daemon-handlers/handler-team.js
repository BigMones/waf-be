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
const __pathSchema_POST_FavTeamSearch = {
    // ---------------------------------------------------------->
    //  SWAGGER INFORMATIONS
    // ---------------------------------------------------------->
        hide:        false,
        tags:        ["Team/Championship API"],
        summary:     "Servizi per la creazione e gestione dei team presenti sulla piattaforma",
        description: "",
    // ---------------------------------------------------------->
    //  OPERATION ID
    // ---------------------------------------------------------->
        operationId: "TeamDetails_post",
    // ---------------------------------------------------------->
    //  REQUEST SCHEMAS
    // ---------------------------------------------------------->
        query: { $ref: "SchemaRequestQueryPagination#"},
         //params: {},
         body:   {$ref:"SchemaRequestTeam#" },
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
                rows: {ref$:"schema_team_validation#"}
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
const __pathSchema_GET_AllTeams = {
    // ---------------------------------------------------------->
    //  SWAGGER INFORMATIONS
    // ---------------------------------------------------------->
        hide:        false,
        tags:        ["Team/Championship API"],
        summary:     "Servizi per la creazione e gestione dei team presenti sulla piattaforma",
        description: "",
    // ---------------------------------------------------------->
    //  OPERATION ID
    // ---------------------------------------------------------->
        operationId: "TeamDetails_getALL",
    // ---------------------------------------------------------->
    //  REQUEST SCHEMAS
    // ---------------------------------------------------------->
        query: { $ref: "SchemaRequestQueryPagination#"},
         //params: {},
         //body:   {$ref:"SchemaRequestTeam#" },
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
                rows: {ref$:"schema_team_validation#"}
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
        "/api/v2/fav_team": [
            {
                // --------------------------------------------------------- #
                method: "POST",
                // --------------------------------------------------------- #
                schema: __pathSchema_POST_FavTeamSearch,
                // --------------------------------------------------------- #
                preHandler: null /*fastify.auth([
                    fastify.authorizationBearerJWT
                ])*/,
                // --------------------------------------------------------- #
                handler: require("../daemon-services/team/service-searchFavTeam"),
                // --------------------------------------------------------- #
                postHandler: null
                // --------------------------------------------------------- #
            }
        ],
        "/api/v2/all_team": [
            {
                // --------------------------------------------------------- #
                method: "GET",
                // --------------------------------------------------------- #
                schema: __pathSchema_GET_AllTeams,
                // --------------------------------------------------------- #
                preHandler: null /*fastify.auth([
                    fastify.authorizationBearerJWT
                ])*/,
                // --------------------------------------------------------- #
                handler: require("../daemon-services/team/service-getAllTeams"),
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
