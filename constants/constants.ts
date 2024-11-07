import { logger, retrieveEnvVariable } from "../utils"

export const PRIVATE_KEY = retrieveEnvVariable('PRIVATE_KEY', logger)
export const RPC_ENDPOINT = retrieveEnvVariable('RPC_ENDPOINT', logger)
export const RPC_WEBSOCKET_ENDPOINT = retrieveEnvVariable('RPC_WEBSOCKET_ENDPOINT', logger)

export const TX_FEE = Number(retrieveEnvVariable('TX_FEE', logger))
export const SWAP_ROUTING = retrieveEnvVariable('SWAP_ROUTING', logger)

export const BUY_UPPER_PERCENT = Number(retrieveEnvVariable('BUY_UPPER_PERCENT', logger))
export const BUY_LOWER_PERCENT = Number(retrieveEnvVariable('BUY_LOWER_PERCENT', logger))

export const BUY_INTERVAL_MIN = Number(retrieveEnvVariable('BUY_INTERVAL_MIN', logger))
export const BUY_INTERVAL_MAX = Number(retrieveEnvVariable('BUY_INTERVAL_MAX', logger))

export const SELL_INTERVAL_MIN = Number(retrieveEnvVariable('SELL_INTERVAL_MIN', logger))
export const SELL_INTERVAL_MAX = Number(retrieveEnvVariable('SELL_INTERVAL_MAX', logger))

export const DISTRIBUTE_WALLET_NUM = Number(retrieveEnvVariable('DISTRIBUTE_WALLET_NUM', logger))

export const SLIPPAGE = Number(retrieveEnvVariable('SLIPPAGE', logger))

export const TOKEN_MINT = retrieveEnvVariable('TOKEN_MINT', logger)
export const POOL_ID = retrieveEnvVariable('POOL_ID', logger)

export const TOKEN_NAME = retrieveEnvVariable('TOKEN_NAME', logger)

export const WISH_WORD = retrieveEnvVariable('WISH_WORD', logger)

export const METEORA_POOL_ID = retrieveEnvVariable("METEORA_POOL_ID", logger);


