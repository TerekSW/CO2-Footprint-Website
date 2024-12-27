//DOM Hauptfunktionen
document.addEventListener('DOMContentLoaded', () => {
    fetchData();       //Lade JSON-Datei
    initializeMenu();  //Menueausrichtung 
    validateInputs();  //Sichere Eingabefelder
});

//laedt JSON-Datei 
function fetchData() {
    fetch('emissions.json') //JSON-Datei abrufen
        .then(response => {
            //pruefen ob Antwort erfolgreich
            if (!response.ok) {
                throw new Error('Fehler beim Laden der JSON-Datei');
            }
            return response.json(); //Antwort in JSON umwandeln
        })
        .then(data => {
            displayTable(data.land); // 
            
            //Event-Listener Dropdown-Filter
            document.getElementById('filterSelect').addEventListener('change', (event) => {
                const filter = event.target.value; //Filterwert 
                //Filterwert --> Anzeige Laenderdaten/Unternehmensdaten
                if (filter === 'land') {
                    displayTable(data.land);
                } else if (filter === 'unternehmen') {
                    displayTable(data.unternehmen);
                }
            });
        })
        .catch(error => console.error('Fehler:', error)); //Fehlerprotokollierung
}


//Erstellung/Anzeige Tabelle 
function displayTable(data) {
    const tableBody = document.querySelector('#tableData tbody'); //Tabellevariable auswaehlen

    //Pruefen, ob Tabellenvariable vorhanden
    if (!tableBody) {
        console.error('Fehler: tbody-Element nicht gefunden');
        return;
    }

    tableBody.innerHTML = ''; //Tabelle leeren

    //Daten iterieren und Zeilen erstellen
    data.forEach(item => {
        const row = document.createElement('tr'); //Neue Tabellenzeile 
        row.innerHTML = `
            <td>${sanitize(item.name)}</td> <!-- Name einfuegen -->
            <td>${sanitize(item.emissionen)}</td> <!-- Emissionen einfuegen -->
        `;
        tableBody.appendChild(row); //Zeile zu Tabelle hinzufuegen
    });
}


//Sortierung Name/Emissionen.
function sortTable(column) {
    const tableBody = document.querySelector('#tableData tbody'); //Tabellenkörper auswaehlen

    //Pruefen, ob das Tabellen-Body-Element vorhanden ist
    if (!tableBody) return;

    const rows = Array.from(tableBody.rows); //Tabellenzeilen erfassen
    const index = column === 'name' ? 0 : 1; //Spaltenindex festlegen
    const ascending = tableBody.getAttribute('data-sort') !== 'asc'; //Sortierreihenfolge 

    //Sortierlogik
    rows.sort((a, b) => {
        const cellA = a.cells[index].innerText.trim(); //Zellenwert auslesen (A)
        const cellB = b.cells[index].innerText.trim(); //Zellenwert auslesen (B)

        return ascending 
            ? (isNaN(cellA) ? cellA.localeCompare(cellB) : cellA - cellB) //Aufsteigend sortieren
            : (isNaN(cellB) ? cellB.localeCompare(cellA) : cellB - cellA); //Absteigend sortieren
    });

    //Sortierte Zeilen einfuegen
    tableBody.innerHTML = '';
    rows.forEach(row => tableBody.appendChild(row));
    tableBody.setAttribute('data-sort', ascending ? 'asc' : 'desc'); //Sortierreihenfolge aktualisieren
}

//Bereinigung Eingaben
function validateInputs() {
    const inputs = document.querySelectorAll('input, textarea, select'); //Alle Eingabefelder 
    
    //Eingabe validieren, sobald Nutzer tippt
    inputs.forEach(input => {
        input.addEventListener('input', (e) => {
            e.target.value = sanitize(e.target.value); //Eingabe bereinigen
        });
    });
}


//Bereinigt Eingaben, um potenzielle Angriffe zu verhindern.
function sanitize(input) {
    const temp = document.createElement('div'); //Temporaeres HTML-Element erstellen
    temp.textContent = input; //Textinhalt festlegen
    return temp.innerHTML; //Bereinigten HTML-Text zurueckgeben
}

//Menu basierend auf Sprache
function initializeMenu() {
    const htmlElement = document.documentElement; //Root-Element auswaehlen
    const userLanguage = navigator.language || navigator.userLanguage; //Browsersprache abrufen
    const rtlLanguages = ['ar', 'he', 'fa', 'ur']; //Liste RTL-Sprachen

    //Sprache pruefen und Richtung setzen
    if (rtlLanguages.includes(userLanguage.split('-')[0])) {
        htmlElement.setAttribute('dir', 'rtl'); //RTL
    } else {
        htmlElement.setAttribute('dir', 'ltr'); //LTR
    }
}

//Abfangen JavaScript-Fehler 
window.onerror = function (message, source, lineno, colno, error) {
    console.error(`Fehler: ${message} in ${source} (Zeile ${lineno}, Spalte ${colno})`);
};