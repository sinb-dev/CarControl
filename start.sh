#/bin/bash

PYTHON_PID=0
function stop() {
	echo "Stopping servers"
	kill $PYTHON_PID
        exit 0
}

trap stop SIGINT

python controls/control-server.py &
PYTHON_PID=$!

node streaming/stream-server.js



