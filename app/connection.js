const HOST = "192.168.54.223"
function connect() {
	socket = new WebSocket("ws://" + HOST + ":8888")
	console.log("connecting");

	socket.addEventListener("open", onconnected);

	socket.addEventListener("close", onclosed);
}
function stop() {
	clearInterval(interval);
	sendOnce();
}


function sendContinuosly(command) {
	if (interval != null)
		clearInterval(interval);
	interval = setInterval(() => {
		socket.send(command + " " + $("#speed").element.value + " " + $("#direction").element.value);
	}, 50);
}
function sendOnce(command) {
	socket.send(command)
}

/*"steer" : steer_command,
"drive" : drive_command,
"brake" : brake_command,
"reverse" : reverse_command,
"forward" : forward_command*/
const Commands = {
	sendSteer(direction) {
		var command = `steer ${direction}`
		sendOnce(command)
	},
	sendDrive(speed) {
		var command = `drive ${speed}`
		sendOnce(command);
	},
	putInReverse() {
		var command = `reverse`
		sendOnce(command)
	},
	brake() {
		var command = `brake`
		sendOnce(command);
	},
	putInReverse() {
		var command = `reverse`
		sendOnce(command)
	},
	putInDrive() {
		var command = `forward`
		sendOnce(command)
	}
}
function status(message) {
	$("#status").text(message)
}

function onconnected() {
	console.log("Connected to control software")
	status("Connected")
	$("#btnConnect").disable();
	$(".ctlButton").enable();
	$("#stream").attr("src", "http://" + HOST + ":9001");

}
function onclosed() {
	console.log("Disconnected from control software")
	status("Disconnected")
	$("#btnConnect").enable();
	$(".ctlButton").disable();
	$("#stream").attr("src", "stream.jpg");
}