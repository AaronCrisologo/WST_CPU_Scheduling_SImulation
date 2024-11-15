import { initGanttChart, createGanttChart, getRandomColor } from './ganttChart.js';

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
const timeQuantumInput = document.getElementById("timeQuantum"); // Input for time quantum
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
    const priorities = document.querySelectorAll(".priority"); // Get all priority values

    for (let i = 0; i < arrivalTimes.length; i++) {
        const arrivalTime = parseInt(arrivalTimes[i].value);
        const burstTime = parseInt(burstTimes[i].value);
        const priority = parseInt(priorities[i].value);

        if (isNaN(arrivalTime) || isNaN(burstTime) || isNaN(priority)) {
            alert("Please enter valid values for all fields.");
            return;
        }

        // Assign a random color for each process
        const processColor = getRandomColor();

        processes.push({
            name: `P${i + 1}`,
            arrivalTime: arrivalTime,
            burstTime: burstTime,
            remainingTime: burstTime, // Track remaining time for each process
            priority: priority, // Store priority value
            endTime: 0,
            turnaroundTime: 0,
            waitingTime: 0,
            color: processColor // Store the color for each process
        });
    }

    const timeQuantum = parseInt(timeQuantumInput.value); // Get the time quantum

    if (isNaN(timeQuantum) || timeQuantum <= 0) {
        alert("Please enter a valid time quantum greater than 0.");
        return;
    }

    roundRobinScheduling(timeQuantum);
}

// Round Robin Scheduling Algorithm
function roundRobinScheduling(timeQuantum) {
    let currentTime = 0;
    const totalProcesses = processes.length;
    let completedProcesses = 0;
    const executionOrder = []; // Array to keep track of execution order
    const queue = []; // Process queue

    // Track whether a process has been added to the queue to avoid duplicates
    const addedToQueue = new Array(totalProcesses).fill(false);

    // Initialize by adding processes that have arrived by time 0
    processes.forEach((process, index) => {
        if (process.arrivalTime <= currentTime) {
            queue.push(index);
            addedToQueue[index] = true;
        }
    });


    // Main loop for Round Robin scheduling
    while (completedProcesses < totalProcesses) {
        if (queue.length > 0) {
            const currentIndex = queue.shift(); // Get the next process in the queue
            const currentProcess = processes[currentIndex];


            // Determine the actual time the process will run this round
            const timeToRun = Math.min(currentProcess.remainingTime, timeQuantum);
            currentProcess.remainingTime -= timeToRun; // Decrement remaining time
            currentTime += timeToRun; // Increment the current time

            // Add process execution to Gantt chart details
            executionOrder.push({
                name: currentProcess.name,
                startTime: currentTime - timeToRun,
                endTime: currentTime,
                color: currentProcess.color // Use the process's color
            });

            // Check if the process has completed its execution
            if (currentProcess.remainingTime === 0) {
                currentProcess.endTime = currentTime; // Set the end time
                currentProcess.turnaroundTime = currentProcess.endTime - currentProcess.arrivalTime; // Calculate turnaround time
                currentProcess.waitingTime = currentProcess.turnaroundTime - currentProcess.burstTime; // Calculate waiting time
                completedProcesses++;
            }

            // Add new arrivals to the queue if they have arrived by the current time
            processes.forEach((process, index) => {
                if (!addedToQueue[index] && process.arrivalTime <= currentTime && process.remainingTime > 0) {
                    queue.push(index);
                    addedToQueue[index] = true;
                }
            });

            // If the process is not yet finished, add it back to the queue
            if (currentProcess.remainingTime > 0) {
                queue.push(currentIndex);
            }
        } else {
            currentTime++; // No available processes; increment current time
        }
    }

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
