import DLMM from '@meteora-ag/dlmm';
import { Commitment, Connection, Finality, Keypair, PublicKey, sendAndConfirmTransaction, Transaction, TransactionMessage, VersionedTransaction } from '@solana/web3.js';
import { METEORA_POOL_ID } from '../constants';
import BN from 'bn.js';

export const DEFAULT_COMMITMENT: Commitment = "finalized";
export const DEFAULT_FINALITY: Finality = "finalized";

export const swapOnMeteora = async (connection: Connection, wallet: Keypair, amount: number, isBuy: boolean) => {
  try {
    const poolKey = new PublicKey(METEORA_POOL_ID);
      const dlmmPool = await DLMM.create(connection, poolKey);
      const swapAmount = new BN(amount);
      // Swap quote
      const swapYtoX = isBuy;
      const binArrays = await dlmmPool.getBinArrayForSwap(swapYtoX);
      const swapQuote = await dlmmPool.swapQuote(
          swapAmount,
          swapYtoX,
          new BN(10000),
          binArrays
      );
      // console.log("🚀 ~ swapOnMeteora ~ swapQuote:", swapQuote)
  
      // Swap
      const swapTx = await dlmmPool.swap({
          inToken: isBuy ? dlmmPool.tokenX.publicKey : dlmmPool.tokenY.publicKey,
          binArraysPubkey: swapQuote.binArraysPubkey,
          inAmount: swapAmount,
          lbPair: dlmmPool.pubkey,
          user: wallet.publicKey,
          minOutAmount: swapQuote.minOutAmount,
          outToken: isBuy ? dlmmPool.tokenY.publicKey : dlmmPool.tokenX.publicKey,
      });
      // if(!isBuy) console.log(await connection.simulateTransaction(swapTx)) 
      // console.log(await connection.simulateTransaction(swapTx))
      const swapTxHash = await sendAndConfirmTransaction(connection, swapTx, [
        wallet,
      ]);
      // console.log(`https://solscan.io/tx/${swapTxHash}`)
      return swapTxHash;
      // let versionedTx = await buildVersionedTx(
      //     connection,
      //     wallet.publicKey,
      //     swapTx,
      //     DEFAULT_COMMITMENT
      //   );
      // versionedTx.sign([wallet]);
  } catch (error) {
    console.log("Failed to swap transaction");
    console.log(error)
    return null;
  }  
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