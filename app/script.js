

function setupLeft() {
    var canvas = $("#cvsLeft")
    var ctx = canvas.element.getContext("2d");
    //canvas.on("click", (event) => debug(event.type))

    var width = $("html").width();
    var height = $("html").height();

    canvas.element.width = width * 0.25
    canvas.element.height = height * 0.5;
    console.log(canvas.element.width)
    //draw wheel
    var lineWidth = 20;
    var radius = canvas.element.width - lineWidth
    var cX = 0
    var cY = radius + lineWidth
    ctx.beginPath()
    ctx.arc(cX, cY, radius, -Math.PI / 2, 0)

    ctx.lineWidth = lineWidth
    ctx.strokeStyle = "#006600"
    ctx.stroke()

    canvas.on("touchmove", (event) => touchleft(event, height))

}

function touchleft(event, canvasHeight) {

    if (event.touches.length == 0) return;
    var x = event.touches[0].clientX;
    var y = event.touches[0].clientY;

    var delta = {
        x: x - 0,
        y: y - canvasHeight
    }

    var dist = Math.sqrt(delta.x * delta.x + delta.y * delta.y);
    if (dist < 125 || dist > 260) {
        return;
    }
    var angle = Math.atan2(delta.y, x);
    var range = Math.PI * 0.5
    angle = Math.max(-range, Math.min(0, angle));
    anglePct = parseInt((angle + range) / range * 100)
    debug("Turn: " + anglePct);
    Commands.sendSteer(anglePct)
}

function setupRight() {
    var canvas = $("#cvsRight")
    var ctx = canvas.element.getContext("2d");
    //canvas.on("click", (event) => debug(event.type))

    var width = $("html").width();
    var height = $("html").height();

    canvas.element.width = width * 0.25
    canvas.element.height = height;

    //draw wheel
    var cX = 0
    var cY = height
    var lineWidth = 20;
    ctx.beginPath()
    ctx.moveTo(canvas.element.width * 0.5, 50);
    ctx.lineTo(canvas.element.width * 0.5, height - 50)
    ctx.lineCap = "round"
    ctx.lineWidth = 20
    ctx.strokeStyle = "#006600"
    ctx.stroke()

    canvas.on("touchmove", (event) => touchright(event, height));
    canvas.on("touchend", (event) => Commands.brake());//


}
function touchright(event, canvasHeight) {
    if (event.touches.length == 0) return;
    var x = event.touches[0].clientX;
    var y = event.touches[0].clientY;

    var delta = {
        x: x,
        y: y - canvasHeight
    }

    //The range of values that must be transformed between 0 and 100
    var amount = y
    var range = canvasHeight - 100;
    amount = Math.max(50, Math.min(range + 50, amount));
    speed = parseInt((amount - 50) / range * 100)
    speed = Math.abs(speed - 100)
    debug("Speed: " + speed)
    Commands.sendDrive(speed)
}

function btnReverse_clicked() {
    $("span.active").removeClass("active");
    $(this).addClass("active")
    Commands.putInReverse();
}
function btnForward_clicked() {
    $("span.active").removeClass("active");
    $(this).addClass("active")
    Commands.putInDrive();
}
function debug(msg) {
    $("#txt").text(msg)
}

function $(selector) {
    if (typeof (selector) == "string") {
        var r = document.querySelectorAll(selector);
    }
    else if (typeof (selector) == "object") {
        var r = [selector]
    } else {
        console.warn("Invalid selector")
        return;
    }

    return {
        element: r[0],
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
            for (var c of r) {
                if (value !== undefined)
                    c[name] = value;

                return this.click[name]
            }
        },
        addClass(classname) {
            for (var c of r) {
                c.classList.add(classname)
            }
        },
        removeClass(classname) {
            for (var c of r) {
                c.classList.remove(classname)
            }
        },
        click(handler) {
            for (var c of r) {
                $(c).on("click", handler)
                $(c).on("touchstart", handler)
            }
        },
        on(event, handler) {
            for (var c of r) {
                if (c) c.addEventListener(event, handler)
            }
        },
        width() { if (r[0]) return r[0].getBoundingClientRect().width },
        height() { if (r[0]) return r[0].getBoundingClientRect().height },
        hide() {
            for (var c of r) {
                if (c) c.style.display = "none";
            }
        },
        show() {
            for (var c of r) {
                if (c) c.style.display = "";
            }
        },
    }
}
