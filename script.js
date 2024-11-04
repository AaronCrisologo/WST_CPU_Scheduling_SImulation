// Store user-defined processes
let processes = [];

// Get elements
const numProcessesInput = document.getElementById("numProcesses");
const processForm = document.getElementById("processForm");
const processFieldsContainer = document.getElementById("processFieldsContainer");
const ganttChart = document.getElementById("ganttChart");
const timeline = document.getElementById("timeline");
const resultsContainer = document.getElementById("resultsContainer");

// Generate input fields for each process
function generateProcessFields() {
    const numProcesses = parseInt(numProcessesInput.value);
    processFieldsContainer.innerHTML = "";

    for (let i = 1; i <= numProcesses; i++) {
        const processField = document.createElement("div");
        processField.classList.add("process-field");

        processField.innerHTML = `
            <label>Process ${i} - Arrival Time (s):</label>
            <input type="number" class="arrivalTime" min="0" value="0" required>
            <label>Burst Time (s):</label>
            <input type="number" class="burstTime" min="1" value="1" required>
            <label>Priority:</label>
            <input type="number" class="priority" min="1" value="${i}" required>
        `;
        processFieldsContainer.appendChild(processField);
    }

    processForm.style.display = "block"; // Show the form after generating fields
}

// Start scheduling with user-defined processes
function startScheduling() {
    processes = [];
    ganttChart.innerHTML = "";
    timeline.innerHTML = "";
    resultsContainer.innerHTML = ""; // Clear previous results

    const arrivalTimes = document.querySelectorAll(".arrivalTime");
    const burstTimes = document.querySelectorAll(".burstTime");
    const priorities = document.querySelectorAll(".priority");

    for (let i = 0; i < arrivalTimes.length; i++) {
        processes.push({
            name: `P${i + 1}`,
            arrivalTime: parseInt(arrivalTimes[i].value),
            burstTime: parseInt(burstTimes[i].value),
            priority: parseInt(priorities[i].value),
            color: getRandomColor(),
            endTime: 0, // Initialize end time
            turnaroundTime: 0, // Initialize turnaround time
            waitingTime: 0 // Initialize waiting time
        });
    }

    // Sort processes by arrival time
    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

    // Initialize chart and animate
    initializeGanttChart();
    createTimeline();
    animateGanttChart();
}

// Generate random color for process bars
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Create a timeline based on processes
function createTimeline() {
    timeline.innerHTML = ""; // Clear existing timeline markers

    const totalBurstTime = processes.reduce((acc, process) => acc + process.burstTime, 0);
    let currentTime = 0;

    processes.forEach(process => {
        const marker = document.createElement("div");
        marker.classList.add("timeline-marker");

        // Calculate position of the marker as a percentage of total width
        const leftOffset = (currentTime / totalBurstTime) * 100;
        marker.style.left = `${leftOffset}%`;

        // Display the current time for each marker
        marker.textContent = `${currentTime}s`;
        timeline.appendChild(marker);

        // Increment current time by burst time for the next marker position
        currentTime += process.burstTime;
    });

    // Add final end time marker
    const endMarker = document.createElement("div");
    endMarker.classList.add("timeline-marker");
    endMarker.style.left = "100%";
    endMarker.textContent = `${currentTime}s`; // Total time
    timeline.appendChild(endMarker);
}

// Initialize Gantt Chart display
function initializeGanttChart() {
    ganttChart.innerHTML = "";

    processes.forEach(process => {
        const processBar = document.createElement("div");
        processBar.classList.add("process-bar");
        processBar.style.backgroundColor = process.color;
        processBar.style.width = "0%"; // Start with width at 0 for animation
        processBar.textContent = `${process.name} (Priority: ${process.priority})`;
        ganttChart.appendChild(processBar);
    });
}

// Animate Gantt Chart with sequential process display
async function animateGanttChart() {
    const processBars = document.querySelectorAll(".process-bar");
    let currentTime = 0;

    for (let i = 0; i < processBars.length; i++) {
        const process = processes[i];
        const processBar = processBars[i];
        const burstTime = process.burstTime;
        const totalBurstTime = processes.reduce((sum, p) => sum + p.burstTime, 0);
        const targetWidth = (burstTime / totalBurstTime) * 100;

        // Gradually show each process bar
        await new Promise(resolve => {
            let currentWidth = 0;
            const interval = setInterval(() => {
                currentWidth += 0.5; // Slow down the animation
                processBar.style.width = `${currentWidth}%`;

                if (currentWidth >= targetWidth) {
                    clearInterval(interval);
                    resolve();
                }
            }, 50); // Adjusted interval for slower animation
        });

        // Update times
        currentTime += burstTime;
        process.endTime = currentTime; // Set end time
        process.turnaroundTime = process.endTime - process.arrivalTime; // Calculate turnaround time
        process.waitingTime = process.turnaroundTime - process.burstTime; // Calculate waiting time
    }

    // Display results in a table after animation
    displayResults();
}

// Display results in a table
function displayResults() {
    const table = document.createElement("table");
    table.innerHTML = `
        <tr>
            <th>Process</th>
            <th>Arrival Time (s)</th>
            <th>Burst Time (s)</th>
            <th>End Time (s)</th>
            <th>Turnaround Time (s)</th>
            <th>Waiting Time (s)</th>
        </tr>
    `;

    processes.forEach(process => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${process.name}</td>
            <td>${process.arrivalTime}</td>
            <td>${process.burstTime}</td>
            <td>${process.endTime}</td>
            <td>${process.turnaroundTime}</td>
            <td>${process.waitingTime}</td>
        `;
        table.appendChild(row);
    });

    resultsContainer.appendChild(table);
}
