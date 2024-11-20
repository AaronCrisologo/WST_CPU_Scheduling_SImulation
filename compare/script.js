document.addEventListener('DOMContentLoaded', () => {
  const processFormContainer = document.getElementById('processFormContainer');
  const resultsContainer = document.getElementById('resultsContainer');
  const chartContainer = document.getElementById('chartContainer');

  document.getElementById('generateProcesses').addEventListener('click', generateProcessFields);
  document.getElementById('compareBtn').addEventListener('click', compareAlgorithms);

  function generateProcessFields() {
    const numProcesses = parseInt(document.getElementById('numProcesses').value, 10);
    processFormContainer.innerHTML = '';
    resultsContainer.innerHTML = '';
    chartContainer.innerHTML = '';

    for (let i = 0; i < numProcesses; i++) {
      const processForm = `
        <div>
          <label>Process ${i + 1} - Arrival Time:</label>
          <input type="number" class="arrivalTime" data-id="${i}" value="0" min="0">
          <label>Burst Time:</label>
          <input type="number" class="burstTime" data-id="${i}" value="1" min="1">
          <label>Priority:</label>
          <input type="number" class="priority" data-id="${i}" value="1" min="1">
        </div>`;
      processFormContainer.innerHTML += processForm;
    }
    document.getElementById('compareBtn').style.display = 'block';
  }

  function compareAlgorithms() {
    const timeQuantum = parseInt(document.getElementById('timeQuantum').value, 10);
    const processes = [];

    document.querySelectorAll('.arrivalTime').forEach((input, index) => {
      const arrivalTime = parseInt(input.value, 10);
      const burstTime = parseInt(document.querySelector(`.burstTime[data-id="${index}"]`).value, 10);
      const priority = parseInt(document.querySelector(`.priority[data-id="${index}"]`).value, 10);
      processes.push({ id: index + 1, arrivalTime, burstTime, priority });
    });

    const fcfsResults = calculateFCFS([...processes]);
    const sjfResults = calculateSJF([...processes]);
    const nppResults = calculateNPP([...processes]);
    const rrResults = calculateRR([...processes], timeQuantum);
    const srtfResults = calculateSRTF([...processes]);
    const ppResults = calculatePP([...processes]);

    displayResults({ fcfsResults, sjfResults, nppResults, rrResults, srtfResults, ppResults });
  }

  function calculateFCFS(processes) {
    let currentTime = 0;
    return processes.map(process => {
      if (currentTime < process.arrivalTime) {
        currentTime = process.arrivalTime;
      }
      const startTime = currentTime;
      const endTime = startTime + process.burstTime;
      const turnaroundTime = endTime - process.arrivalTime;
      const waitingTime = turnaroundTime - process.burstTime;
      currentTime = endTime;
      return { ...process, startTime, endTime, turnaroundTime, waitingTime };
    });
  }

  function calculateSJF(processes) {
    let currentTime = 0;
    const completed = [];
    const readyQueue = [];
    const remaining = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);

    while (remaining.length > 0 || readyQueue.length > 0) {
      while (remaining.length > 0 && remaining[0].arrivalTime <= currentTime) {
        readyQueue.push(remaining.shift());
      }
      if (readyQueue.length > 0) {
        readyQueue.sort((a, b) => a.burstTime - b.burstTime);
        const process = readyQueue.shift();
        const startTime = currentTime;
        const endTime = startTime + process.burstTime;
        const turnaroundTime = endTime - process.arrivalTime;
        const waitingTime = turnaroundTime - process.burstTime;
        completed.push({ ...process, startTime, endTime, turnaroundTime, waitingTime });
        currentTime = endTime;
      } else {
        currentTime = remaining[0].arrivalTime;
      }
    }
    return completed;
  }

  function calculateRR(processes, timeQuantum) {
    let currentTime = 0;
    const completed = [];
    const queue = [];
    const remaining = processes.map(p => ({ ...p, remainingTime: p.burstTime }));
    
    while (remaining.length > 0 || queue.length > 0) {
      // Add processes that have arrived by the current time to the queue
      while (remaining.length > 0 && remaining[0].arrivalTime <= currentTime) {
        queue.push(remaining.shift());
      }
  
      if (queue.length > 0) {
        const process = queue.shift();
        const timeToRun = Math.min(process.remainingTime, timeQuantum);
        
        currentTime += timeToRun; // Simulate process execution
        process.remainingTime -= timeToRun;
  
        // Check for processes that arrived during execution
        while (remaining.length > 0 && remaining[0].arrivalTime <= currentTime) {
          queue.push(remaining.shift());
        }
  
        if (process.remainingTime === 0) {
          const endTime = currentTime;
          const turnaroundTime = endTime - process.arrivalTime;
          const waitingTime = turnaroundTime - process.burstTime;
          completed.push({ 
            ...process, 
            endTime, 
            turnaroundTime, 
            waitingTime 
          });
        } else {
          // Re-add process to the queue if it's not finished
          queue.push(process);
        }
      } else if (remaining.length > 0) {
        // If the queue is empty but there are remaining processes, jump to the next arrival time
        currentTime = remaining[0].arrivalTime;
      }
    }
  
    return completed;
  }  

  function calculateNPP(processes) {
    let currentTime = 0;
    const completed = [];
    const readyQueue = [];
    const remaining = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);

    while (remaining.length > 0 || readyQueue.length > 0) {
      while (remaining.length > 0 && remaining[0].arrivalTime <= currentTime) {
        readyQueue.push(remaining.shift());
      }
      if (readyQueue.length > 0) {
        readyQueue.sort((a, b) => a.priority - b.priority);
        const process = readyQueue.shift();
        const startTime = currentTime;
        const endTime = startTime + process.burstTime;
        const turnaroundTime = endTime - process.arrivalTime;
        const waitingTime = turnaroundTime - process.burstTime;
        completed.push({ ...process, startTime, endTime, turnaroundTime, waitingTime });
        currentTime = endTime;
      } else {
        currentTime = remaining[0].arrivalTime;
      }
    }
    return completed;
  }

  function calculatePP(processes) {
    let currentTime = 0;
    const completed = [];
    const readyQueue = [];
    const remaining = [...processes].map(p => ({ ...p, remainingTime: p.burstTime }));

    while (remaining.length > 0 || readyQueue.length > 0) {
      while (remaining.length > 0 && remaining[0].arrivalTime <= currentTime) {
        readyQueue.push(remaining.shift());
      }
      if (readyQueue.length > 0) {
        readyQueue.sort((a, b) => a.priority - b.priority || a.remainingTime - b.remainingTime);
        const process = readyQueue.shift();
        const timeToRun = 1; // Simulating preemption at every unit time
        process.remainingTime -= timeToRun;
        currentTime += timeToRun;

        if (process.remainingTime === 0) {
          const endTime = currentTime;
          const turnaroundTime = endTime - process.arrivalTime;
          const waitingTime = turnaroundTime - process.burstTime;
          completed.push({ ...process, endTime, turnaroundTime, waitingTime });
        } else {
          readyQueue.push(process);
        }
      } else if (remaining.length > 0) {
        currentTime = remaining[0].arrivalTime;
      }
    }
    return completed;
  }

  function calculateSRTF(processes) {
    let currentTime = 0;
    let completed = 0;
    const n = processes.length;
    const remainingTime = processes.map(p => p.burstTime);
    const results = processes.map(p => ({
      id: p.id,
      arrivalTime: p.arrivalTime,
      burstTime: p.burstTime,
      turnaroundTime: 0,
      waitingTime: 0,
      completionTime: 0
    }));
  
    while (completed < n) {
      // Find the process with the shortest remaining time at the current time
      let shortest = -1;
      let minRemainingTime = Infinity;
  
      for (let i = 0; i < n; i++) {
        if (
          processes[i].arrivalTime <= currentTime &&
          remainingTime[i] > 0 &&
          remainingTime[i] < minRemainingTime
        ) {
          minRemainingTime = remainingTime[i];
          shortest = i;
        }
      }
  
      if (shortest === -1) {
        // No process is ready, advance the time
        currentTime++;
        continue;
      }
  
      // Execute the process with the shortest remaining time for 1 unit of time
      remainingTime[shortest]--;
      currentTime++;
  
      // Check if the process is completed
      if (remainingTime[shortest] === 0) {
        completed++;
        const completionTime = currentTime;
        results[shortest].completionTime = completionTime;
        results[shortest].turnaroundTime =
          completionTime - processes[shortest].arrivalTime;
        results[shortest].waitingTime =
          results[shortest].turnaroundTime - processes[shortest].burstTime;
      }
    }
  
    return results;
  }  

  function displayResults(results) {
    resultsContainer.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>Algorithm</th>
            <th>Turnaround Time</th>
            <th>Waiting Time</th>
          </tr>
        </thead>
        <tbody>
          ${Object.keys(results).map(algorithm => `
            <tr>
              <td>${algorithm.replace(/Results$/, '')}</td>
              <td>${results[algorithm].reduce((acc, p) => acc + p.turnaroundTime, 0) / results[algorithm].length}</td>
              <td>${results[algorithm].reduce((acc, p) => acc + p.waitingTime, 0) / results[algorithm].length}</td>
            </tr>`).join('')}
        </tbody>
      </table>`;
  }
});
