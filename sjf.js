import { initGanttChart, createGanttChart, getRandomColor } from './ganttChart.js';
import { calculateAndDisplayAverages } from './averageTimes.js';

document.addEventListener("DOMContentLoaded", () => {
    const ganttChartElement = document.getElementById("ganttChart");
    const timelineElement = document.getElementById("timeline");

    // Initialize Gantt chart elements
    initGanttChart(ganttChartElement, timelineElement);
});

// Store user-defined processes
let processes = [];

// Get elements
const numProcessesInput = document.getElementById("numProcesses");
const processFieldsContainer = document.getElementById("processFieldsContainer");
const ganttChart = document.getElementById("ganttChart");
const timeline = document.getElementById("timeline");
const resultsContainer = document.getElementById("resultsContainer");
const startButton = document.getElementById("startButton");
const genprocfields = document.getElementById("genprocfields")

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

    // Ensure container is visible and trigger fade-in
    processFieldsContainer.style.display = "block";
    processFieldsContainer.classList.add("fade-in");

    // Show start button
    startButton.style.display = numProcesses > 0 ? 'block' : 'none';
}


// Start scheduling with user-defined processes
function startScheduling() {
    processes = [];
    ganttChart.innerHTML = ""; // Clear previous Gantt chart
    timeline.innerHTML = ""; // Clear previous timeline
    resultsContainer.innerHTML = ""; // Clear previous results

    const arrivalTimes = document.querySelectorAll(".arrivalTime");
    const burstTimes = document.querySelectorAll(".burstTime");

    for (let i = 0; i < arrivalTimes.length; i++) {
        const arrivalTime = parseInt(arrivalTimes[i].value);
        const burstTime = parseInt(burstTimes[i].value);

        if (isNaN(arrivalTime) || isNaN(burstTime)) {
            alert("Please enter valid values for all fields.");
            return;
        }

        // Use getRandomColor from ganttChart.js for each process color
        const processColor = getRandomColor();

        processes.push({
            name: `P${i + 1}`,
            arrivalTime: arrivalTime,
            burstTime: burstTime,
            endTime: 0,
            turnaroundTime: 0,
            waitingTime: 0,
            color: processColor
        });
    }

    console.log("Starting Shortest Job First Scheduling...");
    sjfScheduling();
}

// Shortest Job First Scheduling Algorithm
function sjfScheduling() {
    let currentTime = 0;
    const executionOrder = [];
    const readyQueue = [];

    // Create a copy of processes to manipulate
    const processList = [...processes];

    // Sort processes by arrival time initially
    processList.sort((a, b) => a.arrivalTime - b.arrivalTime);

    while (processList.length > 0 || readyQueue.length > 0) {
        // Add processes to the ready queue whose arrival time <= current time
        while (processList.length > 0 && processList[0].arrivalTime <= currentTime) {
            readyQueue.push(processList.shift());
        }

        // Sort ready queue by burst time
        readyQueue.sort((a, b) => a.burstTime - b.burstTime);

        if (readyQueue.length > 0) {
            // Execute the process with the shortest burst time
            const process = readyQueue.shift();
            const startTime = currentTime;
            const endTime = startTime + process.burstTime;

            process.endTime = endTime;
            process.turnaroundTime = endTime - process.arrivalTime; // Turnaround time = End time - Arrival time
            process.waitingTime = process.turnaroundTime - process.burstTime; // Waiting time = Turnaround time - Burst time

            executionOrder.push({
                name: process.name,
                startTime: startTime,
                endTime: endTime,
                color: process.color
            });

            currentTime = endTime; // Update the current time after process execution
        } else {
            // If no process is ready, advance time to the next process's arrival time
            if (processList.length > 0) {
                currentTime = processList[0].arrivalTime;
            }
        }
    }

    console.log("SJF Scheduling completed.");
    // Create Gantt chart and display results based on execution order
    createGanttChart(executionOrder);
    displayResults();
    calculateAndDisplayAverages(processes);
}

// Display results in a table
function displayResults() {
    const table = document.createElement("table");
    table.innerHTML = `
        <tr>
            <th>Process</th>
            <th>Arrival Time</th>
            <th>Burst Time</th>
            <th>End Time</th>
            <th>Turnaround Time</th>
            <th>Waiting Time</th>
        </tr>
    `;
    processes.forEach((process) => {
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

// Event listener to generate process input fields when the user changes the number of processes
genprocfields.addEventListener("click", generateProcessFields);

// Event listener for the start button
startButton.addEventListener("click", startScheduling);
