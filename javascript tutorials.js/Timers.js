document.body.style.background="blue";
setTimeout(function() {
    document.body.style.background="red";
}, 2000);

var bombTimer=setTimeout(function() {
    console.log("Boom!..");
}, 500);

if (Math.random() < 0.5) { // 50% chances
    console.log("Defused.");
    clearTimeout(bombTimer);
}

var ticks=0;
var clock=setInterval(function() {
    console.log("tick",ticks++);
    if (ticks==10) {
        clearInterval(clock);
        console.log("stop");
    }
}, 200);