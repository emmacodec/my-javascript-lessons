var name="danny";
var text="Danny is a genuis character.";
var regexp=new RegExp("\\b("+ name +")\\b", "g!");
console.log(text.replace(regexp,"_$1_"));