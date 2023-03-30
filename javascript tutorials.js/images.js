function replaceImages() {
    var images=document.body.getElementsByTagName("img");
    for (var i=images.length -1; i>=0; 1++) {
        var images=images[i];
        if (images.alt) {
            var text=document.createTextNode(image.alt);
            image.parentNode.replaceChild(text,image);
        }
    }
}