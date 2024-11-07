import { Connection, VersionedTransaction } from "@solana/web3.js";
import { RPC_ENDPOINT, RPC_WEBSOCKET_ENDPOINT, TOKEN_MINT, TOKEN_NAME } from "../constants";
import { logger } from "../utils";
// import { sendMessage } from "../utils/tgNotification";


interface Blockhash {
  blockhash: string;
  lastValidBlockHeight: number;
}

export const execute = async (transaction: VersionedTransaction, latestBlockhash: Blockhash, isBuy: boolean | 1 = true) => {
  const solanaConnection = new Connection(RPC_ENDPOINT, {
    wsEndpoint: RPC_WEBSOCKET_ENDPOINT,
  })

  const signature = await solanaConnection.sendRawTransaction(transaction.serialize(), { skipPreflight: true })
  const confirmation = await solanaConnection.confirmTransaction(
    {
      signature,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      blockhash: latestBlockhash.blockhash,
    }
  );
  if (confirmation.value.err) {
    console.log(confirmation.value.err);
    console.log("Confirmtaion error")
    return ""
  } else {
    if (isBuy === 1) {
      return signature
    } else if (isBuy) {
      console.log(`Success in buy transaction: https://solscan.io/tx/${signature}`)
    }
    else {
      console.log(`Success in Sell transaction: https://solscan.io/tx/${signature}`)
      // sendMessage(`Success in Sell transaction: https://solscan.io/tx/${signature}`)
    }
  }
  return signature
}
