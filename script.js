// Wait for the HTML document to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element References ---
    const gameBoard = document.getElementById('game-board');
    const movesCountElem = document.getElementById('moves-count');
    const timerElem = document.getElementById('timer');
    const resetButton = document.getElementById('reset-button');
    const messageBox = document.getElementById('message-box');
    const messageTitle = document.getElementById('message-title');
    const messageText = document.getElementById('message-text');
    const messageCloseButton = document.getElementById('message-close-button');

    // --- Game State Variables ---
    let flippedCards = [];
    let matchedPairs = 0;
    let moves = 0;
    let timerInterval;
    let seconds = 0;
    let isBoardLocked = false; // Prevents clicking more than two cards at once
    const totalPairs = 8;

    // --- Emojis for the cards ---
    const emojis = ['🎉', '🚀', '🌟', '💡', '💻', '🧠', '🔥', '🎯'];

    // --- Game Initialization ---
    function initGame() {
        // Reset all state variables
        clearInterval(timerInterval);
        seconds = 0;
        moves = 0;
        matchedPairs = 0;
        flippedCards = [];
        isBoardLocked = false;
        
        // Update UI to reset state
        timerElem.textContent = '0s';
        movesCountElem.textContent = '0';
        gameBoard.innerHTML = ''; // Clear the board
        
        // Create a duplicated and shuffled array of emojis
        const cardEmojis = [...emojis, ...emojis];
        shuffleArray(cardEmojis);
        
        // Create and add card elements to the board
        cardEmojis.forEach(emoji => {
            createCard(emoji);
        });

        // Start the game timer
        startTimer();
    }

    // --- Shuffle Array (Fisher-Yates Algorithm) ---
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }
    }

    // --- Create a single card element and add it to the DOM ---
    function createCard(emoji) {
        const cardContainer = document.createElement('div');
        cardContainer.className = 'card-container h-24';

        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.emoji = emoji; // Store emoji in a data attribute for matching

        const cardFront = document.createElement('div');
        cardFront.className = 'card-face card-front';

        const cardBack = document.createElement('div');
        cardBack.className = 'card-face card-back';
        cardBack.textContent = emoji;

        card.appendChild(cardFront);
        card.appendChild(cardBack);
        cardContainer.appendChild(card);
        gameBoard.appendChild(cardContainer);

        // Add click event listener to the card
        card.addEventListener('click', () => handleCardClick(card));
    }

    // --- Timer Functions ---
    function startTimer() {
        timerInterval = setInterval(() => {
            seconds++;
            timerElem.textContent = `${seconds}s`;
        }, 1000);
    }

    // --- Handle Card Click Logic ---
    function handleCardClick(card) {
        // Ignore click if board is locked, or card is already flipped or matched
        if (isBoardLocked || card.classList.contains('flipped') || card.classList.contains('matched')) {
            return;
        }

        flipCard(card);
        flippedCards.push(card);

        // Check for a match if two cards are flipped
        if (flippedCards.length === 2) {
            incrementMoves();
            checkForMatch();
        }
    }

    // --- Flip a card ---
    function flipCard(card) {
        card.classList.add('flipped');
    }
    
    // --- Unflip a card ---
    function unflipCard(card) {
        card.classList.remove('flipped');
    }

    // --- Increment Moves Counter ---
    function incrementMoves() {
        moves++;
        movesCountElem.textContent = moves;
    }

    // --- Check if the two flipped cards are a match ---
    function checkForMatch() {
        isBoardLocked = true;
        const [card1, card2] = flippedCards;

        if (card1.dataset.emoji === card2.dataset.emoji) {
            // It's a match!
            setTimeout(() => {
                card1.classList.add('matched');
                card2.classList.add('matched');
                matchedPairs++;
                flippedCards = [];
                isBoardLocked = false;
                // Check for win condition
                if (matchedPairs === totalPairs) {
                    endGame();
                }
            }, 500); // Short delay to see the match
        } else {
            // Not a match
            setTimeout(() => {
                unflipCard(card1);
                unflipCard(card2);
                flippedCards = [];
                isBoardLocked = false;
            }, 1000); // Longer delay to memorize the cards
        }
    }

    // --- End Game Logic ---
    function endGame() {
        clearInterval(timerInterval);
        messageTitle.textContent = 'You Won!';
        messageText.textContent = `Amazing! You finished in ${seconds} seconds with ${moves} moves.`;
        messageBox.classList.remove('hidden');
    }

    // --- Event Listeners ---
    // Update: Reset button now reloads the game page for a fresh start
    resetButton.addEventListener('click', () => {
        window.location.reload();
    });

    // Update: "Play Again" button also reloads the game page
    messageCloseButton.addEventListener('click', () => {
        messageBox.classList.add('hidden');
        window.location.reload();
    });

    // --- Initial Game Start ---
    initGame();
});