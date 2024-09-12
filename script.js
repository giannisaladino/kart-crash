// console.log('funziona');

// FASE DI PREPARAZIONE
// RACCOLGO GLI ELEMENTI DI INTERESSE DALLA PAGINA

const grid = document.querySelector('.grid');

// Prepariamo la griglia iniziale
const gridMatrix = [
    ['', '', '', '', '', '', 'grass'],
    ['', 'cones', '', '', '', '', 'fence'],
    ['', '', 'rock', '', '', '', ''],
    ['fence', '', '', '', '', '', ''],
    ['', '', 'grass', '', '', 'water', ''],
    ['', '', '', '', 'cones', '', ''],
    ['', 'water', '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
    ['', '', '', '', '', 'rock', ''],
];

// console.table(gridMatrix);

// impostazioni iniziali
const kartPosition = { y: 7, x: 3 };

//   FUNZIONI RELATIVE ALLA GRIGLIA
// funzione per renderizzare la griglia
function renderGrid() {
    // recupero ogni riga della matrice
    gridMatrix.forEach(function(rowCells){
        // console.log(rowCells);
        // per ognuno delle caselle...

        rowCells.forEach(function(cellContent){
            // console.log(cellContent);
            // creiamo un elemento div
            const cell = document.createElement('div');

            // inseriamo la classe cell
            cell.className = 'cell';

            // se c'è qualcosa nella cella, aggiungi anche una classe con lo stesso nome
            if(cellContent) cell.classList.add(cellContent);

            // ora metti l'elemento nella griglia
            grid.appendChild(cell);
        })
    });
}

// FUNZIONI RELATIVE AL KART
// funzione per posizionare il kart
function placeKart() {
    // inserisco la classe kart, nella cella corrispondente alle cordinate di kartPosition
    gridMatrix[kartPosition.y][kartPosition.x] = 'kart';
}

// FUNZIONE CHE RAGGRUPPA LE OPERAZIONI DI RENDERING
function renderElement(){
    placeKart();
    renderGrid();
}

// esecuzione delle funzioni di gioco
renderElement();
