# Introduction
This repository contains files related to a RC vehicle project I've been workin on.
The components used in the RC vehicle includes a SG90 Micro Servo Motor for turning, a DC motor with a L298N motor driver module. The vehicle is operated with an raspberry pi and is remotely controlled by a progressive webapp. The vehicle also features a camera for live streaming which is consumed by the webapp. The raspberry pi hosts both the control software for steering and driving and a streaming server using Gstreamer through a NodeJS server.
In order to connect to the vehicle using a smartphone the user connects to a ad-hoc wifi network hosted by the Raspberry PI.

# Wiring
Raspberry is wired to the L298N motor driver module.
* The module needs 5v for internal circuitry. A wire is connected from 4th physical pin on the Pi
* The module needs 2 wires for controlling direction. Two wires are attached to the 16th and 18th physical pin (pin 24, 25 BCM)
* The last wire is the stepper and using PWM from 22th physical pin it controls the speed of the motor.

The servo needs a ground and 5volt, and an additional wire to PMW control. These are connected to the Pi's 2nd and 6th physical pin for ground and 5v. The last wire is connected to the 35th physical pin. (BCM pin 19)
These pins are managed by the python program control-server.py. It is also this program that accepts a websocket to remotely control the vehicle.

# Streaming
The raspberry Pi has an official raspberry camera connected.
Streaming is handled by gstreamer and a NodeJS server that broadcasts JPGs in the form of mjpg. This has so far been the easiest way to consuming the stream from a HTML5

# Prerequisits
The software runs on Raspian OS Buster. It requires some gstreamer packages to be installed
`apt-get install gstreamer-1.0-tools`
`apt-get install npm`