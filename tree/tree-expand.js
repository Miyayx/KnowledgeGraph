function update(source) {
	var duration = d3.event && d3.event.altKey ? 5000 : 500;

	// Compute the new tree layout.
	var nodes = tree.nodes(currentRoot).reverse();

	// Update the nodes
	var node = vis.selectAll("g.node")
		.data(nodes);

	// Enter any new nodes at the parent's previous position.
	var nodeEnter = node.enter().append("svg:g")
		.attr("class", "node")
		.attr("transform", function(d) { return "rotate(" + (source.x0+180) + ")translate(" + source.y0 + ")"; });

	//calculate radius for every node and assign it to d.r
	nodeEnter.each(function(d,i){
		if(d.r) return;
		if(d.name == undefined) { d.r = 0; }
		else if (d.depth == 0) { d.r = 65; }
		else { d.r = 70/d.depth; }
	});

	//choose color for every node and assign it to d.color
	nodeEnter.each(function(d,i){
		if(d.depth == 0) d.color = "silver";
		else if (d.category != undefined) 
		d.color = d.color?d.color:colors[colorIndex++];
		else
		d.color = d.color?d.color:colors[colorIndex];
	});

	//define clip-path so that the round image can be cut out
	var defs = nodeEnter.append("svg:defs");
	defs.append("svg:clipPath")
		.attr("id", function(d,i){	
			d.clip_normal = "image-circle1"+i;
			return d.clip_normal;	})
		.append("svg:circle")
		.attr("x",function(d){return (-1)*d.r;})
		.attr("y",function(d){return (-1)*d.r;})
		.attr("r", function(d){return d.r});

	defs.append("svg:clipPath")
		.attr("id", function(d,i){
			d.clip_large = "image-circle2"+i;
			return d.clip_large;	})
		.append("svg:circle")
		.attr("x",function(d){return (-1)*d.r*1.2;})
		.attr("y",function(d){return (-1)*d.r*1.2;})
		.attr("r", function(d){return d.r*1.2});

	// append images
	nodeEnter.append("image")
		.attr("xlink:href",function(d){return d.imageurl})		
		.attr("clip-path",function(d,i){ return "url(#"+d.clip_normal+")";})
		.attr("x", function(d){return (-1)*d.r;})
		.attr("y", function(d){return (-1)*d.r;})
		.attr("visibility","hidden")	
		.attr("onload",function(d){
			var svgImage = this;
			var image = new Image();
			image.src = d.imageurl;
			image.onload = function(){
				// to get real image height and width and calculate suitable height and width for showing image
				var c = d.r*2;
				if(image.width > image.height){
					svgImage.height.baseVal.value = c;
					svgImage.width.baseVal.value = image.width*c/image.height
				}else{
					svgImage.height.baseVal.value = image.height*c/image.width;
					svgImage.width.baseVal.value = c;
				}}})
	.attr("transform", function(d) { return "rotate("+(-d.x+180)+")"; });

	var allCircle =	nodeEnter.append("circle")
		.attr("class","imageBorder")
		.attr("r", function(d){return d.r})
		.attr("stroke",function(d){return d.color;})
		.attr("stroke-opacity","1e-6")
		.attr("stroke-width",3)
		//.attr("fill",function(d){ return d.color; })
		.attr("fill","white")
		.attr("fill-opacity",0)
		.style("cursor", "pointer")
		.each(function(d,i){

		})
	.on('mouseover',function(d){
		//	allCircle.attr("fill-opacity",0.5);

		//magnify the circle
		var circle =  d3.select(this);
		circle.transition()
		.duration(50)
		.attr("r",function(d){ return d.r*1.2; })
		.attr("fill-opacity",0);

	//magnify the image 
	d3.select(this.parentNode).select('image')
		.attr("clip-path",function(d,i){ return "url(#"+d.clip_large+")";})
		.attr("x",function(d){ return (-1)*d.r*1.2;})
		.attr("y",function(d){ return (-1)*d.r*1.2;})
		.attr("width",function(d){
			return this.width.baseVal.value*1.2;	})
		.attr("height",function(d){
			return this.height.baseVal.value*1.2;	});

	// if there is infomation, draw infobox
	//	if(d.infobox == undefined)	return;
	//	renderInfobox(d3.select(this.parentNode),d);

	})
	.on('mouseout',function(d){
		//recover the state 
		allCircle.attr("fill-opacity",0);
		var circle =  d3.select(this);
		circle.transition()
		.duration(50)
		.attr("r",function(d){ return d.r;});	
	d3.select(this.parentNode).select('image')
		.attr("clip-path",function(d,i){ return "url(#"+d.clip_normal+")";})
		.attr("x",function(d){ return (-1)*d.r;})
		.attr("y",function(d){ return (-1)*d.r;})
		.attr("width",function(d){return Math.floor(this.width.baseVal.value/1.2);})
		.attr("height",function(d){return Math.floor(this.height.baseVal.value/1.2);});

	// remove infobox
	//	d3.select(this.parentNode).select('g').remove();
	})
	.on("click",function(d){
		toggle(d);// in tree-expand.js
		update(d);// in tree-expand.js
	});

	//write label
	node.append("text")
		.attr("dx", function(d) { 
			return (d.x > 90)&&(d.x < 270) ? d.r : (-1)*d.r; 
		})
	.attr("dy", ".31em")
		.attr("text-anchor", function(d) { return (d.x > 90)&&(d.x < 270) ? "start" : "end"; })
		.attr("transform", function(d) {
			return (d.x > 90)&&(d.x < 270) ? null : "rotate(180)"; })
		.attr("stroke-width",1)
		.attr("fill-opacity","1e-6")
		.attr("fill",function(d){ return d.color;})
		.text(function(d) { return d.name; });

	//--------------------------------- Update Trasition -------------------------------------//
	// Transition nodes to their new position.
	var nodeUpdate = node.transition()
		.duration(duration)
		.attr("transform", function(d) {return "rotate(" + (d.x+180) + ")translate(" + d.y + ")"; });

	nodeUpdate.select("image")
		.attr("visibility", "visible")

		nodeUpdate.select("text")
		.style("fill-opacity", 1);

	nodeUpdate.select("circle.imageBorder")
		.attr("stroke-opacity",0.5);

	// Transition exiting nodes to the parent's new position.
	var nodeExit = node.exit().transition()
		.duration(duration)
		.attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
		.remove();

	nodeExit.select("circle.imageBorder")
		.attr("stroke-opacity",1e-6)
		.attr("r", 1e-6);

	nodeExit.select("text")
		.style("fill-opacity", 1e-6);

	//-------------------------- Update the links ------------------------------//
	var link = vis.selectAll("path.link")
		.data(tree.links(nodes));

	// Enter any new links at the parent's previous position.
	link.enter().insert("svg:path", "g")
		.attr("class", "link")
		.attr("transform", function(d) { return "rotate("+(-90)+")"; })
		.transition()
		.duration(duration)
		.attr("d",diagonal);

	// Transition links to their new position.
	link
		.attr("transform", function(d) { return "rotate("+(-90)+")"; })
		.transition()
		.duration(duration)
		.attr("d", diagonal);

	// Transition exiting nodes to the parent's new position.
	link.exit().transition()
		.duration(duration)
		.attr("d", function(d) {
			var o = {x: centerX, y: centerY};
			return diagonal({source: o, target: o});
		})
		.remove();

	// Stash the old positions for transition.
	nodes.forEach(function(d) {
		d.x0 = d.x;
		d.y0 = d.y;
	});
}

// Toggle children.
function toggle(d) {
	if(d === currentRoot){	
		if(d.prev){
			currentRoot = d.prev;
		}
	}
	else{	d.prev = currentRoot; currentRoot = d;	}
}
