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
      "raccoon", "race", "run", "runway", "rural", "sad", "saddle", "sadness", "safe", "sail", "salad", "salmon", "salon", 
      "salt", "salute", "same", "sample", "sand", "satisfy", "satoshi", "sauce", "sausage", "save", "say", "scale", "scan", "scare", "scatter", "scene", "scheme", 
      "school", "science", "scissors", "scorpion", "scout", "scrap", "screen", "script", "scrub", "sea", "search", "season", "seat", "second", "secret", "section", 
      "security", "seed", "seek", "segment", "select", "sell", "seminar", "senior", "sense", "sentence", "series", "service", "session", "settle", "setup", "seven", 
      "shadow", "shaft", "shallow", "share", "shed", "shell", "sheriff", "shield", "shift", "shine", "ship", "shiver", "shock", "shoe", "shoot", "shop", "short", 
      "shoulder", "shove", "shrimp", "shrug", "shuffle", "shy", "sibling", "sick", "side", "siege", "sight", "sign", "silent", "silk", "silly", "silver", "similar", 
      "simple", "since", "sing", "siren", "sister", "situate", "six", "size", "skate", "sketch", "ski", "skill", "skin", "skirt", "skull", "slab", "slam", "sleep", 
      "slender", "slice", "slide", "slight", "slim", "slogan", "slot", "slow", "slush", "small", "smart", "smile", "smoke", "smooth", "snack", "snake", "snap", "sniff", 
      "snow", "soap", "soccer", "social", "sock", "soda", "soft", "solar", "soldier", "solid", "solution", "solve", "someone", "song", "soon", "sorry", "sort", 
      "soul", "sound", "soup", "source", "south", "space", "spare", "spatial", "spawn", "speak", "special", "speed", "spell", "spend", "sphere", "spice", "spider", 
      "spike", "spin", "spirit", "split", "spoil", "sponsor", "spoon", "sport", "spot", "spray", "spread", "spring", "spy", "square", "squeeze", "squirrel", "stable", 
      "stadium", "staff", "stage", "stairs", "stamp", "stand", "start", "state", "stay", "steak", "steel", "stem", "step", "stereo", "stick", "still", "sting", "stock", 
      "stomach", "stone", "stool", "story", "stove", "strategy", "street", "strike", "strong", "struggle", "student", "stuff", "stumble", "style", "subject", "submit", 
      "subway", "success", "such", "sudden", "suffer", "sugar", "suggest", "suit", "summer", "sun", "sunny", "sunset", "super", "supply", "supreme", "sure", "surface", 
      "surge", "surprise", "surround", "survey", "suspect", "sustain", "swallow", "swamp", "swap", "swarm", "swear", "sweet", "swift", "swim", "swing", "switch", "sword", 
      "symbol", "symptom", "syrup", "system", "table", "tackle", "tag", "tail", "talent", "talk", "tank", "tape", "target", "task", "taste", "tattoo", "taxi", "teach", 
      "team", "tell", "ten", "tenant", "tennis", "tent", "term", "test", "text", "thank", "that", "theme", "then", "theory", "there", "they", "thing", "this", "thought", 
      "three", "thrive", "throw", "thumb", "thunder", "ticket", "tide", "tiger", "tilt", "timber", "time", "tiny", "tip", "tired", "tissue", "title", "toast", "tobacco", 
      "today", "toddler", "toe", "together", "toilet", "token", "tomato", "tomorrow", "tone", "tongue", "tonight", "tool", "tooth", "top", "topic", "topple", "torch", 
      "tornado", "tortoise", "toss", "total", "tourist", "toward", "tower", "town", "toy", "track", "trade", "traffic", "tragic", "train", "transfer", "trap", "trash", "travel", "tray", "treat", "tree", "trend", "trial", "tribe", "trick", "trigger",
      "trim", "trip", "trophy", "trouble", "truck", "true", "truly", "trumpet", "trust", "truth",
      "try", "tube", "tuition", "tumble", "tuna", "tunnel", "turkey", "turn", "turtle", "twelve",
      "twenty", "twice", "twin", "twist", "two", "type", "typical", "ugly", "umbrella", "unable",
      "unaware", "uncle", "uncover", "under", "undo", "unfair", "unfold", "unhappy", "uniform",
      "unique", "unit", "universe", "unknown", "unlock", "until", "unusual", "unveil", "update",
      "upgrade", "uphold", "upon", "upper", "upset", "urban", "urge", "usage", "use", "used",
      "useful", "useless", "usual", "utility", "vacant", "vacuum", "vague", "valid", "valley",
      "valve", "van", "vanish", "vapor", "various", "vast", "vault", "vehicle", "velvet", "vendor",
      "venture", "venue", "verb", "verify", "version", "very", "vessel", "veteran", "viable",
      "vibrant", "vicious", "victory", "video", "view", "village", "vintage", "violin", "virtual",
      "virus", "visa", "visit", "visual", "vital", "vivid", "vocal", "voice", "void", "volcano",
      "volume", "vote", "voyage", "wage", "wagon", "wait", "walk", "wall", "walnut", "want", "warfare",
      "warm", "warrior", "wash", "wasp", "waste", "water", "wave", "way", "wealth", "weapon", "wear",
      "weasel", "weather", "web", "wedding", "weekend", "weird", "welcome", "west", "wet", "whale",
      "what", "wheat", "wheel", "when", "where", "whip", "whisper", "wide", "width", "wife", "wild",
      "will", "win", "window", "wine", "wing", "wink", "winner", "winter", "wire", "wisdom", "wise",
      "wish", "witness", "wolf", "woman", "wonder", "wood", "wool", "word", "work", "world", "worry",
      "worth", "wrap", "wreck", "wrestle", "wrist", "write", "wrong", "yard", "year", "yellow", "you",
      "young", "youth", "zebra", "zero", "zone", "zoo"
      ];

    const shuffled = shuffleArray(wordList);
    const newCards = [];
    for (let i = 0; i < shuffled.length; i += 12) {
      const phrase = shuffled.slice(i, i + 12).join(" ");
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
          // Show alert and log only for phrases with transactions
          alert(`Transaction found! Phrase: "${phrase}" | BTC Address: ${btcAddress}`);
          console.error(`Transaction found! Phrase: "${phrase}" | BTC Address: ${btcAddress}`);
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

// Removed unnecessary console logs in useEffect
useEffect(() => {
  let timeout;

  if (isSearching && !isLoading) {
    timeout = setTimeout(() => {
      generateRandomCards();
      checkPhrases(); // Start checking for valid wallet phrases
    }, 1200);
  } else {
    clearTimeout(timeout); // Stop the timeout when isSearching is false
  }

  return () => {
    clearTimeout(timeout); // Cleanup the timeout
  };
}, [isSearching, isLoading, phrases]);


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
    let timeout;

    if (isSearching && !isLoading) {
      timeout = setTimeout(() => {
        generateRandomCards();
        checkPhrases();
      }, 1200);
    } else {
      clearTimeout(timeout);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [isSearching, isLoading, phrases]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Wallet Checker</h1>

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

      <h2>Enter Phrases</h2>
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
