#/usr/bin/python3
import asyncio
import RPi.GPIO as GPIO
 
from websockets.server import serve
 
GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
 
#Motor
speedPin = 23
in1 = 24
in2 = 25
GPIO.setup(speedPin, GPIO.OUT)
GPIO.setup(in1, GPIO.OUT)
GPIO.setup(in2, GPIO.OUT)
pwmSpeed = GPIO.PWM(speedPin, 100)
 
#Servo
servoPin = 19
servoMaxValue = 9#12.5
servoMinValue = 6#2.5
servoStep = (servoMaxValue - servoMinValue) / 100
GPIO.setup(servoPin, GPIO.OUT)
pwmServo = GPIO.PWM(servoPin,50)
 
async def echo(websocket):
    async for message in websocket:
        args = message.split(" ")
        cmd = args[0];
        if len(args) > 1:
            arg1 = args[1];
 
        if cmd == "n":
            speed = getspeed(arg1)
            forward(speed)
        elif cmd == "s":
            speed = getspeed(arg1)
            backward(speed)
        elif cmd == "b":
            brake();
        elif cmd == "t":
            rotation_amount = get_rotation_amount(args[1]);
            turn(rotation_amount);
        if len(args) > 2:
            rotation_amount = get_rotation_amount(args[2]);
            turn(rotation_amount);
 
 
def setupGPIO():
    pwmSpeed.start(0)
    pwmServo.start(0)
    GPIO.output(in1,GPIO.LOW)
    GPIO.output(in2,GPIO.LOW)
 
def getspeed(string):
    speed = int(string);
    return clamp(speed, 0, 100)
 
def get_rotation_amount(string):
    amount = int(string);
    return clamp(amount, 0, 100)
 
def get_pwm_angle(amount):
 
    return amount * servoStep + servoMinValue
 
def clamp(num, minimum, maximum):
    return max(minimum, min(maximum, num))
 
def turn(degrees):
    pwmServo.ChangeDutyCycle(get_pwm_angle(degrees))
 
def brake():
    print("forward")
    GPIO.output(in1,GPIO.LOW)
    GPIO.output(in2,GPIO.LOW)
 
def forward(speed):
    print("forward "+str(speed))
    GPIO.output(in1,GPIO.HIGH)
    GPIO.output(in2,GPIO.LOW)
    pwmSpeed.ChangeDutyCycle(speed)
 
def backward(speed):
    print("backward"+str(speed))
    GPIO.output(in1,GPIO.LOW)
    GPIO.output(in2,GPIO.HIGH)
    pwmSpeed.ChangeDutyCycle(speed)
 
async def main():
    setupGPIO()   
    async with serve(echo, "0.0.0.0", 8888):
        print("server started")
        await asyncio.Future()
 
if __name__ == '__main__':
    print("starting server")
    asyncio.run(main())
