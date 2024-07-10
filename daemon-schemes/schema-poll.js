// ------------------------------------------------------------------------- //
//  FORCE STRICT MODE
// ------------------------------------------------------------------------- //

'use strict';

// ------------------------------------------------------------------------- //
//
//  DAEMON SCHEMA: NOTICEBOARDS
//
// ------------------------------------------------------------------------- //

// ------------------------------------------------------------------------- //
//  EXPORT MODULES
// ------------------------------------------------------------------------- //

/**
 * @author:      mmmarella
 * @version:     06/08/2021 (dd/mm/yyyy)
 * @description: Ritorna la lista entities di swagger.
 * @type:        Sync Function
 *
 * @returns Swagger Tags - Array
 */
const moduleObj = Object.freeze((fastify) => {
    // --------------------------------------------------------------------- |
    fastify.addSchema({
        // Common definitions area
        $id: "SchemaRequestPollCreate",
        type: "object",
        description: "Describe the identifier of entity.",
        // Parameters match area
        properties: {
            choices_name: {
                type: "string",
                description: "Scelte"
            },
            choices_id: {
                type: "string",
                description: "id_scelte"
            },
            id_team: {
                type: "string",
                description: "Mail"
            },
            votes_number: {
                type: "string",
                description: "numero totale di voti"
            }
        },
        //required:["mail","password","username"]
    });




    fastify.addSchema({
        // Common definitions area
        $id: "schema_poll_validation",
        description: "check if all fields are correct",
        type: "object",
        properties: {
            rowCount: {
                type: 'integer'
            },
            message: {
                type: 'string',
                nullable: true
            },
            rows: {
                type: "array",
                items: {
                    id_vote: {
                        type: "string",
                        description: "Id del voto"
                    },
                    choices_name: {
                        type: "string",
                        description: "Scelte"
                    },
                    choices_id: {
                        type: "string",
                        description: "id_scelte"
                    },
                    id_team: {
                        type: "string",
                        description: "Mail"
                    },
                    votes_number: {
                        type: "string",
                        description: "numero totale di voti"
                    }

                }
            }
        }
    });



});

// Public scope
module.exports = moduleObj;

// ------------------------------------------------------------------------- //
//  END: ENTITY
// ------------------------------------------------------------------------- //
