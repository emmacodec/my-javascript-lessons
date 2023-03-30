var lastX; //tracks the last observed mouse X position
var rect=document.querySelector("div");
rect.addEventListener("mousedown",function(event) {
    if (event.which==1) {
        lastX=event.pageX;
        addEventListener("mousemove",moved);
        event.preventDefault(); //prevent selection
    }
});

function moved(event) {
    if (event.which !=1) {
        removeEventListener("mousemove", moved);
    } else {
        var dist=event.pageX - lastX;
        var newWidth=Math.max(10,rect.offsetWidth + dist);
        rect.style.width=newWidth + "px";
        lastX=event.pageX
    }
}