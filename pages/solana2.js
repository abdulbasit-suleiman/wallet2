import { useState, useEffect } from "react";
import { Connection, PublicKey, Keypair } from "@solana/web3.js";
import * as bip39 from "bip39";
import * as ed25519 from "ed25519-hd-key";

// Define HTTP RPC URLs from QuickNode
const rpcUrls = [
  "https://compatible-dawn-wish.solana-mainnet.quiknode.pro/fccdfb42bd8daca05533a2af451ae5d36f7a1587", // First URL
  "https://compatible-dawn-wish.solana-mainnet.quiknode.pro/640e39ef0ddd886a6f31ea2699eb227cd04546c2", // Second URL
];

const MAX_REQUESTS_PER_SECOND = 15; // Max requests per second per URL
let lastRequestTime = Date.now();
let requestCounters = [0, 0]; // Track request count for both URLs

const wordList = [
  "abandon", "ability", "able", "about", "above", "absent", "absorb", "abstract", 
  "absurd", "abuse", "baby", "bachelor", "bacon", "badge", "bag", "balance", "balcony", 
  "ball", "bamboo", "banana", "cabbage", "cabin", "cable", "cactus", "cage", "cake", 
  "call", "calm", "camera", "camp", "dad", "damage", "damp", "dance", "danger", "daring", 
  "dash", "daughter", "dawn", "day", "eager", "eagle", "early", "earn", "earth", "easily", 
  "east", "easy", "echo", "ecology", "fabric", "face", "faculty", "fade", "faint", "faith", 
  "fall", "false", "fame", "family", "gadget", "gain", "galaxy", "gallery", "game", "gap", 
  "garage", "garbage", "garden", "garlic", "habit", "hair", "half", "hammer", "hamster", 
  "hand", "happy", "harbor", "hard", "ice", "icon", "idea", "identify", "idle", "ignore", 
  "ill", "illegal", "illness", "image", "jacket", "jaguar", "jar", "jazz", "jealous", "jeans", 
  "jelly", "jewel", "job", "join", "kangaroo", "keen", "keep", "ketchup", "key", "kick", 
  "kid", "kidney", "kind", "kingdom", "lab", "label", "labor", "ladder", "lady", "lake", 
  "lamp", "language", "laptop", "large", "machine", "mad", "magic", "magnet", "maid", "mail", 
  "main", "major", "make", "mammal", "naive", "name", "napkin", "narrow", "nasty", "nation", 
  "nature", "near", "neck", "need", "oak", "obey", "object", "oblige", "obscure", "observe", 
  "obtain", "obvious", "occur", "ocean", "pact", "paddle", "page", "pair", "palace", "palm", 
  "panda", "panel", "panic", "panther", "paper", "quality", "quantum", "quarter", "question", 
  "quick", "quit", "quiz", "quote", "rabbit", "raccoon", "race", "rack", "radar", "radio", 
  "rail", "rain", "raise", "rally", "sad", "saddle", "sadness", "safe", "sail", "salad", "salmon", 
  "salon", "salt", "salute", "table", "tackle", "tag", "tail", "talent", "talk", "tank", "tape", 
  "target", "task", "ugly", "umbrella", "unable", "unaware", "uncle", "uncover", "under", 
  "undo", "unfair", "unfold", "vacant", "vacuum", "vague", "valid", "valley", "valve", "van", 
  "vanish", "vapor", "various", "vast", "wage", "wagon", "wait", "walk", "wall", "walnut", 
  "want", "warfare", "warm", "warrior", "yard", "year", "yellow", "you", "young", "youth", 
  "zebra", "zero", "zone", "zoo"
];

// Function to shuffle the array
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Generate a valid 12-word seed phrase
const generateValidSeedPhrase = () => {
  let isValid = false;
  let seedPhrase = [];

  while (!isValid) {
    const shuffledWords = shuffleArray(wordList); // Shuffle the word list
    seedPhrase = shuffledWords.slice(0, 12); // Take the first 12 words

    // Validate the generated seed phrase
    isValid = bip39.validateMnemonic(seedPhrase.join(" "));
  }

  return seedPhrase;
};

// Function to derive the Solana address from a mnemonic using BIP-39 and Solana derivation path
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

// Main component
export default function Home() {
  const [address, setAddress] = useState("");
  const [transactions, setTransactions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedPhrase, setGeneratedPhrase] = useState("");
  const [generatedAddress, setGeneratedAddress] = useState("");

  const checkTransactions = async (solAddress) => {
    if (!solAddress) return;

    setLoading(true);
    setTransactions(null);
    setError(null);

    const now = Date.now();
    const secondsElapsed = (now - lastRequestTime) / 1000;

    if (secondsElapsed > 1) {
      requestCounters = [0, 0];
      lastRequestTime = now;
    }

    const connectionIndex = requestCounters[0] <= requestCounters[1] ? 0 : 1;

    if (requestCounters[connectionIndex] >= MAX_REQUESTS_PER_SECOND) {
      setError("Rate limit exceeded. Please try again later.");
      setLoading(false);
      return;
    }

    try {
      requestCounters[connectionIndex]++;
      
      const connection = new Connection(rpcUrls[connectionIndex], "confirmed");
      const publicKey = new PublicKey(solAddress);

      const signatureInfo = await connection.getSignaturesForAddress(publicKey, { limit: 1 });

      if (signatureInfo.length > 0) {
        setTransactions("You have transactions.");
      } else {
        setTransactions("No transactions found.");
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching transaction data.");
    } finally {
      setLoading(false);
    }
  };

  const generateAndCheckAddress = async () => {
    let found = false;

    while (!found) {
      const phrase = generateValidSeedPhrase(); // Use the valid seed phrase generator
      setGeneratedPhrase(phrase);

      try {
        // Generate the address from the mnemonic using the new method
        const keypair = await deriveKeypairFromMnemonic(phrase.join(" "));
        const address = keypair.publicKey.toBase58();
        setGeneratedAddress(address);

        // Check transactions for the generated address
        await checkTransactions(address);

        if (transactions === "You have transactions.") {
          found = true;
        }
      } catch (error) {
        setError("Error generating address or checking transactions.");
      }
    }
  };

  const handleManualCheck = () => {
    if (address) {
      checkTransactions(address);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1>Solana Transaction Checker</h1>

      <div>
        <label htmlFor="address">Enter Solana Address:</label>
        <input
          type="text"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter Solana Address"
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />
      </div>

      <button
        onClick={handleManualCheck}
        disabled={loading}
        style={{ padding: "10px 20px", backgroundColor: "#0070f3", color: "#fff", border: "none", cursor: "pointer" }}
      >
        {loading ? "Checking..." : "Check Transactions"}
      </button>

      <div>
        <h3>Generated 12-Word Phrase:</h3>
        <p>{generatedPhrase}</p>
        <button
          onClick={generateAndCheckAddress}
          disabled={loading}
          style={{ padding: "10px 20px", backgroundColor: "#0070f3", color: "#fff", border: "none", cursor: "pointer" }}
        >
          {loading ? "Generating..." : "Generate and Check Address"}
        </button>
      </div>

      <div style={{ marginTop: "20px" }}>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {transactions && <p>{transactions}</p>}
        {generatedAddress && <p>Generated Address: {generatedAddress}</p>}
      </div>
    </div>
  );
}
