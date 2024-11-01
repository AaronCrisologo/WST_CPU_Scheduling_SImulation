// Store user-defined processes
let processes = [];

// Get elements
const numProcessesInput = document.getElementById("numProcesses");
const processForm = document.getElementById("processForm");
const processFieldsContainer = document.getElementById("processFieldsContainer");
const ganttChart = document.getElementById("ganttChart");
const timeline = document.getElementById("timeline");

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

    processForm.style.display = "block";
}

// Start scheduling with user-defined processes
function startScheduling() {
    processes = [];
    ganttChart.innerHTML = "";
    timeline.innerHTML = "";

    const arrivalTimes = document.querySelectorAll(".arrivalTime");
    const burstTimes = document.querySelectorAll(".burstTime");
    const priorities = document.querySelectorAll(".priority");

    for (let i = 0; i < arrivalTimes.length; i++) {
        processes.push({
            name: `P${i + 1}`,
            arrivalTime: parseInt(arrivalTimes[i].value),
            burstTime: parseInt(burstTimes[i].value),
            priority: parseInt(priorities[i].value),
            color: getRandomColor()
        });
    }

    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

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

// Create a timeline based on total burst time
function createTimeline() {
    const totalBurstTime = processes.reduce((acc, process) => acc + process.burstTime, 0);
    let currentTime = 0;

    processes.forEach(process => {
        const marker = document.createElement("div");
        marker.classList.add("timeline-marker");

        const markerWidth = (process.burstTime / totalBurstTime) * 100;
        marker.style.width = `${markerWidth}%`;
        marker.textContent = `${currentTime}s`;
        timeline.appendChild(marker);

        currentTime += process.burstTime;
    });

    const endMarker = document.createElement("div");
    endMarker.classList.add("timeline-marker");
    endMarker.textContent = `${totalBurstTime}s`;
    timeline.appendChild(endMarker);
}

// Initialize Gantt Chart display with hidden processes
function initializeGanttChart() {
    ganttChart.innerHTML = "";

    const totalBurstTime = processes.reduce((acc, process) => acc + process.burstTime, 0);

    processes.forEach(process => {
        const processBar = document.createElement("div");
        processBar.classList.add("process-bar");
        processBar.style.backgroundColor = process.color;
        processBar.style.width = "0%"; // Start with width at 0 for animation
        processBar.textContent = `${process.name} (Priority: ${process.priority})`;
        ganttChart.appendChild(processBar);
    });
}

// Animate Gantt Chart with slower animation and sequential process display
async function animateGanttChart() {
    const processBars = document.querySelectorAll(".process-bar");
    let currentTime = 0;

    for (let i = 0; i < processBars.length; i++) {
        const process = processes[i];
        const processBar = processBars[i];
        const burstTime = process.burstTime;
        const targetWidth = (burstTime / processes.reduce((sum, p) => sum + p.burstTime, 0)) * 100;

        // Show each process bar gradually
        await new Promise(resolve => {
            let currentWidth = 0;
            const interval = setInterval(() => {
                currentWidth += 0.5; // Slow down the animation
                processBar.style.width = `${currentWidth}%`;

                if (currentWidth >= targetWidth) {
                    clearInterval(interval);
                    resolve();
                }
            }, 50); // Interval adjusted for slower animation
        });

        currentTime += burstTime;
    }
}
