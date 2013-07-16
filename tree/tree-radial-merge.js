var dataStack = new Array();
var currentRoot;
var diameter = 960, radius = diameter / 2;
var centerX = radius,
centerY = 0;

var colors = ["skyblue", "blue", "purple", "mediumpurple", "deeppink", "red", "darkorange", "green"];

var tree = d3.layout.tree().size([360, radius - 150]).separation(function(a, b) {
	return (a.parent == b.parent ? 1: 2) / a.depth;
}).children(function(d) { // decide where to create a new node
	if (d.categories != undefined) return d.categories;
	else if (d.children != undefined) return d.children;
	else if (d.undirected != undefined) return d.undirected;
	else return null;
});

// form of lines
var diagonal = d3.svg.diagonal.radial().projection(function(d) {
	return [d.y, d.x / 180 * Math.PI];
});

//	function project(d) {
//		var r = d.y, a = (d.x - 90) / 180 * Math.PI;
//		return [r * Math.cos(a), r * Math.sin(a)];
//	}
var vis = d3.select("#chart").append("svg").attr("width",diameter).attr("height", diameter).append("g").attr("transform", "translate(" + radius + "," + radius + ")")
vis.append("svg:defs").append("svg:clipPath").attr("id", "background-clip").append("svg:circle").attr("x", - radius).attr("y", - radius).attr("r", radius);

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
d3.json("../data-infobox4.json", function(json) {
	currentRoot = json;

	update(currentRoot);
});

