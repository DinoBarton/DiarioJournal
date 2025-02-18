const savedEntries = JSON.parse(localStorage.getItem('entries')) || [];

// Function to save the journal entry
function saveEntry() {
    const pleasantness = document.getElementById("pleasantness").value;
    const energy = document.getElementById("energy").value;
    const entry = document.getElementById("entry").value;
    const date = new Date().toISOString().split('T')[0]; // Date in YYYY-MM-DD format

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

    savedEntries.unshift(newEntry); // Add new entry at the beginning of the array
    localStorage.setItem('entries', JSON.stringify(savedEntries));
    displayEntries();
    updateChart();
    document.getElementById("entry").value = ''; // Clear the entry box
    document.getElementById("pleasantness").value = ''; // Clear pleasantness input
    document.getElementById("energy").value = ''; // Clear energy input
}

// Function to display the entries
function displayEntries() {
    const entriesList = document.getElementById("entriesList");
    entriesList.innerHTML = ''; // Clear current list

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

// Function to delete an entry
function deleteEntry(index) {
    savedEntries.splice(index, 1); // Remove the entry at the given index
    localStorage.setItem('entries', JSON.stringify(savedEntries)); // Update localStorage
    displayEntries(); // Re-render the entries
    updateChart(); // Re-render the chart
}

// Function to update the mood chart
function updateChart() {
    const chartData = savedEntries.map(entry => ({
        x: entry.pleasantness,    // Pleasantness on the X-axis
        y: entry.energy          // Energy on the Y-axis
    }));

    // Calculate the average of all entries
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

// Initialize by displaying saved entries and the chart
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('entriesList')) {
        displayEntries();
    }
    if (document.getElementById('moodChart')) {
        updateChart();
    }
});