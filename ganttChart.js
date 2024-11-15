// ganttChart.js

let ganttChartContainer, timelineContainer;

// Store colors by process name for consistency
const processColors = {};

// Function to initialize Gantt chart elements
function initGanttChart(ganttChartElement, timelineElement) {
    ganttChartContainer = ganttChartElement;
    timelineContainer = timelineElement;
    ganttChartContainer.innerHTML = ""; // Clear previous chart
    timelineContainer.innerHTML = "";   // Clear previous timeline
}

// Function to generate a consistent color for each process
function getProcessColor(processName) {
    if (!processColors[processName]) {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        processColors[processName] = color;
    }
    return processColors[processName];
}

// Function to create and animate Gantt chart
function createGanttChart(executionOrder) {
    ganttChartContainer.innerHTML = ""; // Clear previous chart
    timelineContainer.innerHTML = "";   // Clear previous timeline
    let totalTime = executionOrder[executionOrder.length - 1].endTime;

    executionOrder.forEach((segment, index) => {
        const processBar = document.createElement("div");
        processBar.classList.add("process-bar");
        processBar.style.backgroundColor = getProcessColor(segment.name);

        // Set initial width to 0 and position based on start time
        processBar.style.width = "0%";
        processBar.style.left = `${(segment.startTime / totalTime) * 100}%`; // Position based on startTime
        processBar.textContent = `${segment.name}`;

        // Append the process bar to the Gantt chart
        ganttChartContainer.appendChild(processBar);

        // Create timeline marker for each process segment
        const marker = document.createElement("div");
        marker.classList.add("timeline-marker");
        marker.style.left = `${(segment.startTime / totalTime) * 100}%`;
        marker.textContent = `${segment.startTime}s`;
        timelineContainer.appendChild(marker);

        // Delay each bar's width expansion for animation effect
        setTimeout(() => {
            const duration = segment.endTime - segment.startTime;
            const widthPercentage = (duration / totalTime) * 100;
            processBar.style.width = `${widthPercentage}%`;
        }, index * 500); // Adjust the timing as needed
    });

    // Add final end time marker
    const endMarker = document.createElement("div");
    endMarker.classList.add("timeline-marker");
    endMarker.style.left = "100%";
    endMarker.textContent = `${totalTime}s`;
    timelineContainer.appendChild(endMarker);
}

// Export functions to be used in other scripts
export { initGanttChart, createGanttChart };
