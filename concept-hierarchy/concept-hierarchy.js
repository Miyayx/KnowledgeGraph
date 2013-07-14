var diameter = 960;

var w = 700,
h = 700,
i = 0,
duration = 500,
root;

var treeWidth = w - 50;

var rectParam = {
	"rx": 5,
	"ry": 8,
	"offsetx": 20,
	"offsety": 10
}

var convertJson = function(json, issuper) {
	var children = new Array();
	if (issuper) {
		json.forEach(function(item) {
			var newItem = new Object();
			newItem.level = "super";
			newItem.name = item.name;
			if (item.super) {
				newItem.children = convertJson(item.super, issuper);
			}
			children.push(newItem);
		});
	} else {
		json.forEach(function(item) {
			var newItem = new Object();
			newItem.level = "sub";
			newItem.name = item.name;
			if (item.sub) {
				newItem.children = convertJson(item.sub, issuper);
			}
			children.push(newItem);
		});
	}
	return children;
};

var tree = d3.layout.tree().sort(null).size([treeWidth, h / 2 - 50]).children(function(d) {
	return d.children;
	//return d.children ? d.children : d.super? d.super : d.sub;
	//return  d.super? d.super : d.sub;
}).separation(function(a, b) {
	return (b.name.length + 5);
});

var svg = d3.select("#concept-chart").append("svg:svg").attr("width", w).attr("height", h).append("svg:g").attr("transform", "translate(" + 0 + "," + h / 2 + ")");
var diagonal = d3.svg.diagonal().source(function(d) {
	if (d.source.level == "center") {
		return d.target.level == "sub" ? {
			x: w / 2,
			y: d.source.y + d.source.textHeight + rectParam.offsety / 2
		}: {
			x: w / 2 + rectParam.offsetx / 2,
			y: rectParam.offsety / 2
		};
	}
	else if (d.target.level == "sub") return {
		x: d.source.x + d.source.textWidth / 2,
		y: (d.source.y + d.source.textHeight + rectParam.offsety / 2)
	};
	else return {
		x: d.source.x,
		y: d.source.y
	}
}).projection(function(d) {
	if (d.level == "center") {
		return d.children[0].level == "super" ? [d.x + d.textWidth / 2, d.y] : [d.x + d.textWidth / 2, d.y + d.textHeight + rectParam.offsety / 2];
	}
	if (d.level == "super") {
		//if (d.textWidth && d.textHeight) return d.id % 2 == 1 ? [d.x + d.textWidth / 2 - rectParam.offsetx / 2, (d.y + 1 * d.textHeight - rectParam.offsety / 2)] : [d.x + d.textWidth / 2 - rectParam.offsetx / 2, (d.y - 3 * d.textHeight - rectParam.offsety / 2)];
		//else 
		return [d.x + d.textWidth / 2 - rectParam.offsetx / 2, d.y - d.textHeight - rectParam.offsety / 2];
	} else {
		if (d.textWidth && d.textHeight) return [d.x + d.textWidth / 2, d.y - d.textHeight / 2 + rectParam.offsety / 2];
		else return [d.x, d.y];
	}
});

var lineFun = d3.svg.line.radial().radius(function(d) {
	return d.y;
}).angle(function(d) {
	return d.x / 180 * Math.PI;
});

d3.json("concept.json", function(json) {
	json.x = w / 2;
	json.y = h / 2;

	var newjson = new Object();
	newjson.level = "center";
	newjson.name = json.name;

	newjson.children = new Array();
	newjson.children = convertJson(json.super, true);
	update(newjson, true);

	newjson.children = new Array();
	newjson.children = convertJson(json.sub, false);
	update(newjson, false);
	//update(newjson);
});

function update(source, issuper) {

	var nodes = tree.nodes(source);
	var links = tree.links(nodes);

	//Update the nodes
	var nodeGroup = svg.selectAll("g.none").data(nodes).enter().append("svg:g").attr("class", function(d) {
		return "node"
	});

	nodeGroup.append("svg:rect").attr("rx", rectParam.rx).attr("ry", rectParam.ry).attr("class", function(d) {
		return d.level == "center" ? "center-node": (d.level == "super" ? "super-node": "sub-node");
	});

	var textGroup = nodeGroup.append("text").attr("text-anchor", function(d) {}).attr("dy", ".80em").text(function(d) {
		return d.name;
	});

	nodeGroup.each(function(d, i) {
		d.textWidth = d3.select(this).select("text").node().getBBox().width;
		d.textHeight = d3.select(this).select("text").node().getBBox().height;
		if (!d.id) {
			d.id = i;
		}

		if (d.id % 2 == 1) {
			d.y = d.y - 2 * d.textHeight;
		}
	});

	nodeGroup.attr("transform", function(d) {
		if (d.level == "center") return "translate(" + (treeWidth / 2) + ",0)";
		if (d.level == "super") return "translate(" + (d.x) + "," + ( - d.y) + ") rotate(0) ";
		return "translate(" + d.x + "," + d.y + ")";
	});

	nodeGroup.selectAll("rect").attr("width", function(d) {
		return d.textWidth + rectParam.offsetx;
	}).attr("height", function(d) {
		return d.textHeight + rectParam.offsety;
	}).attr("transform", function(d) {
		return "translate(" + ( - rectParam.offsetx / 2) + "," + ( - rectParam.offsety / 2) + ")";
	});

	var linkGroup = svg.selectAll("path.link").data(links).enter().append("path").attr("class", function(d) {
		return d.target.level == "super" ? "super-link": "sub-link"
	}).attr("d", diagonal);

	linkGroup.attr("transform", function(d) {
		if (d.target.level == "super") return "rotate(180) translate(" + ( - w / 2 - d.source.x - d.source.textWidth / 2) + ")"
	});

};

