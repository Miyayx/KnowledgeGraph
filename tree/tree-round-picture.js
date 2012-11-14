var radius = 960/ 2;

var vis = d3.select("#chart").append("svg")
.attr("width", radius * 2)
.attr("height", radius * 2 - 150)
.append("g")
.attr("transform", "translate(" + radius + "," + radius + ")");

var image;

var defs = vis.append("svg:defs");
var clipPath = defs.append("svg:clipPath")
.attr("id", "imageCircle")
.append("svg:circle")
.attr("x",-25)
.attr("y",-25)
.attr("r", 50);

defs.append("svg:clipPath")
.attr("id", "imageCircle2")
.append("svg:circle")
.attr("x",-25)
	.attr("y",-25)
	.transition()
.duration(500)
	.attr("r", 60)

	vis.append("image")
	.attr("xlink:href","../picture/43.jpeg")		
	.attr("clip-path", "url(#imageCircle)")
	.attr("x", -25)
	.attr("y", -25)	
	.attr("onload",function(d){
		var svgImage = this;
		var image = new Image();
		image.src = "../picture/43.jpeg";
		image.onload = function(){
			svgImage.height.baseVal.value = image.height;
			svgImage.width.baseVal.value = image.width;
		}})

var circle = vis.append("circle")
.attr("r", 50)
 .style("cursor", "pointer")
.attr("stroke","rgba(128,0,128,0.75)")
.attr("fill","rgba(0,0,0,0)")
.attr("stroke-width",5)
.on('mouseover',function(d){
	circle.transition()
	.duration(50)
	.attr("r",60);

vis.select('image')
	.attr("clip-path", "url(#imageCircle2)")
	.attr("width",function(d){
		return this.width.baseVal.value*1.2
	})
.attr("height",function(d){return this.height.baseVal.value*1.2});
})
.on('mouseout',function(d){
	circle.transition()
	.duration(50)
	.attr("r",50);

vis.select('image')
	.attr("clip-path", "url(#imageCircle)")
	.attr("width",function(d){return this.width.baseVal.value/1.2;})
	.attr("height",function(d){return this.height.baseVal.value/1.2});

})
.on('click',function(d){

});

