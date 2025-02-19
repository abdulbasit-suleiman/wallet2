import axios from 'axios';
import * as bitcoin from 'bitcoinjs-lib';  
import crypto from 'crypto';               

// Create ECPair factory
const ECPair = bitcoin.ECPair;

export function generateBitcoinAddress(phrase) {
    try {
        // Generate a SHA-256 hash from the phrase
        const seed = crypto.createHash('sha256').update(phrase).digest();

        // Generate the key pair from the seed
        const keyPair = ECPair.fromPrivateKey(seed, { network: bitcoin.networks.bitcoin });

        // Generate a native SegWit (bc1q) Bitcoin address
        const { address } = bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey, network: bitcoin.networks.bitcoin });

        return address;  // This will generate a bc1q address (SegWit Bech32)
    } catch (error) {
        console.error("Error generating Bitcoin address:", error.message);
        throw new Error("Failed to generate Bitcoin address.");
    }
}

export async function checkBitcoinAddress(address) {
    const url = `https://blockstream.info/api/address/${address}`;
    try {
        const response = await axios.get(url);
        console.log('API Response:', response.data);  // Log the full response for debugging
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
