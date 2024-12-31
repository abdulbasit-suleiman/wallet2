import { useState, useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";

export default function WalletCheckerApp() {
  const [input, setInput] = useState("");
  const [generatedPhrases, setGeneratedPhrases] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [addressTransactions, setAddressTransactions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY = "CTTREV5V4SRWBPQHQ8DHQH1H3KI44IN5EV"; // Replace with your Etherscan API Key

  const wordList = [
    "abandon", "ability", "able", "about", "above", "absent", "absorb", "abstract", 
    "absurd", "abuse" , 
    "baby", "bachelor", "bacon", "badge", "bag", "balance", "balcony", "ball", 
    "bamboo", "banana","cabbage", "cabin", "cable", 
    "cactus", "cage", "cake", "call", "calm", "camera", "camp",
    "dad", "damage", "damp", "dance", "danger", "daring", "dash", "daughter", "dawn", "day", "eager", "eagle", "early",
    "earn", "earth", "easily", "east", "easy", "echo", "ecology", "fabric", "face", "faculty", "fade", "faint", "faith", "fall", "false", "fame", "family",
  "gadget", "gain", "galaxy", "gallery", "game", "gap", "garage", "garbage",
  "garden", "garlic", "habit", "hair", 
  "half", "hammer", "hamster", "hand", "happy", "harbor", "hard",  "ice", "icon", "idea", "identify", "idle", "ignore", "ill", "illegal", "illness", "image", 
  "jacket", "jaguar", "jar", "jazz", "jealous", "jeans", "jelly", "jewel", "job", "join",  "kangaroo", "keen", "keep", "ketchup", "key", "kick", 
  "kid", "kidney", "kind", "kingdom", "lab", "label", "labor", "ladder", "lady", "lake", 
  "lamp", "language", "laptop", "large",
  "machine", "mad", "magic", "magnet", "maid", "mail", "main", "major", "make", "mammal", "naive", "name", "napkin", "narrow", "nasty", "nation", 
  "nature", "near", "neck", "need", "oak", "obey", "object", "oblige", "obscure", "observe", 
  "obtain", "obvious", "occur", "ocean",  
  "pact", "paddle", "page", "pair", "palace", "palm", "panda", "panel", "panic", "panther", 
  "paper", "quality", "quantum", "quarter", "question", "quick", 
  "quit", "quiz", "quote", "rabbit", "raccoon", "race", "rack", "radar", "radio", "rail", "rain", 
  "raise", "rally","sad", "saddle", "sadness", "safe", "sail", "salad", "salmon", "salon", 
  "salt", "salute", "table", "tackle", "tag", "tail", "talent", "talk", "tank", "tape", "target", "task", "ugly", "umbrella", "unable",
  "unaware", "uncle", "uncover", "under", "undo", "unfair", "unfold","vacant", "vacuum", "vague", "valid", "valley",
  "valve", "van", "vanish", "vapor", "various", "vast", "wage", "wagon", "wait", "walk", "wall", "walnut", "want", "warfare",
  "warm", "warrior","yard", "year", "yellow", "you",
  "young", "youth", "zebra", "zero", "zone", "zoo"
  ];
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const generateRandomPhrase = () => {
    const shuffled = shuffleArray(wordList);
    return shuffled.slice(0, 12).join(" ");
  };

  const handleStartGenerating = () => {
    setIsGenerating(true);
  };

  const handleStopGenerating = () => {
    setIsGenerating(false);
  };

  const fetchAddressTransactions = async (address) => {
    try {
      const response = await axios.get(
        `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=${API_KEY}`
      );
      return response.data.result || [];
    } catch (error) {
      console.error(`Error fetching transactions for ${address}:`, error);
      return [];
    }
  };

  useEffect(() => {
    let interval;
    if (isGenerating) {
      interval = setInterval(() => {
        for (let i = 0; i < 5; i++) {
          handleGenerateAndCheck();
        }
      }, 1000); // Generate 5 phrases per second
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);
  
  const handleGenerateAndCheck = async () => {
    const newPhrase = generateRandomPhrase();
  
    try {
      const wallet = ethers.Wallet.fromMnemonic(newPhrase);
      const ethAddress = wallet.address;
  
      const transactions = await fetchAddressTransactions(ethAddress);
      if (transactions.length > 0) {
        alert(`Key phrase with transactions found: ${newPhrase}`);
      }
  
      setWallets((prev) => [
        ...prev,
        { phrase: newPhrase, address: ethAddress, transactions },
      ]);
  
      setGeneratedPhrases((prev) => [...prev, newPhrase]);
    } catch {
      // Invalid phrase, ignore it
    }
  };
  
  const handleInputCheck = async () => {
    const items = input.split(",").map((item) => item.trim());

    for (const item of items) {
      try {
        const wallet = ethers.Wallet.fromMnemonic(item);
        const ethAddress = wallet.address;

        const transactions = await fetchAddressTransactions(ethAddress);
        if (transactions.length > 0) {
          alert(`Key phrase with transactions found: ${item}`);
        }

        setWallets((prev) => [
          ...prev,
          { phrase: item, address: ethAddress, transactions },
        ]);
      } catch {
        if (ethers.utils.isAddress(item)) {
          const transactions = await fetchAddressTransactions(item);
          if (transactions.length > 0) {
            alert(`Transactions found for address: ${item}`);
          }
          setAddressTransactions((prev) => [
            ...prev,
            { address: item, transactions },
          ]);
        } else {
          setError(`Invalid input: ${item}`);
        }
      }
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h1>Wallet Phrase and Address Checker</h1>

      <textarea
        rows="5"
        placeholder="Enter wallet phrases or Ethereum addresses, separated by commas"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />
      <button
        onClick={handleInputCheck}
        style={{ padding: "10px", width: "100%", marginBottom: "20px" }}
      >
        Check Input
      </button>

      <button
        onClick={isGenerating ? handleStopGenerating : handleStartGenerating}
        style={{
          padding: "10px",
          width: "100%",
          backgroundColor: isGenerating ? "#FF6347" : "#4CAF50",
          color: "white",
        }}
      >
        {isGenerating ? "Stop Generating" : "Start Generating"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginTop: "20px" }}>
        <h2>Generated Wallets</h2>
        {wallets.map(({ phrase, address, transactions }, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
            }}
          >
            <p><strong>Phrase:</strong> {phrase}</p>
            <p><strong>Address:</strong> {address}</p>
            <p>
              <strong>Transactions:</strong> {transactions.length > 0
                ? transactions.map((tx) => (
                    <div key={tx.hash}>
                      <p>Hash: {tx.hash}</p>
                      <p>Value: {ethers.utils.formatEther(tx.value)} ETH</p>
                    </div>
                  ))
                : "No transactions found."}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
