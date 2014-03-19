'use strict';

function rectObject(a, b, c, d){
	this.name = "RECTANGLE";
	this.left = (a < c) ?a:c;
	this.right = (this.left==a)?c:a;
	this.top = (b<d)?b:d;
	this.bottom = (this.top==b)?d:b;
	this.width = this.right - this.left;
	this.height = this.bottom - this.top;
	this.drawWhenSelect = function(){
        context.save();
		context.lineWidth =1;
        context.strokeStyle = "#FF0000";
		context.beginPath();
		context.moveTo(this.left,this.top);
		context.lineTo(this.right,this.top);
		context.lineTo(this.right, this.bottom);
		context.lineTo(this.left,this.bottom);
		context.lineTo(this.left,this.top);
        context.stroke();
        context.restore();
	}
	this.reposition = function(x, y){
		this.left = x;
		this.right = this.left+this.width;
		this.top = y;
		this.bottom = this.top+this.height;
	}
	this.resize = function(fromX,fromY,toX,toY){
		this.left = (fromX<toX)?fromX:toX;
		this.right = (this.left==fromX)?toX:fromX;
		this.top = (fromY<toY)?fromY:toY;
		this.bottom = (this.top==fromY)?toY:fromY;
		this.width = this.right - this.left;
		this.height = this.bottom - this.top;
	}
	this.draw = function(){
		context.save();
		context.lineWidth =1;
		context.beginPath();
		context.moveTo(this.left,this.top);
		context.lineTo(this.right,this.top);
		context.lineTo(this.right, this.bottom);
		context.lineTo(this.left,this.bottom);
		context.lineTo(this.left,this.top);
        //context.strokeStyle = "#000000";
		context.stroke();
		context.restore();	
	}
	this.isSelected = function(x,y){
		var th = 10;//threshold
		if(((x<this.left+th&&x>this.left-th)&&(y>this.top-th )&&(y<this.bottom+th)) ||
				((x<this.right+th)&&(x>this.right-th)&&(y>this.top-th )&&(y<this.bottom+th)) ||
				((y<this.top+th)&&(y>this.top-th)&&(x>this.left-th)&&(x<this.right+th)) ||
				((y<this.bottom+th)&&(y>this.bottom-th)&&(x>this.left-th)&&(x<this.right+th))
			){
				return true;
		}
		return false;
	}
}