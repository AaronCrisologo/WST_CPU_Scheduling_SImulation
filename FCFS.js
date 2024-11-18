import { initGanttChart, createGanttChart, getRandomColor } from './ganttChart.js';

document.addEventListener("DOMContentLoaded", () => {
    const ganttChartElement = document.getElementById("ganttChart");
    const timelineElement = document.getElementById("timeline");

    // Initialize Gantt chart elements
    initGanttChart(ganttChartElement, timelineElement);

    // Start scheduling and generate the Gantt chart
    startScheduling();
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
        `;
        processFieldsContainer.appendChild(processField);
    }

    processFieldsContainer.style.display = "block"; // Show process fields
    startButton.style.display = "block"; // Show start button
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

    console.log("Starting First Come First Serve Scheduling...");
    fcfsScheduling();
}

// First Come, First Serve Scheduling Algorithm
function fcfsScheduling() {
    let currentTime = 0;
    const executionOrder = []; // Array to keep track of execution order

    // Sort processes by arrival time
    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

    processes.forEach((process) => {
        // If the current time is less than the process's arrival time, idle until the process arrives
        if (currentTime < process.arrivalTime) {
            currentTime = process.arrivalTime;
        }

        // Process starts execution
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
    });

    console.log("FCFS Scheduling completed.");
    // Create Gantt chart and display results based on execution order
    createGanttChart(executionOrder);
    displayResults();
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
numProcessesInput.addEventListener("input", generateProcessFields);

// Event listener for the start button
startButton.addEventListener("click", startScheduling);
