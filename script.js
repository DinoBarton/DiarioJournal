const savedEntries = JSON.parse(localStorage.getItem('entries')) || [];

function saveEntry() {
    const pleasantness = document.getElementById("pleasantness").value;
    const energy = document.getElementById("energy").value;
    const entry = document.getElementById("entry").value;
    const date = new Date().toISOString().split('T')[0];

    if (entry.trim() === "" || pleasantness === "" || energy === "") {
        alert("Please fill in all fields.");
        return;
    }

    const newEntry = {
        date,
        pleasantness: parseInt(pleasantness),
        energy: parseInt(energy),
        entry
    };

    savedEntries.unshift(newEntry); 
    localStorage.setItem('entries', JSON.stringify(savedEntries));
    displayEntries();
    updateChart();
    document.getElementById("entry").value = ''; 
    document.getElementById("pleasantness").value = ''; 
    document.getElementById("energy").value = '';
}

function displayEntries() {
    const entriesList = document.getElementById("entriesList");
    entriesList.innerHTML = ''; 

    if (savedEntries.length === 0) {
        entriesList.innerHTML = "<p>No entries yet.</p>";
    } else {
        savedEntries.forEach((entry, index) => {
            const entryElement = document.createElement('div');
            entryElement.classList.add('entry');
            entryElement.innerHTML = `
                <strong>${entry.date}</strong><br>
                Pleasantness: ${entry.pleasantness}, Energy: ${entry.energy}<br>
                ${entry.entry}<br>
                <button class="delete-btn" onclick="deleteEntry(${index})">Delete</button>
                <hr>
            `;
            entriesList.appendChild(entryElement);
        });
    }
}

function deleteEntry(index) {
    savedEntries.splice(index, 1); 
    localStorage.setItem('entries', JSON.stringify(savedEntries));
    displayEntries(); 
    updateChart();
}

function updateChart() {
    const chartData = savedEntries.map(entry => ({
        x: entry.pleasantness,  
        y: entry.energy 
    }));

    const avgPleasantness = savedEntries.reduce((acc, entry) => acc + entry.pleasantness, 0) / savedEntries.length;
    const avgEnergy = savedEntries.reduce((acc, entry) => acc + entry.energy, 0) / savedEntries.length;

    const avgData = {
        x: avgPleasantness,
        y: avgEnergy
    };

    const ctx = document.getElementById('moodChart').getContext('2d');
    new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'Mood Entries',
                    data: chartData,
                    backgroundColor: 'rgba(75, 192, 192, 1)',
                    borderColor: 'rgba(75, 192, 192, 0.8)',
                    borderWidth: 1,
                    pointRadius: 5
                },
                {
                    label: 'Average Mood',
                    data: [avgData],
                    backgroundColor: 'rgba(255, 99, 132, 1)',
                    borderColor: 'rgba(255, 99, 132, 0.8)',
                    borderWidth: 2,
                    pointRadius: 7
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'Pleasantness (0 - 10)'
                    }
                },
                y: {
                    type: 'linear',
                    title: {
                        display: true,
                        text: 'Energy (0 - 10)'
                    }
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('entriesList')) {
        displayEntries();
    }
    if (document.getElementById('moodChart')) {
        updateChart();
    }
});
