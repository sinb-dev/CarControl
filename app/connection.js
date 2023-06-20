const DEBUG = false;
const HOST = !DEBUG ? "192.168.1.26" : "127.0.0.1";

let _connecting = false;
function connect() {
	if (_connecting) return;
	_connecting = true;
	console.log("connecting");
	socket = new WebSocket("ws://" + HOST + ":8888")

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
	sendOnce(command)
	interval = setInterval(() => {
		sendOnce(command)
		console.log(command)
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
		sendContinuosly(command);
	},
	putInReverse() {
		var command = `reverse`
		sendOnce(command)
	},
	brake() {
		var command = `brake`
		sendOnce(command);
		console.log("!");
		if (interval != null)
			clearInterval(interval);
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
	$("#btnConnect").hide();
	$("#btnGear").show();
	$(".ctlButton").enable();
	$("#stream").attr("src", "http://" + HOST + ":9001");
	_connecting = false;

}
function onclosed() {
	console.log("Disconnected from control software")
	status("Disconnected")
	$("#btnConnect").show();
	$("#btnGear").hide();
	$(".ctlButton").disable();
	$("#stream").attr("src", "stream.jpg");
	_connecting = false;
}