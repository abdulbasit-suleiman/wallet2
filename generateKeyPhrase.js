import { validateMnemonic, wordlists, mnemonicToSeedSync } from 'bip39';
import { Keypair } from '@solana/web3.js';

// Official BIP-39 wordlist
const wordList = wordlists.english;

// Generate a valid BIP-39 mnemonic phrase
export const generateValidKeyPhrase = () => {
  let validPhrase = null;

  while (!validPhrase) {
    const shuffled = wordList.sort(() => 0.5 - Math.random());
    const candidatePhrase = shuffled.slice(0, 12).join(' ');

    if (validateMnemonic(candidatePhrase, wordlists.english)) {
      validPhrase = candidatePhrase;
    }
  }

  return validPhrase;
};

// Derive Solana address from the mnemonic
export const deriveSolAddress = (mnemonic) => {
  const seed = mnemonicToSeedSync(mnemonic).slice(0, 32); // First 32 bytes of seed
  const keypair = Keypair.fromSeed(seed); // Derive keypair from the seed
  return keypair.publicKey.toBase58(); // Return the public key in Base58 format
};
