var radius = 960/ 2;
//var radius = $(window).width()/2;
var colors = ["rgba(255,0,255,0.5)",
    "rgba(0,255,0,0.5)",
    "rgba(255,255,0,0.5)",
    "rgba(0,0,255,0.5)",
    "rgba(128,0,128,0.5)"];

var textColors = ["rgb(255,0,255)",
    "rgb(0,255,0)",
    "rgb(255,255,0)",
    "rgb(0,0,255)",
    "rgb(128,0,128)"
    ];

    var colorIndex = 0;

	var tree = d3.layout.tree()
.size([360, radius - 120])
	.separation(function(a, b) { 
			return (a.parent == b.parent ? 1 : 2) / a.depth; 
			})
.children(function(d){
		if(d.kinds != undefined)
		return d.kinds;
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

vis.append("image")
.attr("xlink:href","../picture/background.jpg")		
.attr("clip-path", "url(#background-clip)")
.attr("x",-radius)
.attr("y",-radius-75)
.attr("width", radius*2)
.attr("height", radius*2+150);

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
		else if (d.kind != undefined) return colors[colorIndex++];
		else return colors[colorIndex];
		};
		colorIndex = 0;
		var link = vis.selectAll("path.link")
		.data(tree.links(nodes))
		.enter().append("path")
		.attr("class", "link")
		//		.attr("stroke",function(d){
		//				if(d.depth == 0) return "rgb(128,0,128)";
		//				else if (d.kind != undefined) return textColors[colorIndex++];
		//				else return textColors[colorIndex];
		//				})
		//		.attr("fill","none")
		.attr("d",diagonal);

var node = vis.selectAll("g.node")
	.data(nodes)
	.enter().append("g")
	.attr("transform", function(d) { return "rotate(" + (d.x-90) + ")translate(" + d.y + ")"; });

var defs = node.append("svg:defs");
defs.append("svg:clipPath")
	.attr("id", "imageCircle")
	.append("svg:circle")
	.attr("x",function(d){return (-1)*calculateRadius(d);})
	.attr("y",function(d){return (-1)*calculateRadius(d);})
	.attr("r", calculateRadius);

node.append("image")
	.attr("xlink:href",function(d){return d.imageurl})		
	.attr("clip-path", "url(#imageCircle)")
	.attr("x", function(d){return (-1)*calculateRadius(d);})
	.attr("y", function(d){return (-1)*calculateRadius(d);})
	.attr("width", function(d){
			return 2*calculateRadius(d);

			})
.attr("height", function(d){
		return 2*calculateRadius(d);
		})
.attr("onload",function(d){
		var svgImage = this;
		var image = new Image();
		image.src = d.imageurl;
		image.onload = function(){
		var c = calculateRadius(d)*2;
		if(image.width > image.height){
		svgImage.height.baseVal.value = c;
		svgImage.width.baseVal.value = image.width*c/image.height

		}else{

		svgImage.height.baseVal.value = image.height*c/image.width;
		svgImage.width.baseVal.value = c;
		}
		}
		})
.attr("transform", function(d) { return "rotate("+(-d.x+90)+")"; });

colorIndex = 0;
node.append("circle")
	.attr("r", calculateRadius)
	.attr("stroke",
			function(d){ 
			//	return getColor(d);

			if(d.depth == 0) return "rgba(139,137,137,0.5)";
			else if (d.kind != undefined) return colors[colorIndex++];
			else return colors[colorIndex];
			})
//	.attr("fill","rgba(128,0,128,0.2)")
.attr("fill","rgba(0,0,0,0)")
	.attr("stroke-width",4);

colorIndex = 0;
node.append("text")
	.attr("dx", function(d) { 
			return d.x < 180 ? calculateRadius(d) : (-1)*calculateRadius(d); 
			})
.attr("dy", ".31em")
	.attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
	.attr("transform", function(d) { return d.x < 180 ? null : "rotate(180)"; })

	.attr("stroke-width",1)
	//			.attr("stroke",function(d){
	//					return getColor(d);}
	//			     )
	.attr("fill",function(d){
			//return getColor(d);

			if(d.depth == 0) return "rgb(139,137,137)";
			else if (d.kind != undefined) return textColors[colorIndex++];
			else return textColors[colorIndex];
			})
.text(function(d) { return d.name; });
});
