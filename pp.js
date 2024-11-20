import { initGanttChart, createGanttChart, getRandomColor } from './ganttChart.js';
import { calculateAndDisplayAverages } from './averageTimes.js';

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
            <label>Priority:</label>
            <input type="number" class="priority" min="1" value="1" required>
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
    const priorities = document.querySelectorAll(".priority");

    for (let i = 0; i < arrivalTimes.length; i++) {
        const arrivalTime = parseInt(arrivalTimes[i].value);
        const burstTime = parseInt(burstTimes[i].value);
        const priority = parseInt(priorities[i].value);

        if (isNaN(arrivalTime) || isNaN(burstTime) || isNaN(priority)) {
            alert("Please enter valid values for all fields.");
            return;
        }

        // Use getRandomColor from ganttChart.js for each process color
        const processColor = getRandomColor();

        processes.push({
            name: `P${i + 1}`,
            arrivalTime: arrivalTime,
            burstTime: burstTime,
            remainingTime: burstTime, // Keep track of remaining burst time
            priority: priority,
            endTime: 0,
            turnaroundTime: 0,
            waitingTime: 0,
            color: processColor
        });
    }

    console.log("Starting Preemptive Priority Scheduling...");
    preemptivePriorityScheduling();
}

// Preemptive Priority Scheduling Algorithm
function preemptivePriorityScheduling() {
    let currentTime = 0;
    const executionOrder = [];
    let completed = 0;

    // Process queue that includes arrival times
    const processQueue = [...processes];

    // Sort the process queue based on arrival time
    processQueue.sort((a, b) => a.arrivalTime - b.arrivalTime);

    // While there are processes that are not completed
    while (completed < processes.length) {
        // Filter processes that have arrived but are not completed
        const availableProcesses = processQueue.filter(
            (p) => p.arrivalTime <= currentTime && p.remainingTime > 0
        );

        if (availableProcesses.length === 0) {
            // If no process is available, increment time
            currentTime++;
            continue;
        }

        // Sort available processes by priority (lower value = higher priority)
        availableProcesses.sort((a, b) => a.priority - b.priority);
        const selectedProcess = availableProcesses[0];

        // Execute the process for 1 unit of time
        selectedProcess.remainingTime -= 1;
        const startTime = currentTime;
        currentTime += 1;

        // If this was the last time unit for this process
        if (selectedProcess.remainingTime === 0) {
            selectedProcess.endTime = currentTime;
            selectedProcess.turnaroundTime =
                selectedProcess.endTime - selectedProcess.arrivalTime; // Turnaround time = End time - Arrival time
            selectedProcess.waitingTime =
                selectedProcess.turnaroundTime - selectedProcess.burstTime; // Waiting time = Turnaround time - Burst time
            completed++;
        }

        // Add execution to the Gantt chart timeline
        if (
            executionOrder.length > 0 &&
            executionOrder[executionOrder.length - 1].name === selectedProcess.name
        ) {
            // Extend the last block if it's the same process
            executionOrder[executionOrder.length - 1].endTime = currentTime;
        } else {
            // Add a new block for this process
            executionOrder.push({
                name: selectedProcess.name,
                startTime: startTime,
                endTime: currentTime,
                color: selectedProcess.color
            });
        }
    }

    console.log("Preemptive Priority Scheduling completed.");
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
            <th>Priority</th>
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
            <td>${process.priority}</td>
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
