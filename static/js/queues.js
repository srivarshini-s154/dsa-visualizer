document.addEventListener('DOMContentLoaded', function() {
    // Queue implementation
    const queue = {
        elements: [],
        capacity: 10,
        front: 0,
        rear: -1,
        count: 0,
        type: 'linear', // 'linear', 'circular', 'deque', 'priority'
        
        init: function(type) {
            this.type = type;
            this.elements = [];
            this.front = 0;
            this.rear = -1;
            this.count = 0;
            
            // Clear operation history when changing queue type
            this.clearOperationHistory();
            
            // Update UI based on queue type
            this.updateUIForQueueType();
            this.updateVisualization();
            this.logOperation(`Initialized ${type} queue`);
        },
        
        clearOperationHistory: function() {
            const historyList = document.getElementById('history-list');
            if (historyList) {
                historyList.innerHTML = '';
            }
        },
        
        enqueue: function(value, priority = null) {
            fetch('/api/queue', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    operation: 'enqueue',
                    value: Number(value),
                    priority: priority,
                    queue_type: this.type
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.result === 'success') {
                    // Refresh the queue visualization
                    this.getAllElements();
                    this.logOperation(`Enqueued ${value}${priority ? ' with priority ' + priority : ''}`);
                } else {
                    alert(`Error: ${data.message}`);
                }
            })
            .catch(error => {
                alert(`Error: ${error.message}`);
            });
        },
        
        dequeue: function() {
            fetch('/api/queue', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    operation: 'dequeue',
                    queue_type: this.type
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.result === 'success') {
                    // Refresh the queue visualization
                    this.getAllElements();
                    this.logOperation(`Dequeued ${data.data}`);
                } else {
                    alert(`Error: ${data.message}`);
                }
            })
            .catch(error => {
                alert(`Error: ${error.message}`);
            });
        },
        
        enqueueFront: function(value) {
            fetch('/api/queue', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    operation: 'enqueue_front',
                    value: Number(value),
                    queue_type: this.type
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.result === 'success') {
                    // Refresh the queue visualization
                    this.getAllElements();
                    this.logOperation(`Enqueued ${value} at front`);
                } else {
                    alert(`Error: ${data.message}`);
                }
            })
            .catch(error => {
                alert(`Error: ${error.message}`);
            });
        },
        
        dequeueRear: function() {
            fetch('/api/queue', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    operation: 'dequeue_rear',
                    queue_type: this.type
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.result === 'success') {
                    // Refresh the queue visualization
                    this.getAllElements();
                    this.logOperation(`Dequeued ${data.data} from rear`);
                } else {
                    alert(`Error: ${data.message}`);
                }
            })
            .catch(error => {
                alert(`Error: ${error.message}`);
            });
        },
        
        peek: function() {
            fetch('/api/queue', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    operation: 'peek',
                    queue_type: this.type
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.result === 'success') {
                    this.logOperation(`Peeked ${data.data}`);
                } else {
                    alert(`Error: ${data.message}`);
                }
            })
            .catch(error => {
                alert(`Error: ${error.message}`);
            });
        },
        
        clear: function() {
            fetch('/api/queue', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    operation: 'clear',
                    queue_type: this.type
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.result === 'success') {
                    // Refresh the queue visualization
                    this.getAllElements();
                    this.logOperation('Cleared queue');
                } else {
                    alert(`Error: ${data.message}`);
                }
            })
            .catch(error => {
                alert(`Error: ${error.message}`);
            });
        },
        
        size: function() {
            fetch('/api/queue', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    operation: 'size',
                    queue_type: this.type
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.result === 'success') {
                    this.logOperation(`Queue size is ${data.data}`);
                } else {
                    alert(`Error: ${data.message}`);
                }
            })
            .catch(error => {
                alert(`Error: ${error.message}`);
            });
        },
        
        isEmpty: function() {
            fetch('/api/queue', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    operation: 'is_empty',
                    queue_type: this.type
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.result === 'success') {
                    this.logOperation(`Queue is ${data.data ? 'empty' : 'not empty'}`);
                } else {
                    alert(`Error: ${data.message}`);
                }
            })
            .catch(error => {
                alert(`Error: ${error.message}`);
            });
        },
        
        isFull: function() {
            fetch('/api/queue', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    operation: 'is_full',
                    queue_type: this.type
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.result === 'success') {
                    this.logOperation(`Queue is ${data.data ? 'full' : 'not full'}`);
                } else {
                    alert(`Error: ${data.message}`);
                }
            })
            .catch(error => {
                alert(`Error: ${error.message}`);
            });
        },
        
        getAllElements: function() {
            fetch('/api/queue', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    operation: 'get_all',
                    queue_type: this.type
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.result === 'success') {
                    this.elements = data.data;
                    this.count = this.elements.length;
                    this.rear = this.count - 1;
                    this.updateVisualization();
                } else {
                    console.error('Error getting queue elements:', data.message);
                }
            })
            .catch(error => {
                console.error('Error getting queue elements:', error);
            });
        },
        
        updateVisualization: function() {
            // Skip visualization update for priority queue
            if (this.type === 'priority') {
                return;
            }
            
            const queueElements = document.getElementById('queue-elements');
            if (!queueElements) return;
            
            queueElements.innerHTML = '';
            
            // Clear circular queue class if it exists
            queueElements.classList.remove('circular-queue');
            
            if (this.type === 'circular') {
                queueElements.classList.add('circular-queue');
                
                // Create visual elements for circular queue
                for (let i = 0; i < this.capacity; i++) {
                    const element = document.createElement('div');
                    element.className = 'queue-element';
                    
                    if (i < this.elements.length && this.elements[i] !== null && this.elements[i] !== undefined) {
                        element.textContent = this.elements[i];
                        element.style.backgroundColor = this.getElementColor(this.elements[i]);
                    } else {
                        element.style.backgroundColor = '#ddd';
                        element.textContent = '';
                    }
                    
                    queueElements.appendChild(element);
                }
            } else {
                // Create visual elements for linear queue or deque
                this.elements.forEach((value, index) => {
                    const element = document.createElement('div');
                    element.className = 'queue-element';
                    element.textContent = value;
                    element.style.backgroundColor = this.getElementColor(value);
                    queueElements.appendChild(element);
                });
            }
            
            // Update info panel
            document.getElementById('queue-size').textContent = this.count;
            
            if (this.isEmptyClient()) {
                document.getElementById('front-element').textContent = 'None';
                document.getElementById('rear-element').textContent = 'None';
            } else {
                document.getElementById('front-element').textContent = this.elements[0];
                document.getElementById('rear-element').textContent = this.elements[this.elements.length - 1];
            }
        },
        
        getElementColor: function(value) {
            // Generate a color based on the value for visual distinction
            const hue = (value * 137) % 360;
            return `hsl(${hue}, 70%, 65%)`;
        },
        
        logOperation: function(operation) {
            const historyList = document.getElementById('history-list');
            if (!historyList) return;
            
            const historyItem = document.createElement('div');
            
            // Determine operation type for styling
            let operationType = 'other';
            if (operation.startsWith('Enqueued')) operationType = 'enqueue';
            if (operation.startsWith('Dequeued')) operationType = 'dequeue';
            
            historyItem.className = `history-item ${operationType}`;
            historyItem.textContent = `${new Date().toLocaleTimeString()}: ${operation}`;
            
            historyList.appendChild(historyItem);
            historyList.scrollTop = historyList.scrollHeight;
        },
        
        updateUIForQueueType: function() {
            // Update visualization title
            document.getElementById('visualization-title').textContent = 
                `${this.type.charAt(0).toUpperCase() + this.type.slice(1)} Queue Visualization`;
            
            // Show/hide priority input
            document.getElementById('priority-input').style.display = 
                this.type === 'priority' ? 'flex' : 'none';
            
            // Show/hide deque operations
            document.getElementById('deque-operations').style.display = 
                this.type === 'deque' ? 'block' : 'none';
            
            // Show/hide CPU scheduling section
            document.getElementById('scheduling-section').style.display = 
                this.type === 'priority' ? 'block' : 'none';
            
            // Show/hide visualization section for priority queue
            document.querySelector('.visualization-section').style.display = 
                this.type === 'priority' ? 'none' : 'block';
            
            // Show/hide standard queue operations
            document.querySelector('.queue-operations').style.display = 
                this.type === 'priority' ? 'none' : 'block';
            
            // Show/hide operation history
            document.querySelector('.operation-history').style.display = 
                this.type === 'priority' ? 'none' : 'block';
            
            // Show/hide complexity table
            document.querySelector('.complexity-table').style.display = 
                this.type === 'priority' ? 'none' : 'block';
            
            // Update active tab
            document.querySelectorAll('.queue-type-btn').forEach(btn => {
                if (btn.dataset.type === this.type) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            
            // Reset scheduler when switching to priority queue
            if (this.type === 'priority') {
                this.resetScheduler();
            }
        },
        
        isEmptyClient: function() {
            return this.count === 0;
        },
        
        // Priority Scheduler Methods
        addProcess: function() {
            const processId = document.getElementById('process-id').value || `P${this.processes.length + 1}`;
            const arrivalTime = document.getElementById('arrival-time').value;
            const burstTime = document.getElementById('burst-time').value;
            const priority = document.getElementById('process-priority').value;
            
            if (!burstTime || burstTime < 1) {
                alert('Burst time must be at least 1.');
                return;
            }
            
            if (priority < 1 || priority > 3) {
                alert('Priority must be between 1 and 3.');
                return;
            }
            
            fetch('/api/priority_scheduler', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'add_process',
                    process_id: processId,
                    arrival_time: parseInt(arrivalTime),
                    burst_time: parseInt(burstTime),
                    priority: parseInt(priority)
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.result === 'success') {
                    alert('Process added successfully.');
                    // Clear input fields
                    document.getElementById('process-id').value = '';
                    document.getElementById('arrival-time').value = '0';
                    document.getElementById('burst-time').value = '1';
                    document.getElementById('process-priority').value = '1';
                    
                    // Refresh process table
                    this.getProcesses();
                } else {
                    alert(`Error: ${data.message}`);
                }
            })
            .catch(error => {
                alert(`Error: ${error.message}`);
            });
        },
        
        calculateSchedule: function() {
            fetch('/api/priority_scheduler', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'calculate_schedule'
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.result === 'success') {
                    this.displaySchedulerResults(data.data);
                } else {
                    alert(`Error: ${data.message}`);
                }
            })
            .catch(error => {
                alert(`Error: ${error.message}`);
            });
        },
        
        resetScheduler: function() {
            fetch('/api/priority_scheduler', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'reset_scheduler'
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.result === 'success') {
                    // Clear all scheduler UI elements
                    document.getElementById('process-table-body').innerHTML = '';
                    document.getElementById('process-table-footer').innerHTML = '';
                    document.getElementById('gantt-container').innerHTML = '';
                    document.getElementById('execution-steps-container').innerHTML = '';
                    
                    // Clear input fields
                    document.getElementById('process-id').value = '';
                    document.getElementById('arrival-time').value = '0';
                    document.getElementById('burst-time').value = '1';
                    document.getElementById('process-priority').value = '1';
                } else {
                    alert(`Error: ${data.message}`);
                }
            })
            .catch(error => {
                alert(`Error: ${error.message}`);
            });
        },
        
        getProcesses: function() {
            fetch('/api/priority_scheduler', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'get_processes'
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.result === 'success') {
                    this.updateProcessTable(data.data);
                } else {
                    console.error('Error getting processes:', data.message);
                }
            })
            .catch(error => {
                console.error('Error getting processes:', error);
            });
        },
        
        updateProcessTable: function(processes) {
            const tableBody = document.getElementById('process-table-body');
            tableBody.innerHTML = '';
            
            processes.forEach(process => {
                const row = document.createElement('tr');
                
                row.innerHTML = `
                    <td>${process.id}</td>
                    <td>${process.arrival_time}</td>
                    <td>${process.burst_time}</td>
                    <td>${process.priority}</td>
                    <td>${process.completion_time || '-'}</td>
                    <td>${process.waiting_time || '-'}</td>
                    <td>${process.turnaround_time || '-'}</td>
                `;
                
                tableBody.appendChild(row);
            });
        },
        
        displaySchedulerResults: function(data) {
            // Update process table with results
            this.updateProcessTable(data.processes);
            
            // Calculate and display averages
            this.calculateAverages(data.avg_waiting_time, data.avg_turnaround_time);
            
            // Render Gantt chart
            this.renderGanttChart(data.gantt_chart);
            
            // Show execution steps
            this.showExecutionSteps(data.execution_steps);
        },
        
        calculateAverages: function(avgWaitingTime, avgTurnaroundTime) {
            const tableFooter = document.getElementById('process-table-footer');
            tableFooter.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align: right; font-weight: bold;">Averages:</td>
                    <td>-</td>
                    <td>${avgWaitingTime.toFixed(2)}</td>
                    <td>${avgTurnaroundTime.toFixed(2)}</td>
                </tr>
            `;
        },
        
        renderGanttChart: function(ganttChart) {
            const ganttContainer = document.getElementById('gantt-container');
            ganttContainer.innerHTML = '';
            
            if (!ganttChart || ganttChart.length === 0) {
                return;
            }
            
            // Create timeline container
            const timelineContainer = document.createElement('div');
            timelineContainer.className = 'gantt-timeline';
            
            // Create segments container
            const segmentsContainer = document.createElement('div');
            segmentsContainer.className = 'gantt-segments';
            
            // Find the maximum time to create proper timeline
            const maxTime = Math.max(...ganttChart.map(segment => segment.end_time));
            
            // Create timeline markers
            for (let i = 0; i <= maxTime; i++) {
                const marker = document.createElement('div');
                marker.className = 'timeline-marker';
                marker.textContent = i;
                marker.style.left = `${i * 50}px`; // 50px per time unit
                timelineContainer.appendChild(marker);
            }
            
            // Create Gantt segments
            ganttChart.forEach(segment => {
                const segmentElement = document.createElement('div');
                segmentElement.className = `gantt-segment priority-${segment.priority}`;
                segmentElement.style.left = `${segment.start_time * 50}px`;
                segmentElement.style.width = `${(segment.end_time - segment.start_time) * 50}px`;
                segmentElement.innerHTML = `
                    <div class="segment-label">${segment.process}</div>
                    <div class="segment-time">${segment.start_time}-${segment.end_time}</div>
                `;
                segmentsContainer.appendChild(segmentElement);
            });
            
            ganttContainer.appendChild(timelineContainer);
            ganttContainer.appendChild(segmentsContainer);
        },
        
        showExecutionSteps: function(steps) {
            const stepsContainer = document.getElementById('execution-steps-container');
            stepsContainer.innerHTML = '';
            
            steps.forEach(step => {
                const stepElement = document.createElement('div');
                stepElement.className = 'step';
                stepElement.textContent = step;
                stepsContainer.appendChild(stepElement);
            });
            
            stepsContainer.scrollTop = stepsContainer.scrollHeight;
        }
    };
    
    // Initialize the queue visualization
    queue.init('linear');
    
    // Event listeners for queue type tabs
    document.querySelectorAll('.queue-type-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const type = this.dataset.type;
            queue.init(type);
        });
    });
    
    // Event listeners for buttons
    document.getElementById('enqueue-btn').addEventListener('click', function() {
        const value = document.getElementById('element-value').value;
        if (value) {
            let priority = null;
            if (queue.type === 'priority') {
                priority = parseInt(document.getElementById('priority-value').value) || 5;
            }
            queue.enqueue(Number(value), priority);
            document.getElementById('element-value').value = '';
        }
    });
    
    document.getElementById('dequeue-btn').addEventListener('click', function() {
        queue.dequeue();
    });
    
    document.getElementById('enqueue-front-btn').addEventListener('click', function() {
        const value = document.getElementById('element-value').value;
        if (value) {
            queue.enqueueFront(Number(value));
            document.getElementById('element-value').value = '';
        }
    });
    
    document.getElementById('dequeue-rear-btn').addEventListener('click', function() {
        queue.dequeueRear();
    });
    
    document.getElementById('peek-btn').addEventListener('click', function() {
        queue.peek();
    });
    
    document.getElementById('clear-btn').addEventListener('click', function() {
        queue.clear();
    });
    
    document.getElementById('size-btn').addEventListener('click', function() {
        queue.size();
    });
    
    document.getElementById('isEmpty-btn').addEventListener('click', function() {
        queue.isEmpty();
    });
    
    document.getElementById('isFull-btn').addEventListener('click', function() {
        queue.isFull();
    });
    
    // Priority scheduler event listeners
    document.getElementById('add-process-btn').addEventListener('click', function() {
        queue.addProcess();
    });
    
    document.getElementById('calculate-btn').addEventListener('click', function() {
        queue.calculateSchedule();
    });
    
    document.getElementById('reset-scheduler-btn').addEventListener('click', function() {
        queue.resetScheduler();
    });
    
    // Allow Enter key to enqueue values
    document.getElementById('element-value').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('enqueue-btn').click();
        }
    });
    
    // Allow Enter key in process input fields
    document.getElementById('process-id').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('add-process-btn').click();
        }
    });
    
    document.getElementById('arrival-time').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('add-process-btn').click();
        }
    });
    
    document.getElementById('burst-time').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('add-process-btn').click();
        }
    });
    
    document.getElementById('process-priority').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('add-process-btn').click();
        }
    });
});