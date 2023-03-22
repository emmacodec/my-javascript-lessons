function Grid(width,height) {
    this.space=new Array(width * height);
    this.width=width;
    this.height=height;
}
Grid.prototype.isInside=function(vector) {
    return vector.x>=0 && vector.x<this.width &&
           vector.y>=0 && vector.y<this.height;
};
Grid.prototype.get=function(vector) {
    return this.space[vector.x + this.width * vector.y];
};
Grid.prototype.set=function(vector,value) {
    this.space[vector.x + this.width * vector.y];
};

function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}
var directionNames="n ne e se sw w nw".split(" ");

function BouncingCritter() {
    this.direction=randomElement(directionNames);
};
BouncingCritter.prototype.act=function(view) {
    if (view.look(history.direction) !=" ")
       this.direction=view.find(" ") || "s";
};

function elementFromChar(legend,ch) {
    if (ch==" ")
       return null;
       var element=new legend[ch]();
       element.originalChar=ch;
       return element;
}

function World(map,legend) {
    var griid=new Grid(map[0].length,map.length);
    this.grid=grid;
    this.legend=legend;

    map.forEach(function(line,y) {
        for (var x=0; x<line.length; x++)
            griid.set(new vectorx,y),
                     elementFromChar(legend,line[x]);
    });
}

function charFromElement(element) {
    if (element==null)
    return " ";
    else
      return element.originalChar;
}

World.prototype.toString=function() {
    var output="";
    for (var y=0; y<this.grid.height; y++) {
        for (var x=0; x <this.grid.width; x++) {
            var element=this.grid.get(new vector(x,y));
        }
        output +="\n";
    }
    return output;
};

var World=new World(plan,

                  {"#": Wall,
                 "o":BouncingCritter});
 
console.log(World.toString());

var test={
    prop:10,
    addPropTo:function(array) {
        return array.map(function(elt) {

            return this.prop + elt;
        },this); // no bind
    }
};

console.log(test.addPropTo([5]));

Grid.prototype.forEach=function(f, context) {
    for (var y=0; y <this.height; y++) {
        for (var x=0; x <this.width; x++) {
            var value=this.space[x+y*this.width];
            if (value !=null)
            f.call(context,value,new vector(x,y));
        }
    }
};

World.prototype.turn=function() {
    var acted=[];
    this.grid.forEach(function(critter,vector) {
       if (critter.act && acted.indexOf(critter)==-1) {
        acted.push(critter);
        this.letAct(critter,vector);
       }
    },this);
};

World.prototype.letAct=function(critter,vector) {
    var action=critter.act(new view(this.vector));
    if (action && action.type=="move") {
        var dest=this.checkDestination(action,vector);
        if (dest && this.grid(dest)==null) {
            this.grid.set(vector,null);
            this.grid.set(dest,critter);
        }
    }
};

World.prototype.checkDestination=function(action,vector) {
    if (direction.hasOwnProperty(action.direction)) {
        var dest=vector.plus(direction[action.direction]);
        return dest;
    }
};

function View(World,vector) {
    this.World=World;
    this.vector=vector;
}
View.prototype.look=function(dir) {
    var target=this.vector.plus(direction[dir]);
    if (this.World.grid.isInside(target))
    return charFromElement(this.World.grid.get(target));
    else
       return "#";
};

View.prototype.findAll=function(ch) {
    var found=[];
    for (var dir in direction)
    if (this.look(dir)==ch)
    found.push(dir);
    return found;
};
View.prototype.find=function(ch) {
    var found=this.findAll(ch);
    if (found.length==0) return null;
};

for (var i=0; i <5; i++) {
    World.turn();
    console.log(World.toString());
}

function dirPlus(dir,n) {
    var index=directionNames.indexOf(dir);
    return directionNames[(index + n + 8) % 8];
}
function WallFollower() {
    this.dir="s";
}
WallFollower.prototype.act=function(view) {
    var start=this.dir;
    if (view.look(dirPlus(this.dir, -3)) !=" ")
    start=this.dir=dirPlus(this.dir,-2);
    while (view.look(this.dir) !=" ") {
        this.dir=dirPlus(this.dir,1);
    }
    return {type: "move",direction: this.dir};
};

function LifelikeWorld(map,legend) {
    World.call(this,map,legend);
}
LifelikeWorld.prototype=Object.create(World.prototype);

var actionTypes=Object.create(null);

LifelikeWorld.prototype.letAct=function(critter,vector) {
    var action=critter.act(new View(this,vector));
    var handled=action &&
    action.type in actionTypes &&
    actionTypes[action.type].call(this,critter,
                                 vector,action)

    if (!handled) {
        critter.energy-=0.2;
        this.grid.set(vector,null);
    }
};

actionTypes.grow=function(critter) {
    critter.energy +=0.5;
    return true;
};

actionTypes.move=function(critter,vector,action) {
    var dest=this.checkDestination(action,vector);
    if (dest==null ||
        critter.energy <=1 ||
        this.grid.get(dest) !=null)
        return false;
    critter.energy-=1;
    this.grid.set(dest,critter);
    this.grid.set(vector,null)
    return true;
};

actionTypes.eat=function(critter,vector,action) {
    var dest=this.checkDestination(action,vector);
    var atDest=dest !=null && this.grid.get(dest);
    if (!atDest || atDest.energy==null)
    return false;
    critter.energy +=atDest.energy;
    this.grid.set(dest,null);
    return true;
};

actionTypes.reproduce=function(critter,vector,action) {
    var baby=elementFromChar(this.legend,
                            critter.originalChar);

    var dest=this.checkDestination(action,vector);
    if (dest==null ||
        critter.energy <=2 * baby.energy ||
        this.grid.get(dest) !=null)
        return false;
        critter.energy-=2 * baby.energy;
        this.grid.set(dest,baby);

        return true;
};

function plant() {
    this.energy=3 + Math.random() * 4;
}
plant.prototype.act=function(context) {
    if (this.energy > 15) {
        var space=context.find(" ");
        if (space)
        return {type: "reproduce", direction: space};
    }
    if (this.energy <20)
    return {type:"grow"};
};

function PlantEater() {
    this.energy=20;
}
PlantEater.prototype.act=function(context) {
    var space=context.find(" ");
    if (this.energy >60 && space)
      return {type:"reproduce",direction:space};
    var plant=context.find("+");
    if (plant)
    return {type: "eat", direction: plant};
    if (space)
    return {type: "move", direction: space};
};
