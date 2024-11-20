/**
 * Function to calculate and display average waiting time (AWT) and average turnaround time (ATAT).
 * @param {Array} processes - An array of process objects with `waitingTime` and `turnaroundTime`.
 */
export function calculateAndDisplayAverages(processes) {
    const averagesContainer = document.getElementById("averagesContainer");
    const avgWaitingTimeElement = document.getElementById("averageWaitingTime");
    const avgTurnaroundTimeElement = document.getElementById("averageTurnaroundTime");

    if (!processes || processes.length === 0) {
        // Hide the averages container if there are no processes
        averagesContainer.style.display = "none";
        return;
    }

    // Calculate AWT and ATAT
    let totalWaitingTime = 0;
    let totalTurnaroundTime = 0;

    processes.forEach(process => {
        totalWaitingTime += process.waitingTime;
        totalTurnaroundTime += process.turnaroundTime;
    });

    const averageWaitingTime = totalWaitingTime / processes.length;
    const averageTurnaroundTime = totalTurnaroundTime / processes.length;

    // Update the values in the DOM
    avgWaitingTimeElement.textContent = averageWaitingTime.toFixed(2);
    avgTurnaroundTimeElement.textContent = averageTurnaroundTime.toFixed(2);

    // Show the averages container
    averagesContainer.style.display = "block";
}

// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
    const startSchedulingBtn = document.getElementById("startButton");
    const averagesContainer = document.getElementById("averagesContainer");

    // Initially hide averages container
    averagesContainer.classList.add("hidden");

    // Show averages container when Start Scheduling button is clicked
    startSchedulingBtn.addEventListener("click", () => {
        averagesContainer.classList.remove("hidden");
    });
});

