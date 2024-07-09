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
        $id: "SchemaRequestTeam",
        type: "object",
        description: "Describe the identifier of entity.",
        // Parameters match area
        properties: {
            id_team: {
                type: "string",
                description: "Scelte"
            }
        },
        //required:["mail","password","username"]
    });




    fastify.addSchema({
        // Common definitions area
        $id: "schema_team_validation",
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
                    id_team: {
                        type: "string",
                        description: "Id del voto"
                    },
                    nome: {
                        type: "string",
                        description: "id_scelte"
                    },
                    id_campionato: {
                        type: "string",
                        description: "Mail"
                    },
                    anno_creazione: {
                        type: "string",
                        description: "numero totale di voti"
                    },
                    status: {
                        type: "string",
                        description: "numero totale di voti"
                    },
                    nome_champ: {
                        type: "string",
                        description: "numero totale di voti"
                    },
                    paese: {
                        type: "string",
                        description: "numero totale di voti"
                    },
                    

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
