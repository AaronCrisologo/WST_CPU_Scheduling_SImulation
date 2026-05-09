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

let processes = [];

const numProcessesInput = document.getElementById("numProcesses");
const processFieldsContainer = document.getElementById("processFieldsContainer");
const ganttChart = document.getElementById("ganttChart");
const timeline = document.getElementById("timeline");
const resultsContainer = document.getElementById("resultsContainer");
const startButton = document.getElementById("startButton");
const genprocfields = document.getElementById("genprocfields");

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
            priority: priority,
            endTime: 0,
            turnaroundTime: 0,
            waitingTime: 0,
            color: processColor
        });
    }

    console.log("Starting Non-Preemptive Priority Scheduling...");
    priorityScheduling();
}

function priorityScheduling() {
    let currentTime = 0;
    const executionOrder = [];
    const completed = [];

    while (completed.length < processes.length) {
        // Filter out processes that have already arrived and are not completed
        const availableProcesses = processes.filter(
            (p) => p.arrivalTime <= currentTime && !completed.includes(p)
        );

        if (availableProcesses.length === 0) {
            // If no processes are available, increment time
            currentTime++;
            continue;
        }

        // Select the process with the highest priority (lowest priority number)
        availableProcesses.sort((a, b) => a.priority - b.priority);
        const selectedProcess = availableProcesses[0];

        // Process starts execution
        const startTime = currentTime;
        const endTime = startTime + selectedProcess.burstTime;

        selectedProcess.endTime = endTime;
        selectedProcess.turnaroundTime = endTime - selectedProcess.arrivalTime; // Turnaround time = End time - Arrival time
        selectedProcess.waitingTime = selectedProcess.turnaroundTime - selectedProcess.burstTime; // Waiting time = Turnaround time - Burst time

        executionOrder.push({
            name: selectedProcess.name,
            startTime: startTime,
            endTime: endTime,
            color: selectedProcess.color
        });

        currentTime = endTime; // Update the current time after process execution
        completed.push(selectedProcess); // Mark process as completed
    }

    console.log("Priority Scheduling completed.");
    // Create Gantt chart and display results based on execution order
    createGanttChart(executionOrder);
    displayResults();
    calculateAndDisplayAverages(processes);
}

// Safe DOM-based results rendering
function displayResults() {
    const table = document.createElement("table");
    const header = document.createElement("tr");
    const headers = ["Process", "Arrival Time", "Burst Time", "Priority", "End Time", "Turnaround Time", "Waiting Time"];
    headers.forEach(txt => {
        const th = document.createElement("th");
        th.textContent = txt;
        header.appendChild(th);
    });
    table.appendChild(header);

    processes.forEach((process) => {
        const row = document.createElement("tr");
        const cells = [
            process.name,
            process.arrivalTime,
            process.burstTime,
            process.priority,
            process.endTime,
            process.turnaroundTime,
            process.waitingTime
        ];
        cells.forEach(val => {
            const td = document.createElement("td");
            td.textContent = val;
            row.appendChild(td);
        });
        table.appendChild(row);
    });

    resultsContainer.appendChild(table);
}

genprocfields.addEventListener("click", generateProcessFields);
startButton.addEventListener("click", startScheduling);