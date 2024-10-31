// Process data with burst times (in milliseconds)
const processes = [
    { name: "P1", burstTime: 2000, color: "#FF5733" },
    { name: "P2", burstTime: 1500, color: "#33B5E5" },
    { name: "P3", burstTime: 3000, color: "#FF33A6" },
    { name: "P4", burstTime: 1000, color: "#8D33FF" }
];

// Get elements
const ganttChart = document.getElementById("ganttChart");
const timeline = document.getElementById("timeline");
const startButton = document.getElementById("startButton");

// Calculate total burst time to determine the full timeline
const totalBurstTime = processes.reduce((sum, process) => sum + process.burstTime, 0);
const chartWidth = ganttChart.offsetWidth;

// Function to create a timeline with markers at regular intervals
function createTimeline() {
    timeline.innerHTML = ""; // Clear any previous markers
    let currentTime = 0;

    processes.forEach(process => {
        const marker = document.createElement("div");
        marker.classList.add("timeline-marker");

        // Calculate the exact width and time for each marker based on burst time
        const markerWidth = (process.burstTime / totalBurstTime) * 100;
        marker.style.width = `${markerWidth}%`;
        marker.textContent = `${currentTime / 1000}s`;
        timeline.appendChild(marker);

        // Update current time for next marker
        currentTime += process.burstTime;
    });

    // Final marker for end time
    const endMarker = document.createElement("div");
    endMarker.classList.add("timeline-marker");
    endMarker.style.width = "0%";
    endMarker.textContent = `${totalBurstTime / 1000}s`;
    timeline.appendChild(endMarker);
}

// Initialize Gantt Chart display
function initializeGanttChart() {
    ganttChart.innerHTML = ""; // Clear chart

    processes.forEach(process => {
        // Create a process bar
        const processBar = document.createElement("div");
        processBar.classList.add("process-bar");
        processBar.style.backgroundColor = process.color;

        // Set width based on burst time
        const processWidth = (process.burstTime / totalBurstTime) * 100;
        processBar.style.width = `${processWidth}%`;
        processBar.textContent = process.name;
        ganttChart.appendChild(processBar);
    });
}

// Animate Gantt Chart
async function animateGanttChart() {
    startButton.disabled = true;

    const processBars = document.querySelectorAll(".process-bar");
    let startTime = 0;

    for (let i = 0; i < processBars.length; i++) {
        const process = processes[i];
        const processBar = processBars[i];
        const burstTime = process.burstTime;

        await new Promise(resolve => {
            // Animate each process as a gradual color change for visual effect
            let currentWidth = 0;
            const interval = setInterval(() => {
                currentWidth += 1;
                processBar.style.width = `${currentWidth}%`;

                if (currentWidth >= (burstTime / totalBurstTime) * 100) {
                    clearInterval(interval);
                    resolve();
                }
            }, burstTime / 100);
        });

        // Update start time for each process
        startTime += burstTime;
    }

    startButton.disabled = false;
}

// Event listeners
startButton.addEventListener("click", () => {
    initializeGanttChart();
    createTimeline();
    animateGanttChart();
});

// Initialize Gantt chart and timeline on load
initializeGanttChart();
createTimeline();
