function showComputePage() {
    const landingPage = document.getElementById("landingPage");
    const computePage = document.getElementById("computePage");

    // Wait for the fade-out animation to complete
    setTimeout(() => {
        landingPage.style.display = "none"; // Hide the landing page
        computePage.style.display = "block"; // Show the compute page
        computePage.classList.add("fade-in"); // Add the fade-in class
    }, 0); // Match this duration with the CSS fade-out duration
}

function navigateToComparison() { 
    window.location.href = 'compare/comparison.html'; }


// Track the currently loaded algorithm module
let currentAlgorithm = null;

const algorithmSelect = document.getElementById("algorithmSelect");

function toggleTimeQuantum() {
    const selectedAlgorithm = document.getElementById("algorithmSelect").value;
    const timeQuantumContainer = document.getElementById("timeQuantumContainer");

    // Show the Time Quantum input only if "rr.js" is selected
    if (selectedAlgorithm === "rr.js") {
        timeQuantumContainer.style.display = "block";
    } else {
        timeQuantumContainer.style.display = "none";
    }
}

// Hide Gantt Chart container by default
document.querySelector('#ganttChartContainer').style.display = 'none';
document.querySelector('#ganttChartContainer').style.opacity = '0';

// Modify the start scheduling function to show and animate the Gantt Chart
function startScheduling() {
    const ganttContainer = document.querySelector('#ganttChartContainer');
    
    // Show the container
    ganttContainer.style.display = 'block';
    
    // Use setTimeout to ensure display is set before animating
    setTimeout(() => {
        ganttContainer.style.transition = 'opacity 0.5s ease-in';
        ganttContainer.style.opacity = '1';
    }, 10);
}

// Attach the startScheduling function to the button
document.querySelector('button[onclick="startScheduling()"]').addEventListener('click', startScheduling);

algorithmSelect.addEventListener("change", async (event) => {
    const selectedAlgorithm = event.target.value;
    const scriptElement = document.getElementById("algorithmScript");

    // Call cleanup on the currently loaded algorithm (if any)
    if (currentAlgorithm && typeof currentAlgorithm.cleanup === "function") {
        currentAlgorithm.cleanup();
    }

    // Remove the old script
    if (scriptElement) {
        scriptElement.remove();
    }

    // Dynamically import the new module
    currentAlgorithm = await import(`./${selectedAlgorithm}`);

    // Attach the new script to the DOM for debugging purposes
    const newScriptElement = document.createElement("script");
    newScriptElement.id = "algorithmScript";
    newScriptElement.type = "module";
    newScriptElement.src = selectedAlgorithm;
    document.body.appendChild(newScriptElement);
});

const goBackButton = document.getElementById("goBackButton");

goBackButton.addEventListener("click", () => {
    // Hide the Compute page
    computePage.style.display = "none";

    // Show the Landing page
    landingPage.style.display = "block";

    // Optional: Reset animations or styles if needed
    landingPage.classList.add("fade-in");
});
