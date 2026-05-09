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

        const labelArrival = document.createElement("label");
        labelArrival.textContent = `Process ${i} - Arrival Time (s):`;
        const inputArrival = document.createElement("input");
        inputArrival.type = "number";
        inputArrival.className = "arrivalTime";
        inputArrival.min = "0";
        inputArrival.value = "0";
        inputArrival.required = true;

        const labelBurst = document.createElement("label");
        labelBurst.textContent = "Burst Time (s):";
        const inputBurst = document.createElement("input");
        inputBurst.type = "number";
        inputBurst.className = "burstTime";
        inputBurst.min = "1";
        inputBurst.value = "1";
        inputBurst.required = true;

        const labelPriority = document.createElement("label");
        labelPriority.textContent = "Priority:";
        const inputPriority = document.createElement("input");
        inputPriority.type = "number";
        inputPriority.className = "priority";
        inputPriority.min = "1";
        inputPriority.value = "1";
        inputPriority.required = true;

        // Assemble the field
        processField.appendChild(labelArrival);
        processField.appendChild(inputArrival);
        processField.appendChild(labelBurst);
        processField.appendChild(inputBurst);
        processField.appendChild(labelPriority);
        processField.appendChild(inputPriority);

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

    // Replace previous output
    resultsContainer.innerHTML = '';
    resultsContainer.appendChild(table);
}

// Event listener to generate process input fields when the user changes the number of processes
genprocfields.addEventListener("click", generateProcessFields);

// Event listener for the start button
startButton.addEventListener("click", startScheduling);