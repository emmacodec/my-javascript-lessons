function time(name,action) {
    var start=Date.now();// Current time in milliseconds
    action();
    console.log(name,"took",Date.now() -start,"ms");
}

time("naive",function() {
    var target=document.getElementById("one");
    while (target.offsetWidth< 2000)
       target.appendChild(document.createTextNode("X"));
});
// naive took 32 ms

time("clever",function() {
    var target=document.getElementById("two");
    target.appendChild(document.createTextNode("XXXX"));
    var total=Math.ceil(2000 / (target.offsetWidth / 5));
    for (var i=5; i < total;i++)
       target.appendChild(document.createTextNode("X"));
});
// clever took 1ms