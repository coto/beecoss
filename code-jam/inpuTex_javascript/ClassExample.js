person = new Object()
person.name = "Tim Scarfe"
person.height = "6Ft"

person.run = function() {
	this.state = "running"
	this.speed = "4ms^-1"
}

//##########################

timObject = {
	property1 : "Hello",
	property2 : "MmmMMm",
	property3 : ["mmm", 2, 3, 6, "kkk"],
	method1 : function(){alert("Method had been called" + this.property1)}
};

timObject.method1();
alert(timObject.property3[2])

for(x in timObject) alert( x + "-" + timObject[ x ] )
	
//############################

function cat(name) {
	this.name = name;
	this.talk = function() {
		alert( this.name + " say meeow!" );
	}
} 

cat1 = new cat("felix");
cat1.talk() //alerts "felix says meeow!"

cat2 = new cat("ginger");
cat2.talk() //alerts "ginger says meeow!"
cat.prototype.changeName = function(name) {
	this.name = name;
}

firstCat = new cat("pursur");
firstCat.changeName("Bill");
firstCat.talk() //alerts "Bill says meeow!"
