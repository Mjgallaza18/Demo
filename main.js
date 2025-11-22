const concepts = [
    'Closure', 'Async/Await', 'Promise', 'Array.map()', 'Spread Operator',
    'Destructuring', 'Hoisting', 'querySelector', 'localStorage', 'Event Bubbling',
    'JSON.parse', 'Fetch API', 'null vs undefined', 'Arrow Function', 'Ternary Operator',
    'Strict Mode', 'Template Literals', 'ES6 Classes', 'IIFE', 'Memoization',
    'Debouncing', 'Recursion', 'Set Data Structure', 'Generator Function', 'Web Workers'
]; 

let boardConcepts = [];
let calledItems = new Set();
let isGameOver = false;

// Utility function to shuffle an array (Fisher-Yates)
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createBoard() {
    // 1. Prepare concepts
    shuffle(concepts);
    boardConcepts = concepts.slice(0, 25); 

    const board = document.getElementById('bingo-board');
    board.innerHTML = '';
    
    // 2. Reset state
    isGameOver = false;
    calledItems.clear();
    document.getElementById('current-call').textContent = 'Call a concept!';
    document.getElementById('message').textContent = 'Click "Call Next Concept" to begin!';

    // 3. Create the 5x5 grid cells
    boardConcepts.forEach((concept, index) => {
        const cell = document.createElement('div');
        cell.classList.add('bingo-cell');
        cell.textContent = concept;
        cell.dataset.index = index;
        cell.dataset.marked = 'false';
        cell.addEventListener('click', () => markCell(cell));
        board.appendChild(cell);
    });
}

function markCell(cell) {
    if (isGameOver || cell.dataset.marked === 'true') return;
    
    const concept = cell.textContent;

    // Check if the clicked concept has been called
    if (calledItems.has(concept)) {
        cell.classList.add('marked');
        cell.dataset.marked = 'true';
        document.getElementById('message').textContent = `✅ Marked: ${concept}`;
        checkWin();
    } else {
        document.getElementById('message').textContent = `🚫 Error: ${concept} hasn't been called yet!`;
    }
}

function callNextItem() {
    if (isGameOver) return;
    
    // 1. Get available concepts that haven't been called
    const uncalledConcepts = concepts.filter(c => !calledItems.has(c));
    
    if (uncalledConcepts.length === 0) {
        document.getElementById('current-call').textContent = 'All concepts called!';
        return;
    }
    
    // 2. Select a random concept
    const randomIndex = Math.floor(Math.random() * uncalledConcepts.length);
    const calledConcept = uncalledConcepts[randomIndex];
    calledItems.add(calledConcept);
    
    // 3. Update UI
    document.getElementById('current-call').textContent = calledConcept;
    document.getElementById('message').textContent = `Looking for: ${calledConcept}`;
}

function checkWin() {
    const cells = Array.from(document.querySelectorAll('.bingo-cell'));
    const marked = (index) => cells[index].dataset.marked === 'true';

    // Winning patterns (5x5 grid indices: 0-24)
    const patterns = [
        // Rows
        [0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14], [15, 16, 17, 18, 19], [20, 21, 22, 23, 24],
        // Columns
        [0, 5, 10, 15, 20], [1, 6, 11, 16, 21], [2, 7, 12, 17, 22], [3, 8, 13, 18, 23], [4, 9, 14, 19, 24],
        // Diagonals
        [0, 6, 12, 18, 24], [4, 8, 12, 16, 20]
    ];
    
    for (const pattern of patterns) {
        if (pattern.every(marked)) {
            isGameOver = true;
            document.getElementById('message').textContent = '🎉 BINGO! You got a winning line!';
            // Highlight the winning pattern
            pattern.forEach(index => cells[index].style.boxShadow = '0 0 10px 5px #2ecc71');
            return;
        }
    }
}

// Start the game when the page loads
window.onload = createBoard;