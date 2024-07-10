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

const { Connection, PublicKey, clusterApiUrl, Keypair } = require('@solana/web3.js');
const { createMint, mintTo, getOrCreateAssociatedTokenAccount, TOKEN_PROGRAM_ID } = require('@solana/spl-token');

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
    const { secretKey, metadataUri } = req.body;

    if (!secretKey || !metadataUri) {
      return reply.code(400).send({ error: 'secretKey and metadataUri are required' });
    }
  
    try {
      const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
      const payer = Keypair.fromSecretKey(Uint8Array.from(secretKey));
      
      // Create the mint account
      const mint = await createMint(
        connection,
        payer,
        payer.publicKey,
        null,
        0 // Decimals
      );
  
      // Get or create the associated token account for the payer
      const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        payer,
        mint,
        payer.publicKey
      );
  
      // Mint 1 NFT to the token account
      await mintTo(
        connection,
        payer,
        mint,
        tokenAccount.address,
        payer.publicKey,
        1
      );
  
      return reply.send({ success: true, mint: mint.toBase58() });
    } catch (error) {
      return reply.code(500).send({ error: error.message });
    }
  
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
