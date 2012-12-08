var radius = 960/ 2;
var currentRoot;
var centerX = radius, centerY = 0;

var colors=["skyblue","blue","purple","mediumpurple","deeppink",
    "red","darkorange","green"];

var colorIndex = 0;

	var tree = d3.layout.tree()
.size([360, radius - 120])
	.separation(function(a, b) { 
		return (a.parent == b.parent ? 1 : 2) / a.depth; 
	})
.children(function(d){ // decide where to create a new node
	if(d.categories != undefined)
	return d.categories;
	else if(d.children != undefined)
	return d.children;
	else if(d.undirected != undefined)
	return d.undirected;
	else return null;
});

// form of lines
var diagonal = d3.svg.diagonal.radial()
	.projection(function(d) { return [d.y,d.x / 180 * Math.PI]; });

	//	function project(d) {
	//		var r = d.y, a = (d.x - 90) / 180 * Math.PI;
	//		return [r * Math.cos(a), r * Math.sin(a)];
	//	}

	var vis = d3.select("#chart").append("svg")
	.attr("width", $(window).width())
	.attr("height", radius * 2 + 150)
	.append("g")
	.attr("transform", "translate(" + ($(window).width()/2) + "," + radius + ")")
	vis.append("svg:defs")
	.append("svg:clipPath")
	.attr("id", "background-clip")
	.append("svg:circle")
	.attr("x",-radius)
	.attr("y",-radius)
	.attr("r",radius);

	//vis.append("image")
	//.attr("xlink:href","../picture/background.jpg")		
	//.attr("clip-path", "url(#background-clip)")
	//.attr("x",-radius)
	//.attr("y",-radius-75)
	//.attr("width", radius*2)
	//.attr("height", radius*2+150);

	//vis.append("circle")
	//.attr("x",-radius)
	//.attr("y",-radius-75)
	//.attr("r", radius+75)
	//.attr("fill","black");

	d3.json("../data-infobox.json", function(json) {
		currentRoot = json;
		currentRoot.x0 = radius;
		currentRoot.y0 = 0;

		var nodes = tree.nodes(json);

		var calculateRadius = function(d){
			if(d.name == undefined)
		return 0;
			else if (d.depth == 0)
		return 65;
			else 
		return 70/d.depth;
		};

		var getColor = function(d){

			if(d.depth == 0) return "rgba(139,137,137,0.5)";
			else if (d.category != undefined) return colors[colorIndex++];
			else return colors[colorIndex];
		};

		//create infobox and render its color and position
		var renderInfobox = function(vis,d){
			var infobox = createInfobox(vis,d.infobox);
			infobox.selectAll("rect.label")
				.attr("fill",function(d){	return d.color;	});

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

		// draw links(lines)
		var link = vis.selectAll("path.link")
			.data(tree.links(nodes))
			.enter().append("path")
			.attr("class", "link")
			.attr("d",diagonal)
			.attr("transform", function(d) { return "rotate("+(-90)+")"; });

		// draw nodes block
		var node = vis.selectAll("g.node")
			.data(nodes)
			.enter().append("g")
			.attr("class","node")
			.attr("transform", function(d) { return "rotate(" + (d.x+180) + ")translate(" + d.y + ")"; });

		//calculate radius for every node and assign it to d.r
		node.each(function(d,i){
			if(d.r) return;
			if(d.name == undefined) { d.r = 0; }
			else if (d.depth == 0) { d.r = 65; }
			else { d.r = 70/d.depth; }
		});
		//
		//choose color for every node and assign it to d.color
		node.each(function(d,i){
			if(d.depth == 0) d.color = "silver";
			else if (d.category != undefined) 
			d.color = d.color?d.color:colors[colorIndex++];
			else
			d.color = d.color?d.color:colors[colorIndex];
		})

		//define clip-path so that the round image can be cut out
		var defs = node.append("svg:defs");
		defs.append("svg:clipPath")
			.attr("id", function(d,i){	d.clip_normal = "image-circle1"+i;
				return d.clip_normal;	})
			.append("svg:circle")
			.attr("x",function(d){return (-1)*d.r;})
			.attr("y",function(d){return (-1)*d.r;})
			.attr("r", function(d){return d.r})

			defs.append("svg:clipPath")
			.attr("id", function(d,i){	d.clip_large = "image-circle2"+i;
				return d.clip_large;	})
			.append("svg:circle")
			.attr("x",function(d){return (-1)*d.r*1.2;})
			.attr("y",function(d){return (-1)*d.r*1.2;})
			.attr("r", function(d){return d.r*1.2});

		// append images
		node.append("image")
			.attr("xlink:href",function(d){return d.imageurl})		
			.attr("clip-path",function(d,i){ return "url(#"+d.clip_normal+")";})
			.attr("x", function(d){return (-1)*d.r;})
			.attr("y", function(d){return (-1)*d.r;})
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

		var allCircle =	node.append("circle")
			.attr("r", function(d){return d.r})
			.attr("stroke",function(d){return d.color;})
			.attr("stroke-opacity",0.5)
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
		if(d.infobox == undefined)	return;
		renderInfobox(d3.select(this.parentNode),d);

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
		d3.select(this.parentNode).select('g').remove();
		})
		.on("click",function(d){
			toggle(d);// in tree-expand.js
			update(d);// in tree-expand.js
		});

		// Stash the old positions for transition.
		nodes.forEach(function(d) {
			d.x0 = d.x;
			d.y0 = d.y;
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
			.attr("fill-opacity",1)
			.attr("fill",function(d){ return d.color;})
			.text(function(d) { return d.name; });
	});
