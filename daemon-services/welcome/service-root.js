// ------------------------------------------------------------------------- //
//  FORCE STRICT MODE
// ------------------------------------------------------------------------- //

'use strict';

// ------------------------------------------------------------------------- //
//
//  DAEMON SERVICE: SUB-MODULE
//
// ------------------------------------------------------------------------- //
//  DEDICATED RESOURCE EXAMPLE
// ------------------------------------------------------------------------- //
//
//      fastify.get('/lorem/:uuid', async (req, reply) => {
//          // Get client from pool
//          const client = await DbSingleton.getInstance().db().connect();
//
//          // Query db from client
//          const {rows, rowCount} = await client.query(
//              'SELECT * FROM table WHERE uuid = $1',
//              [req.params.uuid],
//          );
//
//          // Release client
//          client.release();
//
//          // Send plus compression if enabled
//          reply.type('text/plain').compress( [rows, rowCount] );
//      });
//
// ------------------------------------------------------------------------- //
//  SHARED RESOURCE EXAMPLE
// ------------------------------------------------------------------------- //
//
//      fastify.get('/lorem/:uuid', async (req, reply) => {
//          // Query db from pool
//          const {rows, rowCount} = await DbSingleton.getInstance().db().query(
//              'SELECT * FROM table WHERE uuid = $1',
//              [req.params.uuid],
//          );
//
//          // Send plus compression if enabled
//          reply.type('text/plain').compress( [rows, rowCount] );
//      });
//
// ------------------------------------------------------------------------- //
//  TRASACTIONED RESOURCE EXAMPLE
// ------------------------------------------------------------------------- //
//
//      fastify.get('/lorem/:uuid', async (req, reply) => {
//          // Query db from pool
//          const {rows, rowCount} = await DbSingleton.getInstance().db().query(
//              'SELECT * FROM table WHERE uuid = $1',
//              [req.params.uuid],
//          );
//
//          // Create tansaction session from pool
//          const {rows, rowCount} = await DbSingleton.getInstance().db().transact(async client => {
//              // will resolve to an id, or reject with an error
//              const {rows, rowCount} = await client.query(
//                  'SELECT * FROM table WHERE uuid = $1',
//                  [req.params.uuid],
//              );
//
//              // ... something ...
//
//              // Return data from promise
//              return {rows, rowCount};
//          });
//
//          // Send plus compression if enabled
//          reply.type('text/plain').compress( [rows, rowCount] );
//      });
//
// ------------------------------------------------------------------------- //
//  COMMON MODULES
// ------------------------------------------------------------------------- //

// Load package.json
const daemonPackageJson = require("./../../package.json");

// Load kernel
const { SettingsMngSingleton } = require("./../../daemon-kernels/kernel-settings");
const respSystem               = require("./../../daemon-kernels/kernel-response");

// ------------------------------------------------------------------------- //
//  EXPORT MODULES
// ------------------------------------------------------------------------- //

/**
 * @author:      mmarella
 * @version:     18/01/2021 (dd/mm/yyyy)
 * @description: Wrapper del servizio RESTful richiesto.
 * @type:        Async Function
 *
 * @param {Object} req
 * @param {Object} reply
 */
const moduleObj = Object.freeze(async (req, reply) => {
    // --------------------------------------------------------------------- |

    // Get settings
    const configs = SettingsMngSingleton.getInstance();

    // Prepare response object
    const response = respSystem(
        1,    // count rows
        null, // message
        [{    // rows
            "server-name":    configs.getProperty("server",  "server-name"),
            "server-welcome": configs.getProperty("server",  "server-welcome"),
            "server-docpath": configs.getProperty("swagger", "swagger-http-path"),
            "server-daemon": {
                "name":  configs.getProperty("process", "process-pm2-name"),
                "vers":  configs.getProperty("server",  "server-version"),
                "bind":  configs.getProperty("server",  "server-bind-addr"),
                "port":  configs.getProperty("server",  "server-bind-port"),
                "queue": configs.getProperty("server",  "server-tcp-queue"),
            },
            "server-build": {
                "package": daemonPackageJson.name,
                "version": daemonPackageJson.version,
                "depends": daemonPackageJson.dependencies,
            },
        }],
        null // payload
    );

    // Send result compressed
    reply.type(
        "application/json"
    ).compress(
        response.serialize()
    );

    // --------------------------------------------------------------------- |
});

// Public scope
module.exports = moduleObj;

// ------------------------------------------------------------------------- //
//  END: ENTITY
// ------------------------------------------------------------------------- //
