var bar=document.querySelector(".progress div");
addEventListener("scroll",function() {
    var max=document.body.scrollHeight-this.innerHeight;
    var percent=(this.pageYOffset/max) * 100;
    bar.style.width=percent + "%";
});