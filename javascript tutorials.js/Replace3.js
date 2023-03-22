var stock="1 coke,2 pepsi, and 101 sprite";
function minusOne(match,amount,unit) {
    amount=Number(amount) -1;
    if (amount==1) // only one left, remove the "s"
    unit=unit.slice(0,unit.length-1);
    else if (amount==0)
    amount="no";
    return amount + " " + unit;
}
console.log(stock.replace(/(\d+) (\w+)/g,minusOne));