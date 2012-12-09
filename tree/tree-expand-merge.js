idIndex = 0; // help increase id of g.node
defaultImage = "https://s3.amazonaws.com/kinlane-productions/api-evangelist/github/github-logo-transparent.png";

function update(source) {
	var duration = d3.event && d3.event.altKey ? 5000 : 500;

	//create infobox and render its color and position
	//infobox lib in infobox-bubble.js
	var renderInfobox = function(v,d){
		var infobox = createInfobox(v,d.infobox);
		infobox.selectAll("rect.label")
			.attr("fill",function(d){ return d.color; });

		infobox.selectAll("rect.context")
			.attr("fill","white");

		infobox.select("rect.background")
			.attr("stroke",function(d){return d.color;});

		infobox.select("polygon")
			.attr("fill",function(d){return d.color;})
			.attr("fill-opacity",0.5);

		//	infobox
		//		.attr("transform",function(d){
		//			return (d.x > 90)&&(d.x < 270) ? "matrix(1 0 0 1 "+(30+d.r*1.2)+" "+(-captionH)+")" : "matrix(1 0 0 -1 "+(30+d.r*1.2)+" "+captionH+")"; 
		//		});
		//	infobox
		//		.selectAll("text")
		//		.attr("transform", function(d) {
		//			return (d.x > 90)&&(d.x < 270) ? null : "rotate(180)" ;  });

		//	infobox
		//		.selectAll("tspan")
		//		.attr("transform", function(d) {
		//			return (d.x > 90)&&(d.x < 270) ? null : "rotate(180)"  });

		infobox.attr("transform",function(d){
			return (d.x > 90)&&(d.x < 270) ? 
			"translate("+(d.r*1.2+infobox_p_width)+","+(-1*captionH)+")" //x:magnifying circle's radius and infobox's pointer's width
			: "rotate(180) translate("
			+(-1*(d3.select("rect.background").node().width.baseVal.value+infobox_p_width+d.r*1.2))
			//x: infobox's width+infobox's pointer's width+magnifying circle's radius
			+","+(-1*captionH)+")";});

		infobox.select("polygon")
			.attr("transform",function(d){ //if the degree is between 90 and 270, reverse the triangle and adjust position 
				return	(d.x > 90)&&(d.x < 270) ? "matrix(-1 0 0 1 "+
				(d3.select("rect.background").node().width.baseVal.value)
				+" 0)":null; })
	}

	// Compute the new tree layout.
	var nodes = tree.nodes(source);

	// Update the nodes
	var node = vis.selectAll("g.node")
		.data(nodes,function(d) { return d.id || (d.id = ++idIndex); });  //judge if the node is a new one based on id

	// Enter any new nodes at the parent's previous position.
	var nodeEnter = node.enter().append("svg:g")
		.attr("class", "node")
		.attr("transform", function(d) { return "rotate(" + (d.x+180) + ")translate(" + d.y + ")"; });

	//calculate radius for every node and assign it to d.r
	node.each(function(d,i){
		if(d.r) return;
		if(d.name == undefined) { d.r = 0; }
		else if (d.depth == 0) { d.r = 65; }
		else { d.r = 70/d.depth; }
	});

	//choose color for every node and assign it to d.color
	var colorIndex = 0;
	node.each(function(d,i){
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

	//when moveover, the image should be magnified, so the clippath should be different.
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
		.attr("visibility","hidden")	
		.attr("onload",function(d){
			var svgImage = this;
			var image = new Image();
			image.src = d.imageurl?d.imageurl:defaultImage;
			image.onload = function(){
				// to get real image height and width and calculate suitable height and width for showing image
				var c = d.r*2;
				if(image.width > image.height){
					svgImage.height.baseVal.value = c;
					svgImage.width.baseVal.value = image.width*c/image.height
				}else{
					svgImage.height.baseVal.value = image.height*c/image.width;
					svgImage.width.baseVal.value = c;
				}
				svgImage.setAttribute("x",(-1)*svgImage.width.baseVal.value/2);
				svgImage.setAttribute("y",(-1)*svgImage.height.baseVal.value/2);
			};
			image.onerror = function(){
				image.src = defaultImage;
			};
		})
	.attr("transform", function(d) { return "rotate("+(-d.x+180)+")"; });

	// draw the circle boundary
	var allCircle =	nodeEnter.append("circle")
		.attr("class","imageBorder")
		.attr("stroke-opacity","1e-6")
		.attr("stroke-width",3)
		.attr("fill","white")
		.attr("fill-opacity",0)
		.style("cursor", "pointer")
		.on('mouseover',function(d){
		//magnify the circle
		var circle =  d3.select(this);
		circle.transition()
			.duration(50)
			.attr("r",function(d){ return d.r*1.2; })
			.attr("fill-opacity",0);

		//magnify the image 
		d3.select(this.parentNode).select('image')
			.attr("clip-path",function(d,i){ return "url(#"+d.clip_large+")";})
			.attr("width",function(d){
				return this.width.baseVal.value*1.2;	})
			.attr("height",function(d){
				return this.height.baseVal.value*1.2;	})
			.attr("x",function(d){ return (-1)*this.width.baseVal.value/2;})
			.attr("y",function(d){ return (-1)*this.height.baseVal.value/2;});

		this.parentNode.parentNode.insertBefore(this.parentNode);// bring this node and its infobox to the front
		//	 if there is infomation, draw infobox
		if(d.infobox == undefined)	return;
		renderInfobox(d3.select(this.parentNode),d);

		})
	.on('mouseout',function(d){
		//recover the state 
	var circle =  d3.select(this);
	circle.transition()
		.duration(50)
		.attr("r",function(d){ return d.r;});	
	d3.select(this.parentNode).select('image')
		.attr("clip-path",function(d,i){ return "url(#"+d.clip_normal+")";})
		.attr("width",function(d){return Math.floor(this.width.baseVal.value/1.2);})
		.attr("height",function(d){return Math.floor(this.height.baseVal.value/1.2);})
		.attr("x",function(d){ return (-1)*this.width.baseVal.value/2;})
		.attr("y",function(d){ return (-1)*this.height.baseVal.value/2;});

	// remove infobox
	d3.select(this.parentNode).select('g').remove();
	})
	.on("click",function(d){
		if(d.depth === 0){ // if it's the root node,then turn back to the prev data
			data = dataStack.pop();
			if(data){
				currentRoot = data;
				update(currentRoot);
			}
		}else{
			d3.json("../data-infobox2.json", function(json) {
				dataStack.push(currentRoot);
				currentRoot = json;
				update(currentRoot);	
			});
		}
	});

	//write label
	nodeEnter.append("text")
		.attr("dx", function(d) { 
			return (d.x > 90)&&(d.x < 270) ? d.r+5 : (-1)*d.r-5; 
		})
	.attr("dy", ".31em")
		.attr("text-anchor", function(d) { return (d.x > 90)&&(d.x < 270) ? "start" : "end"; })
		.attr("transform", function(d) {
			return (d.x > 90)&&(d.x < 270) ? null : "rotate(180)"; })
		.attr("stroke-width",1)
		.attr("fill-opacity","1e-6")
		.text(function(d) { return d.name; });

	//------------------------------ Update Trasition ----------------------------------//
	// Transition all nodes to their new position.
	var nodeUpdate = node.transition()
		.duration(duration)
		.attr("transform", function(d) {return "rotate(" + (d.x+180) + ")translate(" + d.y + ")"; });

	nodeUpdate.select("image")
		.attr("clip-path",function(d,i){ return "url(#"+d.clip_normal+")";})
		.attr("visibility", "visible");

	nodeUpdate.select("text")
		.attr("fill",function(d){ return d.color;})
		.style("fill-opacity", 1);

	nodeUpdate.select("circle.imageBorder")
		.attr("r", function(d){return d.r})
		.attr("stroke",function(d){return d.color;})
		.attr("stroke-opacity",0.5);

	//------------------------------- Transition exiting nodes ----------------------------//
	var nodeExit = node.exit().transition()
		.duration(duration)
		.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
		.remove();

	nodeExit.select("image")
		.attr("visibility","hidden");

	nodeExit.select("circle.imageBorder")
		.attr("stroke-opacity",1e-6)
		.attr("r", 1e-6);

	nodeExit.select("text")
		.style("fill-opacity", 1e-6);

	//-------------------------- Update the links ------------------------------//
	var link = vis.selectAll("path.link")
		.data(tree.links(nodes));

	// Initialize new links to the center.
	link.enter().insert("svg:path", "g")
		.attr("class", "link")
		.attr("transform", function(d) { return "rotate("+(-90)+")"; })
		.transition()
		.duration(duration)
		.attr("d", function(d) {
			var o = {x: centerX, y: centerY};
			return diagonal({source: o, target: o});
		});

	// Transition links to their new position.
	link.attr("transform", function(d) { return "rotate("+(-90)+")"; })
		.transition()
		.duration(duration)
		.attr("d", diagonal);

	// Transition exiting nodes to the center.
	link.exit().transition()
		.duration(duration)
		.attr("d", function(d) {
			var o = {x: centerX, y: centerY};
			return diagonal({source: o, target: o});
		})
	.remove();

}

