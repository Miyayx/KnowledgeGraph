var radius = 960/ 2;

	var tree = d3.layout.tree()
.size([360, radius - 120])
	.separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

var diagonal = d3.svg.diagonal.radial()
	.projection(function(d) { return [d.y,d.x / 180 * Math.PI]; });

	function project(d) {
	  var r = d.y, a = (d.x - 90) / 180 * Math.PI;
	  return [r * Math.cos(a), r * Math.sin(a)];
	}
	
	function step(d) {
	  var s = project(d.source),
	      m = project({x: d.target.x, y: d.source.y}),
	      t = project(d.target),
	      r = d.source.y,
	      sweep = d.target.x > d.source.x ? 1 : 0;
	  return (
	    "M" + s[0] + "," + s[1] +
	    "A" + r + "," + r + " 0 0," + sweep + " " + m[0] + "," + m[1] +
	    "L" + t[0] + "," + t[1]);
	}
	
	var vis = d3.select("#chart").append("svg")
	.attr("width", radius * 2)
	.attr("height", radius * 2 - 150)
	.append("g")
	.attr("transform", "translate(" + radius + "," + radius + ")");

	d3.json("../flare.json", function(json) {
			var nodes = tree.nodes(json);

			var link = vis.selectAll("path.link")
			.data(tree.links(nodes))
			.enter().append("path")
			.attr("class", "link")
			.attr("d", step);

			var node = vis.selectAll("g.node")
			.data(nodes)
			.enter().append("g")
			.attr("class", "node")
			.attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })

			node.append("circle")
			.attr("r", 10);

			node.append("image")
			.attr("xlink:href", "https://github.com/favicon.ico")
			.attr("x", -8)
			.attr("y", -8)
			.attr("width", 30)
			.attr("height", 30);

			node.append("text")
				.attr("dx", function(d) { return d.x < 180 ? 8 : -8; })
				.attr("dy", ".31em")
				.attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
				.attr("transform", function(d) { return d.x < 180 ? null : "rotate(180)"; })
				.text(function(d) { return d.name; });
	});
