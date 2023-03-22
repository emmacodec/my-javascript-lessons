function average(array) {
    function plus(a,b) {return a+b;}
    return array.reduce(plus) / array.length;
}

function age(p) {return p.died - p.born;}
function mother(p) {return p.mom=="M";}
function child(p) {return p.child=="Ch";}

console.log(average(ancestry.filter(mother).map(age)));
console.log(average(ancestry.filter(child).map(age)));

/*average age between mother and child*/