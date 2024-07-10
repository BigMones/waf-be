/* eslint-disable no-unused-vars */
const fastify = require('fastify')({ logger: true });
const { createVoteAccount, castVote, tallyVotes } = require('../../daemon-kernels/kernel-votingSolana')
const { Keypair } = require('@solana/web3.js');


// ------------------------------------------------------------------------- //
//  FORCE STRICT MODE
// ------------------------------------------------------------------------- //

'use strict';


//  COMMON MODULES
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
    const { voterSecretKey, voteAccountPubKey, vote } = req.body;
    const voter = Keypair.fromSecretKey(Buffer.from(voterSecretKey, 'base64'));
    const voteAccount = new PublicKey(voteAccountPubKey);
    const signature = await castVote(voter, voteAccount, vote);
    return { signature };
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
