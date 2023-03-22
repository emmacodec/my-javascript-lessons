function power(base,exponent) {
    if(exponent==0)
    return 1;
    else
      return base * power(base,exponent -1);
}

console.log(2,3);

function findSolution(target) {
    function find(start,history) {
        if(start==target)
        return history;
        else
        return find(start +5, "("+history+" + 5)") ||
        find(start * 3, "(" + history + " + 3)");
    }
    return find(1,"1");
}

console.log(findSolution(24));