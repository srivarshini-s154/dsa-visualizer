from flask import Flask, render_template, jsonify, request
from utils.stack import Stack
from utils.queue import Queue
import heapq

app = Flask(__name__)

# Homepage route
@app.route('/')
def homepage():
    return render_template('homepage.html')

# Stack visualization route
@app.route('/stacks')
def stacks():
    return render_template('stacks.html')

# Queue visualization route
@app.route('/queues')
def queues():
    return render_template('queues.html')

# Initialize global instances
stack = Stack()
linear_queue = Queue(queue_type='linear')
circular_queue = Queue(queue_type='circular')
deque_queue = Queue(queue_type='deque')
priority_queue = Queue(queue_type='priority')

# API endpoint for stack operations
@app.route('/api/stack', methods=['POST'])
def stack_api():
    data = request.json
    operation = data.get('operation')
    value = data.get('value')
    
    try:
        if operation == 'push':
            result = stack.push(value)
            return jsonify({"result": "success", "data": result})
        elif operation == 'pop':
            result = stack.pop()
            return jsonify({"result": "success", "data": result})
        elif operation == 'peek':
            result = stack.peek()
            return jsonify({"result": "success", "data": result})
        elif operation == 'size':
            result = stack.size()
            return jsonify({"result": "success", "data": result})
        elif operation == 'is_empty':
            result = stack.is_empty()
            return jsonify({"result": "success", "data": result})
        elif operation == 'clear':
            stack.clear()
            return jsonify({"result": "success", "data": "Stack cleared"})
        elif operation == 'get_all':
            result = stack.to_list()
            return jsonify({"result": "success", "data": result})
        else:
            return jsonify({"result": "error", "message": "Invalid operation"})
    except Exception as e:
        return jsonify({"result": "error", "message": str(e)})

# API endpoint for queue operations
@app.route('/api/queue', methods=['POST'])
def queue_api():
    data = request.json
    operation = data.get('operation')
    value = data.get('value')
    priority = data.get('priority')
    queue_type = data.get('queue_type', 'linear')
    
    # Select the appropriate queue instance
    if queue_type == 'linear':
        queue_instance = linear_queue
    elif queue_type == 'circular':
        queue_instance = circular_queue
    elif queue_type == 'deque':
        queue_instance = deque_queue
    elif queue_type == 'priority':
        queue_instance = priority_queue
    else:
        return jsonify({"result": "error", "message": "Invalid queue type"})
    
    try:
        if operation == 'enqueue':
            result = queue_instance.enqueue(value, priority)
            return jsonify({"result": "success", "data": result})
        elif operation == 'dequeue':
            result = queue_instance.dequeue()
            return jsonify({"result": "success", "data": result})
        elif operation == 'enqueue_front':
            result = queue_instance.enqueue_front(value)
            return jsonify({"result": "success", "data": result})
        elif operation == 'dequeue_rear':
            result = queue_instance.dequeue_rear()
            return jsonify({"result": "success", "data": result})
        elif operation == 'peek':
            result = queue_instance.peek()
            return jsonify({"result": "success", "data": result})
        elif operation == 'size':
            result = queue_instance.size()
            return jsonify({"result": "success", "data": result})
        elif operation == 'is_empty':
            result = queue_instance.is_empty()
            return jsonify({"result": "success", "data": result})
        elif operation == 'is_full':
            result = queue_instance.is_full()
            return jsonify({"result": "success", "data": result})
        elif operation == 'clear':
            queue_instance.clear()
            return jsonify({"result": "success", "data": "Queue cleared"})
        elif operation == 'get_all':
            result = queue_instance.to_list()
            return jsonify({"result": "success", "data": result})
        else:
            return jsonify({"result": "error", "message": "Invalid operation"})
    except Exception as e:
        return jsonify({"result": "error", "message": str(e)})

# API endpoint for expression evaluation
@app.route('/api/evaluate_expression', methods=['POST'])
def evaluate_expression():
    data = request.json
    expression = data.get('expression')
    
    try:
        # Convert infix to postfix
        postfix_expression = infix_to_postfix(expression)
        
        # Evaluate postfix expression
        result, evaluation_steps = evaluate_postfix(postfix_expression)
        
        return jsonify({
            "result": "success", 
            "postfix": postfix_expression,
            "evaluation_steps": evaluation_steps,
            "final_result": result
        })
    except Exception as e:
        return jsonify({"result": "error", "message": str(e)})

# API endpoint for priority CPU scheduling
@app.route('/api/priority_scheduler', methods=['POST'])
def priority_scheduler():
    data = request.json
    action = data.get('action')
    
    try:
        if action == 'add_process':
            process_id = data.get('process_id')
            arrival_time = data.get('arrival_time')
            burst_time = data.get('burst_time')
            priority = data.get('priority')
            
            # Add to priority queue's process list
            priority_queue.add_process(process_id, arrival_time, burst_time, priority)
            return jsonify({"result": "success", "message": f"Process {process_id} added"})
            
        elif action == 'calculate_schedule':
            # Calculate priority scheduling
            result = priority_queue.calculate_priority_schedule()
            return jsonify({"result": "success", "data": result})
            
        elif action == 'reset_scheduler':
            priority_queue.reset_scheduler()
            return jsonify({"result": "success", "message": "Scheduler reset"})
            
        elif action == 'get_processes':
            processes = priority_queue.get_processes()
            return jsonify({"result": "success", "data": processes})
            
        else:
            return jsonify({"result": "error", "message": "Invalid action"})
            
    except Exception as e:
        return jsonify({"result": "error", "message": str(e)})

# Helper function to check operator precedence
def precedence(op):
    if op == '+' or op == '-':
        return 1
    if op == '*' or op == '/':
        return 2
    return 0

# Convert infix expression to postfix notation
def infix_to_postfix(expression):
    # Remove spaces
    expression = expression.replace(" ", "")
    
    output = []
    ops_stack = Stack()
    
    i = 0
    while i < len(expression):
        char = expression[i]
        
        # If character is a digit, parse the whole number
        if char.isdigit():
            num = char
            while i + 1 < len(expression) and expression[i + 1].isdigit():
                i += 1
                num += expression[i]
            output.append(num)
        
        # If character is '(', push it to stack
        elif char == '(':
            ops_stack.push(char)
        
        # If character is ')', pop until '(' is found
        elif char == ')':
            while not ops_stack.is_empty() and ops_stack.peek() != '(':
                output.append(ops_stack.pop())
            ops_stack.pop()  # Remove '(' from stack
        
        # If character is an operator
        else:
            while (not ops_stack.is_empty() and 
                   precedence(ops_stack.peek()) >= precedence(char)):
                output.append(ops_stack.pop())
            ops_stack.push(char)
        
        i += 1
    
    # Pop all operators from stack
    while not ops_stack.is_empty():
        output.append(ops_stack.pop())
    
    return ' '.join(output)

# Evaluate postfix expression and return steps
def evaluate_postfix(expression):
    tokens = expression.split()
    eval_stack = Stack()
    steps = []
    
    for token in tokens:
        step = {}
        
        # If token is a number, push to stack
        if token.isdigit():
            eval_stack.push(int(token))
            step['action'] = f"Push operand {token}"
            step['stack'] = eval_stack.to_list()
        
        # If token is an operator
        else:
            # Pop two operands
            operand2 = eval_stack.pop()
            operand1 = eval_stack.pop()
            
            # Perform operation
            if token == '+':
                result = operand1 + operand2
            elif token == '-':
                result = operand1 - operand2
            elif token == '*':
                result = operand1 * operand2
            elif token == '/':
                result = operand1 / operand2
            else:
                raise ValueError(f"Unknown operator: {token}")
            
            # Push result back to stack
            eval_stack.push(result)
            
            step['action'] = f"Apply {token} on last two operands: {operand1} {token} {operand2} = {result}"
            step['stack'] = eval_stack.to_list()
        
        steps.append(step)
    
    final_result = eval_stack.pop()
    return final_result, steps

if __name__ == '__main__':
    app.run(debug=True)