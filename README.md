# CPU Scheduling Simulation

An interactive web‑based learning platform that visualizes and lets users experiment with the fundamental CPU scheduling algorithms used in operating systems. The tool is designed for students, educators, and anyone interested in understanding how different scheduling policies affect process execution, performance metrics, and system throughput.

---

## 🎯 Project Goal
Create a lightweight, browser‑only simulation that:

* **Demonstrates** each scheduling algorithm step‑by‑step.  
* **Visualizes** process execution with Gantt charts and timing diagrams.  
* **Compares** multiple algorithms side‑by‑side using identical job sets.  
* **Educates** users through interactive tutorials and explanatory text.  
* **Supports** quick experimentation without requiring any backend or installation.

---

## 🚀 Key Features

| Feature | Description |
|--------|-------------|
| **Algorithm Simulations** | First‑Come‑First‑Serve (FCFS), Shortest‑Job‑First (SJF), Shortest‑Remaining‑Time‑First (SRTF), Non‑Preemptive & Preemptive Priority (NPP/PP), Round‑Robin (RR), and more. |
| **Dynamic Gantt Charts** | Real‑time visual representation of process order, waiting time, and turnaround time. |
| **Performance Metrics** | Automatic calculation of Average Waiting Time (AWT) and Average Turnaround Time (ATAT) for each algorithm. |
| **Algorithm Comparison** | Upload two algorithm sets and view them side‑by‑side for direct performance analysis. |
| **Interactive Tutorials** | Step‑by‑step walkthroughs that explain core concepts (process arrival, burst time, quantum, priority, etc.) with annotated graphics. |
| **Responsive Design** | Clean UI with gradients, smooth animations, and high‑contrast text for accessibility across desktop and mobile browsers. |
| **No Installation Required** | Pure client‑side HTML/CSS/JS – just open `index.html` (or `comparison.html`) in any modern browser. |
| **Extensible Module System** | Each scheduling algorithm lives in its own self‑contained JavaScript module (`FCFS.js`, `SJF.js`, …) for easy addition of new algorithms or visual enhancements. |

---

## 📂 Folder Structure (High‑Level)

```
WST_CPU_Scheduling_Simulation/
├─ index.html                # Main simulation page
├─ comparison.html           # Side‑by‑side comparison page
├─ styles.css                # Global styling & layout
├─ main.js                   # Core UI logic, dispatcher, and utilities
├─ averageTimes.js           # Helper for AWT/ATAT calculations
├─ ganttChart.js             # Canvas‑based Gantt chart rendering & animation
├─ FCFS.js
├─ SJF.js
├─ RR.js
├─ NPP.js
├─ PP.js
├─ SRTF.js
├─ compare/
│   ├─ script.js             # Comparison page logic
│   └─ styles.css            # Comparison‑specific styling
└─ tutorials/
    ├─ tutorial1.md
    └─ tutorial2.md
```

---

## 🛠️ How to Use

1. **Clone / Download** the repository to a local folder.  
2. **Open** `index.html` (or `comparison.html`) in any up‑to‑date web browser (Chrome, Firefox, Edge, Safari). No server is required.  
3. **Select** a scheduling algorithm from the dropdown menu.  
4. **Enter** the number of processes and their attributes (arrival time, burst time, priority, etc.).  
   * For Round‑Robin, specify a **Time Quantum**.  
5. **Click** *Start Scheduling* to generate the Gantt chart and see real‑time metrics (waiting time, turnaround time).  
6. **Switch** to the *Compare* page to load two different algorithms and run the same process set for direct comparison.  
7. **Explore** the *Learn* tutorials for deeper insight into each algorithm’s theory and practical implications.

---

## 🧩 Technical Highlights

* **Pure JavaScript Modules** – each algorithm (`FCFS.js`, `SJF.js`, …) implements its scheduling logic in an isolated scope, making the codebase modular and easy to extend.  
* **Canvas‑Based Rendering** – `ganttChart.js` draws and animates Gantt charts using the HTML5 Canvas API, providing smooth visual feedback.  
* **Metric Calculation** – `averageTimes.js` computes AWT and ATAT on‑the‑fly, updating the UI after each scheduling run.  
* **Responsive UI** – CSS Flexbox and Grid layouts ensure the interface adapts gracefully to different screen sizes.  
* **No External Dependencies** – the project relies solely on vanilla web technologies, avoiding any build step or external library bloat.  

---

## 📈 Future Enhancements (Roadmap)

| Planned Feature | Description |
|-----------------|-------------|
| **Additional Algorithms** | Implement Multilevel Feedback Queue, Earliest Deadline First (EDF), and others. |
| **Customizable Quantum** | UI control for Round‑Robin quantum with real‑time impact preview. |
| **Process Import/Export** | Allow uploading/downloading process tables as CSV for batch testing. |
| **Dark Mode** | Add a toggle for dark theme to improve accessibility in low‑light environments. |
| **Unit Tests** | Introduce automated test suite (Jest) for algorithm correctness validation. |
| **Docker Container** | Provide a one‑click Dockerfile for consistent local deployment. |
| **Educator Dashboard** | Optional backend (Node/Express) to track student usage statistics and generate reports. |

---

## 🤝 Contributing

1. **Fork** the repository.  
2. Create a **feature branch** (`git checkout -b feature/awesome‑feature`).  
3. **Commit** your changes with clear messages.  
4. **Submit** a Pull Request with a concise description of the improvement.  
5. Ensure all **new code** follows the existing modular pattern and passes any linting checks.

---

## 📜 License

This project is released under the **MIT License** – see the `LICENSE` file for details.

---

## 📞 Contact

* **Aaron Angelo Crisologo** – *Initial developer & maintainer*  
  <a href="mailto:aaron.crisologo@example.com">aaron.crisologo@example.com</a>

* **Barcelona, Nielle**  
  <a href="mailto:nielle.barcelona@example.com">nielle.barcelona@example.com</a>

* **Ramos, Mark Kevin**  
  <a href="mailto:mark.ramos@example.com">mark.ramos@example.com</a>

---

**Explore. Learn. Compare.**  
Dive into the world of CPU scheduling and develop an intuitive grasp of how operating systems decide which process runs next.