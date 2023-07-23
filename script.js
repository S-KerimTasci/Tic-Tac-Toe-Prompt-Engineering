let fields = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
];

let currentPlayer = 'circle';

function init() {
    render();
}

function render() {
    const board = document.getElementById('content');

    let tableHTML = '<table class="tic-tac-toe-board">';
    for (let i = 0; i < 3; i++) {
        tableHTML += '<tr>';
        for (let j = 0; j < 3; j++) {
            const index = i * 3 + j;
            let fieldValue;
            if (fields[index] === 'circle') {
                fieldValue = generateCircleSVG();
            } else if (fields[index] === 'cross') {
                fieldValue = generateCrossSVG();
            } else {
                fieldValue = ''; // Leeres Feld
            }
            tableHTML += `<td class="tic-tac-toe-cell" onclick="handleClick(this, ${index})">${fieldValue}</td>`;
        }
        tableHTML += '</tr>';
    }
    tableHTML += '</table>';

    board.innerHTML = tableHTML;
}

function generateCircleSVG() {
    const circleSize = 70; // Breite und Höhe des Kreises in px
    const strokeColor = '#00B0ef'; // Farbe des Kreises
    const strokeWidth = 5; // Breite des Kreises in px
    const animationDuration = '125ms'; // Dauer der Animation

    const svgCode = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${circleSize}" height="${circleSize}">
        <circle cx="${circleSize / 2}" cy="${circleSize / 2}" r="${(circleSize / 2) - (strokeWidth / 2)}" 
                stroke="${strokeColor}" stroke-width="${strokeWidth}" fill="none">
          <animate attributeName="r" from="0" to="${(circleSize / 2) - (strokeWidth / 2)}" dur="${animationDuration}" fill="freeze" />
          <animate attributeName="cx" from="${circleSize / 2}" to="${circleSize / 2}" dur="${animationDuration}" fill="freeze" />
          <animate attributeName="cy" from="${circleSize / 2}" to="${circleSize / 2}" dur="${animationDuration}" fill="freeze" />
        </circle>
      </svg>
    `;
    return svgCode;
}

function generateCrossSVG() {
    const crossSize = 70; // Breite und Höhe des Kreuzes in px
    const strokeColor = '#FFC000'; // Farbe des Kreuzes
    const strokeWidth = 8; // Breite des Kreuzes in px
    const animationDuration = '125ms'; // Dauer der Animation

    const svgCode = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${crossSize}" height="${crossSize}">
        <line x1="0" y1="0" x2="${crossSize}" y2="${crossSize}" stroke="${strokeColor}" stroke-width="${strokeWidth}">
          <animate attributeName="x2" from="0" to="${crossSize}" dur="${animationDuration}" fill="freeze" />
          <animate attributeName="y2" from="0" to="${crossSize}" dur="${animationDuration}" fill="freeze" />
        </line>
        <line x1="0" y1="${crossSize}" x2="${crossSize}" y2="0" stroke="${strokeColor}" stroke-width="${strokeWidth}">
          <animate attributeName="x2" from="0" to="${crossSize}" dur="${animationDuration}" fill="freeze" />
          <animate attributeName="y2" from="${crossSize}" to="0" dur="${animationDuration}" fill="freeze" />
        </line>
      </svg>
    `;
    return svgCode;
}

function handleClick(cell, index) {
    if (fields[index] === null) {
        fields[index] = currentPlayer;
        cell.innerHTML = currentPlayer === 'circle' ? generateCircleSVG() : generateCrossSVG();
        cell.onclick = null;

        currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle';
    }
}

function checkGameEnd() {
    const winCombinations = [
        // Horizontale Gewinnkombinationen
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        // Vertikale Gewinnkombinationen
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        // Diagonale Gewinnkombinationen
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (const combination of winCombinations) {
        const [a, b, c] = combination;
        if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
            return { winner: fields[a], cells: combination };
        }
    }

    if (fields.every((cell) => cell !== null)) {
        return { winner: 'tie' };
    }

    return null;
}

function drawWinningLine(cells) {
    const content = document.getElementById('content');
    const cellSize = 100; // Größe der Zellen in px
    const strokeWidth = 5; // Breite der Linie in px

    if (cells.length === 3) {
        const [a, b, c] = cells;
        const [ax, ay] = [a % 3, Math.floor(a / 3)];
        const [bx, by] = [b % 3, Math.floor(b / 3)];
        const [cx, cy] = [c % 3, Math.floor(c / 3)];

        let x1, y1, x2, y2;

        if (ax === bx && bx === cx) {
            // Vertikale Linie
            x1 = (ax + 0.5) * cellSize;
            y1 = ay * cellSize;
            x2 = x1;
            y2 = (cy + 1) * cellSize;
        } else if (ay === by && by === cy) {
            // Horizontale Linie
            x1 = ax * cellSize;
            y1 = (ay + 0.5) * cellSize;
            x2 = (cx + 1) * cellSize;
            y2 = y1;
        } else if (ax === ay && bx === by && cx === cy) {
            // Diagonale Linie (von links oben nach rechts unten)
            x1 = ax * cellSize;
            y1 = ay * cellSize;
            x2 = (cx + 1) * cellSize;
            y2 = (cy + 1) * cellSize;
        } else if (ax + ay === 2 && bx + by === 2 && cx + cy === 2) {
            // Diagonale Linie (von rechts oben nach links unten)
            x1 = (ax + 1) * cellSize;
            y1 = ay * cellSize;
            x2 = bx * cellSize;
            y2 = (by + 1) * cellSize;
        }

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('stroke', 'white');
        line.setAttribute('stroke-width', strokeWidth);

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '300');
        svg.setAttribute('height', '300');
        svg.appendChild(line);

        // Die Linie als erstes Element im 'content' div einfügen und 'position: absolute;' setzen
        content.insertBefore(svg, content.firstChild);
        svg.style.position = 'absolute';
    }
}


function handleClick(cell, index) {
    if (fields[index] === null) {
        fields[index] = currentPlayer;
        cell.innerHTML = currentPlayer === 'circle' ? generateCircleSVG() : generateCrossSVG();
        cell.onclick = null;

        const gameEndResult = checkGameEnd();
        if (gameEndResult) {
            drawWinningLine(gameEndResult.cells);
            setTimeout(() => {
                fields = [
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                ];
                init(); // Neues Spiel starten
            }, 1500);
        } else {
            currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle';
        }
    }
}


