window.addEventListener("load",eventWindowLoaded,false);
var deviceAgent = navigator.userAgent.toLowerCase();
var isTouchDevice = ('ontouchstart' in document.documentElement) || 
					(deviceAgent.match(/(iphone|ipod|ipad)/) ||
					deviceAgent.match(/(android)/)  || 
					deviceAgent.match(/(iemobile)/) || 
					deviceAgent.match(/iphone/i) || 
					deviceAgent.match(/ipad/i) || 
					deviceAgent.match(/ipod/i) || 
					deviceAgent.match(/blackberry/i) || 
					deviceAgent.match(/bada/i));

function eventWindowLoaded(){
	canvasApp();
}
function canvasApp(){
	var theCanvas=document.getElementById("canvas");
	var context = canvas.getContext("2d");
	theCanvas.width = 300;
	theCanvas.height = 200;
	var tem1,tem2;
	var drawings = [];
	var selectedDrawing,newDrawing;
	theCanvas.addEventListener("mousedown",canvasMouseDown,false);
	//theCanvas.addEventListener("mousemove",doNothing,false);
	if(isTouchDevice){
		theCanvas.addEventListener("touchstart",canvasTouchStart,false);
	}
	var cat = new Image();
	cat.src = "cat.jpeg";
	function canvasMouseDown(e){
		selectDrawing(e.clientX,e.clientY);
		tem1 = e.clientX;
		tem2 = e.clientY;
		theCanvas.addEventListener("mousemove",canvasMouseMove,false);
		newDrawing = new rectObject(e.clientX,e.clientY,e.clientX,e.clientY);
		drawings.push(newDrawing)
		function canvasMouseMove(e){
			//console.log(e)
			if(selectedDrawing){
				selectedDrawing.reposition(e.clientX,e.clientY);
			}else{
				if(newDrawing){
					newDrawing.resize(tem1,tem2,e.clientX,e.clientY);
				}
			}
			drawScreen();
			theCanvas.addEventListener("mouseup",canvasMouseUp,false);
			function canvasMouseUp(e){
				newDrawing = null;
				selectedDrawing = null;
			}
		}
	}
	function canvasTouchStart(e){
		e.preventDefault();
		selectDrawing(e.targetTouches[0].pageX,e.targetTouches[0].pageY)
		tem1 = e.targetTouches[0].pageX;
		tem2 = e.targetTouches[0].pageY;
		theCanvas.addEventListener("touchmove",canvasTouchMove,false);
		newDrawing = new rectObject(e.targetTouches[0].pageX,e.targetTouches[0].pageY,e.targetTouches[0].pageX,e.targetTouches[0].pageY);
		drawings.push(newDrawing);
		function canvasTouchMove(e){
			e.preventDefault();
			if(selectedDrawing){
				selectedDrawing.reposition(e.targetTouches[0].pageX,e.targetTouches[0].pageY);
			}else{
				if(newDrawing){
					newDrawing.resize(tem1,tem2,e.targetTouches[0].pageX,e.targetTouches[0].pageY);
				}
			}
			drawScreen();
			theCanvas.addEventListener("touchend",canvasTouchEnd,false);
			function canvasTouchEnd(e){
				newDrawing = null;
				selectedDrawing = null;
			}
		}
	}
	function selectDrawing(x,y){
		if(drawings){
			for(var i=0;i<drawings.length;i++){
				selectedDrawing = false;
				if(drawings[i].isSelected(x,y)){
					selectedDrawing = drawings[i]
					return
				}
			}
		}
	}
	function rectObject(a,b,c,d){
		this.left = (a<c)?a:c;
		this.right = (this.left==a)?c:a;
		this.top = (b<d)?b:d;
		this.bottom = (this.top==b)?d:b;
		this.width = this.right - this.left;
		this.height = this.bottom - this.top;
		this.reposition = function(x,y){
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
			this.width = this.right - this.top;
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
			if(selectedDrawing == this){
				context.strokeStyle = "#FF0000";
			}
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
	function drawScreen(){
		theCanvas.width = theCanvas.width;
		context.save();
		context.globalAlpha = 0.3;
		context.drawImage(cat,0,0,cat.width,cat.height,0,0,theCanvas.width,theCanvas.height);
		context.restore();
		render();
	}
	function render() {
		for(var i=0;i<drawings.length;i++){
			drawings[i].draw()
		}
	}
	function Loop() {
		//window.setTimeout(Loop, 20);
		drawScreen();
	}
	Loop();
}