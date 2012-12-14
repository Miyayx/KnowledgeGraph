function update(source) {
	var duration = d3.event && d3.event.altKey ? 5000 : 500;

	// Compute the new tree layout.
	var nodes = tree.nodes(root).reverse();

	// Normalize for fixed-depth.
	nodes.forEach(function(d) { d.y = d.depth * 180; });

	// Update the nodes
	var node = vis.selectAll("g.node")
		.data(nodes, function(d) { return d.id || (d.id = ++i); });

	// Enter any new nodes at the parent's previous position.
	var nodeEnter = node.enter().append("svg:g")
		.attr("class", "node")
		.attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
		.on("click", function(d) { toggle(d); update(d); });

	nodeEnter.append("svg:circle")
		.attr("r", 1e-6)
		.style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

	nodeEnter.append("svg:text")
		.attr("x", function(d) { return d.children || d._children ? -10 : 10; })
		.attr("dy", ".35em")
		.attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
		.text(function(d) { return d.name; })
		.style("fill-opacity", 1e-6);

	// Transition nodes to their new position.
	var nodeUpdate = node.transition()
		.duration(duration)
		.attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

	nodeUpdate.select("circle")
		.attr("r", 4.5)
		.style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

	nodeUpdate.select("text")
		.style("fill-opacity", 1);

	// Transition exiting nodes to the parent's new position.
	var nodeExit = node.exit().transition()
		.duration(duration)
		.attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
		.remove();

	nodeExit.select("circle")
		.attr("r", 1e-6);

	nodeExit.select("text")
		.style("fill-opacity", 1e-6);

	// Update the links
	var link = vis.selectAll("path.link")
		.data(tree.links(nodes), function(d) { return d.target.id; });

	// Enter any new links at the parent's previous position.
	link.enter().insert("svg:path", "g")
		.attr("class", "link")
		.attr("d", function(d) {
			var o = {x: source.x0, y: source.y0};
			return diagonal({source: o, target: o});
		})
	.transition()
		.duration(duration)
		.attr("d", diagonal);

	// Transition links to their new position.
	link.transition()
		.duration(duration)
		.attr("d", diagonal);

	// Transition exiting nodes to the parent's new position.
	link.exit().transition()
		.duration(duration)
		.attr("d", function(d) {
			var o = {x: source.x, y: source.y};
			return diagonal({source: o, target: o});
		})
	.remove();

	// Stash the old positions for transition.
	nodes.forEach(function(d) {
		d.x0 = d.x;
		d.y0 = d.y;
	});

	var relationship = vis.selectAll("g.relationship")
		.data(tree.links(nodes));

	var relationEnter = relationship.enter().append("svg:g")
		.attr("class","relationship")

	var pathDefs = relationship.append("svg:defs");
	pathDefs.append("svg:path")
		.attr("id", function(d,i){	
			d.relationpath = "relationpath"+d.target.id;
			return d.relationpath;	})
	//	.attr("transform",function(d){ return "translate("+d.target.y+","+d.target.x+")";})
		.attr("d",diagonal);

	relationEnter.append("text")
		.attr("text-anchor","end")
		.attr("dy", ".31em")
		.attr("stroke-width",1)
		.style("font-size", "12px")
		.attr("fill","red")
	//	.attr("fill-opacity","1e-6")
		.append("textPath")
		.attr("xlink:href", function(d){ return "#"+d.relationpath; })
		.attr("startOffset","100%")
		.text( function(d){ return d.target.name; })

	relationship.selectAll("text")
		.transition()
		.duration(duration)
		.attr("fill-opacity","1");

	relationship.exit().selectAll("text")
		.transition()
		.duration(duration)
		.attr("fill-opacity","1e-6");
	relationship.exit().remove();
}

// Toggle children.
function toggle(d) {
	// if (d.children) {
	//   d._children = d.children;
	//   d.children = null;
	// } else {
	//   d.children = d._children;
	//   d._children = null;
	// }
	if(d === root){	root = primary;}
	else{
		primary = root; 
		root = d;
	}
}
