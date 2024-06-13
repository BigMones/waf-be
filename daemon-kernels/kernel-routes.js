// ------------------------------------------------------------------------- //
//  FORCE STRICT MODE
// ------------------------------------------------------------------------- //

'use strict';

// ------------------------------------------------------------------------- //
//
//  DAEMON KERNEL: ROUTES
//
// ------------------------------------------------------------------------- //
//  COMMON MODULES
// ------------------------------------------------------------------------- //

// ------------------------------------------------------------------------- //
//  COMMON UTILITIES
// ------------------------------------------------------------------------- //

// ------------------------------------------------------------------------- //
//  HELPER FUNCTION
// ------------------------------------------------------------------------- //

// ------------------------------------------------------------------------- //
//  COMMON FUNCTIONS
// ------------------------------------------------------------------------- //

// ------------------------------------------------------------------------- //
//  EXPORT MODULES
// ------------------------------------------------------------------------- //
/**
 * @author:      mmarella
 * @version:     18/01/2021 (dd/mm/yyyy)
 * @description: Loader delle rotte RESTful a partire da direttive JSON.
 * @type:        Sync Function
 *
 * @param {Object} fastify
 * @param {String} targetName
 * @param {String} targetToLoad
 */
const moduleObj = Object.freeze((fastify, targetName, targetToLoad, prefixRoute = null) => {
    // --------------------------------------------------------------------- |
    //  REQUIRE ROUTE HANDLERS
    // --------------------------------------------------------------------- |

    // Merge all route into unique object
    const ontologiesHandler = require(
        "./../daemon-handlers/" + targetToLoad
    )(fastify);

    // Extract all path keys
    const pathHandlerKeys = Object.keys(ontologiesHandler);

    // Prepare configs
    const opts = fastify.getConfigs();

    // Get settings value
    const prefixEnabled = opts.getAsBoolean("versioning", "allowed-prefixes");

    // --------------------------------------------------------------------- |
    //  INSTALL PATH CALLBACKS
    // --------------------------------------------------------------------- |

    // Loop on all route keys
    pathHandlerKeys.map((pathKey) => {
        const injectRoute = (fastify, opts, done) => {
            ontologiesHandler[pathKey].map((pathObj) => {
                // Prepare callback
                let registerMethod = null;

                // Populate callback from method
                switch (pathObj.method) {
                    // Save real function based to method
                    case "GET":     registerMethod = fastify.get;     break;
                    case "PUT":     registerMethod = fastify.put;     break;
                    case "POST":    registerMethod = fastify.post;    break;
                    case "DELETE":  registerMethod = fastify.delete;  break;

                    // Always nothing
                    default:        /* -------------------------- */  break;
                }

                // Check for error...
                if (registerMethod == null) {
                    return;
                }

                // Generate options for path
                const pathOptions = {
                    // ------------------------------------------------------------- |
                    //  WEBSOCKET DEFINITION
                    // ------------------------------------------------------------- |
                    webSocket:   (pathObj.webSocket !== null ? pathObj.webSocket : false),
                    // ------------------------------------------------------------- |
                    //  SCHEMA DEFINITION
                    // ------------------------------------------------------------- |
                    schema:      pathObj.schema,
                    // ------------------------------------------------------------- |
                    //  BEFORE REQUEST PROCESSING
                    // ------------------------------------------------------------- |
                    preHandler:  pathObj.preHandler,
                    // ------------------------------------------------------------- |
                    //  REQUEST/RESPONSE PROCESSOR
                    // ------------------------------------------------------------- |
                    handler:     pathObj.handler,
                    // ------------------------------------------------------------- |
                    //  AFTER REQUEST PROCESSED
                    // ------------------------------------------------------------- |
                    postHandler: pathObj.postHandler
                };

                // Delegate to real function with arguments
                registerMethod.call(fastify, pathKey, pathOptions);
            });

            // Set done as route-plugin
            done();
        };

        // Inject route to fastify
        fastify.register(
            injectRoute,
            {
                prefix: (
                    prefixEnabled &&
                    prefixRoute
                ) ? prefixRoute : null
            }
        );
    });

    // --------------------------------------------------------------------- |
});

// Public scope
module.exports = moduleObj;

// ------------------------------------------------------------------------- //
//  END: KERNEL
// ------------------------------------------------------------------------- //
