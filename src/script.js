// Stellt sicher, dass das DOM geladen ist
document.addEventListener('DOMContentLoaded', () => {
    fetch('emissions.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Fehler beim Laden der JSON-Datei');
            }
            return response.json();
        })
        .then(data => {
            // Standardmäßig Länderdaten anzeigen
            renderTable(data.land);

            // Event-Listener für den Filter
            document.getElementById('filterSelect').addEventListener('change', (event) => {
                const filter = event.target.value;
                if (filter === 'land') {
                    renderTable(data.land);
                } else if (filter === 'unternehmen') {
                    renderTable(data.unternehmen);
                }
            });
        })
        .catch(error => console.error('Fehler:', error));
});

// Tabelle rendern
function renderTable(data) {
    const tableBody = document.querySelector('#tabelData tbody');
    tableBody.innerHTML = ''; // Löscht bestehenden Tabelleninhalt

    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.emissionen}</td>
        `;
        tableBody.appendChild(row);
    });
}
