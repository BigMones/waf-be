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
            poll_name: {
                type: "string",
                description: "Scelte"
            },
            id_team: {
                type: "string",
                description: "id_scelte"
            },
            first_choice_name: {
                type: "string",
                description: "Mail"
            },
            first_choice_id: {
                type: "string",
                description: "numero totale di voti"
            },
            first_choice_votes: {
                type: "string",
                description: "numero totale di voti"
            },
            second_choice_name: {
                type: "string",
                description: "numero totale di voti"
            },
            second_choice_id: {
                type: "string",
                description: "numero totale di voti"
            },
            second_choice_votes: {
                type: "string",
                description: "numero totale di voti"
            },
            total_votes: {
                type: "string",
                description: "numero totale di voti"
            },
            exp_poll: {
                type: "string",
                description: "numero totale di voti"
            }
        },
        //required:["mail","password","username"]
    });

    fastify.addSchema({
        // Common definitions area
        $id: "SchemaRequestPollDelete",
        type: "object",
        description: "Describe the identifier of entity.",
        // Parameters match area
        properties: {
            id_vote: {
                type: "string",
                description: "Id del voto"
            }
        },
        //required:["mail","password","username"]
    });

    fastify.addSchema({
        // Common definitions area
        $id: "SchemaRequestPollDetails",
        type: "object",
        description: "Describe the identifier of entity.",
        // Parameters match area
        properties: {
            id_vote: {
                type: "string",
                description: "Id del voto"
            },
            id_team:{
                type: "string",
                description: "LoremIpsum..."
            }
        },
        //required:["mail","password","username"]
    });

    fastify.addSchema({
        // Common definitions area
        $id: "SchemaRequestVoteInser",
        type: "object",
        description: "Describe the identifier of entity.",
        // Parameters match area
        properties: {
            id_vote: {
                type: "string",
                description: "Id del voto"
            },

            id_team: {
                type: "string",
                description: "id_scelte"
            },
            first_choice_id: {
                type: "string",
                description: "numero totale di voti"
            },
            first_choice_votes: {
                type: "string",
                description: "numero totale di voti"
            },
            second_choice_id: {
                type: "string",
                description: "numero totale di voti"
            },
            second_choice_votes: {
                type: "string",
                description: "numero totale di voti"
            },
            total_votes: {
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
                    poll_name: {
                        type: "string",
                        description: "Scelte"
                    },
                    id_team: {
                        type: "string",
                        description: "id_scelte"
                    },
                    first_choice_name: {
                        type: "string",
                        description: "Mail"
                    },
                    first_choice_id: {
                        type: "string",
                        description: "numero totale di voti"
                    },
                    first_choice_votes: {
                        type: "string",
                        description: "numero totale di voti"
                    },
                    second_choice_name: {
                        type: "string",
                        description: "numero totale di voti"
                    },
                    second_choice_id: {
                        type: "string",
                        description: "numero totale di voti"
                    },
                    second_choice_votes: {
                        type: "string",
                        description: "numero totale di voti"
                    },
                    total_votes: {
                        type: "string",
                        description: "numero totale di voti"
                    },
                    exp_poll: {
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
