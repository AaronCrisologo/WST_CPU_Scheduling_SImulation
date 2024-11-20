let processes = [];
let animationInterval;

// Constants
const ANIMATION_DURATION_PER_UNIT = 500; // Duration for each time unit in milliseconds

const numProcessesInput = document.getElementById("numProcesses");
const processFieldsContainer = document.getElementById("processFieldsContainer");
const ganttChart = document.getElementById("ganttChart");
const timeline = document.getElementById("timeline");
const resultsContainer = document.getElementById("resultsContainer");

// Function to generate input fields for processes in a table
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
            <input type="number" class="priority" min="1" value="1" required>
        `;
        processFieldsContainer.appendChild(processField);
    }

    processFieldsContainer.style.display = "block"; // Show process fields
    document.getElementById("startButton").style.display = "block"; // Show start button
}

// Function to start the scheduling process
function startScheduling() {
    processes = [];
    ganttChart.innerHTML = "";
    timeline.innerHTML = "";
    resultsContainer.innerHTML = "";

    const arrivalTimes = document.querySelectorAll(".arrivalTime");
    const burstTimes = document.querySelectorAll(".burstTime");
    const priorityLevels = document.querySelectorAll(".priority");

    for (let i = 0; i < arrivalTimes.length; i++) {
        const arrivalTime = parseInt(arrivalTimes[i].value);
        const burstTime = parseInt(burstTimes[i].value);
        const priority = parseInt(priorityLevels[i].value);

        if (isNaN(arrivalTime) || isNaN(burstTime) || isNaN(priority)) {
            alert("Please enter valid values for all fields.");
            return;
        }

        processes.push({
            name: `P${i + 1}`,
            arrivalTime: arrivalTime,
            burstTime: burstTime,
            remainingTime: burstTime,
            endTime: 0,
            turnaroundTime: 0,
            waitingTime: 0,
            isComplete: false,
            priority: priority,
            startTime: 0 // To track when each process starts executing
        });
    }

    preemptivePriorityScheduling();
}

// Preemptive Priority scheduling algorithm
function preemptivePriorityScheduling() {
    let currentTime = 0;
    const executionOrder = [];
    let completedProcesses = 0;

    while (completedProcesses < processes.length) {
        const availableProcesses = processes.filter(p => p.arrivalTime <= currentTime && !p.isComplete);

        if (availableProcesses.length === 0) {
            currentTime++;
            continue; // If no processes are available, increment time
        }

        const currentProcess = availableProcesses.reduce((prev, curr) =>
            (prev.priority < curr.priority) ? prev : curr // Select process with the highest priority
        );

        // Record the execution order
        executionOrder.push({
            name: currentProcess.name,
            start: currentTime,
            end: currentTime + 1
        });

        currentProcess.remainingTime--;

        if (currentProcess.remainingTime === 0) {
            currentProcess.isComplete = true;
            currentProcess.endTime = currentTime + 1;
            currentProcess.turnaroundTime = currentProcess.endTime - currentProcess.arrivalTime;
            currentProcess.waitingTime = currentProcess.turnaroundTime - currentProcess.burstTime;
            completedProcesses++;
        }

        currentTime++;
    }

    createGanttChart(executionOrder);
    displayResults(); // Display results after scheduling
}

function createGanttChart(executionOrder) {
    ganttChart.innerHTML = ""; // Clear previous chart
    timeline.innerHTML = ""; // Clear previous timeline markers

    // Calculate total execution time
    const totalExecutionTime = executionOrder[executionOrder.length - 1].end; // Calculate total execution time

    let currentProcessEndTime = 0; // To track when the process ends for bar placement

    executionOrder.forEach(segment => {
        // Calculate the start time based on the actual segment start and end times
        const start = segment.start;
        const end = segment.end;

        // Create the process bar and animate
        createProcessBar(segment.name, start, end, totalExecutionTime);

        // Add a timeline marker at the end of each segment
        addTimelineMarker(end, totalExecutionTime);
    });
}


function createProcessBar(name, startTime, endTime, totalExecutionTime) {
    const processBar = document.createElement("div");
    processBar.classList.add("process-bar");

    const duration = endTime - startTime; // Duration of the process
    const targetWidthPercentage = (duration / totalExecutionTime) * 100; // Width based on total execution time
    const leftPositionPercentage = (startTime / totalExecutionTime) * 100; // Left position based on start time

    processBar.textContent = `${name}`;
    processBar.style.width = "0%"; // Start at 0%
    processBar.style.backgroundColor = getRandomColor();
    processBar.style.position = "absolute"; // Important for layout
    processBar.style.left = `${leftPositionPercentage}%`; // Set left based on start time

    ganttChart.appendChild(processBar);

    // Animate the width using JavaScript
    let currentWidth = 0;
    const animationDuration = duration * ANIMATION_DURATION_PER_UNIT; // Total duration for the animation in milliseconds
    const frameDuration = 10; // The duration for each frame of the animation
    const totalFrames = animationDuration / frameDuration; // Total frames for the animation
    const increment = targetWidthPercentage / totalFrames; // Width increment per frame

    const animation = setInterval(() => {
        if (currentWidth >= targetWidthPercentage) {
            clearInterval(animation);
        } else {
            currentWidth += increment; // Increment the width
            processBar.style.width = `${Math.min(currentWidth, targetWidthPercentage)}%`;
        }
    }, frameDuration);
}


// Add a timeline marker at a specified time
function addTimelineMarker(time, totalExecutionTime) {
    const marker = document.createElement("div");
    marker.classList.add("timeline-marker");
    marker.style.left = `${(time / totalExecutionTime) * 100}%`;
    marker.textContent = `${time}s`;
    timeline.appendChild(marker);
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

// Helper function to generate a random color for the process bars
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}