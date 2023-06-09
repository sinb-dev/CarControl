#/bin/bash

cd streaming
npm install

cd ../controls
pip3 install websockets

rm RPi -rf
cd ..
--rm src