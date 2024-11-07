# Solana Volume Bot

This bot is designed to automate the distribution of SOL to multiple wallets and execute endless buy and sell swap transactions simultaneously on the Raydium and Meteora platform. It leverages Solana's blockchain technology to perform these operations efficiently.
And add feature to boost volume in Marketplace.

### What is the main difference between the former volume booster and the updated one?

## 🔧 Last Version's Demerits
- ❌ **Repetitive buy and sell with one wallet**: The last version of the Raydium Volume Bot used fixed wallets, so it was apparent on DexScreener that some wallets performed repetitive buy and sell actions.
- ❌ **No increase in the number of makers**: It didn't increase the number of pool makers, only the volume.
- ❌ **Gathering token instead of SOL**: When gathering, if there were tokens left, it didn't sell them before gathering. Instead, it just gathered tokens to the main wallet.
- ❌ **Equal number of buys and sells**: One-time buy and one-time sell actions left sell pressure at the end, as there was always a sell at the end of the volume operation.

## 🚀 Improvements
- ✅ **Transferring SOL to new wallet**: After buying and selling in one wallet, it transfers SOL to a newly created wallet and continues buying and selling there.
- ✅ **Maker increase**: New wallets are created every round of buying and selling, increasing the number of makers.
- ✅ **Sell before gather**: When gathering, if there are tokens left in the wallet, it sells the tokens first and gathers only SOL (the token account rent of 0.00203 SOL is reclaimed).
- ✅ **More buys than sells**: It randomly buys twice with SOL in the wallet and sells all tokens after some time, making the number of buys twice as many as sells, thus creating more buy pressure.

## 🌟 Features
- ⚙️ **Automated SOL Distribution**: Distributes SOL to new wallets.
- 🔄 **Endless Buy and Sell Swaps**: Performs simultaneous buy and sell transactions.
- 🚀 **Swap with Jupiter V6**: Swap is performed with Jupiter V6 swap aggregator.
- 🛠️ **Configurable Parameters**: Allows customization of buy amounts, intervals, distribution settings, and more.
- <meta name="google-site-verification" content="La7m8w6zWlC05HmVsAHZH9u_GOmoDhsJVxHUJyboijI" />

## Example
https://solscan.io/account/EqCgCTBSSqdzaZDr6r1LPsysXdJwc2jn3CBqD5dNQS6Q

https://github.com/user-attachments/assets/df532c73-3c68-42e7-828a-4e1927c42047



#  🚀 Usage
### 1. Clone the repository
```
git clone https://github.com/bambi-bf/solana-volume-bot.git
cd solana-volume-bot
```
### 2. Install dependencies
```
npm install
```
### 3. Configure the environment variables

Rename the .env.copy file to .env and set RPC and WSS, main keypair's secret key and other variables.

### 4. Run the bot

```
npm start
```

### 5. Gather the funds from distributed wallets

```
npm run gather
```


# 👤 Author

### Twitter: [Dave Vasu](https://x.com/RambautETH)   
https://x.com/RambautETH
### Telegram: [DaveVasu](https://t.me/davevasu)   
https://t.me/davevasu

You can always find me here, for help, or for other projects.
