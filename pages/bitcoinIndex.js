import { useState } from 'react';
import { generatePhrases } from '../shuffle';  // Function to generate shuffled phrases
import { generateBitcoinAddress, checkBitcoinAddress } from '../bitcoin';  // Bitcoin address related functions

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