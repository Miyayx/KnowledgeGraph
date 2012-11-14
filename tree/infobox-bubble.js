var myCvs;

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
	return maxs.length>16 ? "aaaaaaaaaaaaaaaa" : maxs;
}

function calculateiBoxHeight(data){

	var linenum = 0;
	for(i=0;i<data.length;i++){
		linenum = linenum+Math.floor(data.length/16)+1;
	}
	return lineH*linenum;
}

var lineH = 15;

function createInfobox(canvas,data){
	myCvs = canvas;
	var maxLabelString,maxContextString,
	    maxLabelLength,maxContextLength;

	var ibHeight = calculateiBoxHeight(data);

	maxLabelString = getMaxLabelString(data);
	maxContextString = getMaxContextString(data);

	maxLabelLength = getTextLength(maxLabelString);
	maxContextLength = getTextLength(maxContextString);

	infobox = canvas.append("g")
		//	.attr("class","infobox")
		.attr("width",maxLabelLength+maxContextLength+10)
		.attr("height",ibHeight+10)
		.attr("x",0)
		.attr("y",0)
		.attr("fill","red");

	infobox.append("rect")
		.attr("x",0)
		.attr("y",0)
		.attr("width",maxLabelLength+maxContextLength+10)
		.attr("height",lineH)
		.attr("fill","blue")
			.text("Infobox");

		var currentH = 0;
	infobox.selectAll("rect")
		.data(data)
		.enter()
		.append("rect")
		.attr("x",0)
		.attr("y",function(d,i){
			var myH = currentH;
			currentH = currentH+(Math.floor(d.context.length/16)+1)*lineH;
			return myH;	})
		.attr("width",maxLabelLength)
		.attr("height",lineH)
		.text(function(d){return d.label});

	infobox.selectAll("rect")
		.data(data)
		.enter()
		.append("rect")
		.attr("x",0)
		.attr("y",function(d,i){
			var myH = currentH;
			currentH = currentH+(Math.floor(d.context.length/16)+1)*lineH;
			return myH;	})
		.attr("width",maxContextLength)
		.attr("height",10)
		.text(function(d){return d.context});

	return infobox;

}
