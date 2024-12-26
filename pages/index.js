import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const [inputValue, setInputValue] = useState(''); // State to store input
  const [focus, setFocus] = useState(false); // Track input focus for animation
  const router = useRouter();

  // Colors for splash effect
  const colors = [
    '#FF5733', '#33FF57', '#5733FF', '#FFC300', '#FF33A1', '#33A1FF', '#FF6F33', '#33FF7A', '#7AFF33', '#33FF8C',
    '#FF33B8', '#33FFBE', '#E433FF', '#FF33D0', '#33E4FF', '#FF8433', '#33B6FF', '#33D0FF', '#FF5733', '#FF7043'
  ];

  useEffect(() => {
    // No need for additional useEffect for shifting now
  }, []);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleFocus = () => {
    setFocus(true);
  };

  const handleBlur = () => {
    setFocus(false);
  };

  const handleKeyDown = (event) => {
    // Check if 'Enter' key is pressed
    if (event.key === 'Enter') {
      const trimmedInput = inputValue.trim().toLowerCase();

      // Check for specific input values and route accordingly
      if (trimmedInput === 'hi') {
        router.push('/merged'); 
      } else if (trimmedInput === 'hello') {
        router.push('/hello'); 
      } else {
        alert('Invalid input, please type .');
      }
    }
  };

  // Set random color from the array for the splash effect
  const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

  return (
    <div style={styles.container}>
      <div className="falling-elements">
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            key={index}
            className="flower"
            style={{
              left: `${Math.random() * 100}vw`,
              animationDuration: `${Math.random() * 3 + 2}s`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}

        {Array.from({ length: 5 }).map((_, index) => (
          <img
            key={index}
            className="bitcoin"
            style={{
              left: `${Math.random() * 100}vw`,
              animationDuration: `${Math.random() * 3 + 2}s`,
              animationDelay: `${Math.random() * 2}s`,
              width: '30px',
              height: '30px',
            }}
          />
        ))}

        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="car"
            style={{
              left: `${Math.random() * 100}vw`,
              animationDuration: `${Math.random() * 4 + 3}s`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          >
            <span className="dollar">$</span>
            <span className="dollar">$</span>
            <span className="dollar">$</span>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="Enter The stuff Abdulbasit told you For Eth"
        style={{
          ...styles.input,
          borderColor: focus ? getRandomColor() : '#ccc',
          animation: focus ? 'splash 0.6s ease-out' : 'none',
          animationName: 'jump',  // Apply the jumping animation
          animationDuration: '3s', // Duration of each jump
          animationIterationCount: 'infinite', // Make it run forever
        }}
      />
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f0f0',
    position: 'relative', // Important for the flowers to be positioned correctly
  },
  input: {
    padding: '10px 20px',
    fontSize: '16px',
    width: '300px',
    textAlign: 'center',
    borderRadius: '5px',
    border: '1px solid #ccc',
    outline: 'none',
    transition: 'all 0.3s ease',
    zIndex: 2, // Keep input above falling elements
  },
};

// CSS for the falling flowers, bitcoin logo, car with dollars, and animations
const globalStyle = `
  @keyframes splash {
    0% { transform: scale(1); box-shadow: 0 0 5px 0 rgba(0,0,0,0.2); }
    50% { transform: scale(1.2); box-shadow: 0 0 10px 10px rgba(0,0,0,0.1); }
    100% { transform: scale(1); box-shadow: 0 0 5px 0 rgba(0,0,0,0.2); }
  }

  @keyframes falling {
    0% { transform: translateY(-100vh); opacity: 1; }
    100% { transform: translateY(100vh); opacity: 0; }
  }

  @keyframes jump {
    0% { transform: translate(0, 0); }
    25% { transform: translate(50vw, 0); }
    50% { transform: translate(50vw, 50vh); }
    75% { transform: translate(0, 50vh); }
    100% { transform: translate(0, 0); }
  }

  .falling-elements {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
    z-index: 1;
  }

  .flower {
    position: absolute;
    top: -10px;
    width: 20px;
    height: 20px;
    background-color: #ff69b4; /* Pink color */
    border-radius: 50%;
    animation: falling linear infinite;
  }

  .bitcoin {
    position: absolute;
    top: -10px;
    animation: falling linear infinite;
  }

  .car {
    position: absolute;
    top: -10px;
    display: flex;
    justify-content: center;
    align-items: center;
    animation: falling linear infinite;
  }

  .dollar {
    font-size: 20px;
    color: green;
    margin: 0 5px;
  }
`;

if (typeof window !== 'undefined') {
  const styleTag = document.createElement('style');
  styleTag.innerHTML = globalStyle;
  document.head.appendChild(styleTag);
}
