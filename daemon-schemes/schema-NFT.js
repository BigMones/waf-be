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
        $id: "SchemaRequestNFTCreate",
        type: "object",
        description: "Describe the identifier of entity.",
        // Parameters match area
        properties: {
            secretKey: {
                type: "string",
                description: "Scelte"
            },
            metadataUri : {
                type: "string",
                description: "id_scelte"
            }
        },
        //required:["mail","password","username"]
    });




    fastify.addSchema({
        // Common definitions area
        $id: "schema_nft_mvf_validation",
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
                    mint: {
                        type: "string",
                        description: "Id del voto"
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
