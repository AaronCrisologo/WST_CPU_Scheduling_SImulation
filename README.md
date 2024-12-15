# ***Simulation of the Different CPU Scheduling Algorithms***

## **🤼 Name of Team Member**

*Crisologo, Aaron Angelo*

*Barcelona, Nielle*

*Ramos, Mark Kevin*

## **📝 Project Overview**
The CPU Scheduling Simulation website is an interactive educational tool designed to help users understand and experiment with various CPU scheduling algorithms. It features an intuitive interface, dynamic visualizations, and performance metrics to provide a hands-on learning experience for students and enthusiasts alike. The platform supports several scheduling algorithms, including:

- First Come First Serve (FCFS)

- Shortest Job First (SJF)

- Non-Preemptive Priority (NPP)

- Round Robin (RR)

- Shortest Remaining Time First (SRTF)

- Preemptive Priority (PP)

The project focuses on all of these aspects along with a responsive design, and an engaging user experience.

## **📚 Features**

The scope of the Class Compass project is focused on developing a front-end mobile application using Flutter that enhances the academic experience for university students. The application will include the following features:

**Interactive Learning:**
Step-by-step tutorials with visual aids to explain scheduling concepts.

**Algorithm Simulation:**
Generate Gantt charts and compute Average Waiting Time (AWT) and Average Turnaround Time (ATAT).

**Algorithm Comparison:**
Compare two scheduling algorithms side by side using the same set of process inputs.

**Modern Design:**
Sleek gradients, animations, and high-contrast text ensure a professional and accessible user interface.

## **👨‍🏫 How to Use**
### **Prerequisites**

- A web browser (Google Chrome, Mozilla Firefox, or any modern browser).

### **Installation**

1. Clone this Repository
2. Navigate to the project folder - It is important to target the correct path in order to avoid errors when navigating through pages
3. Open website.html in your browser

## **🎬 Usage**

### **Landing Page**

- Choose one of three main options:

- Simulate an Algorithm: Experiment with a CPU scheduling algorithm.

- Compare Algorithms: Compare the performance of two scheduling algorithms.

- Learn CPU Scheduling: Access a step-by-step interactive tutorial.

### **Simulation Page**

- Select a scheduling algorithm from the dropdown menu.

- Enter the number of processes and their attributes (e.g., arrival time, burst time).

- (For Round Robin) Enter a Time Quantum.

- Click Start Scheduling to generate the Gantt chart and performance metrics.

### **Comparison Page**

- Select two algorithms to compare.

- Input the processes and their attributes.

- View side-by-side Gantt charts and performance metrics.

### **Learning Section**

- Follow a guided tutorial that explains key CPU scheduling concepts, complete with visuals and examples.

- Navigate using the Next and Previous buttons, and track your progress via progress dots.

## **🏢 Folder Structure**
```
WST_CPU_Scheduling_SImulation/
├── index.html              # Main entry point
├── styles.css              # CSS styles for layout and design
├── main.js                 # Core functionality and interaction logic
├── FCFS.js                 # Implementation of FCFS algorithm
├── SJF.js                  # Implementation of Shortest Job First
├── RR.js                   # Implementation of Round Robin
├── NPP.js                  # Non-Preemptive Priority algorithm
├── PP.js                   # Preemptive Priority algorithm
├── SRTF.js                 # Shortest Remaining Time First algorithm
├── averageTimes.js         # Utility for calculating average waiting and turnaround times
├── ganttChart.js           # Logic for generating and animating Gantt charts
├── compare/                # Files for the comparison page
│   ├── comparison.html     # Comparison page
│   ├── script.js           # Logic for handling comparisons
│   ├── styles.css          # CSS specific to comparison page

```
