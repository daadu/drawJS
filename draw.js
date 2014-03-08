

window.addEventListener("load",eventWindowLoaded,false);
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
	var selectedDrawing;
	//theCanvas.addEventListener("mousedown",mouseDown,false);
	//theCanvas.addEventListener("mouseup",mouseUp,false);
	hammertimetouch = Hammer(theCanvas).on("touch",canvasTouched);
	hammertimerelease = Hammer(theCanvas).on("release",canvasReleased);
	//theCanvas.addEventListener("mouseover",mouseOver,false);
	var cat = new Image();
	cat.src = "/static/cat.jpeg";
	function canvasTouched(e){
		e.gesture.preventDefault()
		if(!selectedDrawing){
			selectDrawing(e.gesture.center.pageX,e.gesture.center.pageY)
		}
		tem1 = e.gesture.center.pageX;
		tem2 = e.gesture.center.pageY;
	}
	function mouseDown(e){
		//console.log(e.clientX,e.clientY);
		if(!selectedDrawing){
			selectDrawing(e.clientX,e.clientY);
		}
		
		tem1 = e.clientX;
		tem2 = e.clientY;
	}
	function selectDrawing(x,y){
		if(drawings){
			for(var i=0;i<drawings.length;i++){
				selectedDrawing = false;
				var threshold = 10;
				var left = (drawings[i].fromX<drawings[i].toX)?drawings[i].fromX:drawings[i].toY;
				var right = (left==drawings[i].fromX)?drawings[i].toX:drawings[i].fromX;
				var top = (drawings[i].fromY<drawings[i].toY)?drawings[i].fromY:drawings[i].toY;
				var bottom = (top==drawings[i].fromY)?drawings[i].toY:drawings[i].fromY;
				if(((x<left+threshold&&x>left-threshold)&&(y>top-threshold )&&(y<bottom+threshold)) ||
					((x<right+threshold)&&(x>right-threshold)&&(y>top-threshold )&&(y<bottom+threshold)) ||
					((y<top+threshold)&&(y>top-threshold)&&(x>left-threshold)&&(x<right+threshold)) ||
					((y<bottom+threshold)&&(y>bottom-threshold)&&(x>left-threshold)&&(x<right+threshold))
					){
					selectedDrawing = drawings[i]
					return 
				}
			}
		}
	}
	function canvasReleased(e){
		e.gesture.preventDefault()
		if(!selectedDrawing){
			drawings.push(new drawnObject(tem1,tem2,e.gesture.center.pageX,e.gesture.center.pageY));
			
		}else{
			var width = selectedDrawing.fromX - selectedDrawing.toX;
			width = (width<0)?-1*width:width;
			var height = selectedDrawing.fromY - selectedDrawing.toY;
			height = (height<0)?-1*height:height;
			selectedDrawing.fromX = e.gesture.center.pageX;
			selectedDrawing.fromY = e.gesture.center.pageY;
			selectedDrawing.toX = selectedDrawing.fromX+width;
			selectedDrawing.toY = selectedDrawing.fromY+height;
			selectedDrawing = null;
		}
	}
	function mouseUp(e){
		if(!selectedDrawing){
			drawings.push(new drawnObject(tem1,tem2,e.clientX,e.clientY));
			
		}else{
			var width = selectedDrawing.fromX - selectedDrawing.toX;
			width = (width<0)?-1*width:width;
			var height = selectedDrawing.fromY - selectedDrawing.toY;
			height = (height<0)?-1*height:height;
			selectedDrawing.fromX = e.clientX;
			selectedDrawing.fromY = e.clientY;
			selectedDrawing.toX = selectedDrawing.fromX+width;
			selectedDrawing.toY = selectedDrawing.fromY+height;
			selectedDrawing = null;
		}
		//delete tempDrawing;
	}
	function drawnObject(a,b,c,d){
		this.fromX = a;
		this.fromY = b;
		this.toX = c;
		this.toY = d;
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
			if(selectedDrawing == drawings[i]){
				context.save();
				context.lineWidth =1;
				context.beginPath();
				context.moveTo(drawings[i].fromX,drawings[i].fromY);
				context.lineTo(drawings[i].toX,drawings[i].fromY);
				context.lineTo(drawings[i].toX, drawings[i].toY);
				context.lineTo(drawings[i].fromX,drawings[i].toY);
				context.lineTo(drawings[i].fromX,drawings[i].fromY);
				context.strokeStyle = "#FF0000";
				context.stroke();
				context.restore();
			}else{
				context.save();
				context.lineWidth =1;
				context.beginPath();
				context.moveTo(drawings[i].fromX,drawings[i].fromY);
				context.lineTo(drawings[i].toX,drawings[i].fromY);
				context.lineTo(drawings[i].toX, drawings[i].toY);
				context.lineTo(drawings[i].fromX,drawings[i].toY);
				context.lineTo(drawings[i].fromX,drawings[i].fromY);
				context.stroke();
				context.restore();
			}
		}
	}
	function calcDistance(x1,y1,x2,y2){
		return Math.floor(Math.sqrt( (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2) ))
	}
	function Loop() {
		window.setTimeout(Loop, 20);
		drawScreen();
	}
	Loop();
}