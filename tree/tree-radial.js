var radius = 960/ 2;
//var radius = $(window).width()/2;
var colors = ["rgba(255,0,255,1)",
    "rgba(0,255,0,1)",
    "rgba(255,255,0,1)",
    "rgba(0,0,255,1)",
    "rgba(128,0,128,1)"];

var colorIndex = 0;

	var tree = d3.layout.tree()
.size([360, radius - 120])
	.separation(function(a, b) { 
		return (a.parent == b.parent ? 1 : 2) / a.depth; 
	})
.children(function(d){
	if(d.categories != undefined)
	return d.categories;
	else if(d.children != undefined)
	return d.children;
	else if(d.undirected != undefined)
	return d.undirected;
	else return null;
});

var diagonal = d3.svg.diagonal.radial()
	.projection(function(d) { return [d.y,d.x / 180 * Math.PI]; });

	function project(d) {
		var r = d.y, a = (d.x - 90) / 180 * Math.PI;
		return [r * Math.cos(a), r * Math.sin(a)];
	}

//function step(d) {
//	var s = project(d.source),
//	    m = project({x: d.target.x, y: d.source.y}),
//	    t = project(d.target),
//	    r = d.source.y,
//	    sweep = d.target.x > d.source.x ? 1 : 0;
//	return (
//			"M" + s[0] + "," + s[1] +
//			"A" + r + "," + r + " 0 0," + sweep + " " + m[0] + "," + m[1] +
//			"L" + t[0] + "," + t[1]);
//}

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

d3.json("../datatest.json", function(json) {
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


	var link = vis.selectAll("path.link")
		.data(tree.links(nodes))
		.enter().append("path")
		.attr("class", "link")
		.attr("d",diagonal);

	var node = vis.selectAll("g.node")
		.data(nodes)
		.enter().append("g")
		.attr("transform", function(d) { return "rotate(" + (d.x-90) + ")translate(" + d.y + ")"; });
	//
	//calculate radius for every node and assign it to d.r
	node.each(function(d,i){
		if(d.name == undefined)
		d.r = 0;
		else if (d.depth == 0)
		d.r = 65;
		else 
		d.r = 70/d.depth;
	});
	//
	//choose color for every node and assign it to d.color
	node.each(function(d,i){
		if(d.depth == 0) d.color = "rgba(139,137,137,0.5)";
		else if (d.category != undefined) 
		d.color = colors[colorIndex++];
		else
		d.color = colors[colorIndex];
	})
	var defs = node.append("svg:defs");
	defs.append("svg:clipPath")
		.attr("id", "imageCircle")
		.append("svg:circle")
		.attr("x",function(d){return (-1)*d.r;})
		.attr("y",function(d){return (-1)*d.r;})
		.attr("r", function(d){return d.r})

		defs.append("svg:clipPath")
		.attr("id", "imageCircle2")
		.append("svg:circle")
		.attr("x",function(d){return (-1)*d.r*1.2;})
		.attr("y",function(d){return (-1)*d.r*1.2;})
		.attr("r", function(d){return d.r*1.2})

		node.append("image")
		.attr("xlink:href",function(d){return d.imageurl})		
		.attr("clip-path", "url(#imageCircle)")
		.attr("x", function(d){return (-1)*d.r;})
		.attr("y", function(d){return (-1)*d.r;})
		.attr("onload",function(d){
			var svgImage = this;
			var image = new Image();
			image.src = d.imageurl;
			image.onload = function(){
				var c = d.r*2;
				if(image.width > image.height){
					svgImage.height.baseVal.value = c;
					svgImage.width.baseVal.value = image.width*c/image.height
				}else{
					svgImage.height.baseVal.value = image.height*c/image.width;
					svgImage.width.baseVal.value = c;
				}}})
	.attr("transform", function(d) { return "rotate("+(-d.x+90)+")"; });

	var allCircle =	node.append("circle")
		.attr("r", function(d){return d.r})
		.attr("stroke",function(d){return d.color;})
		.attr("stroke-opacity",0.5)
		.attr("stroke-width",5)
		//.attr("fill",function(d){ return d.color; })
		.attr("fill","white")
		.attr("fill-opacity",0)
		.style("cursor", "pointer")
		.html("https://www.google.com.hk")
		.on('mouseover',function(d){
			//	allCircle.attr("fill-opacity",0.5);

			var circle =  d3.select(this);
			circle.transition()
			.duration(50)
			.attr("r",function(d){ return d.r*1.2; })
			.attr("fill-opacity",0);

		d3.select(this.parentNode).select('image')
			.attr("clip-path", "url(#imageCircle2)")
			.attr("x",function(d){ return (-1)*d.r*1.2;})
			.attr("y",function(d){ return (-1)*d.r*1.2;})
			.attr("width",function(d){
				return this.width.baseVal.value*1.2; })
			.attr("height",function(d){return this.height.baseVal.value*1.2})
		})
	.on('mouseout',function(d){
		allCircle.attr("fill-opacity",0);
		var circle =  d3.select(this);
		circle.transition()
		.duration(50)
		.attr("r",function(d){ return d.r;});	
	d3.select(this.parentNode).select('image')
		.attr("clip-path", "url(#imageCircle)")
		.attr("x",function(d){ return (-1)*d.r;})
		.attr("y",function(d){ return (-1)*d.r;})
		.attr("width",function(d){return this.width.baseVal.value/1.2;})
		.attr("height",function(d){return this.height.baseVal.value/1.2});
	})
	.on("click",function(d)
			{
				//			var ibox = d3.select("#infobox").append("table")
				//			.attr("width", 100)
				//			.attr("height", radius * 2 + 150)
				//			.attr("transform", "translate(" + (($(window).width()/2)+radius) + "," + radius + ")");
			});

	node.append("text")
		.attr("dx", function(d) { 
			return d.x < 180 ? d.r : (-1)*d.r; 
		})
	.attr("dy", ".31em")
		.attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
		.attr("transform", function(d) { return d.x < 180 ? null : "rotate(180)"; })
		.attr("stroke-width",1)
		.attr("fill-opacity",1)
		.attr("fill",function(d){ return d.color;})
		.text(function(d) { return d.name; });
});
