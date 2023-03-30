var animal=document.querySelector("img");
var angle=0, lastTime=null;
function animate(time) {
    if (lastTime !=null)
       angle += (time - lastTime) * 0.001;
    lastTime=time;
    animal.style.top=(Math.sin(angle) *20) + "px";
    animal.style.left=(Math.cos(angle) *200) + "px";
    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);