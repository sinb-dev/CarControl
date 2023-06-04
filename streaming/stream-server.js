
var express = require('express')
var http = require('http')
var net = require('net');
var child = require('child_process');

var app = express();
var httpServer = http.createServer(app);
var multipart = "--totalmjpeg"
app.get('/', function (req, res) {
    var date = new Date();

    res.writeHead(200, {
        'Date': date.toUTCString(),
        'Connection': 'close',
        'Cache-Control': 'no-cache, private',
        
        'Pragma' : 'no-cache',
        'Content-Type': 'multipart/x-mixed-replace; boundary="'+multipart+'"',
        'Age' : 0,
        
        'Server': 'CustomStreamer/0.0.1',
    });

    var tcpServer = net.createServer(function (socket) {
    
        socket.on('data', function (data) {
			res.write('--' + multipart + '\r\n', 'ascii');
			res.write('Content-Type: image/jpeg\r\n');
			res.write('Content-Length: ' + data.length + '\r\n');
			res.write('\r\n', 'ascii');
			res.write(data, 'binary');
			res.write('\r\n', 'ascii');
        });
        socket.on('close', function (had_error) {
            res.end();
        });
    });

    tcpServer.maxConnections = 1;

    tcpServer.listen(function () {
        
        //Bullseye
        /*
        var cmd = 'gst-launch-1.0';
        var args =
            ['libcamerasrc',
                '!', 'video/x-raw,width=800,height=600',
                '!', 'queue',
                '!', 'videoconvert',
                '!', 'jpegenc',
                '!', 'multipartmux',
                '!', 'tcpclientsink', 'host=0.0.0.0',
                'port=' + tcpServer.address().port];*/
        
        //Buster
        var cmd = 'sh';
        var args = ["-c", "raspivid -n -t 0 -fps 20 -w 640 -h 480 -o - | gst-launch-1.0 fdsrc ! decodebin ! videoconvert ! jpegenc ! multipartmux ! tcpclientsink host=0.0.0.0 port="+ tcpServer.address().port]
		console.log(args.join(" "))
        var gstMuxer = child.spawn(cmd, args);

        gstMuxer.stderr.on('data', onSpawnError);
        gstMuxer.on('exit', onSpawnExit);

        res.connection.on('close', function () {
			console.log("Connection closed")
            gstMuxer.kill();
        });
    });
});

httpServer.listen(9001);

function onSpawnError(data) {
    console.log(data.toString());
}

function onSpawnExit(code) {
    if (code != null) {
        console.log('GStreamer error, exit code ' + code);
    }
}

process.on('uncaughtException', function (err) {
    console.log(err);
});