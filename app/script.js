function $(selector) {
	var r = document.querySelectorAll(selector);
 
	return {
		element : r[0],
		text(str) {
			for (var c of r) {
				c.innerText = str;
			}
		},
		disable() {
			for (var c of r) {
				c.disabled = true;
			}
		},
		enable() {
			for (var c of r) {
				c.disabled = false;
			}
		},
        attr(name, value) {
            if (r[0]) {
                if (value !== undefined)
                    r[0][name] = value;
                
                return r[0][name]
                
            }
        },
        on(event, handler) {
            if (r[0]) r[0].addEventListener(event, handler)
        },
        width() { if (r[0]) return r[0].getBoundingClientRect().width },
        height() { if (r[0]) return r[0].getBoundingClientRect().height },
	}
}

function setupLeft() {
    var canvas = $("#cvsLeft")
    var ctx = canvas.element.getContext("2d");
    //canvas.on("click", (event) => debug(event.type))
    
    var width = $("html").width();
    var height = $("html").height();
    
    canvas.element.width = width*0.25
    canvas.element.height = height;
    console.log(canvas.element.width)
    //draw wheel
    var cX = 0
    var cY = height
    var lineWidth = 20;
    ctx.beginPath()
    var radius = canvas.element.width - lineWidth
    ctx.arc(0,height, radius, -Math.PI/2, 0)
   
    ctx.lineWidth=lineWidth
    ctx.strokeStyle = "#006600"
    ctx.stroke()

    canvas.on("touchmove", (event) => touchleft(event,height))
}

function touchleft(event,canvasHeight) 
{
    if (event.touches.length == 0) return;
    var x = event.touches[0].clientX;
    var y = event.touches[0].clientY;

    var delta = {
        x : x - 0,
        y : y - canvasHeight
    }

    var dist = Math.sqrt(delta.x*delta.x + delta.y*delta.y);
    if (dist < 125 || dist > 260) {
        return;
    }
    var angle = Math.atan2(delta.y,x);
    var range = Math.PI*0.5
    angle = Math.max(-range,Math.min(0,angle));
    anglePct = parseInt((angle + range) / range * 100)
    debug("Turn: "+anglePct);
}

function setupRight() {
    var canvas = $("#cvsRight")
    var ctx = canvas.element.getContext("2d");
    //canvas.on("click", (event) => debug(event.type))
    
    var width = $("html").width();
    var height = $("html").height();
    
    canvas.element.width = width*0.25
    canvas.element.height = height;
    
    //draw wheel
    var cX = 0
    var cY = height
    var lineWidth = 20;
    ctx.beginPath()
    ctx.moveTo(canvas.element.width*0.5, 50);
    ctx.lineTo(canvas.element.width*0.5, height-50)
    ctx.lineCap = "round"
    ctx.lineWidth=20
    ctx.strokeStyle = "#006600"
    ctx.stroke()

    canvas.on("touchmove", (event) => touchright(event,height))
}
function touchright(event,canvasHeight) 
{
    if (event.touches.length == 0) return;
    var x = event.touches[0].clientX;
    var y = event.touches[0].clientY;

    var delta = {
        x : x,
        y : y - canvasHeight
    }

    //The range of values that must be transformed between 0 and 100
    var amount = y
    var range = canvasHeight-100;
    amount = Math.max(50, Math.min(range+50, amount));
    speed = parseInt((amount - 50) / range * 100)
    speed = Math.abs(speed-100)
    debug("Speed: "+speed)
}

function debug(msg) {
	$("#txt").text(msg)
}