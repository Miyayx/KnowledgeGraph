var diameter = 960;

var w = 600,
h = 500,
i = 0,
duration = 500,
root;

var rectParam = {
	"rx": 5,
	"ry": 8,
	"offsetx": 20,
	"offsety": 10
}

var tree = d3.layout.tree().sort(null).size([w-50, h / 2 - 50]).children(function(d) {
	return d.children;
}).separation(function(a, b) {
	return (b.name.length + 5);
});

var svg = d3.select("#concept-chart").append("svg:svg").attr("width", w).attr("height", h).append("svg:g").attr("transform", "translate(" + 0 + "," + h / 2 + ")");
var diagonal = d3.svg.diagonal().projection(function(d) {
	if (d.level == "center") {
		return d.children[0].level == "super" ? [d.x + d.textWidth / 2, d.y] : [d.x + d.textWidth / 2, d.y + d.textHeight];
	}
	if (d.level == "super") {
		if (d.textWidth && d.textHeight) return [d.x + d.textWidth/2-rectParam.offsetx/2, (d.y - d.textHeight - rectParam.offsety / 2)];
		else return [d.x,d.y];
	} else {
		if (d.textWidth && d.textHeight) return [d.x + d.textWidth / 2, d.y - d.textHeight / 2 + rectParam.offsety / 2];
		else return [d.x, d.y];
	}
});

d3.json("concept.json", function(json) {
	json.x = w / 2;
	json.y = h / 2;

	var newjson = new Object();
	newjson.level = "center";
	newjson.name = json.name;

	newjson.children = new Array();
	json.super.forEach(function(item) {
		item.level = "super";
		newjson.children.push(item);
	});
	update(newjson,true);

	newjson.children = new Array();
	json.sub.forEach(function(item) {
		item.level = "sub";
		newjson.children.push(item);
	});
	update(newjson,false);
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

	var textGroup = nodeGroup.append("text").attr("text-anchor", function(d) {
		//return d.super ? "end": "start";
	}).attr("dy", ".80em").text(function(d) {
		return d.name;
	});

	nodeGroup.each(function(d, i) {
		d.textWidth = d3.select(this).select("text").node().getBBox().width;
		d.textHeight = d3.select(this).select("text").node().getBBox().height;
	});

	nodeGroup.attr("transform", function(d) {
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

	//update the links
	var linkGroup = svg.selectAll("path.link").data(links).enter().append("path").attr("class", function(d) {
		return d.target.level == "super" ? "super-link": "sub-link"
	}).attr("d", diagonal);

	linkGroup.attr("transform", function(d) {
		if (d.target.level == "super") return "rotate(180) translate(" + ( - w / 2 - d.source.x - d.source.textWidth / 2 ) + ")"
	});

};

