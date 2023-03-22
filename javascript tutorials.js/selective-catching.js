function promptDirection(question) {
    var result=prompt(question,"");
    if (result.toLowerCase()=="left") return "L";
    if (result.toLowerCase()=="right") return "R";
    throw new InputError("invalid direction: " + result);
}

for (;;) {
    try {
        var dir = promptDirection("where?");
        console.log("you choose",dir);
        break;
    } catch (e) {
        if (e instanceof InputError)
        console.log("Not a valid direction. Try again.");
        else
          throw e;
    }
}