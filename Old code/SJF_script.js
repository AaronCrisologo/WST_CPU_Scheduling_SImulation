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
    processFieldsContainer.innerHTML = ""; // Clear previous fields

    for (let i = 1; i <= numProcesses; i++) {
        const processField = document.createElement("div");
        processField.classList.add("process-field");

        processField.innerHTML = `
            <label>Process ${i} - Arrival Time (s):</label>
            <input type="number" class="arrivalTime" min="0" value="0" required>
            <label>Burst Time (s):</label>
            <input type="number" class="burstTime" min="1" value="1" required>
            <label>Priority:</label>
            <input type="number" class="priority" min="1" value="1" required>
        `;
        processFieldsContainer.appendChild(processField);
    }

    processForm.style.display = "block";
}

// Start scheduling with user-defined processes
function startScheduling() {
    processes = [];
    ganttChart.innerHTML = ""; // Clear previous Gantt chart
    timeline.innerHTML = ""; // Clear previous timeline
    resultsContainer.innerHTML = ""; // Clear previous results

    const arrivalTimes = document.querySelectorAll(".arrivalTime");
    const burstTimes = document.querySelectorAll(".burstTime");
    const priorityLevels = document.querySelectorAll(".priority");

    for (let i = 0; i < arrivalTimes.length; i++) {
        processes.push({
            name: `P${i + 1}`,
            arrivalTime: parseInt(arrivalTimes[i].value),
            burstTime: parseInt(burstTimes[i].value),
            priority: parseInt(priorityLevels[i].value),
            endTime: 0,
            turnaroundTime: 0,
            waitingTime: 0
        });
    }

    sjfScheduling();
}

// Shortest Job First Scheduling Algorithm
function sjfScheduling() {
    let currentTime = 0;
    const totalProcesses = processes.length;
    let completedProcesses = 0;
    const isCompleted = new Array(totalProcesses).fill(false); // Track completed processes
    const executionOrder = []; // Store the order of execution

    while (completedProcesses < totalProcesses) {
        const availableProcesses = getAvailableProcesses(currentTime, isCompleted);

        if (availableProcesses.length > 0) {
            const selectedIndex = selectNextProcess(availableProcesses);
            const selectedProcess = processes[selectedIndex];

            // Update process times
            currentTime += selectedProcess.burstTime; // Increment current time
            processes[selectedIndex].endTime = currentTime; // Set end time
            processes[selectedIndex].turnaroundTime = currentTime - processes[selectedIndex].arrivalTime; // Calculate turnaround time
            processes[selectedIndex].waitingTime = processes[selectedIndex].turnaroundTime - selectedProcess.burstTime; // Calculate waiting time

            // Mark process as completed
            isCompleted[selectedIndex] = true;
            completedProcesses++;

            // Record the execution order
            executionOrder.push(selectedProcess); // Store executed process
        } else {
            currentTime++; // If no processes are available, increment current time
        }
    }

    // Create Gantt chart and display results using execution order
    createGanttChart(executionOrder);
    displayResults();
}

// Get all processes that have arrived and are not completed
function getAvailableProcesses(currentTime, isCompleted) {
    return processes.map((process, index) => {
        return process.arrivalTime <= currentTime && !isCompleted[index] ? index : -1;
    }).filter(index => index !== -1);
}

// Select the next process to run based on the shortest burst time
function selectNextProcess(availableProcesses) {
    // Sort available processes by burst time, then by arrival time
    availableProcesses.sort((a, b) => {
        if (processes[a].burstTime === processes[b].burstTime) {
            return processes[a].arrivalTime - processes[b].arrivalTime;
        }
        return processes[a].burstTime - processes[b].burstTime;
    });

    // Return the index of the selected process
    return availableProcesses[0];
}

// Create Gantt Chart
function createGanttChart(executionOrder) {
    ganttChart.innerHTML = ""; // Clear previous chart
    let totalBurstTime = processes.reduce((sum, p) => sum + p.burstTime, 0);
    let currentPosition = 0; // Track the position for each process

    executionOrder.forEach((process) => {
        const processBar = document.createElement("div");
        processBar.classList.add("process-bar");

        // Calculate width percentage
        const widthPercentage = (process.burstTime / totalBurstTime) * 100;

        // Set the initial width to 0% for animation
        processBar.style.width = "0%";
        processBar.textContent = `${process.name}`;
        processBar.style.backgroundColor = getRandomColor(); // Set random color

        // Append the process bar to the Gantt chart
        ganttChart.appendChild(processBar);

        // Set the left position based on the currentPosition
        processBar.style.left = `${(currentPosition / totalBurstTime) * 100}%`;

        // Animate the width to the calculated percentage
        setTimeout(() => {
            processBar.style.width = `${widthPercentage}%`;
        }, currentPosition * 100); // Delay based on elapsed time

        // Update position for the next process
        currentPosition += process.burstTime;

        // Update timeline markers
        const marker = document.createElement("div");
        marker.classList.add("timeline-marker");
        marker.style.left = `${(currentPosition / totalBurstTime) * 100}%`;
        marker.textContent = `${currentPosition}s`;
        timeline.appendChild(marker);
    });

    // Add final end time marker
    const endMarker = document.createElement("div");
    endMarker.classList.add("timeline-marker");
    endMarker.style.left = "100%";
    endMarker.textContent = `${currentPosition}s`; // Total time
    timeline.appendChild(endMarker);
}

// Function to generate a random color
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
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
