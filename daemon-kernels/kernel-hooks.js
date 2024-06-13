// ------------------------------------------------------------------------- //
//  FORCE STRICT MODE
// ------------------------------------------------------------------------- //

'use strict';

// ------------------------------------------------------------------------- //
//
//  DAEMON KERNEL: HOOKS
//
// ------------------------------------------------------------------------- //
//  COMMON MODULES
// ------------------------------------------------------------------------- //

const jsonUtils = require("../daemon-utilities/utility-json");

// ------------------------------------------------------------------------- //
//  HELPER FUNCTIONS
// ------------------------------------------------------------------------- //

// ------------------------------------------------------------------------- //
//  COMMON FUNCTIONS
// ------------------------------------------------------------------------- //
/**
 * @author:      mmarella
 * @version:     18/01/2021 (dd/mm/yyyy)
 * @description: Genera hooks per fastify.
 * @type:        Sync Function
 *
 * @param {Object} fastify
 */
module.exports = Object.freeze((fastify) => {
    /**
     * @author:      mmarella
     * @version:     18/01/2021 (dd/mm/yyyy)
     * @description: Registra l'evento in fastify
     * @type:        Sync Function
     */
    fastify.addHook('onSend', (request, reply, payload, done) => {
        try {
            // Prepare payload
            let new_payload = payload;

            // Check for specific errors payload
            if ([
                400,    // Bad request
                401,    // Unauthorize
                403,    // Forbidden
                404,    // Not found
                429,    // Rate limit
                500     // Internal server error
            ].includes(reply.statusCode)) {
                // Debug
                logger.info("HOOK.Normalize-Reponse: CODE<" + reply.statusCode + ">.Payload(): %j", new_payload);

                // Prepare data from string
                new_payload = JSON.parse(
                    new_payload,
                    jsonUtils.jsonDecoder
                );

                // Base storage
                let p_message    = (new_payload.message            ? new_payload.message : new_payload.error);
                let p_error      = (p_message == new_payload.error ? reply.statusCode    : new_payload.error);
                let p_listErrors = [];

                // Personalize error
                switch (reply.statusCode) {
                    // Bad request
                    case 400:
                        // Populate array
                        p_listErrors = [{
                            "message": p_message,
                            "source":  p_error
                        }];

                        // Populate errors
                        p_error   = "Bad Request";
                        p_message = "One or more params/properties are missing or invalid!";
                        break;

                    // All errors
                    default: break;
                }

                // Create new payload data
                new_payload = JSON.stringify({
                    "code":    p_error,
                    "message": p_message,
                    "errors":  p_listErrors
                }, jsonUtils.jsonEncoder);

                // Set new size for content error
                reply.headers({
                    'Content-Length': new_payload.length
                });
            }

            // Send response encoded
            done(null, new_payload);
        }
        // Catch error
        catch (err) {
            // Send error
            done(err);
        }
    });
});

// ------------------------------------------------------------------------- //
//  END: KERNEL
// ------------------------------------------------------------------------- //

/* global logger */
