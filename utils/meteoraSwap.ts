import DLMM from '@meteora-ag/dlmm';
import { Commitment, Connection, Finality, Keypair, PublicKey, sendAndConfirmTransaction, Transaction, TransactionMessage, VersionedTransaction } from '@solana/web3.js';
import { METEORA_POOL_ID } from '../constants';
import BN from 'bn.js';

export const DEFAULT_COMMITMENT: Commitment = "finalized";
export const DEFAULT_FINALITY: Finality = "finalized";

export const swapOnMeteora = async (connection: Connection, wallet: Keypair, amount: number, isBuy: boolean) => {
  
}

export const buildVersionedTx = async (
    connection: Connection,
    payer: PublicKey,
    tx: Transaction,
    commitment: Commitment = DEFAULT_COMMITMENT
  ): Promise<VersionedTransaction> => {
    const blockHash = (await connection.getLatestBlockhash(commitment)).blockhash;
  
    let messageV0 = new TransactionMessage({
      payerKey: payer,
      recentBlockhash: blockHash,
      instructions: tx.instructions,
    }).compileToV0Message();
  
    return new VersionedTransaction(messageV0);
  };