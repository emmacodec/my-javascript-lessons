var day1= {
    Emmanuel:false
    events: ["work","singing","pizza-store","jogging","cinema"]
};

console.log(day1.Emmanuel);

var journal=[
    {events:["work","singing","pizza-store","jogging","cinema"]
    Emmanuel:false},

    {events:["work","brushed teeth",]
    Emmanuel:false},

    {events:["weekend","cycling","break","peanuts","football"]
    Emmanuel:true},

    /* and so on...*/
];

function gathercorrelations(journal) {
    var phis={};
    for(var entry=0;entry<journal.length;entry++) {
        var events=journal[entry].events;
        for(var i=0;i<events.length;i++) {
            var event=events[i];

            if (!(event in phis))
            phis[event]=phi(tablefor(event,journal));
        }
    }

    return phis;
}

var correlation=gathercorrelations(journal);
console.log(correlation.pizza);

for(var event in correlation) {
    var correlation=correlations[event];
    if (correlation>0.1 || correlation<-0.1)
    console.log(event + ": " + correlation);
}

