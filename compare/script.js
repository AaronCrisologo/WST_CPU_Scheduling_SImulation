document.addEventListener('DOMContentLoaded', () => {
  const processFormContainer = document.getElementById('processFormContainer');
  const resultsContainer = document.getElementById('resultsContainer');
  const chartContainer = document.getElementById('chartContainer');
  const algorithmSelect = document.getElementById('algorithmSelect');
  const addAlgorithmBtn = document.getElementById('addAlgorithmBtn');
  const algorithmList = document.getElementById('algorithmList');
  const compareBtn = document.getElementById('compareBtn');
  const timequantumdisplay1 = document.getElementById('timeQuantum1');
  const timequantumdisplay = document.getElementById('timeQuantum');

  document.getElementById('generateProcesses').addEventListener('click', generateProcessFields);
  addAlgorithmBtn.addEventListener('click', addAlgorithmToCompare);
  compareBtn.addEventListener('click', compareAlgorithms);

  let selectedAlgorithms = [];
  var iterator = 0;

  // Function to toggle time quantum visibility
  function toggleTimeQuantumVisibility() {
    const isRRSelected = selectedAlgorithms.includes('rr');
    timequantumdisplay1.style.display = isRRSelected ? 'block' : 'none';
    timequantumdisplay.style.display = isRRSelected ? 'block' : 'none';
  }

  function generateProcessFields() {
    const numProcesses = parseInt(document.getElementById('numProcesses').value, 10);
    processFormContainer.innerHTML = '';
    resultsContainer.innerHTML = '';
    chartContainer.innerHTML = '';

    timequantumdisplay1.style.display = 'block';
    timequantumdisplay.style.display = 'block';
    toggleTimeQuantumVisibility();

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
      iterator += 1;
    }
    compareBtn.style.display = iterator > 0 && selectedAlgorithms.length > 1 ? 'block' : 'none';
    toggleTimeQuantumVisibility();
  }

  function addAlgorithmToCompare() {
    const selectedAlgorithm = algorithmSelect.value;

    if (!selectedAlgorithms.includes(selectedAlgorithm)) {
      selectedAlgorithms.push(selectedAlgorithm);

      const listItem = document.createElement('li');
      listItem.classList.add('algorithm-item');

      const algorithmName = document.createElement('span');
      algorithmName.textContent = selectedAlgorithm.toUpperCase();
      algorithmName.classList.add('algorithm-name');

      const removeBtn = document.createElement('button');
      removeBtn.textContent = '✖';
      removeBtn.classList.add('remove-btn');
      removeBtn.onclick = () => {
        selectedAlgorithms = selectedAlgorithms.filter(
          (algorithm) => algorithm !== selectedAlgorithm
        );
        listItem.remove();
        compareBtn.style.display = selectedAlgorithms.length > 1 ? 'block' : 'none';
        toggleTimeQuantumVisibility();
      };

      listItem.appendChild(algorithmName);
      listItem.appendChild(removeBtn);
      algorithmList.appendChild(listItem);
    }

    compareBtn.style.display = iterator > 0 && selectedAlgorithms.length > 1 ? 'block' : 'none';
    toggleTimeQuantumVisibility();
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

    // Calculate results for all algorithms
    const fcfsResults = calculateFCFS([...processes]);
    const sjfResults = calculateSJF([...processes]);
    const nppResults = calculateNPP([...processes]);
    const rrResults = calculateRR([...processes], timeQuantum);
    const srtfResults = calculateSRTF([...processes]);
    const ppResults = calculatePP([...processes]);

    // Only display results for selected algorithms
    const results = {};
    selectedAlgorithms.forEach((algorithm) => {
      results[`${algorithm}Results`] = calculateAlgorithm(algorithm, [...processes], timeQuantum);
    });

    displayResults(results);
  }

  function calculateAlgorithm(algorithm, processes, timeQuantum) {
    switch (algorithm) {
      case 'fcfs':
        return calculateFCFS(processes);
      case 'sjf':
        return calculateSJF(processes);
      case 'npp':
        return calculateNPP(processes);
      case 'rr':
        return calculateRR(processes, timeQuantum);
      case 'srtf':
        return calculateSRTF(processes);
      case 'pp':
        return calculatePP(processes);
      default:
        return [];
    }
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
      while (remaining.length > 0 && remaining[0].arrivalTime <= currentTime) {
        queue.push(remaining.shift());
      }

      if (queue.length > 0) {
        const process = queue.shift();
        const timeToRun = Math.min(process.remainingTime, timeQuantum);

        currentTime += timeToRun;
        process.remainingTime -= timeToRun;

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
          queue.push(process);
        }
      } else if (remaining.length > 0) {
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
        const timeToRun = 1;
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
        currentTime++;
        continue;
      }

      remainingTime[shortest]--;
      currentTime++;

      if (remainingTime[shortest] === 0) {
        completed++;
        const completionTime = currentTime;
        results[shortest].completionTime = completionTime;
        results[shortest].turnaroundTime = completionTime - processes[shortest].arrivalTime;
        results[shortest].waitingTime = results[shortest].turnaroundTime - processes[shortest].burstTime;
      }
    }

    return results;
  }

  // Safe DOM rendering for results
  function displayResults(results) {
    // Minimum averages for highlighting
    let minTurnaroundTime = Infinity;
    let minWaitingTime = Infinity;
    const avgTurnaroundTimes = {};
    const avgWaitingTimes = {};

    // Calculate averages
    Object.keys(results).forEach(algorithm => {
      const totalTurnaround = results[algorithm].reduce((sum, p) => sum + p.turnaroundTime, 0);
      const totalWaiting = results[algorithm].reduce((sum, p) => sum + p.waitingTime, 0);
      const avgTurnaround = totalTurnaround / results[algorithm].length;
      const avgWaiting = totalWaiting / results[algorithm].length;
      avgTurnaroundTimes[algorithm] = avgTurnaround;
      avgWaitingTimes[algorithm] = avgWaiting;

      if (avgTurnaround < minTurnaroundTime) minTurnaroundTime = avgTurnaround;
      if (avgWaiting < minWaitingTime) minWaitingTime = avgWaiting;
    });

    // Build table safely
    const table = document.createElement('table');

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['Algorithm', 'Average Turnaround Time', 'Average Waiting Time'].forEach(txt => {
      const th = document.createElement('th');
      th.textContent = txt;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    const algorithmFullNames = {
      fcfs: 'First-Come, First-Served (FCFS)',
      sjf: 'Shortest Job First (SJF)',
      npp: 'Non-Preemptive Priority (NPP)',
      rr: 'Round Robin (RR)',
      srtf: 'Shortest Remaining Time First (SRTF)',
      pp: 'Preemptive Priority (PP)'
    };

    Object.keys(results).forEach(algorithm => {
      const row = document.createElement('tr');

      const nameCell = document.createElement('td');
      nameCell.textContent = algorithmFullNames[algorithm.replace(/Results$/, '')];
      row.appendChild(nameCell);

      const turnaroundCell = document.createElement('td');
      const waitingCell = document.createElement('td');
      const avgTurnaround = avgTurnaroundTimes[algorithm].toFixed(2);
      const avgWaiting = avgWaitingTimes[algorithm].toFixed(2);
      turnaroundCell.textContent = avgTurnaround;
      waitingCell.textContent = avgWaiting;

      if (avgTurnaround === minTurnaroundTime.toFixed(2)) {
        turnaroundCell.style.backgroundColor = 'green';
      }
      if (avgWaiting === minWaitingTime.toFixed(2)) {
        waitingCell.style.backgroundColor = 'green';
      }

      row.appendChild(turnaroundCell);
      row.appendChild(waitingCell);
      tbody.appendChild(row);
    });

    table.appendChild(tbody);
    // Clear previous output and insert new table
    resultsContainer.innerHTML = '';
    resultsContainer.appendChild(table);
  }
});