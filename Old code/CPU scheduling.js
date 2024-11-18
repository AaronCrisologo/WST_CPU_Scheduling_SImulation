let processCounter = 1;

function showCompute() {
  document.getElementById('mainSelection').style.display = 'none';
  document.getElementById('computeSection').style.display = 'block';
}

function showComparison() {
  document.getElementById('mainSelection').style.display = 'none';
  document.getElementById('comparisonSection').style.display = 'block';
}

function goBack() {
  document.getElementById('computeSection').style.display = 'none';
  document.getElementById('comparisonSection').style.display = 'none';
  document.getElementById('mainSelection').style.display = 'block';
}

function addProcessRow() {
  const tableBody = document.getElementById('processTable').getElementsByTagName('tbody')[0];
  const row = tableBody.insertRow();
  row.innerHTML = `
    <td><input type="text" value="P${processCounter}" readonly></td>
    <td><input type="number" value="0"></td>
    <td><input type="number" value="0"></td>
    <td><input type="number" value="0"></td>
  `;
  processCounter++;
}

function calculate() {
  const resultTableBody = document.getElementById('resultTable').getElementsByTagName('tbody')[0];
  resultTableBody.innerHTML = ''; // Clear previous results
  const ganttChart = document.getElementById('ganttChart');
  ganttChart.innerHTML = ''; // Clear previous gantt bars

  const processes = [];
  for (let i = 1; i < processCounter; i++) {
    const arrivalTime = parseInt(document.getElementById('processTable').rows[i].cells[1].childNodes[0].value);
    const burstTime = parseInt(document.getElementById('processTable').rows[i].cells[2].childNodes[0].value);
    const priority = parseInt(document.getElementById('processTable').rows[i].cells[3].childNodes[0].value);
    processes.push({ id: `P${i}`, arrivalTime, burstTime, priority });
  }

  // Sort processes based on selected algorithm
  const selectedAlgorithm = document.getElementById('algorithmSelect').value;

  if (selectedAlgorithm === "FCFS") {
    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
  } else if (selectedAlgorithm === "SJF") {
    processes.sort((a, b) => a.burstTime - b.burstTime);
  }

  let totalTAT = 0, totalWT = 0, currentTime = 0;

  processes.forEach((process, index) => {
    const endTime = currentTime + process.burstTime;
    const turnaroundTime = endTime - process.arrivalTime;
    const waitingTime = turnaroundTime - process.burstTime;

    totalTAT += turnaroundTime;
    totalWT += waitingTime;

    // Insert result row
    const row = resultTableBody.insertRow();
    row.innerHTML = `
      <td>${process.id}</td>
      <td>${process.arrivalTime}</td>
      <td>${process.burstTime}</td>
      <td>${endTime}</td>
      <td>${turnaroundTime}</td>
      <td>${waitingTime}</td>
    `;

    // Create Gantt bars for each process
    const ganttBar = document.createElement('div');
    ganttBar.classList.add('gantt-bar');
    ganttBar.style.left = `${index * 100}px`; // Adjust position
    ganttBar.style.width = `${process.burstTime * 10}px`; // Adjust width
    ganttBar.textContent = process.id;
    ganttChart.appendChild(ganttBar);

    currentTime = endTime;
  });

  const avgTAT = totalTAT / processes.length;
  const avgWT = totalWT / processes.length;

  document.getElementById('avgTAT').textContent = avgTAT.toFixed(2);
  document.getElementById('avgWT').textContent = avgWT.toFixed(2);

  document.getElementById('resultContainer').style.display = 'block';
  document.getElementById('ganttChart').style.display = 'block';
}

function compareAlgorithms() {
  alert("Comparison logic goes here.");
}

function addComparisonProcessRow() {
  const tableBody = document.getElementById('comparisonTable').getElementsByTagName('tbody')[0];
  const row = tableBody.insertRow();
  row.innerHTML = `
    <td><input type="text" value="P${processCounter}" readonly></td>
    <td><input type="number" value="0"></td>
    <td><input type="number" value="0"></td>
    <td><input type="number" value="0"></td>
  `;
  processCounter++;
}