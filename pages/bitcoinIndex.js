import { useState, useEffect } from "react";
import { Connection, PublicKey, Keypair } from "@solana/web3.js";

// Define HTTP RPC URLs from QuickNode
const rpcUrls = [
  "https://compatible-dawn-wish.solana-mainnet.quiknode.pro/fccdfb42bd8daca05533a2af451ae5d36f7a1587", // First URL
  "https://compatible-dawn-wish.solana-mainnet.quiknode.pro/640e39ef0ddd886a6f31ea2699eb227cd04546c2", // Second URL
];

const MAX_REQUESTS_PER_SECOND = 15; // Max requests per second per URL
let lastRequestTime = Date.now();
let requestCounters = [0, 0]; // Track request count for both URLs

// Define the word list
const wordList = [
  "abandon", "ability", "able", "awful", "awkward", "axis", 
  "baby", "bachelor", "bacon", "butter", "buyer", "buzz", "cabbage", "cabin", "cable", 
  "custom", "cute", "cycle",
  "dad", "damage", "damp", "duty", "dwarf", "dynamic", "eager", "eagle", "early", "extra",
  "eye", "eyebrow", "fabric", "face", "faculty",
  "furnace", "fury", "magic", "myself", "mystery", "myth", "naive", "name", "napkin", "number", "nurse", "nut", "oak", "obey", "object", "oxygen", "oyster", "ozone", 
  "pact", "paddle", "page", "put", "puzzle", "pyramid", "quality", "quantum", "quarter",
  "quit", "quiz", "quote", "rabbit", "raccoon", "race", "run", "runway", "rural", "sad", "saddle", "sadness", "symptom", "syrup", "system", "table", "tackle", "tag", "two", "type", "typical", "ugly", "umbrella", "unable",
  "useless", "usual", "utility", "vacant", "vacuum", "vague", "volume", "vote", "voyage", "wage", "wagon", "wait", "wrist", "write", "wrong", "yard", "year", "yellow", "you",
  "young", "youth", "zebra", "zero", "zone", "zoo"
];

// Function to generate a random 12-word phrase
const generateRandomPhrase = () => {
  const randomWords = [];
  for (let i = 0; i < 12; i++) {
    const randomIndex = Math.floor(Math.random() * wordList.length);
    randomWords.push(wordList[randomIndex]);
  }
  return randomWords.join(" ");
};

// Function to generate the Solana address from a random seed
const generateSolanaAddressFromSeed = (seed) => {
  const keypair = Keypair.fromSeed(seed);
  return keypair.publicKey.toBase58(); // Return the derived address
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
      const phrase = generateRandomPhrase();
      setGeneratedPhrase(phrase);

      // Generate a seed from the phrase and derive the address
      const seed = new Uint8Array(32); // Random 32-byte seed for simplicity
      window.crypto.getRandomValues(seed);
      const address = generateSolanaAddressFromSeed(seed);
      setGeneratedAddress(address);

      await checkTransactions(address);

      if (transactions === "You have transactions.") {
        found = true;
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
