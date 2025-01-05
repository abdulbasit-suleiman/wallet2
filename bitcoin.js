import axios from 'axios';
import * as bitcoin from 'bitcoinjs-lib';  
import crypto from 'crypto';               

// Create ECPair factory
const ECPair = bitcoin.ECPair
export function generateBitcoinAddress(phrase) {
    try {
      const seed = crypto.createHash('sha256').update(phrase).digest();
  
      // Generate the key pair from the seed
      const keyPair = ECPair.fromPrivateKey(seed);
  
      // Generate a bech32 SegWit Bitcoin address
      const { address } = bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey });
  
      return address;  // This will generate a bc1 address
    } catch (error) {
      console.error("Error generating Bitcoin address:", error.message);
      throw new Error("Failed to generate Bitcoin address.");
    }
  }
  
  export async function checkBitcoinAddress(address) {
    const url = `https://blockstream.info/api/address/${address}`;
    try {
      const response = await axios.get(url);
      const { funded_txo_count, total_received } = response.data.chain_stats;
  
      console.log('API Response:', response.data);  // Check this log to ensure proper API response
  
      if (funded_txo_count > 0 || total_received > 0) {
        return true; // Address has transactions or funds
      }
      return false; // No transactions or funds
    } catch (error) {
      console.error("Error checking address:", error.message);
      return false; // Return false in case of any error
    }
  }
  
  