'use strict';

function lineObject(a,b,c,d){
	this.name = "LINE";
	this.x1 = a;
	this.y1 = b;
	this.x2 = c;
	this.y2 = d;
	this.length = calcDist(this.x1,this.y1,this.x2,this.y2);
	this.slope = Math.atan((this.y2-this.y1)/(this.x2-this.x1));

	this.drawWhenSelect = function(){
		context.save();
		var off = 3;//away from selected drawing
        context.lineWidth =1;
        context.strokeStyle = "#FF0000";
        context.moveTo(this.x1,this.y1);
		context.lineTo(this.x2,this.y2);
		context.stroke();
		context.restore();
	};
	this.draw = function(){
		context.save();
        context.lineWidth =1;
        //context.strokeStyle = "#000000";
		context.moveTo(this.x1,this.y1);
		context.lineTo(this.x2,this.y2);
		context.stroke();
		context.restore();
	};
	this.reposition = function(x,y){
		var dx = x - this.x1;
		var dy = y - this.y1;
		this.x1 = x;
		this.y1 = y;
		this.x2 += dx; 
		this.y2 += dy;
	};
	this.resize = function(a,b,c,d){
		this.name = "LINE";
		this.x1 = a;
		this.y1 = b;
		this.x2 = c;
		this.y2 = d;
		this.length = calcDist(this.x1,this.y1,this.x2,this.y2);
		this.slope = Math.atan((this.y2-this.y1)/(this.x2-this.x1))
	}
	this.isSelected = function(x,y){
		var sumDist = calcDist(x,y,this.x1,this.y1) + calcDist(x,y,this.x2,this.y2);//sum distance form clicked point to x1,y1 and x2,y2
		var th = 5; //threshold
		console.log(this.slope)
		if(this.length>sumDist-th){
			console.log("selected")
			return true
		}
		return false;
	}
}

function calcDist(x1,y1,x2,y2){
	return Math.floor(Math.sqrt(((x1-x2)*(x1-x2))+((y1-y2)*(y1-y2))))
}