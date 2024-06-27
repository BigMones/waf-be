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
        $id: "SchemaRequestRegister",
        type: "object",
        description: "Describe the identifier of entity.",
        // Parameters match area
        properties: {
            username: {
                type: "string",
                description: "Username"
            },
            password: {
                type: "string",
                description: "Password"
            },
            mail: {
                type: "string",
                description: "Mail"
            },
            regdate: {
                type: "string",
                description: "Data Registrazione"
            },
            descrizione: {
                type: "string",
                description: "Descrizione del Profilo"
            },
            ruolo: {
                type: "string",
                description: "Ruolo dell'utente all'interno della piattaforma ( Admin o Partecipante di Lega )"
            },
            id_favourite:{
                type:"string",
                description:"ID della squadra favorita"
            },
            is_mvf:{
                type:"string",
                description: "Controllo se l'utente è un MVF o no"
            },
            pubkey:{
                type:"string",
                description:"Public Key del Phantom Wallet"
            }
        },
        required:["mail","password","username"]
    });

    // --------------------------------------------------------------------- |

    fastify.addSchema({
        // Common definitions area
        $id: "SchemaLoginDetails",
        type: "object",
        description: "Describe the current entity.",
        // Parameters match area
        properties: {
            username: {
                type: "string",
                description: "Username"
            },
            password: {
                type: "string",
                description: "password"
            },
            token: {
                type: "string",
                description: "Token decode"
            }
        }
    });
    fastify.addSchema({
        // Common definitions area
        $id: "SchemaLoginPost",
        type: "object",
        description: "Describe the current entity.",
        // Parameters match area
        properties: {
            username: {
                type: "string",
                description: "Username"
            },
            password: {
                type: "string",
                description: "password"
            },
            pubkey:{
                type:"string",
                description:"Public Key del Phantom Wallet"
            }
        }
    });
    // --------------------------------------------------------------------- |

    fastify.addSchema({
        // Common definitions area
        $id: "SchemaResponseGetLogin",
        type: "array",
        description: "Describe the current entity.",
        // Parameters match area
        items: { $ref: "SchemaLoginDetails#" }
    });

    // --------------------------------------------------------------------- |


    fastify.addSchema({
        // Common definitions area
        $id: "schema_login_validation",
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
                    username: {
                        type: "string",
                        description: "Username"
                    },
                    password: {
                        type: "string",
                        description: "password"
                    },
                    token: {
                        type: "string",
                        description: "Token decode"
                    }

                }
            }
        }
    });




    fastify.addSchema({
        // Common definitions area
        $id: "SchemaRequestChangeToken",
        type: "object",
        description: "Describe the identifier of entity.",
        // Parameters match area
        properties: {
            mail: {
                type: "string",
                description: "Email Paziente"
            },
            password: {
                type: "string",
                description: "Nome Paziente"
            }
        },
        required:["mail","password"]
    });
    fastify.addSchema({
        // Common definitions area
        $id: "SchemaRequestDeleteUser",
        type: "object",
        description: "Describe the identifier of entity.",
        // Parameters match area
        properties: {
            mail: {
                type: "string",
                description: "Email Paziente"
            }
        },
        required:["mail"]
    });
    // --------------------------------------------------------------------- |

    fastify.addSchema({
        // Common definitions area
        $id: "SchemaLoginTokenDetails",
        type: "object",
        description: "Describe the current entity.",
        // Parameters match area
        properties: {
            email: {
                type: "string",
                description: "Email Paziente"
            },
            password: {
                type: "string",
                description: "Nome Paziente"
            },
            token: {
                type: "string",
                description: "Token decode"
            }
        }
    });

    // --------------------------------------------------------------------- |

    fastify.addSchema({
        // Common definitions area
        $id: "SchemaResponseGetLoginToken",
        type: "array",
        description: "Describe the current entity.",
        // Parameters match area
        items: { $ref: "SchemaLoginTokenDetails#" }
    });

    // --------------------------------------------------------------------- |


    fastify.addSchema({
        // Common definitions area
        $id: "schema_login_token_validation",
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
                    email: {
                        type: "string",
                        description: "Email Paziente"
                    },
                    password: {
                        type: "string",
                        description: "Nome Paziente"
                    },
                    token: {
                        type: "string",
                        description: "Token decode"
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
