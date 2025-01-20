import { useState, useEffect } from "react";
import * as bip39 from "bip39"; // Importing bip39 for mnemonic handling
import { PublicKey, Keypair } from "@solana/web3.js"; // Solana Web3 library for public key generation
import * as ed25519 from "ed25519-hd-key"; // Import for deriving the keypair using BIP-44

// The word list for generating the seed phrase
const wordList = [
  "abandon", "ability", "able", "about", "above", "absent", "absorb", "abstract",
  "absurd", "abuse", "nature", "near", "neck", "need", "oak", "obey", "object",
  "oblige", "obscure", "observe", "obtain", "obvious", "occur", "ocean", "pact",
  "paddle", "page", "pair", "palace", "palm", "panda", "panel", "panic", "panther",
  "paper", "quality", "quantum", "quarter", "question", "quick", "quit", "quiz",
  "quote", "rabbit", "raccoon", "race", "rack", "radar", "radio", "rail", "rain",
  "raise", "rally", "sad", "saddle", "sadness", "safe", "sail", "salad", "salmon",
  "salon", "salt", "salute", "table", "tackle", "tag", "tail", "talent", "talk",
  "tank", "tape", "target", "task", "ugly", "umbrella", "unable", "unaware", "uncle",
  "uncover", "under", "undo", "unfair", "unfold", "vacant", "vacuum", "vague",
  "valid", "valley", "valve", "van", "vanish", "vapor", "various", "vast", "wage",
  "wagon", "wait", "walk", "wall", "walnut", "want", "warfare", "warm", "warrior",
  "yard", "year", "yellow", "you", "young", "youth", "zebra", "zero", "zone", "zoo",
];

// Helper function to shuffle an array
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Generate a valid Solana seed phrase
const generateValidSeedPhrase = () => {
  let isValid = false;
  let seedPhrase = [];

  while (!isValid) {
    // Shuffle words and generate a 12-word phrase
    const shuffledWords = shuffleArray(wordList);
    seedPhrase = shuffledWords.slice(0, 12); // Take the first 12 words

    // Validate the generated seed phrase using bip39
    isValid = bip39.validateMnemonic(seedPhrase.join(" "));
  }

  return seedPhrase;
};

// Function to derive keypair from mnemonic using BIP-44 derivation path for Solana
const deriveKeypairFromMnemonic = async (mnemonic) => {
  try {
    // Step 1: Convert the mnemonic to a seed
    const seed = await bip39.mnemonicToSeed(mnemonic);
    
    // Step 2: Derive a keypair using the seed and derivation path for Solana
    const derivationPath = "m/44'/501'/0'/0'"; // Solana BIP-44 derivation path
    const derivedSeed = ed25519.derivePath(derivationPath, seed.toString("hex")).key;

    // Step 3: Return the derived Keypair (with both public and private keys)
    return Keypair.fromSeed(derivedSeed);
  } catch (error) {
    console.error("Error deriving keypair:", error);
    throw error;
  }
};

// Function to generate the Solana address from keypair
const generateSolanaAddress = async (seedPhrase) => {
  try {
    const keypair = await deriveKeypairFromMnemonic(seedPhrase.join(" "));
    const publicKey = keypair.publicKey.toBase58(); // Get public key in Base58 format
    console.log("Generated Public Key (Base58):", publicKey); // Check if this matches your wallet address
    return publicKey;
  } catch (error) {
    console.error("Error generating Solana address:", error);
    return "";
  }
};

export default function Home() {
  const [seedPhrase, setSeedPhrase] = useState([]);
  const [address, setAddress] = useState("");
  const [isClient, setIsClient] = useState(false);

  // Generate the seed phrase and address only on the client-side
  useEffect(() => {
    setIsClient(true);
    const newSeedPhrase = generateValidSeedPhrase();
    setSeedPhrase(newSeedPhrase);
    const newAddress = generateSolanaAddress(newSeedPhrase);
    setAddress(newAddress);
  }, []);

  // Copy the seed phrase and address to the clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  // Render only after the component is mounted
  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px", textAlign: "center" }}>
      <h1>Solana Seed Phrase Generator</h1>
      <p>Your generated valid seed phrase is:</p>
      <div
        style={{
          display: "inline-block",
          padding: "15px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          backgroundColor: "#f9f9f9",
          fontSize: "18px",
          marginBottom: "20px",
        }}
      >
        {seedPhrase.join(" ")}
      </div>

      <p>Your generated Solana address is:</p>
      <div
        style={{
          display: "inline-block",
          padding: "15px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          backgroundColor: "#f9f9f9",
          fontSize: "18px",
          marginBottom: "20px",
        }}
      >
        {address}
      </div>

      <div>
        <button
          onClick={() => {
            const newSeedPhrase = generateValidSeedPhrase();
            setSeedPhrase(newSeedPhrase);
            const newAddress = generateSolanaAddress(newSeedPhrase);
            setAddress(newAddress);
          }}
          style={{
            padding: "10px 20px",
            margin: "10px",
            fontSize: "16px",
            cursor: "pointer",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Generate New Phrase & Address
        </button>
        <button
          onClick={() => copyToClipboard(seedPhrase.join(" "))}
          style={{
            padding: "10px 20px",
            margin: "10px",
            fontSize: "16px",
            cursor: "pointer",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Copy Seed Phrase to Clipboard
        </button>
        <button
          onClick={() => copyToClipboard(address)}
          style={{
            padding: "10px 20px",
            margin: "10px",
            fontSize: "16px",
            cursor: "pointer",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Copy Address to Clipboard
        </button>
      </div>
    </div>
  );
}
