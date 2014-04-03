// JQuery, loads the script when the page is ready
$(document).ready(function() {

	// path to data
	var dataLocation = "/data/systemDesigns.json";

	// canvas area and buffers
	var margin = {left: 75, right: 20, top: 30, bottom: 50},
		height = 300 - margin.top - margin.bottom,
		width = 1400 - margin.left - margin.right;

	// add the tooltip, for hovering over
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

	// svg element
	var svg = d3.select("#canvas")
		.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
		.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top +")");

	svg.append("g")
			.attr("class", "xAxis")
			.attr("transform", "translate(0, " + height + ")");
			// .call(xAxis);

	svg.append("g")
			.attr("class", "yAxis");
			// .call(yAxis);

	// Define the label space to be updated in the visualizeIt function
	svg.append("text")
		.attr("class", "xLabel");

	svg.append("text")
		.attr("class", "yLabel");

	// function that will actually draw the plot based on the selected preference
	// Have not yet figured out how to redraw points and axes
	// Seems like I need to complete remove everything prior to drawing anything
	var visualizeIt = function() {

		// assign what it is we want to plot
		var xVariable = $('#xVariable').val();
		var yVariable = $('#yVariable').val();

		// Load data
		d3.json(dataLocation, function(error, data) {
			if (error) { return console.warn("Something is wrong " + error)};

			data.forEach(function(d) { 
				d.name = d.name;
				d.xVariable = d[xVariable];
				d.yVariable = d[yVariable];
			});

			// Establish the domain dynamically using the data, add buffer
			x.domain([d3.min(data, function(d) { return d.xVariable; }) - 1, d3.max(data, function(d) { return d.xVariable; }) + 1]);
			y.domain([d3.min(data, function(d) { return d.yVariable; }) - 1, d3.max(data, function(d) { return d.yVariable; }) + 1]);

			// New way to try and allow dynamic updates
			var circle = svg.selectAll("circle")
				.data(data);

			circle.exit().remove();

			circle.enter().append("circle")
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

			circle
				.attr("cx", function(d) { return x(d.xVariable); })
				.attr("cy", function(d) { return y(d.yVariable); });

			// Re-draw the axes -- works for some reason
			// used this example: https://gist.github.com/phoebebright/3098488
			svg.select(".xAxis")
				// .transition().duration(1500).ease("sin-and-out")
				.call(xAxis);
			
			svg.select(".yAxis")
				// .transition().duration(1500).ease("sin-and-out")
				.call(yAxis);


			// Axes labels, should also change with the select boxes
			svg.select(".xLabel")
				.attr("x", width - 100)
				.attr("y", height + margin.bottom)
				.attr("dy", "-.5em")
				.style("text-anchor", "middle")
				.text(xVariable);

			svg.select(".yLabel")
				.attr("transform", "rotate(-90)")
				.attr("y", 0 - margin.left)
				.attr("x", 0 - (height / 2))
				.attr("dy", "1em")
				.style("text-anchor", "middle")
				.text(yVariable);
		});
	};

	// Redraw function
	// $("#visualizeIt").click(visualizeIt);
	d3.select("#visualizeIt").on("click", visualizeIt);
	// d3.select("#clearIt").on("click", clearIt);

});

