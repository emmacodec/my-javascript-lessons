function findDate(string) {
    var dateTime=/(\d{1,2})-(\d{1,2})-(\d{4})/;
    var match=dateTime.exec(string);
    return new Date(Number(match[3]),
                    Number(match[2]),
                    Number(match[1])); 
}
console.log(findDate("30-1-2003"));