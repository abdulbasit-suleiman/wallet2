import { useState } from "react";
import { Connection, PublicKey, Keypair } from "@solana/web3.js";
import * as bip39 from "bip39";
import * as ed25519 from "ed25519-hd-key";

// Alchemy API Base URL and API Key
const alchemyBaseUrl = "https://solana-mainnet.g.alchemy.com/v2";
const alchemyApiKey = "jwGMXsIHXbboKnq43U6W0oLJPAPq5qLs"; // Replace with your Alchemy API key
const alchemyRpcUrl = `${alchemyBaseUrl}/${alchemyApiKey}`;

// Word list for seed phrase generation
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
    // Convert the mnemonic to a seed
    const seed = await bip39.mnemonicToSeed(mnemonic);

    // Derive a keypair using the seed and derivation path for Solana
    const derivationPath = "m/44'/501'/0'/0'"; // Solana BIP-44 derivation path
    const derivedSeed = ed25519.derivePath(derivationPath, seed.toString("hex")).key;

    // Return the derived Keypair
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
    if (!solAddress) {
      setError("Please enter a Solana address.");
      return;
    }
  
    setLoading(true);
    setTransactions(null);
    setError(null);
  
    try {
      let publicKey;
      try {
        publicKey = new PublicKey(solAddress);
      } catch (err) {
        console.error("Invalid Solana address:", err);
        setError("Invalid Solana address. Please ensure it is properly formatted.");
        return;
      }
  
      const connection = new Connection(alchemyRpcUrl, "confirmed");
      const signatureInfo = await connection.getSignaturesForAddress(publicKey, { limit: 1 });
  
      console.log("API Response (signatureInfo):", signatureInfo);
  
      if (Array.isArray(signatureInfo)) {
        if (signatureInfo.length > 0) {
          setTransactions("You have transactions.");
        } else {
          setTransactions("No transactions found.");
        }
      } else {
        console.error("Unexpected response structure:", signatureInfo);
        throw new Error("Unexpected API response structure.");
      }
    } catch (err) {
      console.error("Error during API call:", err);
  
      if (err.message.includes("StructError")) {
        setError("A data validation error occurred. Please verify your input and try again.");
      } else {
        setError("An error occurred while fetching transaction data.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  
  const generateAndCheckAddress = async () => {
    let found = false;
  
    while (!found) {
      const phrase = generateValidSeedPhrase(); // Generate the valid seed phrase
      setGeneratedPhrase(phrase);
  
      try {
        // Generate the address from the mnemonic
        const keypair = await deriveKeypairFromMnemonic(phrase.join(" "));
        const address = keypair.publicKey.toBase58();
        setGeneratedAddress(address);
  
        // Pass the phrase to checkTransactions
        await checkTransactions(address, phrase);
  
        // If no error occurs, check transactions state
        if (transactions === "You have transactions.") {
          found = true;
  
          // Alert the user with the successful phrase and address
          alert(`Transactions found on this account!\nSeed Phrase: ${phrase.join(" ")}\nAddress: ${address}`);
        }
      } catch (error) {
        console.error("Error generating address or checking transactions:", error);
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
