function tabulate(data, columns) {
	var table = d3.select("#infobox").append("table"),
	    thead = table.append("thead"),
	    tbody = table.append("tbody");

	table
		.style('border-collapse', 'collapse')
		.style('border', '2px solid black');

	// append the header row
	thead.append("tr")
		.selectAll("th")
		.data(["infobox"])
		.enter()
		.append("th")
		.text(function(column) { return "infobox"; });

	// create a row for each object in the data
	var rows = tbody.selectAll("tr")
		.data(data)
		.enter()
		.append("tr");

	// create a cell in each row for each column
	var cells = rows.selectAll("td")
		.data(function(row) {
			return columns.map(function(column) {
				return {column: column, value: row[column]};
			});
		})
	.enter()
		.append("td")
		.text(function(d) { return d.value; })
		.attr('align','center')
		//		.style('border','1px solid black')
		.style('padding','5px');

	return table;
}
// create some people

var infodata = [
{"label":"age","context":20},
{"label":"color","context":"grey"},
{"label":"department","context":"none"}   
];

// render the table
var table = tabulate(infodata, ["label", "context"]);

// uppercase the column headers
table.selectAll("thead th")
.text(function(column) {
	return column.charAt(0).toUpperCase() + column.substr(1);
});

table.selectAll("tbody tr td")
.style('background-color',function(d,i){
	if(i%2==0)
	return 'red';
});

table.
on('mouseover',function(){
	table
	.transition()
	.duration(1000)
	.selectAll("tbody tr td")
	.style('background-color',function(d,i){
		if(i%2!=0)
		return 'red';
	});
})
.on('mouseout',function(){
	table
	.transition()
	.duration(1000)
	.selectAll("tbody tr td")
	.style('background-color',function(d,i){
		if(i%2==0)
		return 'red';
	});
});
