import DLMM from '@meteora-ag/dlmm';
import { Commitment, Connection, Finality, Keypair, PublicKey, Transaction, TransactionMessage, VersionedTransaction } from '@solana/web3.js';
import { METEORA_POOL_ID } from '../constants';
import BN from 'bn.js';

export const DEFAULT_COMMITMENT: Commitment = "finalized";
export const DEFAULT_FINALITY: Finality = "finalized";

export const swapOnMeteora = async (connection: Connection, wallet: Keypair, amount: number, isBuy: boolean) => {
    const poolKey = new PublicKey(METEORA_POOL_ID);
    const dlmmPool = await DLMM.create(connection, poolKey);
    const swapAmount = new BN(amount);
    // Swap quote
    const swapYtoX = !isBuy;
    const binArrays = await dlmmPool.getBinArrayForSwap(swapYtoX);
    const swapQuote = await dlmmPool.swapQuote(
        swapAmount,
        swapYtoX,
        new BN(10),
        binArrays
    );
    console.log("🚀 ~ swapOnMeteora ~ swapQuote:", swapQuote)

    // Swap
    const swapTx = await dlmmPool.swap({
        inToken: dlmmPool.tokenX.publicKey,
        binArraysPubkey: swapQuote.binArraysPubkey,
        inAmount: swapAmount,
        lbPair: dlmmPool.pubkey,
        user: wallet.publicKey,
        minOutAmount: swapQuote.minOutAmount,
        outToken: dlmmPool.tokenY.publicKey,
    });
    let versionedTx = await buildVersionedTx(
        connection,
        wallet.publicKey,
        swapTx,
        DEFAULT_COMMITMENT
      );
    versionedTx.sign
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