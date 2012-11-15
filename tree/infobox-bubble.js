var myCvs;
var captionH = 30;
var limitContextL = 16;

function getTextLength(string){
	var text =  myCvs.append("text").text(string);
	var l = text.node().getBBox().width;
	text.remove();
	return l;
}

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
}

function calculateiBoxHeight(data){

	var linenum = 0;
	for(i=0;i<data.length;i++){
		linenum = linenum+Math.floor(data[i].context.toString().length/limitContextL)+1;
	}
	return lineH*linenum+captionH;
}

var lineH = 20;

function createInfobox(canvas,data){
	myCvs = canvas;
	var maxLabelString,maxContextString,
	    maxLabelLength,maxContextLength;

	var ibHeight = calculateiBoxHeight(data);

	maxLabelString = getMaxLabelString(data);
	maxContextString = getMaxContextString(data);

	maxLabelLength = getTextLength(maxLabelString);
	maxContextLength = getTextLength(maxContextString);

	var roundD = 15;
	var margin = 7;
	var boxWidth = margin+maxLabelLength+maxContextLength+margin+10;
	var boxHeight = margin+ibHeight+margin;

	calculateTextH = function(d,i){
		var myH = currentH;
		currentH = currentH+(Math.floor(d.context.toString().length/limitContextL)+1)*lineH;
		return myH+lineH/2;
	}

	infobox = canvas.append("g")
		.attr("class","infobox")
		.attr("width",boxWidth)
		.attr("height",boxHeight);

	infobox.append("svg:defs")
		.append("svg:clipPath")
		.attr("id", "infobox-clip")
		.append("rect")
		.attr("rx",roundD)
		.attr("ry",roundD)
		.attr("width",boxWidth)
		.attr("height",boxHeight);

	infobox.append("rect")
		.attr("class","label")
		.attr("y",captionH)
		.attr("clip-path","url(#infobox-clip)")
		//.attr("fill","blue")
		.attr("width",margin+maxLabelLength+5)
		.attr("height",boxHeight-captionH);

	infobox.append("rect")
		.attr("class","context")
		.attr("x",margin+maxLabelLength+maxContextLength/2+5)
		.attr("y",captionH)
		.attr("clip-path","url(#infobox-clip)")
		//.attr("fill","white")
		.attr("width",5+maxContextLength+margin)
		.attr("height",boxHeight-captionH);

	infobox.append("text")
		.attr("dx",boxWidth/2)
		.attr("dy",captionH/2+margin)
		//	.attr("transform")
		.attr("text-anchor","middle")
		.attr("font-weight","bold")
		.text("Infobox");

	var currentH = margin+captionH;
	infobox.selectAll("text.label")
		.data(data)
		.enter()
		.append("text")
		.attr("x",margin+maxLabelLength/2)
		.attr("y",calculateTextH)
		.attr("width",maxLabelLength)
		.attr("height",lineH)
		.text(function(d){ return d.label });

	var currentH = margin+captionH;
	infobox.selectAll("text.context")
		.data(data)
		.enter()
		.append("text")
		.attr("x",margin+maxLabelLength+maxContextLength/2+10)
		.attr("y",function(d,i){
			d.y = calculateTextH(d,i);
			return d.y;	})
		.attr("width",maxContextLength)
		.attr("height",function(d){
			return  (Math.floor(d.context.toString().length/limitContextL)+1)*lineH;
		})
	//	.text(function(d){return d.context});
	.each(function(d,i){
		var textBlock = d3.select(this);
		for(j = 0; j < Math.floor(d.context.toString().length/limitContextL)+1; j++){
			textBlock
		.append("tspan")
		.attr("x",margin+maxLabelLength+maxContextLength/2+10)
		.attr("y",d.y+lineH*j)
		.text(d.context.toString().substring(limitContextL*j,limitContextL*(j+1)-1));	
		}
	})

	infobox.append("rect")
		.attr("width",boxWidth)
		.attr("height",boxHeight)
		.attr("rx",roundD)
		.attr("ry",roundD)
		.attr("class","background");

	infobox.append("polygon")
		.attr("point",function(d){
			var c = [];
			var labelRect = d3.select("rect.label").node();
			var x = labelRect.x.baseVal.value;
			var y = labelRect.y.baseVal.value;
			c[0].x = x;
			c[0].y = y;
			c[1].x = x - 10;
			c[1].y = y;
			c[2].x = x;
			c[2].y = y+20;

			return c[0].x+","+c[0].y+" "+c[1].x+","+c[1].y+" "+c[2].x+","+c[2].y;
		})
	return infobox;

}
