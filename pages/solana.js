import { useState, useEffect } from "react";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import * as ed25519 from "ed25519-hd-key"; // Import for HD key derivation
import axios from "axios";
import * as bip39 from "bip39";

export default function WalletCheckerApp() {
  const [input, setInput] = useState("");
  const [wallets, setWallets] = useState([]);
  const [error, setError] = useState(null);
  const [autoCheck, setAutoCheck] = useState(false);

  // Define your custom word list
  const wordList = [
    "symptom", "bird", "claw", "pig", "retire", "exotic",
    "pizza", "forum", "game", "weird", "forget", "twice",
  ];

  const alchemyBaseUrl = "https://solana-mainnet.g.alchemy.com/v2";
  const alchemyApiKey = "jwGMXsIHXbboKnq43U6W0oLJPAPq5qLs"; // Replace with your Alchemy API key

  const generateCustomMnemonic = () => {
    const phrase = Array.from({ length: 12 }, () =>
      wordList[Math.floor(Math.random() * wordList.length)]
    ).join(" ");
    return phrase;
  };

  const fetchSolanaAddressTransactions = async (address) => {
    try {
      const url = `${alchemyBaseUrl}/${alchemyApiKey}`;
      const response = await axios.post(url, {
        jsonrpc: "2.0",
        id: 1,
        method: "getSignaturesForAddress",
        params: [address, { limit: 1 }], // Check if the address has at least one transaction
      });

      if (response.data && response.data.result) {
        return response.data.result;
      }
      return [];
    } catch (error) {
      console.error(
        `Error fetching transactions for Solana address ${address}:`,
        error.message || error
      );
      return [];
    }
  };

  const deriveKeypairFromMnemonic = async (mnemonic) => {
    try {
      const seed = await bip39.mnemonicToSeed(mnemonic);
      const derivationPath = "m/44'/501'/0'/0'";
      const derivedSeed = ed25519.derivePath(derivationPath, seed.toString("hex")).key;
      return Keypair.fromSeed(derivedSeed);
    } catch (error) {
      console.error("Error deriving keypair from mnemonic:", error);
      throw error;
    }
  };
  useEffect(() => {
    if (autoCheck) {
      const interval = setInterval(() => {
        handleGenerateAndCheck().catch(console.error);
      }, 1000); // 3 seconds delay
      return () => clearInterval(interval);
    }
  }, [autoCheck]);

  const handleInputCheck = async () => {
    const items = input.split(",").map((item) => item.trim());
  
    for (const item of items) {
      if (!bip39.validateMnemonic(item)) {
        setError(`Invalid mnemonic: ${item}`);
        continue;
      }
  
      try {
        const keypair = await deriveKeypairFromMnemonic(item);
        const publicKey = keypair.publicKey.toString();
  
        const solanaTransactions = await fetchSolanaAddressTransactions(publicKey);
  
        setWallets((prev) => [
          ...prev,
          { phrase: item, address: publicKey, solanaTransactions },
        ]);
  
        console.log(`Wallet Derived: ${item}, Address: ${publicKey}`);
      } catch (error) {
        setError(`Error processing mnemonic: ${item}`);
        console.error(`Error with mnemonic: ${item}`, error);
      }
    }
  };

  const handleGenerateAndCheck = async () => {
    const newPhrase = generateCustomMnemonic();

    try {
      const keypair = await deriveKeypairFromMnemonic(newPhrase);
      const publicKey = keypair.publicKey.toString();

      // Fetch Solana transactions
      const solanaTransactions = await fetchSolanaAddressTransactions(publicKey);

      if (solanaTransactions.length > 0) {
        alert(`Transaction found! Phrase: ${newPhrase}, Address: ${publicKey}`);
        setAutoCheck(false); // Stop auto-check on success
      } else {
        console.log(`No transactions found for: ${publicKey}`);
      }
    } catch (error) {
      console.error("Error generating wallet from mnemonic:", error);
    }
  };

  useEffect(() => {
    if (autoCheck) {
      const interval = setInterval(handleGenerateAndCheck, 1000);
      return () => clearInterval(interval);
    }
  }, [autoCheck]);

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h1>Wallet Checker</h1>

      <textarea
        rows="5"
        placeholder="Enter secret phrases (mnemonics), separated by commas"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />
      <button
        onClick={handleInputCheck}
        style={{ padding: "10px", width: "100%", marginBottom: "20px" }}
      >
        Check Mnemonics
      </button>

      <button
        onClick={() => setAutoCheck(!autoCheck)}
        style={{
          padding: "10px",
          width: "100%",
          marginBottom: "20px",
          backgroundColor: autoCheck ? "#f44336" : "#4CAF50",
          color: "white",
        }}
      >
        {autoCheck ? "Stop Auto-Check" : "Start Auto-Check"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginTop: "20px" }}>
        <h2>Derived Wallets</h2>
        {wallets.map(({ phrase, address, solanaTransactions }, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
            }}
          >
            <p>
              <strong>Phrase:</strong> {phrase}
            </p>
            <p>
              <strong>Address:</strong> {address}
            </p>
            <p>
              <strong>Solana Transactions:</strong>
              {solanaTransactions.length > 0
                ? solanaTransactions.map((tx, idx) => (
                  <div key={idx}>Signature: {tx.signature}</div>
                ))
                : "No transactions found."}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
