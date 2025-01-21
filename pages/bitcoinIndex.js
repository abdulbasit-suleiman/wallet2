import { useState } from 'react';
import { generatePhrases } from '../shuffle';  // Function to generate shuffled phrases
import { generateBitcoinAddress, checkBitcoinAddress } from '../bitcoin';  // Bitcoin address related functions



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

export default function BitcoinIndex() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkedPhrases, setCheckedPhrases] = useState([]);  // Track checked phrases and their status
  const [customAddress, setCustomAddress] = useState("");  // For user input address
  const [customResult, setCustomResult] = useState(null);  // Result for custom address check

  const handleGenerate = async () => {
    setLoading(true);
    setResult(null);
    setCheckedPhrases([]);  // Reset checked phrases list on new generation
  
    try {
      const phrases = generatePhrases(wordList);  // Generate shuffled phrases
  
      for (const phrase of phrases) {
        try {
          // Step 3: Generate Bitcoin address for the phrase
          const address = generateBitcoinAddress(phrase);
  
          // Step 4: Check if the generated address has any transactions or funds
          const hasTransactions = await checkBitcoinAddress(address);
  
          // Step 5: If a valid address is found with funds or transactions, display it
          if (hasTransactions) {
            // If valid, store it in checkedPhrases
            const phraseStatus = { phrase, address, valid: true };
            setCheckedPhrases((prev) => [...prev, phraseStatus]);
  
            // Alert before updating state
            alert(`Valid wallet with funds or transactions found!\nPhrase: ${phrase}\nAddress: ${address}`);
            
            // Update result with both phrase and address after alert
            setResult({ phrase, address });
            break;  // Stop after finding the first valid address
          }
        } catch (innerError) {
          // Ignore invalid phrases silently (i.e., no valid address generated)
        }
      }
    } catch (error) {
      console.error("Error in handleGenerate:", error.message);
    } finally {
      setLoading(false);
    }
  };  

  const handleCustomAddressCheck = async () => {
    setLoading(true);
    setCustomResult(null);  // Reset custom result

    try {
      const hasTransactions = await checkBitcoinAddress(customAddress);

      if (hasTransactions) {
        setCustomResult(`The address has had transactions or funds.`);
      } else {
        setCustomResult(`The address has not had any transactions or funds.`);
      }
    } catch (error) {
      setCustomResult(`Error checking the address.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "'Arial', sans-serif", maxWidth: '800px', margin: '0 auto', padding: '20px', backgroundColor: '#f4f4f9', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Dep Phrase Checker</h1>
      
      <button 
        onClick={handleGenerate} 
        disabled={loading} 
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#28a745',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px',
          marginBottom: '20px',
          transition: 'background-color 0.3s'
        }}
      >
        {loading ? "Checking..." : "Generate & Check"}
      </button>

      {loading && (
        <div style={{ marginTop: "20px", textAlign: 'center' }}>
          <h3 style={{ color: '#555' }}>Checking Phrases...</h3>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {checkedPhrases.map((phraseStatus, index) => (
              phraseStatus.valid && (
                <li key={index} style={{ color: 'green', marginBottom: '5px' }}>
                  {phraseStatus.phrase} - Valid
                </li>
              )
            ))}
          </ul>
        </div>
      )}

      {!loading && checkedPhrases.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3 style={{ color: '#333' }}>Checked Phrases:</h3>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {checkedPhrases.map((phraseStatus, index) => (
              phraseStatus.valid && (
                <li key={index} style={{ color: 'green', marginBottom: '5px' }}>
                  {phraseStatus.phrase} - Valid
                </li>
              )
            ))}
          </ul>
        </div>
      )}

      {result && (
        <div style={{ marginTop: "20px", backgroundColor: '#fff', padding: '15px', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ color: '#333' }}>Found Valid Address:</h2>
          <p><strong>Phrase:</strong> {result.phrase}</p>
          <p><strong>Bitcoin Address:</strong> {result.address}</p>
        </div>
      )}

      <div style={{ marginTop: "30px" }}>
        <h2 style={{ color: '#333' }}>Check Custom Dep Address</h2>
        <input
          type="text"
          value={customAddress}
          onChange={(e) => setCustomAddress(e.target.value)}
          placeholder="Enter Bitcoin address"
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '16px',
            marginBottom: '10px',
            boxSizing: 'border-box'
          }}
        />
        <button
          onClick={handleCustomAddressCheck}
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'background-color 0.3s'
          }}
        >
          {loading ? "Checking..." : "Check Address"}
        </button>

        {customResult && (
          <div style={{ marginTop: "20px", padding: '10px', backgroundColor: '#f1f1f1', borderRadius: '4px' }}>
            <p style={{ color: '#333' }}>{customResult}</p>
          </div>
        )}
      </div>
    </div>
  );
}