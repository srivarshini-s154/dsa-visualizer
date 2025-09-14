document.addEventListener('DOMContentLoaded', function() {
    // Stack implementation
    const stack = {
        elements: [],
        capacity: 10,
        
        push: function(value) {
            if (this.isFull()) {
                alert('Stack overflow! Cannot push onto a full stack.');
                return false;
            }
            
            if (!value && value !== 0) {
                alert('Please enter a value to push.');
                return false;
            }
            
            this.elements.push(value);
            this.logOperation(`Pushed ${value}`);
            this.updateVisualization();
            return true;
        },
        
        pop: function() {
            if (this.isEmpty()) {
                alert('Stack underflow! Cannot pop from an empty stack.');
                return null;
            }
            
            const value = this.elements.pop();
            this.logOperation(`Popped ${value}`);
            this.updateVisualization();
            return value;
        },
        
        peek: function() {
            if (this.isEmpty()) {
                alert('Stack is empty!');
                return null;
            }
            
            const value = this.elements[this.elements.length - 1];
            this.logOperation(`Peeked ${value}`);
            return value;
        },
        
        clear: function() {
            this.elements = [];
            this.logOperation('Cleared stack');
            this.updateVisualization();
        },
        
        size: function() {
            const size = this.elements.length;
            this.logOperation(`Stack size is ${size}`);
            return size;
        },
        
        isEmpty: function() {
            const isEmpty = this.elements.length === 0;
            this.logOperation(`Stack is ${isEmpty ? 'empty' : 'not empty'}`);
            return isEmpty;
        },
        
        isFull: function() {
            return this.elements.length >= this.capacity;
        },
        
        updateVisualization: function() {
            const stackElements = document.getElementById('stack-elements');
            stackElements.innerHTML = '';
            
            // Create visual elements for each stack item
            this.elements.forEach((value, index) => {
                const element = document.createElement('div');
                element.className = 'stack-element';
                element.textContent = value;
                element.style.backgroundColor = this.getElementColor(value);
                stackElements.appendChild(element);
            });
            
            // Update info panel
            document.getElementById('stack-size').textContent = this.elements.length;
            document.getElementById('top-element').textContent = this.isEmpty() ? 'None' : this.elements[this.elements.length - 1];
        },
        
        getElementColor: function(value) {
            // Generate a color based on the value for visual distinction
            const hue = (value * 137) % 360; // Simple hash for hue
            return `hsl(${hue}, 70%, 65%)`;
        },
        
        logOperation: function(operation) {
            const historyList = document.getElementById('history-list');
            const historyItem = document.createElement('div');
            
            // Determine operation type for styling
            let operationType = 'other';
            if (operation.startsWith('Pushed')) operationType = 'push';
            if (operation.startsWith('Popped')) operationType = 'pop';
            
            historyItem.className = `history-item ${operationType}`;
            historyItem.textContent = `${new Date().toLocaleTimeString()}: ${operation}`;
            
            historyList.appendChild(historyItem);
            historyList.scrollTop = historyList.scrollHeight;
        },
        
        evaluateExpression: function(expression) {
            const stepsContainer = document.getElementById('steps-container');
            stepsContainer.innerHTML = '';
            
            if (!expression) {
                this.addStep('Please enter an expression to evaluate.');
                return;
            }
            
            // Send expression to server for evaluation
            fetch('/api/evaluate_expression', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ expression: expression })
            })
            .then(response => response.json())
            .then(data => {
                if (data.result === 'success') {
                    this.displayEvaluationSteps(data.postfix, data.evaluation_steps, data.final_result);
                } else {
                    this.addStep(`Error: ${data.message}`);
                }
            })
            .catch(error => {
                this.addStep(`Error: ${error.message}`);
            });
        },
        
        displayEvaluationSteps: function(postfixExpression, steps, finalResult) {
            const stepsContainer = document.getElementById('steps-container');
            stepsContainer.innerHTML = '';
            
            // Display postfix expression
            this.addStep(`Postfix expression: ${postfixExpression}`);
            this.addStep('Evaluation steps:');
            
            // Display each step
            steps.forEach((step, index) => {
                const stepElement = document.createElement('div');
                stepElement.className = 'evaluation-step';
                
                const stepNumber = document.createElement('span');
                stepNumber.className = 'step-number';
                stepNumber.textContent = `Step ${index + 1}: `;
                
                const stepAction = document.createElement('span');
                stepAction.className = 'step-action';
                stepAction.textContent = step.action;
                
                const stepStack = document.createElement('div');
                stepStack.className = 'step-stack';
                stepStack.textContent = `Stack: [${step.stack.join(', ')}]`;
                
                stepElement.appendChild(stepNumber);
                stepElement.appendChild(stepAction);
                stepElement.appendChild(stepStack);
                
                stepsContainer.appendChild(stepElement);
            });
            
            // Display final result
            this.addStep(`Final result: ${finalResult}`);
        },
        
        addStep: function(step) {
            const stepsContainer = document.getElementById('steps-container');
            const stepElement = document.createElement('div');
            stepElement.className = 'step';
            stepElement.textContent = step;
            stepsContainer.appendChild(stepElement);
            stepsContainer.scrollTop = stepsContainer.scrollHeight;
        }
    };
    
    // Initialize the stack visualization
    stack.updateVisualization();
    
    // Event listeners for buttons
    document.getElementById('push-btn').addEventListener('click', function() {
        const value = document.getElementById('element-value').value;
        if (value) {
            stack.push(Number(value));
            document.getElementById('element-value').value = '';
        }
    });
    
    document.getElementById('pop-btn').addEventListener('click', function() {
        stack.pop();
    });
    
    document.getElementById('peek-btn').addEventListener('click', function() {
        stack.peek();
    });
    
    document.getElementById('clear-btn').addEventListener('click', function() {
        stack.clear();
    });
    
    document.getElementById('size-btn').addEventListener('click', function() {
        stack.size();
    });
    
    document.getElementById('isEmpty-btn').addEventListener('click', function() {
        stack.isEmpty();
    });
    
    document.getElementById('evaluate-btn').addEventListener('click', function() {
        const expression = document.getElementById('expression-input').value;
        stack.evaluateExpression(expression);
    });
    
    // Allow Enter key to push values
    document.getElementById('element-value').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('push-btn').click();
        }
    });
    
    // Allow Enter key to evaluate expressions
    document.getElementById('expression-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('evaluate-btn').click();
        }
    });
});