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
    // Navigate back to the landing page
    window.location.href = "../website.html";
});

const tutorialSteps = [
    {
        title: "What is CPU Scheduling?",
        text: "CPU scheduling is how your computer decides which program gets to use the CPU at any given time. Think of it like a restaurant manager deciding which customer to serve next!",
        visual: () => {
            return `
                <div class="animation-container">
                    <div class="process-box">Process A</div>
                    <div class="process-box">Process B</div>
                    <div class="process-box">Process C</div>
                    <div>→</div>
                    <div class="process-box" style="background-color: #90EE90;">CPU</div>
                </div>
            `;
        }
    },
    {
        title: "Preemptive vs Non-Preemptive Scheduling",
        text: `Let's understand the key difference between preemptive and non-preemptive scheduling:
            
            <div class="algorithm-comparison">
                <div class="comparison-column">
                    <div class="comparison-title">Preemptive</div>
                    <ul class="bullet-list">
                        <li>Can interrupt running processes</li>
                        <li>Better for responsive systems</li>
                        <li>Examples: SRTF, Preemptive Priority</li>
                        <li>Like being able to pause a movie</li>
                    </ul>
                </div>
                <div class="comparison-column">
                    <div class="comparison-title">Non-Preemptive</div>
                    <ul class="bullet-list">
                        <li>Cannot interrupt running processes</li>
                        <li>Process runs until completion</li>
                        <li>Examples: FCFS, SJF, Non-Preemptive Priority</li>
                        <li>Like watching a movie without pause</li>
                    </ul>
                </div>
            </div>`,
        visual: () => {
            return `
                <div class="animation-container">
                    <div style="text-align: center; width: 100%;">
                        <div style="display: flex; justify-content: space-around; margin-bottom: 20px;">
                            <div>
                                <h4>Preemptive</h4>
                                <div class="process-box" style="background-color: #FFB6C1;">P1 ▮▮▮▯▯</div>
                                <div style="margin: 5px;">↓ Interrupted!</div>
                                <div class="process-box" style="background-color: #98FB98;">P2 ▮▮▮▮▮</div>
                            </div>
                            <div>
                                <h4>Non-Preemptive</h4>
                                <div class="process-box" style="background-color: #FFB6C1;">P1 ▮▮▮▮▮</div>
                                <div style="margin: 5px;">Must Complete</div>
                                <div class="process-box" style="background-color: #98FB98;">P2 waiting...</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    },
    {
        title: "Important Terms",
        text: `Common terms you'll encounter in CPU scheduling:`,
        visual: () => {
            return `
                <div class="terms-grid">
                    <div class="term-card">
                        <div class="term-title">Arrival Time</div>
                        <div>When a process enters the ready queue</div>
                        <div class="term-example">Example: Process P1 arrives at time 0</div>
                    </div>
                    <div class="term-card">
                        <div class="term-title">Burst Time</div>
                        <div>Time needed for process execution</div>
                        <div class="term-example">Example: P1 needs 5ms to complete</div>
                    </div>
                    <div class="term-card">
                        <div class="term-title">Waiting Time</div>
                        <div>Time spent waiting for CPU</div>
                        <div class="term-example">Example: P2 waits 5ms while P1 runs</div>
                    </div>
                    <div class="term-card">
                        <div class="term-title">Turnaround Time</div>
                        <div>Total time from arrival to completion</div>
                        <div class="term-example">Example: Arrival (0) to Completion (7) = 7ms</div>
                    </div>
                    <div class="term-card">
                        <div class="term-title">Response Time</div>
                        <div>Time until first CPU response</div>
                        <div class="term-example">Example: Time until process first starts running</div>
                    </div>
                    <div class="term-card">
                        <div class="term-title">Time Quantum</div>
                        <div>Maximum time slice for Round Robin</div>
                        <div class="term-example">Example: Each process gets max 4ms</div>
                    </div>
                </div>
            `;
        }
    },
    {
        title: "First Come First Serve (FCFS)",
        text: `FCFS is the simplest scheduling algorithm where processes are executed in the order they arrive:
        <ul class="bullet-list">
            <li>Processes are executed in arrival order</li>
            <li>No interruption once a process starts</li>
            <li>Easy to implement but may not be efficient</li>
            <li>Can lead to "convoy effect" where short processes wait for long ones</li>
        </ul>`,
        visual: () => {
            return `
                <div class="timeline-container">
                    <div class="timeline-row">
                        <div>Arrival Order:</div>
                        <div class="process-box" style="background-color: #FFB6C1;">P1 (7ms)</div>
                        <div class="timeline-arrow">→</div>
                        <div class="process-box" style="background-color: #98FB98;">P2 (4ms)</div>
                        <div class="timeline-arrow">→</div>
                        <div class="process-box" style="background-color: #87CEEB;">P3 (2ms)</div>
                    </div>
                    
                    <div>Execution Timeline:</div>
                    <div class="execution-timeline">
                        <div>
                            <div class="execution-block" style="background-color: #FFB6C1;">P1</div>
                            <div class="time-marker">0-7ms</div>
                        </div>
                        <div class="timeline-arrow">→</div>
                        <div>
                            <div class="execution-block" style="background-color: #98FB98;">P2</div>
                            <div class="time-marker">7-11ms</div>
                        </div>
                        <div class="timeline-arrow">→</div>
                        <div>
                            <div class="execution-block" style="background-color: #87CEEB;">P3</div>
                            <div class="time-marker">11-13ms</div>
                        </div>
                    </div>
                    
                    <div style="margin-top: 10px; font-style: italic;">
                        Note: Even though P3 has the shortest burst time (2ms), it must wait for P1 and P2 to complete
                        because it arrived last.
                    </div>
                </div>
            `;
        }
    },
    {
        title: "Shortest Job First (SJF)",
        text: "SJF picks the process that will take the least time to complete. Imagine having several tasks - you might want to do the quickest ones first to reduce overall waiting time.",
        visual: () => {
            return createSJFAnimation();
        }
    },
    {
        title: "Non-Preemptive Priority (NPP)",
        text: "In Non-Preemptive Priority scheduling, each process has a priority value. The process with the highest priority gets to run next, but once a process starts running, it cannot be interrupted - it must finish before another process can start.",
        visual: () => {
            return `
                <div class="animation-container">
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <div>Ready Queue:</div>
                        <div class="process-box" style="background-color: #FFB6C1;">P1 (Priority: 3) Running...</div>
                        <div class="process-box" style="background-color: #98FB98;">P2 (Priority: 1) Waiting</div>
                        <div class="process-box" style="background-color: #87CEEB;">P3 (Priority: 2) Waiting</div>
                        <div style="margin-top: 10px; font-style: italic;">Even if P2 has higher priority, it must wait for P1 to finish</div>
                    </div>
                </div>
            `;
        }
    },
    {
        title: "Shortest Remaining Time First (SRTF)",
        text: "SRTF is the preemptive version of SJF. It continuously checks for the process with the shortest remaining time and can interrupt the current process if a new process with an even shorter time arrives.",
        visual: () => {
            return `
                <div class="animation-container">
                    <div style="text-align: center; width: 100%;">
                        <div style="margin-bottom: 15px;">
                            <div class="process-box" style="background-color: #FFB6C1;">P1 (4ms remaining)</div>
                            <div style="margin: 10px;">↓ New shorter process arrives!</div>
                            <div class="process-box" style="background-color: #98FB98;">P2 (2ms total)</div>
                            <div style="margin: 10px;">↓ P2 preempts P1</div>
                            <div style="display: flex; justify-content: center; gap: 10px;">
                                <div class="process-box" style="background-color: #98FB98;">P2 runs first</div>
                                <div class="process-box" style="background-color: #FFB6C1;">P1 resumes after</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    },
    {
        title: "Round Robin (RR)",
        text: "Round Robin gives each process a small time slice (quantum) and rotates through them. It's like a teacher giving each student a short turn to speak in class!",
        visual: () => {
            return createRRAnimation();
        }
    },
    {
        title: "Preemptive Priority",
        text: "Preemptive Priority scheduling is similar to Non-Preemptive Priority, but it can interrupt a running process if a new process with higher priority arrives. This ensures that high-priority processes get immediate attention.",
        visual: () => {
            return `
                <div class="animation-container">
                    <div style="text-align: center; width: 100%;">
                        <div style="margin-bottom: 15px;">
                            <div class="process-box" style="background-color: #FFB6C1;">P1 (Priority: 3) Running</div>
                            <div style="margin: 10px;">↓ Higher priority process arrives!</div>
                            <div class="process-box" style="background-color: #98FB98;">P2 (Priority: 1) Interrupts</div>
                            <div style="margin: 10px;">↓ Process switch occurs</div>
                            <div style="display: flex; justify-content: center; gap: 10px;">
                                <div class="process-box" style="background-color: #98FB98;">P2 runs</div>
                                <div class="process-box" style="background-color: #FFB6C1;">P1 waits</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    },
    {
        title: "Priority Scheduling",
        text: "Some processes are more important than others! Priority scheduling lets important processes run first, like how emergency vehicles get priority on the road.",
        visual: () => {
            return createPriorityAnimation();
        }
    },
    {
        title: "Understanding Performance Metrics",
        text: `Let's understand how we measure the efficiency of CPU scheduling algorithms:
        
        <div class="metric-explanation">
            <div class="metric-title">Average Waiting Time (AWT)</div>
            <div>The average time processes spend waiting before they can execute.</div>
            <div class="metric-formula">AWT = Total Waiting Time / Number of Processes</div>
            <ul class="bullet-list">
                <li>Lower AWT means processes wait less time</li>
                <li>Indicates better user experience</li>
                <li>Important for interactive systems</li>
            </ul>
        </div>

        <div class="metric-explanation">
            <div class="metric-title">Average Turnaround Time (ATAT)</div>
            <div>The average total time from process arrival to completion.</div>
            <div class="metric-formula">ATAT = Total Turnaround Time / Number of Processes</div>
            <ul class="bullet-list">
                <li>Lower ATAT means processes complete faster</li>
                <li>Indicates more efficient system utilization</li>
                <li>Critical for batch processing systems</li>
            </ul>
        </div>

        <div style="margin-top: 15px;">
            These metrics help us compare different scheduling algorithms:
            <ul class="bullet-list">
                <li>FCFS is simple but may have high AWT</li>
                <li>SJF minimizes AWT but may starve longer processes</li>
                <li>Round Robin provides fair execution but may increase ATAT</li>
            </ul>
        </div>`,
        visual: () => {
            return `
                <div style="display: flex; flex-direction: column; gap: 15px;">
                    <div style="text-align: center; font-weight: bold;">Example Calculation</div>
                    <div style="display: flex; justify-content: space-around;">
                        <div>
                            <div style="margin-bottom: 10px;">Process Timeline:</div>
                            <div class="process-box" style="background-color: #FFB6C1;">P1: Wait 0s, Run 5s</div>
                            <div class="process-box" style="background-color: #98FB98;">P2: Wait 5s, Run 3s</div>
                            <div class="process-box" style="background-color: #87CEEB;">P3: Wait 8s, Run 4s</div>
                        </div>
                        <div>
                            <div style="margin-bottom: 10px;">Calculations:</div>
                            <div>Total Wait Time = 0 + 5 + 8 = 13s</div>
                            <div>AWT = 13/3 = 4.33s</div>
                            <div>Total Turnaround = 5 + 8 + 12 = 25s</div>
                            <div>ATAT = 25/3 = 8.33s</div>
                        </div>
                    </div>
                </div>
            `;
        }
    },
    {
        title: "Demonstration of CPU scheduling",
        text: `All things you need to know on starting your journey in learning CPU scheduling`,
        visual: () => {
            return `
                <div class="video-container"> 
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/Jkmy2YLUbUY" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> 
                </div>
            `;
        }
    }
];

let currentStep = 0;

function startTutorial() {
    currentStep = 0;
    document.getElementById('tutorialModal').style.display = 'block';
    updateTutorial();
}

function updateTutorial() {
    const step = tutorialSteps[currentStep];
    document.getElementById('tutorialTitle').textContent = step.title;
    document.getElementById('tutorialText').innerHTML = step.text;
    document.getElementById('tutorialVisual').innerHTML = step.visual();
    
    // Update navigation buttons
    document.getElementById('prevBtn').disabled = currentStep === 0;
    document.getElementById('nextBtn').textContent = 
        currentStep === tutorialSteps.length - 1 ? 'Finish' : 'Next';
    
    // Update progress dots
    updateProgress();
}

function updateProgress() {
    const container = document.getElementById('tutorialProgress');
    container.innerHTML = '';
    
    for(let i = 0; i < tutorialSteps.length; i++) {
        const dot = document.createElement('div');
        dot.className = `progress-dot ${i === currentStep ? 'active' : ''}`;
        container.appendChild(dot);
    }
}

function nextStep() {
    if(currentStep < tutorialSteps.length - 1) {
        currentStep++;
        updateTutorial();
    } else {
        document.getElementById('tutorialModal').style.display = 'none';
    }
}

function previousStep() {
    if(currentStep > 0) {
        currentStep--;
        updateTutorial();
    }
}

// Close tutorial when clicking the X or outside the modal
document.querySelector('.close-tutorial').onclick = () => {
    document.getElementById('tutorialModal').style.display = 'none';
};

window.onclick = (event) => {
    const modal = document.getElementById('tutorialModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

// Helper functions for visualizations
function createFCFSAnimation() {
    return `
        <div class="animation-container">
            <div class="process-box" style="background-color: #FFB6C1;">P1 (7ms)</div>
            <div class="process-box" style="background-color: #98FB98;">P2 (4ms)</div>
            <div class="process-box" style="background-color: #87CEEB;">P3 (2ms)</div>
            <div style="margin: 20px 0;">↓</div>
            <div style="display: flex; gap: 5px;">
                <div class="process-box" style="background-color: #FFB6C1;">P1</div>
                <div class="process-box" style="background-color: #98FB98;">P2</div>
                <div class="process-box" style="background-color: #87CEEB;">P3</div>
            </div>
        </div>
    `;
}

function createSJFAnimation() {
    return `
        <div class="animation-container">
            <div style="display: flex; flex-direction: column; gap: 10px;">
                <div class="process-box" style="background-color: #FFB6C1;">P1 (7ms)</div>
                <div class="process-box" style="background-color: #98FB98;">P2 (4ms)</div>
                <div class="process-box" style="background-color: #87CEEB;">P3 (2ms)</div>
            </div>
            <div style="margin: 0 20px;">→</div>
            <div style="display: flex; flex-direction: column; gap: 10px;">
                <div class="process-box" style="background-color: #87CEEB;">P3 (2ms)</div>
                <div class="process-box" style="background-color: #98FB98;">P2 (4ms)</div>
                <div class="process-box" style="background-color: #FFB6C1;">P1 (7ms)</div>
            </div>
        </div>
    `;
}

function createRRAnimation() {
    return `
        <div class="animation-container">
            <div style="text-align: center;">
                <div style="margin-bottom: 10px;">Time Quantum = 2ms</div>
                <div style="display: flex; gap: 5px; justify-content: center;">
                    <div class="process-box" style="background-color: #FFB6C1;">P1</div>
                    <div class="process-box" style="background-color: #98FB98;">P2</div>
                    <div class="process-box" style="background-color: #87CEEB;">P3</div>
                </div>
                <div style="margin: 10px 0;">↻</div>
                <div>Processes take turns using CPU for 2ms each</div>
            </div>
        </div>
    `;
}

function createPriorityAnimation() {
    return `
        <div class="animation-container">
            <div style="display: flex; flex-direction: column; gap: 10px;">
                <div class="process-box" style="background-color: #FFB6C1;">P1 (Priority: 3)</div>
                <div class="process-box" style="background-color: #98FB98;">P2 (Priority: 1)</div>
                <div class="process-box" style="background-color: #87CEEB;">P3 (Priority: 2)</div>
            </div>
            <div style="margin: 0 20px;">→</div>
            <div style="display: flex; flex-direction: column; gap: 10px;">
                <div class="process-box" style="background-color: #98FB98;">P2 (Highest)</div>
                <div class="process-box" style="background-color: #87CEEB;">P3 (Medium)</div>
                <div class="process-box" style="background-color: #FFB6C1;">P1 (Lowest)</div>
            </div>
        </div>
    `;
}

function createTermsVisual() {
    return `
        <div style="display: flex; flex-direction: column; gap: 15px;">
            <div style="display: flex; align-items: center; gap: 10px;">
                <div class="process-box">Process</div>
                <div style="flex-grow: 1; height: 2px; background-color: #ddd;"></div>
                <div>Timeline</div>
            </div>
            <div style="display: flex; gap: 10px; align-items: center;">
                <div style="width: 100px;">Arrival</div>
                <div style="flex-grow: 1; display: flex; gap: 5px;">
                    <div style="background-color: #f0f0f0; padding: 5px;">Waiting Time</div>
                    <div style="background-color: #90EE90; padding: 5px;">Execution Time</div>
                </div>
                <div style="width: 100px;">Completion</div>
            </div>
            <div style="text-align: center; margin-top: 10px;">
                Turnaround Time = Completion Time - Arrival Time
            </div>
        </div>
    `;
}