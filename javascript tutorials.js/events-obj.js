var button=document.querySelector("button");
button.addEventListener("mousedown",function() {
    if (event.which==1)
    console.log("Left button");
    else if (event.which==2)
    console.log("Middle button");
    else if (event.which==3)
    console.log("Right button");
});