 var results=[
    {name: "satisfied",count:1034,color:"lightblue"},
    {name: "Neutral",count:563,color:"lightgreen"},
    {name: "Unsatisfied",count:510,color:"pink"},
    {name: "No comment", count:175,color:"silver"},
 ];

 var cx=document.querySelector("canvas").getContext("2d");
 var total=results.reduce(function(sum,choice) {
    return sum + choice.count;
 },0);

 // start at the top
 var currentAngle= -0.5 * Math.PI;
 results.forEach(function(results) {
    var sliceAngle=(results.count/total) * 2 * Math.PI;
    cx.beginPath();
   
    // center=100,100,radius=100
    // from current angle,clockwise by slice's angle
    
    cx.arc(100,100,100
          ,currentAngle + sliceAngle);
        currentAngle += sliceAngle;
        cx.lineTo(100,100);
        cx.fillStyle=results.color;
        cx.fill();
 });