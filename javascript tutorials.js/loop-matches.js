var input="A string with a numbers in it... 42 and 88.";
var number=/\b(\d+)\b/g;
var match;
while (match=number.exec(input))
  console.log("found",match[1],"at",match.index);