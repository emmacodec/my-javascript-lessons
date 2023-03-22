function countAncestors(person,test) {
    function combine(person,fromMother,fromFather) {
        var thisOneCount=test(person);
        return fromMother+fromFather+(thisOneCount ? 1: 0);
    }
    return reduceAncestors(person,combine,0);
}
function longLivingPercentage(person) {
    var all=countAncestors(person,function(person) {
    return true;
    }); 
}
var longLiving=countAncestors(person,function(person) {
return (person.died-person.born) >=100;
});
return longLiving/all; 

console.log(longLivingPercentage(byName["Teidi Salifu"]));

/*average age of person tha lived above 100*/