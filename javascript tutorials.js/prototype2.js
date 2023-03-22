var protoHyena={
    speak:function(line) {
        console.log("The" + this.type + "hyena says'" + line + "'");
    }
};

var killerHyena=Object.create(protoHyena);
killerHyena.type="killer";
killerHyena.speak("SKREEEEE..");