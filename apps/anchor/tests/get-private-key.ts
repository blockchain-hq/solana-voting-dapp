import { getOrCreateWallet } from './wallet'
import { AnchorProvider, Wallet } from '@coral-xyz/anchor'
import { NETWORK, WALLET_PATH } from './config'
import { Connection, Keypair } from '@solana/web3.js'
import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes'

const provider = new AnchorProvider(new Connection(NETWORK), new Wallet(new Keypair()), { commitment: 'confirmed' })

const main = async (provider: AnchorProvider) => {
  const wallet = await getOrCreateWallet(provider.connection, WALLET_PATH)
  const privateKeyUint8Array = new Uint8Array(wallet.secretKey)
  const base58PrivateKey = bs58.encode(privateKeyUint8Array)
  console.log(`Private key: ${base58PrivateKey}`)
}

main(provider)
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
