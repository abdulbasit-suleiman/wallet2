import { useState, useEffect } from "react";
import { generateBitcoinAddress, checkBitcoinAddress, shuffleArray } from '../utils';

export default function MergedApp() {
  const [cards, setCards] = useState([]);
  const [phrases, setPhrases] = useState("");
  const [results, setResults] = useState([]);
  const [copiedPhrases, setCopiedPhrases] = useState(new Set());
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [globalCheckedPhrases, setGlobalCheckedPhrases] = useState(new Set());

  const generateRandomCards = () => {
    const wordList = [
      "abandon", "ability", "able", "awful", "awkward", "axis",
      "baby", "bachelor", "bacon", "butter", "buyer", "buzz", "cabbage", "cabin", "cable",
      "custom", "cute", "cycle", "dad", "damage", "damp", "duty", "dwarf", "dynamic",
      "eager", "eagle", "early", "extra", "eye", "eyebrow", "fabric", "face", "faculty",
      "furnace", "fury", "future", "gadget", "gain", "galaxy", "guitar", "gun", "gym",
      "habit", "hair", "half", "hurt", "husband", "hybrid", "ice", "icon", "idea",
      "issue", "item", "ivory", "jacket", "jaguar", "jar", "junior", "junk", "just",
      "kangaroo", "keen", "keep", "knife", "knock", "know", "lab", "label", "labor",
      "lunch", "luxury", "lyrics", "machine", "mad", "magic", "myself", "mystery",
      "myth", "naive", "name", "napkin", "number", "nurse", "nut", "oak", "obey",
      "object", "oxygen", "oyster", "ozone", "pact", "paddle", "page", "put", "puzzle",
      "pyramid", "quality", "quantum", "quarter", "quit", "quiz", "quote", "rabbit",
      "raccoon", "race", "run", "runway", "rural", "sad", "saddle", "sadness", "symptom",
      "syrup", "system", "table", "tackle", "tag", "two", "type", "typical", "ugly",
      "umbrella", "unable", "useless", "usual", "utility", "vacant", "vacuum", "vague",
      "volume", "vote", "voyage", "wage", "wagon", "wait", "wrist", "write", "wrong",
      "yard", "year", "yellow", "you", "young", "youth", "zebra", "zero", "zone", "zoo"
    ];
  
    const shuffled = shuffleArray(wordList);
    const newCards = [];
    for (let i = 0; i < shuffled.length; i += 12) {
      const phrase = shuffled.slice(i, i + 12).join(" ");
      // Add only unique phrases that haven't been checked yet
      if (!globalCheckedPhrases.has(phrase)) {
        newCards.push(phrase);
      }
    }
  
    setCards((prevCards) => [...prevCards, ...newCards]);
    setPhrases((prevPhrases) => (prevPhrases ? prevPhrases + ", " + newCards.join(", ") : newCards.join(", ")));
  };
  
  const checkPhrases = async () => {
    try {
      const phraseArray = phrases
        .split(",")
        .map((phrase) => phrase.trim())
        .filter((phrase) => phrase.length > 0); // Clean up the phrase array
  
      if (phraseArray.length === 0) {
        alert("No valid phrases to process!");
        return;
      }
  
      setIsLoading(true);
  
      const walletsWithAddresses = await Promise.all(
        phraseArray.slice(0, 10).map(async (phrase) => {
          // Skip if the phrase has already been checked globally
          if (globalCheckedPhrases.has(phrase)) {
            return null;
          }
  
          const btcAddress = generateBitcoinAddress(phrase);
          if (!btcAddress) {
            return null;
          }
  
          const hasTransactions = await checkBitcoinAddress(btcAddress);
  
          if (hasTransactions) {
            alert(`Transaction found! Phrase: "${phrase}" | BTC Address: ${btcAddress}`);
            return { phrase, btcAddress };
          } else {
            return null;
          }
        })
      );
  
      // Filter out null results
      const validWallets = walletsWithAddresses.filter((wallet) => wallet !== null && wallet.btcAddress);
  
      // Update globalCheckedPhrases
      setGlobalCheckedPhrases((prevSet) => {
        const newSet = new Set(prevSet);
        phraseArray.forEach((phrase) => newSet.add(phrase)); // Add all processed phrases
        return newSet;
      });
  
      // Update results state
      setResults((prevResults) => [...prevResults, ...validWallets]);
      setIsLoading(false);
    } catch (error) {
      console.error("Error checking phrases:", error.message);
      setIsLoading(false);
      alert("An error occurred while checking the wallet phrases.");
    }
  };
  
  const toggleSearch = () => {
    setIsSearching((prev) => !prev);
  };

  const handleCopy = (phrase) => {
    navigator.clipboard.writeText(phrase);
    setCopiedPhrases((prev) => new Set(prev).add(phrase));
  };

  const handleDelete = (phrase) => {
    setCopiedPhrases((prev) => {
      const newSet = new Set(prev);
      newSet.delete(phrase);
      return newSet;
    });

    setResults((prev) => prev.filter((result) => result.phrase !== phrase));
  };

  useEffect(() => {
    console.log("isSearching:", isSearching); // Log the state of isSearching
  
    let timeout;
  
    if (isSearching && !isLoading) {
      timeout = setTimeout(() => {
        console.log("Generating random cards...");
        generateRandomCards();
        checkPhrases(); // Start checking for valid wallet phrases
      }, 1200);
    } else {
      console.log("Stopping the search...");
      clearTimeout(timeout); // Stop the timeout when isSearching is false
    }
  
    return () => {
      console.log("Cleaning up timeout...");
      clearTimeout(timeout); // Cleanup the timeout
    };
  }, [isSearching, isLoading, phrases]);
  
  return (
    <div style={{ padding: "20px" }}>
      <h1>Hiiiii</h1>

      {/* Display valid wallets and their BTC addresses */}
      {results.map((wallet, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "15px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            backgroundColor: copiedPhrases.has(wallet.phrase) ? "#d1f7d1" : "#fff",
            transition: "background-color 0.3s ease",
          }}
        >
          <h3 style={{ color: "#4CAF50", margin: "0 0 10px" }}>Valid Wallet</h3>
          <p>Phrase: {wallet.phrase}</p>
          <p>BTC Address: {wallet.btcAddress || "N/A"}</p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button
              onClick={() => {
                if (copiedPhrases.has(wallet.phrase)) {
                  handleDelete(wallet.phrase);
                } else {
                  handleCopy(wallet.phrase);
                }
              }}
              style={{
                padding: "10px 15px",
                backgroundColor: "#4CAF50",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              {copiedPhrases.has(wallet.phrase) ? "Delete" : "Copy"}
            </button>
          </div>
        </div>
      ))}

      <h2>Abdulbasit</h2>
      <textarea
        rows="10"
        cols="50"
        value={phrases}
        onChange={(e) => setPhrases(e.target.value)}
        placeholder="Enter wallet phrases separated by commas"
      ></textarea>
      <br />
      <button
        onClick={checkPhrases}
        style={{
          padding: "10px 15px",
          backgroundColor: "#4CAF50",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginRight: "2rem",
        }}
      >
        Generate and Check Wallets
      </button>
      <button
        onClick={toggleSearch}
        style={{
          padding: "10px 15px",
          backgroundColor: "#4CAF50",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {isSearching ? "Stop Searching" : "Start Searching"}
      </button>
    </div>
  );
}
