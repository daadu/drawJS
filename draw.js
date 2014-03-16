window.addEventListener("load",eventWindowLoaded,false);
var toolSelected = "SELECT";
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
	var selectedDrawing,newDrawing,touchEvent;
	theCanvas.addEventListener("mousedown",canvasDown,false);
	//theCanvas.addEventListener("mousemove",doNothing,false);
	if(isTouchDevice){
		theCanvas.addEventListener("touchstart",canvasDown,false);
	}
	var cat = new Image();
	cat.src = "cat.jpeg";
	function canvasDown(e){
		if(e.touches){
			touchEvent = true;
			e.preventDefault;
			tem1 = e.targetTouches[0].pageX;
			tem2 = e.targetTouches[0].pageY;
		}else{
			touchEvent = false;
			tem1 = e.clientX;
			tem2 = e.clientY;
		}
		if(toolSelected=="SELECT"){
			selectedDrawing = null;
			selectDrawing(tem1,tem2);
			if(selectedDrawing){
				if(touchEvent){
					theCanvas.addEventListener("touchmove",canvasSelectMove,false);
					theCanvas.addEventListener("touchend",function(e){
						e.preventDefault();
						theCanvas.removeEventListener("touchmove",canvasSelectMove,false);;
						selectedDrawing = null;
						drawScreen();
					},false);
				}else{
					theCanvas.addEventListener("mousemove",canvasSelectMove,false);
					theCanvas.addEventListener("mouseup",function(e){
						theCanvas.removeEventListener("mousemove",canvasSelectMove,false);
						selectedDrawing = null;
						drawScreen();
					},false);
				}
			}
		}else{
			switch(toolSelected){
				case "RECTANGLE" : 
					newDrawing = new rectObject(tem1,tem2,tem1,tem2);
					break;
				case "LINE" :
					newDrawing = new lineObject(tem1,tem2,tem1,tem2);
					break;
			}
			drawings.push(newDrawing);
			if(touchEvent){
				theCanvas.addEventListener("touchmove",canvasNewMove,false);
				theCanvas.addEventListener("touchend",function(e){
					e.preventDefault();
					theCanvas.removeEventListener("touchmove",canvasNewMove,false);
					newDrawing = null;
				},false);
			}else{
				theCanvas.addEventListener("mousemove",canvasNewMove,false);
				theCanvas.addEventListener("mouseup",function(e){
					theCanvas.removeEventListener("mousemove",canvasNewMove,false);
					newDrawing = null;
				},false);
			}
		}
		function canvasNewMove(e){
			var temx,temy; //temp varaibles
			if(touchEvent){
				e.preventDefault();
				temx = e.targetTouches[0].pageX;
				temy = e.targetTouches[0].pageY;
			}else{
				temx = e.clientX;
				temy = e.clientY;
			}
			newDrawing.resize(tem1,tem2,temx,temy);
			drawScreen();
		}
		function canvasSelectMove(e){
			var temx,temy; //temp varaibles
			if(touchEvent){
				e.preventDefault();
				temx = e.targetTouches[0].pageX;
				temy = e.targetTouches[0].pageY;
			}else{
				temx = e.clientX;
				temy = e.clientY;
			}
			if(selectedDrawing){
				selectedDrawing.reposition(temx,temy);
			}
			drawScreen();
		}
	}
	function selectDrawing(x,y){
		if(drawings){
			for(var i=0;i<drawings.length;i++){
				if(drawings[i].isSelected(x,y)){
					selectedDrawing = drawings[i];
					return;
				}
			}
		}
	}
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
			context.moveTo(this.x1-off,this.y1-off);
			context.lineTo(this.x2+off,this.y1-off);
			context.lineTo(this.x2+off,this.y2+off);
			context.lineTo(this.x1-off,this.y2+off);
			context.lineTo(this.x1-off,this.y1-off);;
			context.strokeStyle = "#FF0000";
			context.stroke();;
			context.restore();
		};
		this.draw = function(){
			context.save();
			context.moveTo(this.x1,this.y1);
			context.lineTo(this.x2,this.y2);
			context.strokeStyle = "#000000";
			context.stroke();
			context.restore();
		};
		this.reposition = function(x,y){
			//console.log(this)
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
	function rectObject(a,b,c,d){
		this.name = "RECTANGLE";
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
			drawings[i].draw();
		}
		selectedDrawing.drawWhenSelect();
	}
	function calcDist(x1,y1,x2,y2){
		return Math.floor(Math.sqrt(((x1-x2)*(x1-x2))+((y1-y2)*(y1-y2))))
	}
	function Loop() {
		//window.setTimeout(Loop, 20);
		drawScreen();
	}
	Loop();
}