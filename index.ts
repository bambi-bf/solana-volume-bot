import {
  getAssociatedTokenAddress,
} from '@solana/spl-token'
import {
  Keypair,
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  SystemProgram,
  VersionedTransaction,
  TransactionInstruction,
  TransactionMessage,
  ComputeBudgetProgram,
  Transaction,
  sendAndConfirmTransaction
} from '@solana/web3.js'
import {
  BUY_INTERVAL_MAX,
  BUY_INTERVAL_MIN,
  SELL_INTERVAL_MAX,
  SELL_INTERVAL_MIN,
  BUY_LOWER_PERCENT,
  BUY_UPPER_PERCENT,
  DISTRIBUTE_WALLET_NUM,
  PRIVATE_KEY,
  RPC_ENDPOINT,
  RPC_WEBSOCKET_ENDPOINT,
  TOKEN_MINT,
  TOKEN_NAME,
  WISH_WORD,
  SWAP_ROUTING,
  POOL_ID,
} from './constants'
import { Data, readJson, saveDataToFile, sleep } from './utils'
import base58 from 'bs58'
import { getBuyTx, getBuyTxWithJupiter, getSellTx, getSellTxWithJupiter } from './utils/swapOnlyAmm'
import { execute } from './executor/legacy'
import { obfuscateString, sendMessage } from './utils/tgNotification'
import axios from 'axios'
import { swapOnMeteora } from './utils/meteoraSwap'

export const solanaConnection = new Connection(RPC_ENDPOINT, {
  wsEndpoint: RPC_WEBSOCKET_ENDPOINT, commitment: "confirmed"
})

export const mainKp = Keypair.fromSecretKey(base58.decode(PRIVATE_KEY))
const baseMint = new PublicKey(TOKEN_MINT)
const quoteMint = new PublicKey("So11111111111111111111111111111111111111112")
const distritbutionNum = DISTRIBUTE_WALLET_NUM > 20 ? 20 : DISTRIBUTE_WALLET_NUM


const main = async () => {

  // curSolPrice = await getSolPrice();

  const solBalance = await solanaConnection.getBalance(mainKp.publicKey)
  console.log(`Volume bot is running`)
  console.log(`Wallet address: ${mainKp.publicKey.toBase58()}`)
  console.log(`Pool token mint: ${baseMint.toBase58()}`)
  console.log(`Wallet SOL balance: ${(solBalance / LAMPORTS_PER_SOL).toFixed(3)}SOL`)
  console.log(`Buying wait time max: ${BUY_INTERVAL_MAX}s`)
  console.log(`Buying wait time min: ${BUY_INTERVAL_MIN}s`)
  console.log(`Selling wait time max: ${SELL_INTERVAL_MAX}s`)
  console.log(`Selling wait time min: ${SELL_INTERVAL_MIN}s`)
  console.log(`Buy upper limit percent: ${BUY_UPPER_PERCENT}%`)
  console.log(`Buy lower limit percent: ${BUY_LOWER_PERCENT}%`)
  console.log(`Distribute SOL to ${distritbutionNum} wallets`)

  let data: {
    kp: Keypair;
    buyAmount: number;
  }[] | null = null

  if (solBalance < (BUY_LOWER_PERCENT + 0.002) * distritbutionNum) {
    console.log("Sol balance is not enough for distribution")
    // sendMessage("Sol balance is not enough for distribution")
  }

  data = await distributeSol(solanaConnection, mainKp, distritbutionNum)
  if (data == null || data.length == 0) {
    console.log("Distribution failed")
    // sendMessage("Distribution failed")
    return
  }

  data.map(async ({ kp }, i) => {
    await sleep(i * 30000)
    let srcKp = kp
    while (true) {
      // buy part with random percent
      const BUY_WAIT_INTERVAL = Math.round(Math.random() * (BUY_INTERVAL_MAX - BUY_INTERVAL_MIN) + BUY_INTERVAL_MIN)
      const SELL_WAIT_INTERVAL = Math.round(Math.random() * (SELL_INTERVAL_MAX - SELL_INTERVAL_MIN) + SELL_INTERVAL_MIN)
      const solBalance = await solanaConnection.getBalance(srcKp.publicKey)

      let buyAmountInPercent = Number((Math.random() * (BUY_UPPER_PERCENT - BUY_LOWER_PERCENT) + BUY_LOWER_PERCENT).toFixed(3))

      console.log("🚀 ~ data.map ~ solBalance:", solBalance)
      if (solBalance < 5 * 10 ** 6) {
        console.log("Sol balance is not enough in one of wallets")
        // sendMessage("Sol balance is not enough in one of wallets")
        return
      }

      let buyAmountFirst = Math.floor((solBalance - 5 * 10 ** 6) / 100 * buyAmountInPercent)
      let buyAmountSecond = Math.floor(solBalance - buyAmountFirst - 5 * 10 ** 6)

      console.log(`balance: ${solBalance / 10 ** 9} first: ${buyAmountFirst / 10 ** 9} second: ${buyAmountSecond / 10 ** 9}`)
      // sendMessage(`balance: ${solBalance / 10 ** 9} first: ${buyAmountFirst / 10 ** 9} second: ${buyAmountSecond / 10 ** 9}`)
      // try buying until success
      let i = 0

      while (true) {
        try {

          if (i > 10) {
            console.log("Error in buy transaction")
            // sendMessage("Error in buy transaction")
            return
          }
          const result = await buy(srcKp, baseMint, buyAmountFirst)
          if (result) {
            break
          } else {
            i++
            await sleep(2000)
          }
        } catch (error) {
          i++
        }
      }

      let l = 0
      while (true) {
        try {
          if (l > 10) {
            console.log("Error in buy transaction")
            // sendMessage("Error in buy transaction")
            throw new Error("Error in buy transaction")
          }
          const result = await buy(srcKp, baseMint, buyAmountSecond)
          if (result) {
            break
          } else {
            l++
            await sleep(2000)
          }
        } catch (error) {
          l++
        }
      }

      await sleep(BUY_WAIT_INTERVAL * 1000)

      // try selling until success
      let j = 0
      while (true) {
        if (j > 10) {
          console.log("Error in sell transaction")
          // sendMessage("Error in sell transaction")
          return
        }
        const result = await sell(baseMint, srcKp)
        if (result) {
          break
        } else {
          j++
          await sleep(2000)
        }
      }

      await sleep(SELL_WAIT_INTERVAL * 1000)

      // SOL transfer part

    }
  })
}

const distributeSol = async (connection: Connection, mainKp: Keypair, distritbutionNum: number) => {
  const data: Data[] = []
  const wallets = []
  try {
    // private code

    return wallets
  } catch (error) {
    console.log(`Failed to transfer SOL`)
    // sendMessage(`Failed to transfer SOL`)
    return null
  }
}

const buy = async (newWallet: Keypair, baseMint: PublicKey, buyAmount: number) => {
  let solBalance: number = 0
  try {
    solBalance = await solanaConnection.getBalance(newWallet.publicKey)
  } catch (error) {
    console.log("Error getting balance of wallet")
    // sendMessage("Error getting balance of wallet")
    return null
  }
  if (solBalance == 0) {
    return null
  }
  try {
    let buyTx
    // Private code
  }

    return tokenBuyTx
} catch (error) {
  return null
}
}

const sell = async (baseMint: PublicKey, wallet: Keypair) => {
  try {
    const data: Data[] = readJson()
    // Private code

    return tokenSellTx
  } catch (error) {
    return null
  }
} catch (error) {
  return null
}
}

main()
