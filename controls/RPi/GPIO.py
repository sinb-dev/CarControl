from RPi.PWMPin import PWMPin
def setmode(arg):
    pass

def setwarnings(mode):
    pass

def setup(pin, direction):
    pass

def PWM(pin, frequency):
    return PWMPin(pin, frequency);

def output(pin, amount):
    #print("Output "+str(amount)+" on pin "+str(pin))
    pass

OUT = 2
LOW = 1
HIGH = 2
BCM = 0
