'use strict';

function selectEvent(eventType,x,y){
	if(selectedDrawing){
		if(eventType === "touch"){
			theCanvas.addEventListener("touchmove",canvasSelectMove,false);
			theCanvas.addEventListener("touchend",function(e){
				e.preventDefault();
				theCanvas.removeEventListener("touchmove",canvasSelectMove,false);;
				//selectedDrawing = null;
				drawScreen();
			},false);
		}
		if(eventType === "mouse"){
			theCanvas.addEventListener("mousemove",canvasSelectMove,false);
			theCanvas.addEventListener("mouseup",function(e){
				theCanvas.removeEventListener("mousemove",canvasSelectMove,false);
				//selectedDrawing = null;
				drawScreen();
			},false);
		}
	}
	function canvasSelectMove(e){
		console.log("mouse select move")
		var temx,temy; //temp varaibles
		if(eventType=="touch"){
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
function newDrawEvent(eventType,x,y){
	if(eventType === "touch"){
		theCanvas.addEventListener("touchmove",canvasNewMove,false);
		theCanvas.addEventListener("touchend",function(e){
			e.preventDefault();
			theCanvas.removeEventListener("touchmove",canvasNewMove,false);
			selectedDrawing = newDrawing;
			newDrawing = null;
			drawScreen();
		},false);
	}
	if(eventType === "mouse"){
		theCanvas.addEventListener("mousemove",canvasNewMove,false);
		theCanvas.addEventListener("mouseup",function(e){
			theCanvas.removeEventListener("mousemove",canvasNewMove,false);
			selectedDrawing = newDrawing;
			newDrawing = null;
			drawScreen()
		},false);
	}
	function canvasNewMove(e){
		console.log("mouse new move")
		var temx,temy; //temp varaibles
		if(eventType==="touch"){
			e.preventDefault();
			temx = e.targetTouches[0].pageX;
			temy = e.targetTouches[0].pageY;
		}else{
			temx = e.clientX;
			temy = e.clientY;
		}
		newDrawing.resize(x,y,temx,temy);
		drawScreen();
	}
}