$(document).ready(function() {

	var dataLocation = "/data/systemDesigns.json";

	var margin = {left: 50, right: 20, top: 30, bottom: 30},
		height = 300 - margin.top - margin.bottom,
		width = 1400 - margin.left - margin.right;

	// add the tooltip
	var tooltip = d3.select("#canvas")
		.append("div")
			.attr("class", "tooltip")
			.style("opacity", 0);

	// x - y scales
	var x = d3.scale.linear().range([0, width]);
	var y = d3.scale.linear().range([height, 0]);

	// Axes
	var xAxis = d3.svg.axis().scale(x)
		.orient("bottom");
	var yAxis = d3.svg.axis().scale(y)
		.orient("left");

	var svg = d3.select("#canvas")
		.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
		.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top +")");

	// Load data
	d3.json(dataLocation, function(error, data) {
		if (error) { return console.warn("Something is wrong " + error)};

		data.forEach(function(d) { 
			d.name = d.name;
			d.cost = +d.cost;
			d.performance = +d.performance;
		});

		// Establish the domain dynamically using the data, add buffer
		x.domain([d3.min(data, function(d) { return d.cost; }) - 10, d3.max(data, function(d) { return d.cost; }) + 10]);
		y.domain([d3.min(data, function(d) { return d.performance; }) - 1, d3.max(data, function(d) { return d.performance; }) + 1]);

		// Draw the circles
		svg.selectAll("circle")
			.data(data)
			.enter()
			.append("circle")
			.attr("class", "circle")
			.attr("cx", function(d) { return x(d.cost); })
			.attr("cy", function(d) { return y(d.performance); })
			.attr("r", 5)
			.on("mouseover", function(d) {
				tooltip.transition()
					.duration(200)
					.style("opacity", .9);
				tooltip.html(d.name)
					.style("left", (d3.event.pageX + 5) + "px")
					.style("top", (d3.event.pageY - 28) + "px");
			})
			.on("mouseout", function(d) {
				tooltip.transition()
					.duration(500)
					.style("opacity", 0);
			});

		svg.append("g")
				.attr("class", "axis")
				.attr("transform", "translate(0, " + height + ")")
				.call(xAxis);

		svg.append("g")
				.attr("class", "axis")
				.call(yAxis);		
	});

});