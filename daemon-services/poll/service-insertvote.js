/* eslint-disable no-unused-vars */
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

// Load kernel
const { DbSingleton } = require("../../daemon-kernels/kernel-database");
const respSystem      = require("../../daemon-kernels/kernel-response");

// Load entities
const entityObj = require("../../daemon-entities/entity-votes");

//Load Solana Libs
const { Connection, PublicKey, clusterApiUrl, Keypair } = require('@solana/web3.js');
const { Program, AnchorProvider, web3 } = require('@project-serum/anchor');
const connection = new Connection(clusterApiUrl('devnet'));
const wallet = Keypair.generate();

const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions());
const idl = require('./idl.json');
const programId = new PublicKey('YOUR_PROGRAM_ID');
const program = new Program(idl, programId, provider);

// ------------------------------------------------------------------------- //
//  EXPORT MODULES
// ------------------------------------------------------------------------- //

/**
 * @author:      mmarella
 * @version:     05/08/2021 (dd/mm/yyyy)
 * @description: Wrapper del servizio RESTful richiesto.
 * @type:        Async Function
 *
 * @param {Object} req
 * @param {Object} reply
 */
const moduleObj = Object.freeze(async (req, reply) => {
    // --------------------------------------------------------------------- |
    // Prepare data
    let __tryConn     = null;
    let factoryEntity = null;
   
    try {
        // Get conn from poll
        __tryConn = await DbSingleton.getInstance().db().getConnection();
        const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
        const { publicKey, vote } = req.body;

        const programId = new PublicKey('YOUR_PROGRAM_ID_HERE');

        // Public key of the user's wallet (provided by the frontend)
        const userPublicKey = new PublicKey(publicKey);
      
        // Create a transaction
        const transaction = new Transaction().add({
          keys: [{ pubkey: userPublicKey, isSigner: true, isWritable: true }],
          programId,
          data: Buffer.from([vote]), // Send the vote option as a single byte
        });

            const { signature } = await connection.sendTransaction(transaction, [userPublicKey], {
              skipPreflight: false,
              preflightCommitment: 'confirmed',
            });
        
            await connection.confirmTransaction(signature, 'confirmed');
        
          

        // Prepare statements
       factoryEntity = await entityObj.insertPoll(
            __tryConn,
            req.body,
            {/* EMPTY SESSION */} // req.session
        );

}
    catch (err) {
        // Send debug message
         logger.error(
            "The request could not be completed:  " +
            JSON.stringify(err, null, 4)
        );

        // Reset response with error
        factoryEntity = respSystem().reset(
            "The request could not be completed: " + err.message,
            400
        );

    }
    finally {
        // Check nullPointer
        if (__tryConn) {
            // Release client
            __tryConn.release();
        }
    }

    // Send result compressed
    reply.code(factoryEntity.getHttpCode())
    .type("application/json")
    .compress(factoryEntity.serialize());

    // --------------------------------------------------------------------- |
});

// Public scope
module.exports = moduleObj;
// ------------------------------------------------------------------------- //
//  END: TRIGGER
// ------------------------------------------------------------------------- //

/* global logger */

// ------------------------------------------------------------------------- //
//  END: ENTITY
// ------------------------------------------------------------------------- //
