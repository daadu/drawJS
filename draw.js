'use strict';

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


var theCanvas=document.getElementById("canvas");
var context = canvas.getContext("2d");
theCanvas.width = 300;
theCanvas.height = 200;

var tem1,tem2;
var drawings = [];
var selectedDrawing,newDrawing;

var cat = new Image();
cat.src = "cat.jpeg";
function eventWindowLoaded(){
	canvasApp();
	drawScreen();
}
function drawScreen(){
	console.log("draw scree",drawings)
	theCanvas.width = theCanvas.width;
	context.save();
	context.globalAlpha = 0.3;
	context.drawImage(cat,0,0,cat.width,cat.height,0,0,theCanvas.width,theCanvas.height);
	context.restore();
	for(var i=0;i<drawings.length;i++){
        if(drawings[i]!==selectedDrawing){
		  drawings[i].draw();
        }
	}
	if(selectedDrawing){
		selectedDrawing.drawWhenSelect();
	}
};
function canvasApp(){
	theCanvas.addEventListener("mousedown",canvasDown,false);
	//theCanvas.addEventListener("mousemove",doNothing,false);
	if(isTouchDevice){
		theCanvas.addEventListener("touchstart",canvasDown,false);
	}
	function canvasDown(e){
		console.log("mouse down",drawings)
		var x,y,eventType;
		if(e.touches){
			e.preventDefault;
			x = e.targetTouches[0].pageX;
			y = e.targetTouches[0].pageY;
			eventType = "touch";
		}else{
			x = e.clientX;
			y = e.clientY;
			eventType = "mouse";
		}
		switch(toolSelected){
			case "SELECT" : 
				selectedDrawing = selectDrawing(x,y);
				selectEvent(eventType,x,y);
				break;
			case "RECTANGLE" : 
				newDrawing = new rectObject(x,y,x,y);
				drawings.push(newDrawing)
				newDrawEvent(eventType,x,y);
				break;
			case "LINE" :
				newDrawing = new lineObject(x,y,x,y);
				drawings.push(newDrawing);
				newDrawEvent(eventType,x,y);
				break;
		}
	}
	/*var touchEvent;
	function canvasDown(e){
		console.log(e)
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
						//selectedDrawing = null;
						drawScreen();
					},false);
				}else{
					theCanvas.addEventListener("mousemove",canvasSelectMove,false);
					theCanvas.addEventListener("mouseup",function(e){
						theCanvas.removeEventListener("mousemove",canvasSelectMove,false);
						//selectedDrawing = null;
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
					selectedDrawing = newDrawing;
					newDrawing = null;
					drawScreen();
				},false);
			}else{
				theCanvas.addEventListener("mousemove",canvasNewMove,false);
				theCanvas.addEventListener("mouseup",function(e){
					theCanvas.removeEventListener("mousemove",canvasNewMove,false);
					selectedDrawing = newDrawing;
					newDrawing = null;
					drawScreen()
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
	}*/
	function selectDrawing(x,y){
		if(drawings){
            selectedDrawing = null;
			for(var i=0;i<drawings.length;i++){
				if(drawings[i].isSelected(x,y)){
					return drawings[i];
				}
			}
		}
	}
}