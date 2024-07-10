/* eslint-disable no-unused-vars */
// voting.js
const { Connection, PublicKey, Keypair, Transaction, SystemProgram, clusterApiUrl } = require('@solana/web3.js');

const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

const createVoteAccount = async () => {
  const voteAccount = Keypair.generate();
  const airdropSignature = await connection.requestAirdrop(voteAccount.publicKey, 2 * 1e9);
  await connection.confirmTransaction(airdropSignature);
  return voteAccount;
};

const castVote = async (voter, voteAccount, vote) => {
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: voter.publicKey,
      toPubkey: voteAccount.publicKey,
      lamports: vote ? 1 : 0,
    })
  );

  const signature = await connection.sendTransaction(transaction, [voter]);
  await connection.confirmTransaction(signature);
  return signature;
};

const tallyVotes = async (voteAccount) => {
  const balance = await connection.getBalance(voteAccount.publicKey);
  return balance;
};

module.exports = {
  createVoteAccount,
  castVote,
  tallyVotes
};