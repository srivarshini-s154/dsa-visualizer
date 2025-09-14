#queue.py
class Queue:
    def __init__(self, capacity=10, queue_type='linear'):
        self.capacity = capacity
        self.queue_type = queue_type
        self.elements = []
        self.front = 0
        self.rear = -1
        self.count = 0
        
        # For priority scheduling
        self.processes = []
        self.gantt_chart = []
        self.current_time = 0
        
        if queue_type == 'circular':
            self.elements = [None] * capacity
    
    def enqueue(self, value, priority=None):
        if self.is_full():
            raise Exception("Queue overflow")
            
        if self.queue_type == 'priority':
            # For priority queue, store both value and priority
            element = {'value': value, 'priority': priority or 5}
            
            # Insert in priority order (lower number = higher priority)
            inserted = False
            for i in range(len(self.elements)):
                if element['priority'] < self.elements[i]['priority']:
                    self.elements.insert(i, element)
                    inserted = True
                    break
            
            if not inserted:
                self.elements.append(element)
                
        elif self.queue_type == 'circular':
            # Increment rear in circular fashion
            self.rear = (self.rear + 1) % self.capacity
            self.elements[self.rear] = value
        else:
            self.elements.append(value)
            self.rear = len(self.elements) - 1
            
        self.count += 1
        return True
    
    def dequeue(self):
        if self.is_empty():
            raise Exception("Queue underflow")
            
        if self.queue_type == 'circular':
            value = self.elements[self.front]
            self.elements[self.front] = None  # Clear the slot
            self.front = (self.front + 1) % self.capacity
        else:
            value = self.elements.pop(0)
            self.rear = len(self.elements) - 1 if self.elements else -1
            
        self.count -= 1
        return value
    
    def enqueue_front(self, value):
        if self.queue_type != 'deque':
            raise Exception("This operation is only available for Deque")
            
        if self.is_full():
            raise Exception("Deque overflow")
            
        self.elements.insert(0, value)
        self.rear = len(self.elements) - 1
        self.count += 1
        return True
    
    def dequeue_rear(self):
        if self.queue_type != 'deque':
            raise Exception("This operation is only available for Deque")
            
        if self.is_empty():
            raise Exception("Deque underflow")
            
        value = self.elements.pop()
        self.rear = len(self.elements) - 1 if self.elements else -1
        self.count -= 1
        return value
    
    def peek(self):
        if self.is_empty():
            return None
            
        if self.queue_type == 'circular':
            return self.elements[self.front]
        else:
            return self.elements[0]
    
    def size(self):
        return self.count
    
    def is_empty(self):
        return self.count == 0
    
    def is_full(self):
        return self.count >= self.capacity
    
    def clear(self):
        if self.queue_type == 'circular':
            self.elements = [None] * self.capacity
        else:
            self.elements = []
        
        self.front = 0
        self.rear = -1
        self.count = 0
    
    def to_list(self):
        if self.queue_type == 'circular':
            # For circular queue, return elements in order from front to rear
            result = []
            if not self.is_empty():
                current = self.front
                for i in range(self.count):
                    result.append(self.elements[current])
                    current = (current + 1) % self.capacity
            return result
        else:
            return self.elements.copy()

    def get_circular_state(self):
        """Get current state of circular queue for debugging"""
        if self.queue_type != 'circular':
            return None
        
        return {
            'elements': self.elements,
            'front': self.front,
            'rear': self.rear,
            'count': self.count,
            'capacity': self.capacity
        }

    # Priority Scheduling Methods
    def add_process(self, process_id, arrival_time, burst_time, priority):
        """Add a process to the scheduler"""
        process = {
            'id': process_id,
            'arrival_time': int(arrival_time),
            'burst_time': int(burst_time),
            'priority': int(priority),
            'remaining_time': int(burst_time),
            'completion_time': 0,
            'waiting_time': 0,
            'turnaround_time': 0,
            'executed': False
        }
        self.processes.append(process)
        return process

    def calculate_priority_schedule(self):
        """Calculate priority scheduling (non-preemptive)"""
        if not self.processes:
            raise Exception("No processes to schedule")
        
        # Reset previous calculation
        self.current_time = 0
        self.gantt_chart = []
        processes = [p.copy() for p in self.processes]  # Deep copy
        
        # Initialize processes
        for p in processes:
            p['remaining_time'] = p['burst_time']
            p['completion_time'] = 0
            p['waiting_time'] = 0
            p['turnaround_time'] = 0
            p['executed'] = False
        
        completed = 0
        total_processes = len(processes)
        execution_steps = []
        
        execution_steps.append("Starting Priority Scheduling Algorithm (Non-Preemptive)...")
        
        while completed < total_processes:
            # Find processes that have arrived and not completed
            available_processes = [
                p for p in processes 
                if p['arrival_time'] <= self.current_time and p['remaining_time'] > 0
            ]
            
            if not available_processes:
                # No process available, advance time
                self.current_time += 1
                execution_steps.append(f"Time {self.current_time}: No process available")
                continue
            
            # Find process with highest priority (lowest number)
            next_process = min(available_processes, key=lambda x: (x['priority'], x['arrival_time']))
            
            # Execute the process completely (non-preemptive)
            execution_steps.append(f"Time {self.current_time}: Executing {next_process['id']} "
                                  f"(Priority: {next_process['priority']}, Burst Time: {next_process['burst_time']})")
            
            # Add to Gantt chart
            self.gantt_chart.append({
                'process': next_process['id'],
                'start_time': self.current_time,
                'end_time': self.current_time + next_process['burst_time'],
                'priority': next_process['priority']
            })
            
            # Update time and process completion
            self.current_time += next_process['burst_time']
            next_process['completion_time'] = self.current_time
            next_process['turnaround_time'] = next_process['completion_time'] - next_process['arrival_time']
            next_process['waiting_time'] = next_process['turnaround_time'] - next_process['burst_time']
            next_process['remaining_time'] = 0
            next_process['executed'] = True
            completed += 1
            
            execution_steps.append(f"Time {self.current_time}: {next_process['id']} completed "
                                  f"(CT: {next_process['completion_time']}, "
                                  f"TAT: {next_process['turnaround_time']}, "
                                  f"WT: {next_process['waiting_time']})")
        
        # Update the original processes with calculated times
        for p in processes:
            original_process = next((op for op in self.processes if op['id'] == p['id']), None)
            if original_process:
                original_process['completion_time'] = p['completion_time']
                original_process['turnaround_time'] = p['turnaround_time']
                original_process['waiting_time'] = p['waiting_time']
                original_process['executed'] = True
        
        # Calculate averages
        avg_waiting_time = sum(p['waiting_time'] for p in self.processes) / len(self.processes)
        avg_turnaround_time = sum(p['turnaround_time'] for p in self.processes) / len(self.processes)
        
        return {
            'processes': self.processes,
            'gantt_chart': self.gantt_chart,
            'execution_steps': execution_steps,
            'avg_waiting_time': avg_waiting_time,
            'avg_turnaround_time': avg_turnaround_time,
            'total_time': self.current_time
        }

    def get_processes(self):
        """Get all processes"""
        return self.processes

    def reset_scheduler(self):
        """Reset the scheduler"""
        self.processes = []
        self.gantt_chart = []
        self.current_time = 0

    def get_gantt_chart(self):
        """Get the Gantt chart"""
        return self.gantt_chart

    def get_execution_steps(self):
        """Get execution steps"""
        # This would return the steps from the last calculation
        # For simplicity, we'll just return a summary
        if not self.gantt_chart:
            return []
        
        steps = []
        for segment in self.gantt_chart:
            steps.append(f"{segment['process']} executed from {segment['start_time']} to {segment['end_time']}")
        
        return steps