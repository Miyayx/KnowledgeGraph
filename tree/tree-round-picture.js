var radius = 960/ 2;

var vis = d3.select("#chart").append("svg")
.attr("width", radius * 2)
.attr("height", radius * 2 - 150)
.append("g")
.attr("transform", "translate(" + radius + "," + radius + ")");

var image;

var defs = vis.append("svg:defs");
defs.append("svg:clipPath")
.attr("id", "imageCircle")
.append("svg:circle")
.attr("x",-8)
.attr("y",-8)
.attr("r", 50);

vis.append("image")
.attr("xlink:href","../picture/43.jpeg")		
.attr("clip-path", "url(#imageCircle)")
.attr("x", -50)
.attr("y", -50)
.attr("width",function(d){
var width;
		image = new Image();
//image.src = "../picture/43.jpeg";
//image.onload=function(){
//width = image.width;
//}
image.src = this.getAttributeNS('xlink:href');
		return image.width;		} )
.attr("height", function(d){
		return image.height;
		})


vis.append("g")
.append("circle")
.attr("r", 50)
.attr("stroke","rgba(128,0,128,0.75)")
.attr("fill","rgba(128,0,128,0.5)")
.attr("stroke-width",5);


