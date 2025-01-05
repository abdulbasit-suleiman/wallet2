import * as bitcoin from 'bitcoinjs-lib';  
import crypto from 'crypto';
import axios from 'axios';

// Function to shuffle the array
export function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Function to generate a Bitcoin address from a phrase
export function generateBitcoinAddress(phrase) {
  try {
    const seed = crypto.createHash('sha256').update(phrase).digest();

    // Generate the key pair from the seed
    const keyPair = bitcoin.ECPair.fromPrivateKey(seed);

    // Generate a bech32 SegWit Bitcoin address
    const { address } = bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey });

    return address;  // This will generate a bc1 address
  } catch (error) {
    console.error("Error generating Bitcoin address:", error.message);
    throw new Error("Failed to generate Bitcoin address.");
  }
}

// Function to check a Bitcoin address
export async function checkBitcoinAddress(address) {
  const url = `https://blockstream.info/api/address/${address}`;

  try {
    const response = await axios.get(url);
    console.log("API response:", response.data);  // Log the response
    const { funded_txo_count, total_received } = response.data.chain_stats;

    if (funded_txo_count > 0 || total_received > 0) {
      return true; // Address has transactions or funds
    }
    return false; // No transactions or funds
  } catch (error) {
    console.error("Error checking address:", error.message);
    return false; // Return false in case of any error
  }
}
