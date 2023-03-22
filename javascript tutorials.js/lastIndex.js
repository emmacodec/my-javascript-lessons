var pattern=/y/g;
pattern.lastIndex=3;
var match=pattern.exec("xyzzy");
console.log(match.index);
console.log(pattern.lastIndex);