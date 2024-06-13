// ------------------------------------------------------------------------- //
//  FORCE STRICT MODE
// ------------------------------------------------------------------------- //

'use strict';

// ------------------------------------------------------------------------- //
//
//  DAEMON KERNEL: SOCKET.IO
//
// ------------------------------------------------------------------------- //
//  COMMON MODULES
// ------------------------------------------------------------------------- //

// ------------------------------------------------------------------------- //
//  HELPER FUNCTIONS
// ------------------------------------------------------------------------- //

// ------------------------------------------------------------------------- //
//  COMMON FUNCTIONS
// ------------------------------------------------------------------------- //

/**
 * @author:      mmarella
 * @version:     01/03/2021 (dd/mm/yyyy)
 * @description: Socket.IO Engine per fastify.
 * @type:        Sync Function
 *
 * @param {Object} fastify
 */
module.exports = Object.freeze((fastify) => {
    /**
     * @author:      mmarella
     * @version:     01/03/2021 (dd/mm/yyyy)
     * @description: Socket.IO tunnel logics per fastify.
     * @type:        Sync Function
     *
     * @param {Object} error
     */
    fastify.ready((err) => {
        // Check erro on startup
        if (err) { throw err; }

        // Bind to connect event
        fastify.io.on('connect', (socket) => {
            // Debug
            logger.debug('Socket connected: ' + socket.id);

            // Bind client socket to onError
            socket.on('error', (errno) => {
                logger.info('Socket error: ' + errno.message);
            });

            // Bind client socket to onMessage
            socket.on('message', (data) => {
                logger.info(socket.id + " -> DATA: " + JSON.stringify(data, null, 4));
            });

            // Bind client socket to onEvent
            socket.on('event', (data) => {
                logger.info(socket.id + " -> EVNT: " + JSON.stringify(data, null, 4));
            });

            // Bind client socket to onDisconnect
            socket.on('disconnect', () => {
                logger.info('Socket disconnected: ' + socket.id);
            });
        });
    });
});

// ------------------------------------------------------------------------- //
//  END: KERNEL
// ------------------------------------------------------------------------- //

/* global logger */
