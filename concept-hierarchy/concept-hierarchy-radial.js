var diameter = 960;

var w = 600,
h = 500,
i = 0,
root;

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

var tree = d3.layout.tree().sort(null).size([360, diameter / 2 - 120]).children(function(d) {
	return d.children ? d.children: d.super ? d.super: d.sub;
}).separation(function(a, b) {
	//return (b.name.length + 5);
	return 1;
});

var svg = d3.select("#concept-chart").append("svg:svg").attr("width", diameter).attr("height", diameter - 150).append("svg:g").attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

var diagonal = d3.svg.diagonal.radial().source(function(d, i) {
//	return d.source.name ? d.source.level == "center"? {x:480,y:0} :{
//		x: d.source.x,
//		y: d.source.y
//	}: {
//		x: 0,
//		y: 0
//	};
return d.source.level == "center" ? {x:480,y:0} : d.source;
}).target(function(d, i) {
	return {
		x: d.target.x,
		y: d.target.y
	};
}).projection(function(d, i) {
	//if (d.level == "center") {
	//	return d.children[0].level == "super" ? [d.x + d.textWidth / 2, d.y] : [d.x + d.textWidth / 2, d.y + d.textHeight];
	//}
	//if (d.level == "super") {
	//	if (d.textWidth && d.textHeight) return [d.x + d.textWidth / 2 - rectParam.offsetx / 2, (d.y - d.textHeight - rectParam.offsety / 2)];
	//	else return [d.x, d.y];
	//} else {
	//	if (d.textWidth && d.textHeight) return [d.x + d.textWidth / 2, d.y - d.textHeight / 2 + rectParam.offsety / 2];
	//	else return [d.x, d.y];
	//}
	//return [d.y ,d.x/180*Math.PI];
	return [d.y, d.x / 180 * Math.PI];
});

d3.json("concept2.json", function(json) {

	var newjson = new Object();
	newjson.level = "center";
	newjson.name = json.name;

	newjson.children = new Array();
	//newjson.children = convertJson(json.super, true).concat(convertJson(json.sub, false));
	//newjson.children = convertJson(json.super, true);
	//update(newjson, true);
	//newjson.children = new Array();
	//newjson.children = convertJson(json.sub, false);
	//update(newjson, false);
	//newjson.children.push(convertJson(json.children[0].super,true));
	//newjson.children.push(convertJson(json.children[1].sub,false));
	newjson.children[0] = new Object();
	newjson.children[1] = new Object();
	newjson.children[0].children = convertJson(json.children[0].super,true);
	newjson.children[1].children = convertJson(json.children[1].sub,false);
	update(newjson);
});

function update(source, issuper) {

	var nodes = tree.nodes(source);
	var links = tree.links(nodes);

	//update the links
	var linkGroup = svg.selectAll("path.link").data(links).enter().append("path").attr("class", function(d) {
		return d.target.level == "super" ? "super-link": "sub-link"
	}).attr("d", diagonal);

	linkGroup.attr("transform", function(d) {
		//if (d.target.level == "super") return "rotate(180) translate(" + ( - w / 2 - d.source.x - d.source.textWidth / 2) + ")"
	});

	//Update the nodes
	var nodeGroup = svg.selectAll("g.none").data(nodes).enter().append("svg:g").attr("class", function(d) {
		return "node"
	});

	nodeGroup.append("svg:rect").attr("rx", rectParam.rx).attr("ry", rectParam.ry).attr("class", function(d) {
		return d.level == "center" ? "center-node": (d.level == "super" ? "super-node": "sub-node");
	});

	var textGroup = nodeGroup.append("text").attr("text-anchor", function(d) {
		return d.level == "super" ? "start": "end";
	}).attr("dy", ".31em").attr("transform", function(d, i) {
		return d.level == "super" ? "": "rotate(" + (i * 20) + ")translate(0,0)"
		//return "rotate(90)"
	}).text(function(d) {
		return d.name;
	});

	nodeGroup.each(function(d, i) {
		d.textWidth = d3.select(this).select("text").node().getBBox().width;
		d.textHeight = d3.select(this).select("text").node().getBBox().height;
	});

	nodeGroup.attr("transform", function(d, i) {
		return d.level == "center" ? "rotate(-90)": d.level == "super" ? "rotate(" + d.x + ") translate(" + (d.y) + ")": "rotate(" + d.x + ")translate(" + d.y + ")";
	});

	nodeGroup.selectAll("rect").attr("width", function(d) {
		return d.textWidth + rectParam.offsetx;
	}).attr("height", function(d) {
		return d.textHeight + rectParam.offsety;
	}).attr("transform", function(d) {
		//return "translate(" + ( - rectParam.offsetx / 2) + "," + ( - rectParam.offsety / 2) + ")";
		return "rotate(90)";
	});

};

