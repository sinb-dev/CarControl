#/usr/bin/python3
import asyncio
import RPi.GPIO as GPIO
from threading import Thread
import time
import datetime
from websockets.server import serve
 
GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
 
AUTOBRAKEINTERVAL = 100

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


isInReverse = False
'''
command examples            arguments
steer [direction]           direction: Number between 0 and 100 where 50 means straight forward
drive [speed]               speed: Number between 0 and 100 where 100 is full speed. Drive forward for 100 msec
brake                       brake the vehicle
reverse                     put gear in reverse
forward                     put gear in drive
'''

def steer_command(args):
    direction = get_arg_val_or_default(args, 1, 50, "Missing direction from steer command")
    turn(direction)

def drive_command(args):
    speed = get_arg_val_or_default(args, 1, 0, "Missing speed for the drive command")
    drive(speed)
def brake_command(args):
    brake()
def reverse_command(args):
    put_gear_in_reserve()
def forward_command(args):
    put_gear_in_drive()

commands = {
    "steer" : steer_command,
    "drive" : drive_command,
    "brake" : brake_command,
    "reverse" : reverse_command,
    "forward" : forward_command
}
async def echo(websocket):
    async for message in websocket:
        args = message.split(" ")
        command = args[0]
        if command in commands:
            commands[command](args);
        

def get_arg_val_or_default(args, index, default, message):
    if (len(args) <= index):
        print(message)
        return default
    else:
        return args[index]

 
 
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
    amount = int(amount)
    return amount * servoStep + servoMinValue
 
def clamp(num, minimum, maximum):
    return max(minimum, min(maximum, num))
 
def turn(degrees):
    degrees = get_rotation_amount(degrees)
    pwmServo.ChangeDutyCycle(get_pwm_angle(degrees))
 
def brake():
    print("braking")
    GPIO.output(in1,GPIO.LOW)
    GPIO.output(in2,GPIO.LOW)
 
def drive(speed):
    print("forward "+str(speed))
    pwmSpeed.ChangeDutyCycle(speed)
    autoBrakeWhen = datetime.datetime.now() + datetime.timedelta(microseconds=AUTOBRAKEINTERVAL);

def put_gear_in_reverse():
    print("Gear in reverse")
    GPIO.output(in1,GPIO.HIGH)
    GPIO.output(in2,GPIO.LOW)

def put_gear_in_drive():
    print("Gear in drive")
    GPIO.output(in1,GPIO.LOW)
    GPIO.output(in2,GPIO.HIGH)
 
def auto_brake():
    while True:
        time.sleep(0.1);
        if (autoBrakeWhen <= datetime.datetime.now()):
            brake()
        else:
            print(autoBrakeWhen)
autoBrakeWhen = datetime.datetime.now()
autoBrakeThread = Thread(target=auto_brake)
autoBrakeThread.start();

async def main():
    setupGPIO()   
    async with serve(echo, "0.0.0.0", 8888):
        print("server started")
        await asyncio.Future()
 
if __name__ == '__main__':
    print("starting server")
    currently = datetime.datetime.now();
    print(str(currently))
    asyncio.run(main())
