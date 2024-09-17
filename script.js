// console.log('funziona');

// FASE DI PREPARAZIONE
// RACCOLGO GLI ELEMENTI DI INTERESSE DALLA PAGINA

// bottone sinistra
const leftButton = document.querySelector('.left-button');

// bottone destra
const rightButton = document.querySelector('.right-button');

// griglia
const grid = document.querySelector('.grid');

// score counter
const scoreCounter = document.querySelector('.score-counter')

const endGameScreen = document.querySelector('.end-game-screen');

const restartGame = document.querySelector('.play-again');

const finalScore = document.querySelector('.final-score');

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
let score = 0;
let speed = 1000;

// FUNZIONI RELATIVE ALLA GRIGLIA
// funzione per renderizzare la griglia
function renderGrid() {
    // prima di tutto svuota la griglia
    grid.innerHTML = '';

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
    // recuperiamo il valore della cella in cui dobbiamo posizionare il kart
    const contentBeforeKart = gridMatrix[kartPosition.y][kartPosition.x];
    // console.log(contentBeforeKart);

    // se c'è una moneta, prendi i punti bonus, altrimenti è collisione
    if (contentBeforeKart === 'coin') {
        getBonusPoints();
    } else if (contentBeforeKart) {
        gameOver();
    }
    
    // inserisco la classe kart, nella cella corrispondente alle cordinate di kartPosition
    gridMatrix[kartPosition.y][kartPosition.x] = 'kart';
}

// funzione per muovere il kart
function moveKart(direction){
    // console.log(direction);

    // 'solleviamo' il kart per spostarlo da un'altra parte
    gridMatrix[kartPosition.y][kartPosition.x] = '';


    // aggiorniamo le coordinate a seconda della direzione
    switch (direction) {
        case 'left':
            if (kartPosition.x > 0) {
                kartPosition.x--
            } 
            break;
        case 'right':
            if(kartPosition.x < 6) {
                kartPosition.x++
            }
            break;  
            default:
                gridMatrix[kartPosition.y][kartPosition.x] = 'kart';
    }

    // rirenderizzare tutti gli elementi
    renderElements();
}

// FUNZIONE CHE RAGGRUPPA LE OPERAZIONI DI RENDERING
function renderElements(){
    placeKart();
    renderGrid();
}

// FUNZIONI RELATIVE AGLI OSTACOLI
// funzione per far scorrere gli ostacoli
function scrollObstacles() {
    // rimuovo temporaneamente il kart
    gridMatrix[kartPosition.y][kartPosition.x] = '';

    // controllo se c'è una moneta in gioco
    let isCoinInGame = lookForCoin();

    // recupero l'ultima riga e la mettiamo da parte
    // pop permette di portare un elemento alla fine della lista
    let lastRow = gridMatrix.pop();

    // se non ci sono monete in gioco, inseriamo una moneta nella riga
    if(!isCoinInGame) lastRow = insertCoin(lastRow);

    // mescolo casualmente gli Elementi della riga
    lastRow = shuffleElements(lastRow);

    // riporto in cima l'ultima riga recuperata
    // unshift permette di portare un elemento all'inizio della lista
    gridMatrix.unshift(lastRow);

    // console.table(gridMatrix);   

    // rirenderizziamo gli elementi
    renderElements();
}

// FUNZIONE PER MESCOLARE GLI ELEMENTE DI UNA RIGA
function shuffleElements(row) {
    // Algoritmo di Fisher-Yates
    for (let i = row.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [row[i], row[j]] = [row[j], row[i]];
    }

    return row;
}

// FUNZIONI RELATIVE AI PUNTI E ALLA VELOCITA
// funzione che incrementa il punteggio
function incrementScore(){
    // aumento il punteggio di 1 e lo inserisco in pagina
    scoreCounter.innerText = ++score;
}

// aumento la velocità del gioco
function incrementSpeed(){
    // se non siamo già troppo veloci...
    if (speed > 100) {
        // interrompo il flusso di gioco
        clearInterval(gameLoop);
        // con il '-=' decremento l'intervallo aumentando la velocità in questo caso di 100;
        speed -= 100;
        
        // rilanciamo il flusso con la velocità aggiornatas
        gameLoop = setInterval(runGameFlow, speed);
    }
}

// FUNZIONI RELATIVE AI BONUS
function getBonusPoints() {
    // incremento il punteggio di 15 
    score += 15;

    // inseriamo il punteggio aggiornato in pagina
    scoreCounter.innerText = score;

    // aggiungiamo la classe bonus al contatore
    scoreCounter.classList.add('bonus');

    // rimuoviamo la classe subito dopo per poterla riutilizzare
    setTimeout(function(){
        scoreCounter.classList.remove('bonus');
    }, 1500);
}

// Funzione per inserire una coin all'interno della riga
function insertCoin(row){
    // individuiamo l'indice del primo elemento vuoto
    const emptyIndex = row.indexOf('');

    // inserisco un coin in quella posizione
    row[emptyIndex] = 'coin';

    return row;
}

// Funzione per sapere se c'è una coin in gioco
function lookForCoin() {
    // creo un flag
    let coinFound = false;

    // recupero tutte le righe
    gridMatrix.forEach(function(row){
        // per ogni riga, controllo se c'è coin
        if (row.includes('coin')) {
            coinFound = true;
        }
    });
    return coinFound;
}


// FUNZIONI RELATIVE AL FLUSSO DI GIOCO
// funzione che raggruppa le operazioni da ripetere ciclicamente
function runGameFlow() {
    // aumentare il punteggio
    incrementScore();

    // aumentare la velocita ogni 10 punti
    // la % indica il resto della divisione, quindi per tutti i multipli di 10 aumenterà la velocita
    if (score % 10 === 0) {
        incrementSpeed()  
    } 
        
    // far scorrere gli ostacoli
    scrollObstacles();
}

// FUNZIONE DI FINE PARTITA
function gameOver(){
    // interrompo il flusso di gioco
    clearInterval(gameLoop);

    finalScore.innerText = score;

    // rivelo l'immagine di fine gioco
    endGameScreen.classList.remove('hidden');

    // porto il focus sul tasto gioca ancora
    restartGame.focus();
}

// EVENTI DI GIOCO
// click sul bottone gioca ancora
restartGame.addEventListener('click', function(){
    location.reload();
})

// click bottone sinistra
leftButton.addEventListener('click', function(){
    moveKart('left');
})

// click bottone destra
rightButton.addEventListener('click', function(){
    moveKart('right');
});

// reazione alle freccette
document.addEventListener('keyup', function(event){
    // console.log(event.key);
    switch(event.key) {
        case 'ArrowLeft':
            moveKart('left');
            break;
        case 'ArrowRight':
            moveKart('right');
            break;
        default: return;
    }      
});



// esecuzione delle funzioni di gioco
// renderElements();

// scrollo automaticamente gli ostacoli
let gameLoop = setInterval(runGameFlow, speed);