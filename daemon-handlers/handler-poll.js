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
const __pathSchema_POST_PollCreate = {
    // ---------------------------------------------------------->
    //  SWAGGER INFORMATIONS
    // ---------------------------------------------------------->
        hide:        false,
        tags:        ["Poll/Votes API"],
        summary:     "Servizi per la creazione e gestione Votazioni",
        description: "",
    // ---------------------------------------------------------->
    //  OPERATION ID
    // ---------------------------------------------------------->
        operationId: "PollDetails_post",
    // ---------------------------------------------------------->
    //  REQUEST SCHEMAS
    // ---------------------------------------------------------->
        query: { $ref: "SchemaRequestQueryPagination#"},
         //params: {},
         body:   {$ref:"SchemaRequestPollCreate#" },
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
                rows: {ref$:"schema_poll_validation#"}
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
const __pathSchema_DELETE_PollRemove = {
    // ---------------------------------------------------------->
    //  SWAGGER INFORMATIONS
    // ---------------------------------------------------------->
        hide:        false,
        tags:        ["Poll/Votes API"],
        summary:     "Servizi per la creazione e gestione Votazioni",
        description: "",
    // ---------------------------------------------------------->
    //  OPERATION ID
    // ---------------------------------------------------------->
        operationId: "PollDetails_delete",
    // ---------------------------------------------------------->
    //  REQUEST SCHEMAS
    // ---------------------------------------------------------->
        query: { $ref: "SchemaRequestQueryPagination#"},
         //params: {},
         body:   {$ref:"SchemaRequestPollDelete#" },
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
                rows: {ref$:"schema_poll_validation#"}
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
const __pathSchema_POST_PollViewDetails = {
    // ---------------------------------------------------------->
    //  SWAGGER INFORMATIONS
    // ---------------------------------------------------------->
        hide:        false,
        tags:        ["Poll/Votes API"],
        summary:     "Servizi per la creazione e gestione Votazioni",
        description: "",
    // ---------------------------------------------------------->
    //  OPERATION ID
    // ---------------------------------------------------------->
        operationId: "PollDetails_getDetails",
    // ---------------------------------------------------------->
    //  REQUEST SCHEMAS
    // ---------------------------------------------------------->
        query: { $ref: "SchemaRequestQueryPagination#"},
         //params: {},
         body:   {$ref:"SchemaRequestPollDetails#" },
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
                rows: {ref$:"schema_poll_validation#"}
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
const __pathSchema_POST_PollViewDetailsSingle = {
    // ---------------------------------------------------------->
    //  SWAGGER INFORMATIONS
    // ---------------------------------------------------------->
        hide:        false,
        tags:        ["Poll/Votes API"],
        summary:     "Servizi per la creazione e gestione Votazioni",
        description: "",
    // ---------------------------------------------------------->
    //  OPERATION ID
    // ---------------------------------------------------------->
        operationId: "PollDetails_getDetails",
    // ---------------------------------------------------------->
    //  REQUEST SCHEMAS
    // ---------------------------------------------------------->
        query: { $ref: "SchemaRequestQueryPagination#"},
         //params: {},
         body:   {$ref:"SchemaRequestPollDetails#" },
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
                rows: {ref$:"schema_poll_validation#"}
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
const __pathSchema_POST_VotePost = {
    // ---------------------------------------------------------->
    //  SWAGGER INFORMATIONS
    // ---------------------------------------------------------->
        hide:        false,
        tags:        ["Poll/Votes API"],
        summary:     "Servizi per la creazione e gestione Votazioni",
        description: "",
    // ---------------------------------------------------------->
    //  OPERATION ID
    // ---------------------------------------------------------->
        operationId: "Vote_Details_PostVote",
    // ---------------------------------------------------------->
    //  REQUEST SCHEMAS
    // ---------------------------------------------------------->
        query: { $ref: "SchemaRequestQueryPagination#"},
         //params: {},
         body:   {$ref:"SchemaRequestVoteInser#" },
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
                rows: {ref$:"schema_poll_validation#"}
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
const __pathSchema_GET_PollStats = {
    // ---------------------------------------------------------->
    //  SWAGGER INFORMATIONS
    // ---------------------------------------------------------->
        hide:        false,
        tags:        ["Poll/Votes API"],
        summary:     "Servizi per la creazione e gestione Votazioni",
        description: "",
    // ---------------------------------------------------------->
    //  OPERATION ID
    // ---------------------------------------------------------->
        operationId: "PollDetails_VoteStats",
    // ---------------------------------------------------------->
    //  REQUEST SCHEMAS
    // ---------------------------------------------------------->
        query: { $ref: "SchemaRequestQueryPagination#"},
         //params: {},
         body:   {$ref:"SchemaRequestPollDelete#" },
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
                rows: {ref$:"schema_poll_validation#"}
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
        "/api/v2/poll_create": [
            {
                // --------------------------------------------------------- #
                method: "POST",
                // --------------------------------------------------------- #
                schema: __pathSchema_POST_PollCreate,
                // --------------------------------------------------------- #
                preHandler: null /*fastify.auth([
                    fastify.authorizationBearerJWT
                ])*/,
                // --------------------------------------------------------- #
                handler: require("../daemon-services/poll/web2/service-createPoll"),
                // --------------------------------------------------------- #
                postHandler: null
                // --------------------------------------------------------- #
            }
        ],
        // ----------------------------------------------------------------- |
        "/api/v2/poll_view": [
            {
                // --------------------------------------------------------- #
                method: "POST",
                // --------------------------------------------------------- #
                schema: __pathSchema_POST_PollViewDetails,
                // --------------------------------------------------------- #
                preHandler: null /*fastify.auth([
                    fastify.authorizationBearerJWT
                ])*/,
                // --------------------------------------------------------- #
                handler: require("../daemon-services/poll/web2/service-getPolls"),
                // --------------------------------------------------------- #
                postHandler: null
                // --------------------------------------------------------- #
            }
        ],
        // ----------------------------------------------------------------- |
        "/api/v2/poll_delete": [
            {
                // --------------------------------------------------------- #
                method: "DELETE",
                // --------------------------------------------------------- #
                schema: __pathSchema_DELETE_PollRemove,
                // --------------------------------------------------------- #
                preHandler: null /*fastify.auth([
                    fastify.authorizationBearerJWT
                ])*/,
                // --------------------------------------------------------- #
                handler: require("../daemon-services/poll/web2/service-deletePoll"),
                // --------------------------------------------------------- #
                postHandler: null
                // --------------------------------------------------------- #
            }
        ],
        // ----------------------------------------------------------------- |
        "/api/v2/vote_insert": [
            {
                // --------------------------------------------------------- #
                method: "PUT",
                // --------------------------------------------------------- #
                schema: __pathSchema_POST_VotePost,
                // --------------------------------------------------------- #
                preHandler: null /*fastify.auth([
                    fastify.authorizationBearerJWT
                ])*/,
                // --------------------------------------------------------- #
                handler: require("../daemon-services/poll/web2/service-insertVoteweb2"),
                // --------------------------------------------------------- #
                postHandler: null
                // --------------------------------------------------------- #
            }
        ],
        // ----------------------------------------------------------------- |
        "/api/v2/poll_stats": [
            {
                // --------------------------------------------------------- #
                method: "POST",
                // --------------------------------------------------------- #
                schema: __pathSchema_GET_PollStats,
                // --------------------------------------------------------- #
                preHandler: null /*fastify.auth([
                    fastify.authorizationBearerJWT
                ])*/,
                // --------------------------------------------------------- #
                handler: require("../daemon-services/poll/web2/service-getPollStats"),
                // --------------------------------------------------------- #
                postHandler: null
                // --------------------------------------------------------- #
            }
        ],
        "/api/v2/poll_details": [
            {
                // --------------------------------------------------------- #
                method: "POST",
                // --------------------------------------------------------- #
                schema: __pathSchema_POST_PollViewDetailsSingle,
                // --------------------------------------------------------- #
                preHandler: null /*fastify.auth([
                    fastify.authorizationBearerJWT
                ])*/,
                // --------------------------------------------------------- #
                handler: require("../daemon-services/poll/web2/service-pollDetails"),
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
