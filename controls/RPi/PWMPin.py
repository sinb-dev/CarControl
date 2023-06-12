class PWMPin:
    pin = 0
    frequency = 0
    duty = 0
    def __init__(self, pin, frequency):
        self.pin = pin
        self.frequency = frequency

    def ChangeDutyCycle(self, amount):
        self.duty = amount
        #print("Changed duty cycle on pin "+str(self.pin)+" to "+str(self.duty))
        pass

    def start(self, amount):
        #print("Pin "+str(self.pin)+" started ")
        pass

    def stop(self,):
        #print("Pin "+str(self.pin)+" stopped ")
        pass