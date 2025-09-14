class Stack:
    def __init__(self, capacity=10):
        self.capacity = capacity
        self.elements = []
    
    def push(self, value):
        if self.is_full():
            raise Exception("Stack overflow")
        self.elements.append(value)
        return True
    
    def pop(self):
        if self.is_empty():
            raise Exception("Stack underflow")
        return self.elements.pop()
    
    def peek(self):
        if self.is_empty():
            return None
        return self.elements[-1]
    
    def size(self):
        return len(self.elements)
    
    def is_empty(self):
        return len(self.elements) == 0
    
    def is_full(self):
        return len(self.elements) >= self.capacity
    
    def clear(self):
        self.elements = []
    
    def to_list(self):
        return self.elements.copy()