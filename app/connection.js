function connect()
{
	socket = new WebSocket("ws://10.0.0.158:8888")
	console.log("connecting");
 
	socket.addEventListener("open", onconnected);
 
	socket.addEventListener("close", onclosed);
}
function stop()
{
	clearInterval(interval);
	sendOnce();
}
 
 
function sendContinuosly(command)
{
	if (interval != null)
		clearInterval(interval);
	interval = setInterval(() => {
		socket.send(command+" "+$("#speed").element.value+" "+$("#direction").element.value);
	},100);
}
function sendOnce(command)
{
	socket.send(command)
}
function forward()
{
	sendContinuosly("n");
}
function backward()
{
	sendContinuosly("s");
}
function left()
{
	sendContinuosly("l");
}
function right()
{
	sendContinuosly("r");
}
function status(message)
{
	$("#status").text(message)
}
 
function onconnected() {
    console.log("Connected to control software")
	status("Connected")
	$("#btnConnect").disable();
	$(".ctlButton").enable();
    $("#stream").attr("src","http://10.0.0.158:9001");
    
}
function onclosed() {
    console.log("Disconnected from control software")
	status("Disconnected")
	$("#btnConnect").enable();
	$(".ctlButton").disable();
    $("#stream").attr("src","stream.jpg");
}