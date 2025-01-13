export function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  export function generatePhrases(wordList, phraseLength = 24) {
    const phrases = [];
    for (let i = 0; i < 1000000; i++) { // Generate multiple phrases
      const shuffled = shuffleArray(wordList);
      phrases.push(shuffled.slice(0, phraseLength).join(" "));
    }
    return phrases;
  }
  
  