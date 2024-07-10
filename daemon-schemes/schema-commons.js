// ------------------------------------------------------------------------- //
//  FORCE STRICT MODE
// ------------------------------------------------------------------------- //

'use strict';

// ------------------------------------------------------------------------- //
//
//  DAEMON SCHEMA: COMMONS
//
// ------------------------------------------------------------------------- //

// ------------------------------------------------------------------------- //
//  EXPORT MODULES
// ------------------------------------------------------------------------- //

/**
 * @author:      mmmarella
 * @version:     18/01/2021 (dd/mm/yyyy)
 * @description: Installa i vari schemi utili alle rotte RESTful.
 * @type:        Sync Function
 *
 * @param {Object} fastify
 */
const moduleObj = Object.freeze((fastify) => {
    // --------------------------------------------------------------------- |

    fastify.addSchema({
        // Common definitions area
        $id: "SchemaRequestQueryPagination",
        description: "Pagination attributes",
        type: "object",
        // Parameters match area
        properties: {
            "page": {
                type: 'number'
            },
            "limit": {
                type: 'number'
            }
        }
    });

    // --------------------------------------------------------------------- |

    fastify.addSchema({
        // Common definitions area
        $id: "SchemaResponseError400",
        description: "Server cannot or will not process the request due to an apparent error!",
        type: "object",
        // Parameters match area
        properties: {
            "code":    { type: 'string' },
            "message": { type: 'string' },
            "errors":  {
                "type":  "array",
                "items": {
                    type: 'object',
                    properties: {
                        "source":  { type: 'string' },
                        "message": { type: 'string' }
                    }
                }
            }
        }
    });

    // --------------------------------------------------------------------- |

    fastify.addSchema({
        // Common definitions area
        $id: "SchemaResponseError401",
        description: "Authentication information is missing or invalid!",
        type: "object",
        // Parameters match area
        properties: {
            "code":    { type: 'string' },
            "message": { type: 'string' },
            "errors":  {
                "type":  "array",
                "items": {
                    type: 'object',
                    properties: {
                        "source":  { type: 'string' },
                        "message": { type: 'string' }
                    }
                }
            }
        }
    });

    // --------------------------------------------------------------------- |

    fastify.addSchema({
        // Common definitions area
        $id: "SchemaResponseError403",
        description: "Requested resource is forbidden for some reason!",
        type: "object",
        // Parameters match area
        properties: {
            "code":    { type: 'string' },
            "message": { type: 'string' },
            "errors":  {
                "type":  "array",
                "items": {
                    type: 'object',
                    properties: {
                        "source":  { type: 'string' },
                        "message": { type: 'string' }
                    }
                }
            }
        }
    });

    // --------------------------------------------------------------------- |

    fastify.addSchema({
        // Common definitions area
        $id: "SchemaResponseError404",
        description: "The requested resource could not be found but may be available in the future!",
        type: "object",
        // Parameters match area
        properties: {
            "code":    { type: 'string' },
            "message": { type: 'string' },
            "errors":  {
                "type":  "array",
                "items": {
                    type: 'object',
                    properties: {
                        "source":  { type: 'string' },
                        "message": { type: 'string' }
                    }
                }
            }
        }
    });

    // --------------------------------------------------------------------- |

    fastify.addSchema({
        // Common definitions area
        $id: "SchemaResponseError429",
        description: "User has sent too many requests in a given amount of time (rate limiting)!",
        type: "object",
        // Parameters match area
        properties: {
            "code":    { type: 'string' },
            "message": { type: 'string' },
            "errors":  {
                "type":  "array",
                "items": {
                    type: 'object',
                    properties: {
                        "source":  { type: 'string' },
                        "message": { type: 'string' }
                    }
                }
            }
        }
    });

    // --------------------------------------------------------------------- |

    fastify.addSchema({
        // Common definitions area
        $id: "SchemaResponseError500",
        description: "Unexpected condition was encountered and no more specific message is suitable!",
        type: "object",
        // Parameters match area
        properties: {
            "code":    { type: 'string' },
            "message": { type: 'string' },
            "errors":  {
                "type":  "array",
                "items": {
                    type: 'object',
                    properties: {
                        "source":  { type: 'string' },
                        "message": { type: 'string' }
                    }
                }
            }
        }
    });

    // --------------------------------------------------------------------- |

    fastify.addSchema({
        // Common definitions area
        $id: "SchemaRequestIdentifierEntity",
        type: "object",
        description: "Describe the identifier of entity.",
        // Parameters match area
        properties: {
            id: {
                type: "string",
                description: "Internal ID for identification."
            }
         }
    });

    // --------------------------------------------------------------------- |

    fastify.addSchema({
        // Common definitions area
        $id: "SchemaResponseIdentifierEntity",
        type: "array",
        description: "Describe the manipulated entity.",
        // Parameters match area
        items: {
            type: 'object',
            properties: {
                id: {
                    type: "string",
                    description: "Internal ID for identification."
                }
            }
         }
    });

    // --------------------------------------------------------------------- |
});

// Public scope
module.exports = moduleObj;

// ------------------------------------------------------------------------- //
//  END: ENTITY
// ------------------------------------------------------------------------- //
