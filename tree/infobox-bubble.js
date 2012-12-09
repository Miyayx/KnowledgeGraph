var myCvs;  //the canvas of infobox that svg elements will put on 
var captionH = 30; // caption(title) line height
var limitContextL = 16; // limited context length
var infobox_p_width = 35; // pointer width ,the triangle
var infobox_p_height = 30;
var infobox_lineH = 20; // each line's height

//get the width of text box which will be put onto the screen
function getTextLength(string){
	var text =  myCvs.append("text").text(string);
	var l = text.node().getBBox().width;
	text.remove();
	return l;
}

//get the longest label to get width of label rect
function getMaxLabelString(data){
	var ml = 0;
	var maxs;
	for(i = 0; i < data.length; i++){
		if(data[i].label.length > ml){
			ml = data[i].label.length;
			maxs = data[i].label;
		}
	}
	return maxs;
}

//get the longest context to get width of context rect
function getMaxContextString(data){
	var ml = 0;
	var maxs;
	for(i = 0; i < data.length; i++){
		if(data[i].context.length > ml){
			ml = data[i].context.length;
			maxs = data[i].context;
		}
	}
	return maxs.length>limitContextL ? "aaaaaaaaaaaaaaaa" : maxs; 
	//the length will not larger than 16. If it's longer, then line feed
}

function calculateiBoxHeight(data){

	var linenum = 0;
	for(i=0;i<data.length;i++){
		linenum = linenum+Math.floor(data[i].context.toString().length/limitContextL)+1;
	}
	return infobox_lineH*linenum+captionH;//including caption and all the lines
}

function createInfobox(canvas,data){
	myCvs = canvas;
	var maxLabelString,maxContextString,
	    maxLabelLength,maxContextLength;

	var ibHeight = calculateiBoxHeight(data);

	maxLabelString = getMaxLabelString(data);
	maxContextString = getMaxContextString(data);

	maxLabelLength = getTextLength(maxLabelString);
	maxContextLength = getTextLength(maxContextString);

	var roundD = 15; //we will create a rounded rect
	var padding = 7; //blank between text and box boundary 
	var boxWidth = padding+maxLabelLength+maxContextLength+padding+10; 
	//two side padding blank,label column width,context column width and column distance
	var boxHeight = padding+ibHeight+padding;

	//calculate the text vertical center using d
	calculateTextH = function(d,i){
		var myH = currentH;
		currentH = currentH+(Math.floor(d.context.toString().length/limitContextL)+1)*infobox_lineH;
		return myH+infobox_lineH/2;
	}

	infobox = canvas.append("g")
		.attr("class","infobox")//in graph.css
		.attr("width",boxWidth)
		.attr("height",boxHeight)
		.attr("render-order",1); // put the element on the toppest

	infobox.append("svg:defs")
		.append("svg:clipPath")
		.attr("id", "infobox-clip")
		.append("rect")
		.attr("rx",roundD)
		.attr("ry",roundD)
		.attr("width",boxWidth)
		.attr("height",boxHeight);

	//background of label column
	infobox.append("rect")
		.attr("class","label")
		.attr("y",captionH)
		.attr("clip-path","url(#infobox-clip)")
		.attr("width",padding+maxLabelLength+5)
		.attr("height",boxHeight-captionH);

	//background of context column
	infobox.append("rect")
		.attr("class","context")
		.attr("x",padding+maxLabelLength+maxContextLength/2+5)
		.attr("y",captionH)
		.attr("clip-path","url(#infobox-clip)")
		//.attr("fill","white")
		.attr("width",5+maxContextLength+padding)
		.attr("height",boxHeight-captionH);

	//write caption "Infobox"
	infobox.append("text")
		.attr("dx",boxWidth/2)
		.attr("dy",captionH/2+padding)
		//	.attr("transform")
		.attr("text-anchor","middle")
		.attr("font-weight","bold")
		.text("Infobox");

	//write label
	var currentH = padding+captionH;
	infobox.selectAll("text.label")
		.data(data)
		.enter()
		.append("text")
		.attr("x",padding+maxLabelLength/2)
		.attr("y",calculateTextH)
		.attr("width",maxLabelLength)
		.attr("height",infobox_lineH)
		.text(function(d){ return d.label });

	// write context
	var currentH = padding+captionH;
	infobox.selectAll("text.context")
		.data(data)
		.enter()
		.append("text")
		.attr("x",padding+maxLabelLength+maxContextLength/2+10)
		.attr("y",function(d,i){
			d.y = calculateTextH(d,i);
			return d.y;	})
		.attr("width",maxContextLength)
		.attr("height",function(d){
			return  (Math.floor(d.context.toString().length/limitContextL)+1)*infobox_lineH;
		})
	//	.text(function(d){return d.context});
	.each(function(d,i){ // use tag<tspan> to write context for it maybe too long to divided into multiline.
		var textBlock = d3.select(this);
		for(j = 0; j < Math.floor(d.context.toString().length/limitContextL)+1; j++){
			textBlock
		.append("tspan")
		.attr("x",padding+maxLabelLength+maxContextLength/2+10)
		.attr("y",d.y+infobox_lineH*j)
		.text(d.context.toString().substring(limitContextL*j,limitContextL*(j+1)-1));	
		}
	})

	// draw the boundary
	infobox.append("rect")
		.attr("width",boxWidth)
		.attr("height",boxHeight)
		.attr("rx",roundD)
		.attr("ry",roundD)
		.attr("class","background");

	//draw the pointer
	infobox.append("polygon")
		.attr("points",function(d){
			var labelRect = d3.select("rect.label").node();
			//		var x = labelRect.x.baseVal.value;
			//		var y = labelRect.y.baseVal.value;
			//	var c = [
			//		[x,y],
			//		[x-30,y],
			//		[x,y+25]];
			var x = boxWidth;
			var y = captionH;
			var c = [
			[x,y],
			[x+infobox_p_width,y],
			[x,y+infobox_p_height]
			];

		return c[0][0]+","+c[0][1]+" "+c[1][0]+","+c[1][1]+" "+c[2][0]+","+c[2][1];
		})
	return infobox;

}
