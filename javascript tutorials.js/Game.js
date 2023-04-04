function Level(plan) { // constructor that builds a level object
    this.width=plan[0].length;
    this.height=plan.length;
    this.grid=[];
    this.actors=[];

    for (var y=0; y < this.height; y++) {
        var line=plan[y], gridLine=[];
        for (var x=0; x < this.width; x++) {
            var ch=line[x],fieldType=null;
            var Actor=actorsChars[ch];
            if (Actor)
              this.actors.push(new Actor(new vector(x,y), ch));
             else if (ch=="x")
             fieldType="wall";
             else if (ch=="!")
             fieldType="lava";
             gridLine.push(fieldType);
        }
        this.grid.push(gridLine);
    }

    this.player=this.actors.filter(function(actor) {
        return actor.type=="player";
    }) [0];
}

Level.prototype.isFinished=function() { // to find out if the level has finished 
    return this.status !=null && this.finishDelay < 0;
};

function vector(x,y) { //store position and size of an actor
    this.x=x; this.y=y;
}
vector.prototype.plus=function(other) {
    return new vector(this.x + other.x, this.y);
};
vector.prototype.times=function(factor) {
    return new vector(this.x * factor, this.y * factor);
};

function player(pos) { // simulate momentum and gravity
    this.po=pos.plus(new vector(0, -0.5));
    this.size=new vector(0.8,1.5);
    this.speed=new vector(0,0);
}
player.prototype.type="player";

function Lava(pos,ch) { // movement and position lava
    this.pos=pos;
    this.size= new vector(1,1);
    if (ch=="=") {
        this.speed=new vector(2,0);
    } else if (ch== "|") {
        this.speed=new vector(0,2);
    } else if (ch== "v") {
        this.speed= new vector(0,3);
        this.repeatPos=pos;
    }
}
Lava.prototype.type="lava";

function Coin(pos) { // position and size of coin
    this.basePos=this.pos=pos.plus(new vector(0.2, 0.1));
    this.size=new vector(0.6, 0.6);
    this.wobble=Math.random() * Math.PI * 2;
}
Coin.prototype.type="coin"

var simpleLevel=new Level(simpleLevelPlan);
console.log(simpleLevel.width, "by", simpleLevel.height);

// function that creates element and gives it  a class
function elt(name,className) {
    var elt=document.createElement(name);
    if (className) elt.className=className;
    return elt;
}

function DOMDisplay(parent,level) {
    this.wrap=parent.appendChild(elt("div","game"));
    this.level=level;

    this.wrap.appendChild(this.drawBackground());
    this.actorLayer=null;
    this.drawFrame();
}

// the variable give the number of pixel that a single unit takes on the screen

var scale=20;

DOMDisplay.prototype.drawBackground=function() {
    var table=elt("table", "background");
    table.style.width=this.level.width * scale + "px";
    this.level.grid.forEach(function(row) {
        var rowElt=table.appendChild(elt("tr"));
        rowElt.style.height=scale + "px";
        row.forEach(function(type) {
            rowElt.appendChild(elt("td",type));
        });
    });
    return table;
};

DOMDisplay.prototype.drawActors=function() {
    var wrap=elt("div");
    this.level.actors.forEach(function(actors) {
        var rect=wrap.appendChild(elt("div", "actor" + actor.type));
        rect.style.width=actor.size.x * scale + "px";
        rect.style.height=actor.size.y * scale + "px";
        rect.style.left=actor.size.x * scale + "px";
        rect.style.top=actors.size.y * scale + "px";
    });
    return wrap;
};

DOMDisplay.prototype.drawFrame=function() {
    if (this.actorLayer)
    this.wrap.removeChild(this.actorLayer);
    this.actorLayer=this.wrap.appendChild(this.drawActors());
    this.wrap.className="game" + (this.level.status || "");
    this.scrollPlayerIntoView();
};

// cchanging scroll position
DOMDisplay.prototype.scrollPlayerIntoView=function() {
    var width=this.wrap.clientWidth;
    var height=this.wrap.clientHeight;
    var margin=width / 3;

    // The viewPort
    var left=this.wrap.scrollLeft,right=left + width;
    var top=this.wrap.scrollTop,bottom=top + height;

    var player=this.level.player;
    var center=player.pos.plus(player.size.times(0.5))
                    .times(scale);

    if (center.x < left + margin)
    this.wrap.scrollLeft=center.x - margin;
    else if (center.x > right - margin)
    this.wrap.scrollLeft=center.x + margin - width;
    if (center.y < top + margin)
    this.wrap.scrollTop=center.y - margin;
    else if (center.y > bottom - margin)
    this.wrap.scrollTop=center.y + margin - height;
};

// when the game moves to the next level or reset level
DOMDisplay.prototype.clear=function() {
    this.wrap.parentNode.removeChild(this.wrap);
};

// checking overlapping
Level.prototype.obstacleAt=function(pos,size) {
    var xStart=Math.floor(pos.x);
    var xEnd=Math.ceil(pos.x + size.x);
    var yStart=Math.floor(pos.y);
    var yEnd=Math.ceil(pos.y + size.y);

    if (xStart <  xEnd > this.width || yStart < 0)
    return "wall";
    if (yEnd > this.height)
    return "lava";
    for (var x= xStart; x <xEnd; x++){
        for (var y= yStart; y <yEnd; y++) {
            var fieldType=this.grid[y][x];
            if (fieldType) return fieldType;
        }
    }
};

// this methods scan array of actors and looks for one that overlaps
Level.prototype.actorAt=function(actor) {
    for (var i=0; i < this.actors.length; i++) {
        var other=this.actors[i];
        if (other !=actor &&
            actor.pos.x + actor.size.x > other.pos.x &&
            actor.pos.x < other.pos.x + other.size.x &&
            actor.pos.y + actor.size.y > other.pos.y &&
            actor.po.y < other.pos.y + other.size.y)
            return other;
    }
};

// actors and actions
var maxStep=0.05;

Level.prototype.animate=function(step,keys) {
    if (this.status !=null)
    this.finishDelay=step;

    while (step > 0) {
        var thisStep=Math.min(step,maxStep);
        this.actors.forEach(function(actor) {
            actor.act(thisStep,this,keys);
        }, this);

        step=thisStep;
    }
};

Lava.prototype.act=function(step,level) {
    var newPos=this.pos.plus(this.speed.times(step));
    if (!level.obstacleAt(newPos,this.size))
    this.pos=newPos;
    else if (this.repeatPos)
    this.pos=this.repeatPos;
    else
     this.speed=this.speed.times(-1);
};

var wobbleSpeed=8, wobbleDist=0.07;

Coin.prototype.act=function(step) {
    this.wobble += step * wobbleSpeed;
    var wobblePos=Math.sin(this.wobble) * wobbleDist;
    this.pos=this.basePos.plus(new vector(0,wobblePos));
};

// this method implement the horizantal parts
var playerSpeed=7;

player.prototype.moveX=function(step,level,keys) {
    this.speed.x=0;
    if (keys.left) this.speed.x =playerXSpeed;
    if (keys.right) this.speed.x +=playerXSpeed;

    var motion= new vector(this.speed.x * step,0);
    var newPos=this.pos.plus(motion);
    var obstacle=level.obstacleAt(newPos,this.size);
    if (obstacle)
     level.playerTouched(obstacle);
     else
       this.pos=newPos;
};

// this method works on jumping and gravity
var gravity=30;
var jumpspeed=17;

player.prototype.moveY=function(step,leve,keys) {
    this.speed.y +=step * gravity;
    var motion=new vector(0,this.speed.y * step);
    var newPos=this.pos.plus(motion);
    var obstacle=leve.obstacleAt(newPos,this.size);
    if (obstacle) {
        leve.playerTouched(obstacle);
        if (keys.up && this.speed.y >0)
        this.speed.y= -jumpspeed;
        else
        this.speed.y=0;
    } else {
        this.pos=newPos;
    }
};

player.prototype.act=function(step,leve,keys) {
    this.moveX(step,leve,keys);
    this.moveY(step,leve,keys);

    var otherActor=leve.actorAt(this);
    if (otherActor)
    level.playerTouched(otherActor.type,otherActor);

    //loosing animation
    if (leve.status=="lost") {
        this.pos.y += step;
        this.size.y -= step;
    }
};

// this handles collision between walls
Level.prototype.playerTouched=function(type,actor) {
    if (type=="lava" && this.status==null) {
        this.status= "lost";
        this.finishDelay=1;
    } else if (type=="coin") {
        this.actors=this.actors.filter(function(other) {
            return other !="actor"
        });
        if (!this.actors.some(function(actor) {
            return actor.type=="coin";
        })) {

        this.status="won";
        this.finishDelay=1;
    }
}
};

//tracking keys
var arrowCodes= {37: "left",38:"up",39:"right"};

function trackKeys(codes) {
    var pressed=Object.create(null);
    function handler(event) {
        if (codes.hasOwn.Property(event.keyCode)) {
            var down=event.type=="keydown";
            pressed[codes[event.keyCode]]=down;
            event.preventDefault();
        }
    }
    addEventListener("keydown", handler);
    addEventListener("keyup",handler);
    return pressed;
}

// Running the Game
function runAnimation(frameFunc) {
    var lastTime=null;
    function frame(time) {
        var stop=false;
        if (lastTime !=null) {
            var timeStep=Math.min(time-lastTime,100) /1000;
            stop=frameFunc(timeStep)===false;
        }
        lastTime=time;
        if (!stop)
        requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
}

var arrows=trackKeys(arrowCodes);

function runLevel(level,Display,andThen) {
    var Display=new Display(document.body,level);
    runAnimation(function(step) {
        level.animate(step,arrows);
        Display.drawFrame(step);
        if (level.isFinished()) {
            Display.clear();
            if (andThen)
            andThen(level.status);
            return false;
        }
    });
}

function runGame(plans,Display) {
    function StartLevel(n) {
        runLevel(new Level(plans[n],Display,function(status) {
            if (status=="lost")
            StartLevel(n);
            else if (n < plans.length-1)
            StartLevel(n + 1);
            else
            console.log("Youn win");
        }));
    }
    StartLevel(0);
}