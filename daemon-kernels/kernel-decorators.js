// ------------------------------------------------------------------------- //
//  FORCE STRICT MODE
// ------------------------------------------------------------------------- //

'use strict';

// ------------------------------------------------------------------------- //
//
//  DAEMON KERNEL: DECORATORS
//
// ------------------------------------------------------------------------- //
//  CONSTANT DEV|PROD AUTH
// ------------------------------------------------------------------------- //

// ------------------------------------------------------------------------- //
//  COMMON MODULES
// ------------------------------------------------------------------------- //

// System modules

const jwtHandler = require("jsonwebtoken");

// Utilities
// const commonUtils  = require("../daemon-utilities/utility-commons");

// ------------------------------------------------------------------------- //
//  HELPER FUNCTIONS
// ------------------------------------------------------------------------- //

/**
 * @author:      mmarella
 * @version:     11/03/2021 (dd/mm/yyyy)
 * @description: Helper per controllo rotta rispetto le policy utente/gruppo
 * @type:        Sync Function
 *
 * @param {String} hostname
 * @returns Null | String Hostname
 */
const __cleanOriginReferal = (hostname) => {
    // Prepare protocols
    const protocols = [
        "https",
        "http"
    ];

    // Check invalid hostname
    if (hostname != null && hostname != undefined) {
        // Loop on all protocols
        for (let i = 0; i < protocols.length; i++) {
            // Prepare regex
            let testProtocol = new RegExp('^' + protocols[i] + "://", 'i');

            // Check for protocol and clean
            if (testProtocol.test(hostname.trim())) {
                return hostname.trim().replace(protocols[i] + "://", "");
            }
        }

        // Always return default value
        return hostname;
    }

    // Empty array or invalid!
    return null;
}

// ------------------------------------------------------------------------- //
//  COMMON FUNCTIONS
// ------------------------------------------------------------------------- //
/**
 * @author:      mmarella
 * @version:     11/03/2021 (dd/mm/yyyy)
 * @description: Genera dei decoratori per fastify delle singole entità kernel.
 * @type:        Sync Function
 *
 * @param {Object} fastify
 */
module.exports = Object.freeze((fastify) => {
    /**
     * @author:      mmarella
     * @version:     26/03/2021 (dd/mm/yyyy)
     * @description: Registra un verificatore JWT OAuth2 nella request fastify
     * @type:        Sync Function
     */
    fastify.decorate("authorizationBearerJWT", (req, res, done) => {
        // Get all settings
        const settings = req.getConfigs();

        // Check for fake session
        if (settings.getAsBoolean("authentication", "auth-jwt-use-fake-session")) {
            // Debug
            logger.warn("[ONLY-DEV]: Fake-Session generated!");

            // Register session data
            req.session = Object.freeze({
                id:          1,
                email:       "profile@example.org",
                name:        "Mario",
                surname:     "Rossi",
                fiscal_code: "################",
                phone:       "+39 339 1234567",
                roles:       [
                    "ROLE_CODE_FROM_DB_OR_TOKEN_ADMIN",
                    "ROLE_CODE_FROM_DB_OR_TOKEN_USER"
                ],
                jwt_token:   "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                last_login:  Date.now()
            });

            // Enable call
            done();
        }
        // Otherwise...
        else {
            // Prepare http errors
            const __noPermissions  = new Error("You don't have permissions for this path!");
            const __unableUpsert   = new Error("Impossible to upsert the current profile token!");
            const __misAuthHeader  = new Error("Authorization header not found!");
            const __malformedToken = new Error("The authentication token is malformed!");

            // Prepare status for errors
            __noPermissions.statusCode  = 403;
            __unableUpsert.statusCode   = 401;
            __misAuthHeader.statusCode  = 401;
            __malformedToken.statusCode = 403;

            // Prepare special error (jwt)
            const __jwtManageError = (err) => {
                // Prepare data
                let __errCode = 401;
                let __errMsg  = (
                    err && err.message
                ) ? err.message : "Unknown token error!";

                // Check type
                switch (err.name) {
                    case "TokenExpiredError":
                        // Populate error
                        __errMsg  = "The authentication token is expired!";
                        __errCode = 401;
                        break;

                    case "JsonWebTokenError":
                        // Check message type
                        if (err.message.startsWith('jwt malformed')) {
                            // Populate error
                            __errMsg  = 'The authentication token is malformed!';
                            __errCode = 401;
                        }
                        else if (err.message.startsWith('jwt signature is required')) {
                            // Populate error
                            __errMsg  = 'The authentication token\'s signature is required!';
                            __errCode = 401;
                        }
                        else if (err.message.startsWith('invalid signature')) {
                            // Populate error
                            __errMsg  = 'The authentication token\'s signature is invalid!';
                            __errCode = 401;
                        }
                        else if (err.message.startsWith('jwt audience invalid')) {
                            // Populate error
                            __errMsg  = 'The authentication token\'s audience is invalid!';
                            __errCode = 401;
                        }
                        else if (err.message.startsWith('jwt issuer invalid')) {
                            // Populate error
                            __errMsg  = 'The authentication token\'s issuer is invalid!';
                            __errCode = 401;
                        }
                        else if (err.message.startsWith('jwt id invalid')) {
                            // Populate error
                            __errMsg  = 'The authentication token\'s ID is invalid!';
                            __errCode = 401;
                        }
                        else if (err.message.startsWith('jwt subject invalid')) {
                            // Populate error
                            __errMsg  = 'The authentication token\'s subject is invalid!';
                            __errCode = 401;
                        }
                        break;

                    // Nothing
                    default: break;
                }

                // Prepare error tmp
                let __tmpErr = new Error(__errMsg);

                // Set status code
                __tmpErr.statusCode = __errCode;

                // Send back error
                return __tmpErr;
            }

            // Extract auth header
            const authHeader = req.headers.authorization;

            // Get config from req
            const __settings = req.getConfigs();

            // Check for header
            if (!authHeader) {
                // Send response
                done(__misAuthHeader);
                return;
            }

            // Extract token from header
            const sessionToken = authHeader.substring(
                'Bearer'.length
            ).trim();

            // Get URL editor instance
            const urlData = req.urlData();

            // Get data from routing
            const requestPath = urlData.path;
            const remoteAddr  = __cleanOriginReferal(req.headers['origin'])   ||
                                __cleanOriginReferal(req.headers['Referal'])  ||
                                req.headers['x-forwarded-for']                ||
                                req.hostname                                  ||
                                "Address obfuscated! Node.JS is running under proxy?";
            const remoteIPv4  = req.headers['x-real-ip']  ||
                                req.raw.ip                ||
                                req.raw.ips[0]            ||
                                "Address IP obfuscated! Node.JS is running under proxy?";

            // Debug only
            logger.info("RBAC.Handle-RemoteAddr:  " + remoteAddr);
            logger.info("RBAC.Handle-RemoteIPv4:  " + remoteIPv4);
            logger.info("RBAC.Handle-CallMethod:  " + req.raw.method + "  " + requestPath);

            // Check for session token
            if (sessionToken) {
             // Create promise for async resolve as sync
                new Promise((resolve, reject) => {
                    // Verify token with jwt utils
                    jwtHandler.verify(
                        sessionToken,
                         __settings.getProperty("authentication",  "auth-jwt-jwt-secret"),
                        {
                            issuer:           __settings.getProperty("authentication",  "auth-jwt-verify-issuer"),
                            audience:         __settings.getProperty("authentication",  "auth-jwt-verify-audience"),
                            ignoreExpiration: __settings.getAsBoolean("authentication", "auth-jwt-ignore-expire"),
                            ignoreNotBefore:  __settings.getAsBoolean("authentication", "auth-jwt-ignore-not-before")
                        },
                        (err, decoded) => {
                            // Check error with token
                            if (err) {
                                // Reject auth
                                reject(err);
                            }
                            // Otherwise...
                            else {
                                // Auth verified
                                resolve(decoded);
                            }
                        }
                    );
                })
                // Manage session...
                .then(async (userData) => {
                    // Check upsert to db
                    if (userData) {
                        // Register session data
                        req.session = Object.freeze(userData);

                        // Debug messages
                        logger.info("RBAC.Verify-BToken-JWT:  Authentication.Decode<Bearer>(...) ::-->> " + JSON.stringify(
                            req.session,
                            null,
                            4
                        ));

                        // TODO: CREATE SESSION JSON FROM DATABASE HERE!
                        // ...

                        // Enable call
                        done();
                    }
                    // Otherwise...
                    else {
                        // Send response
                        done(__noPermissions);
                    }
                })
                // Manage error...
                .catch((err) => {
                    // Catch error from token
                    fastify.log.error(err);

                    // Send response
                    done(__jwtManageError(err));
                });
            }
            else {
                // Reset with error
                return done(
                    __malformedToken
                );
            }
        }
    });
});

// ------------------------------------------------------------------------- //
//  END: KERNEL
// ------------------------------------------------------------------------- //

/* global logger */
