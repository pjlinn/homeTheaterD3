/*
	TO-DO:
	1. Read through Nefretti's thesis again and take notes on what
	I can write about.

	2. Add variables to capture all the design aggregates, not just
	cost. Like performance, reliability, etc.

	3. Figure out a way to port the systemDesigns array of objects
	into the D3 visualizaion. Even if that means making it a new file
*/

// JQuery, loads the script when the page is ready
$(document).ready(function() {

	var systemDesigns = []; // Should be a global variable to hold system designs
/*
	Visualization Code
	=======================================================
	*
	* Loads prior to clicking the graph it button
	*
	*
	=======================================================
*/
	/*
		Path to data for visualization, artifical data, not
		created yet.
	*/
	var dataLocation = "/data/systemDesigns.json";

	/*
		Visualization canvas area and buffers
	*/
	var margin = {left: 75, right: 20, top: 30, bottom: 50},
		height = 300 - margin.top - margin.bottom,
		width = 1400 - margin.left - margin.right;

	/*
		Add the tooltip, for displaying design when 
		hovering over point
	*/
	var tooltip = d3.select("#canvas")
		.append("div")
			.attr("class", "tooltip")
			.style("opacity", 0);

	/*
		x - y scale range
	*/
	var x = d3.scale.linear().range([0, width]);
	var y = d3.scale.linear().range([height, 0]);

	/*
		Axes, call this to draw the axes
	*/
	var xAxis = d3.svg.axis().scale(x)
		.orient("bottom");
	var yAxis = d3.svg.axis().scale(y)
		.orient("left");

	/*	
		svg element, allocates space for drawing
	*/
	var svg = d3.select("#canvas")
		.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
		.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top +")");

	/*
		allocates space for the axes
	*/
	svg.append("g")
			.attr("class", "xAxis")
			.attr("transform", "translate(0, " + height + ")");

	svg.append("g")
			.attr("class", "yAxis");

	/*
		Define the label space to be updated in the visualizeIt function
	*/
	svg.append("text")
		.attr("class", "xLabel");

	svg.append("text")
		.attr("class", "yLabel");

	/*
	Function that fires on the button click
	=======================================================
	*
	* Dynamically draws the scatter plot, based on selected
	* options for the axis variables
	*
	=======================================================
	*/
	var visualizeIt = function() {

		/*
			Assign what it is we want to plot, 
			comes from select boxes. These variables are used 
			for the axes labels as well.
		*/
		var xVariable = $('#xVariable').val();
		var yVariable = $('#yVariable').val();

		
		/*
			Assign variables from the global list of 
			system designs to be used throughout.
		*/
		systemDesigns.forEach(function(d) { 
			d.name = d.name;
			d.xVariable = d[xVariable];
			d.yVariable = d[yVariable];
		});

		/*
			Establish the domain dynamically using the data, 
			add buffer so the points don't sit right on the
			axes
		*/
		x.domain([d3.min(systemDesigns, function(d) { return d.xVariable; }) - 1, d3.max(systemDesigns, function(d) { return d.xVariable; }) + 1]);
		y.domain([d3.min(systemDesigns, function(d) { return d.yVariable; }) - 1, d3.max(systemDesigns, function(d) { return d.yVariable; }) + 1]);

		/*
			New way to try and allow dynamic updates
			Uses stuff from http://bost.ocks.org/mike/join/
		*/
		var circle = svg.selectAll("circle")
			.data(systemDesigns);

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

		/*
			Re-draw the axes -- works for some reason -- didn't use 
			transitions but I could used this example: 
			https://gist.github.com/phoebebright/3098488
		*/
		svg.select(".xAxis")
			// .transition().duration(1500).ease("sin-and-out")
			.call(xAxis);
		
		svg.select(".yAxis")
			// .transition().duration(1500).ease("sin-and-out")
			.call(yAxis);
		/*
			Axes labels, should also change with the select boxes
		*/
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
	};
	/*
	END visualizeIt function
	=======================================================
	=======================================================
	*/

	/*
		Redraw function using D3 instead of jquery.
		Fires the function on each button click
	*/
	d3.select("#visualizeIt").on("click", visualizeIt);
	// $("#visualizeIt").click(visualizeIt);
	// d3.select("#clearIt").on("click", clearIt);
/*
	END Visualization Code
	=======================================================
	=======================================================
*/

/*
	System Design Code
	=======================================================
	*
	* Code that grabs the json file of components and
	* builds different designs. Not scaleable or production
	* quality, but should work for proof-of-concept
	=======================================================
*/

	/*
		JQuery function that goes to the URL in the first argument and
		returns the json data
	*/
	$.getJSON("data/homeTheaterSystemComponents.json", function(data) {
		var components = 	[]; // Used to hold the distinct type of components
		var televisions = 	[]; // Holds information on each television
		var speakers = 		[]; // Holds information on each speaker
		var amplifiers = 	[]; // Holds information on each amplifier

		/*
			cycles though each json object, key is an index I think, val
			is how I grab each property
		*/
		$.each(data, function(key, val) {
			/*
				"pushes" all component properties into an array, 
				probably not scaleable

				The if statements allocate each component's information
				into its respective bucket
			*/
			components.push(val.component);
			if (val.component == "television") { televisions.push(
					{
						"brand" : val.brand,
						"cost" : val.cost,
						"performance" : val.performance,
						"reliability" : val.reliability
					}
				); 
			};	
			if (val.component == "speaker") { speakers.push(
					{
						"brand" : val.brand,
						"cost" : val.cost,
						"performance" : val.performance,
						"reliability" : val.reliability
					}
				); 
			};
			if (val.component == "amplifier") {amplifiers.push(
					{
						"brand" : val.brand,
						"cost" : val.cost,
						"performance" : val.performance,
						"reliability" : val.reliability
					}
				); 
			};
		});
		// console.log(televisions[0].performance);
		/*
			unique returns an array of components with all 
			duplicates parsed out, then we call the printComponenets 
			function on each element
		*/
		// unique(components).forEach(printComponenets);

		/*
			Brute force functions to build a list of objects
			that will look similar to the systemDesigns.json 
			file and hopefully can be used in place of that file
			in the scatter plot
		*/
		buildSystems(televisions, amplifiers, speakers);
	});

	/*
		Got this off stack overflow, doesn't seem like JS has a 
		collection that can't hold duplicates, so you have to use this
		http://stackoverflow.com/questions/11688692/most-elegant-way-to-create-a-list-of-unique-items-in-javascript
	*/
	function unique(arr) {
	    var u = {}, a = [];
	    for(var i = 0, l = arr.length; i < l; ++i){
	        if(!u.hasOwnProperty(arr[i])) {
	            a.push(arr[i]);
	            u[arr[i]] = 1;
	        }
	    }
	    return a;
	};

	/*
		Uses jquery to print to the components select box
	*/
	// function printComponenets(element, index, array) {
	// 	$("#component1").append("<option value='" + element + "'>" + element + "</option>");
	// };

	/*
		Quick function to test with by printing out
		elements
	*/
	function printObject(element, index, array) {
		console.log(element);
	};

	/*
		Brute force way to build systems, pass 3 arrays of components
		not dynamic at all...wonder what the break point is...
	*/
	function buildSystems(televisions, amplifiers, speakers) {
		var sum = 0;		 	// Total system design cost
		var performance = 0;	// Total system performance
		var reliability = 0; 	// Total system reliability 
		var counter = 1;		// Used to label design names

		for (var i = televisions.length - 1; i >= 0; i--) {
			for (var j = amplifiers.length - 1; j >= 0; j--) {
				for (var k = speakers.length - 1; k >= 0; k--) {
					sum = televisions[i].cost + amplifiers[j].cost + speakers[k].cost;
					performance = (televisions[i].performance + amplifiers[j].performance + speakers[k].performance) / 3;
					reliability = (televisions[i].reliability + amplifiers[j].reliability + speakers[k].reliability) / 3;
					systemDesigns.push(
						{
							"name" : "design " + counter,
							"cost" : sum,
							"performance" : performance,
							"reliability" : reliability,
							"television" : televisions[i].brand,
							"amplifier" : amplifiers[j].brand,
							"speaker" : speakers[k].brand
						}
					);

					counter++;
				};
			};
		};
		// console.log(systemDesigns[0].name + " " + systemDesigns[0].cost + " " + systemDesigns[0].performance + " " + systemDesigns[0].reliability);
		/*
			Build a table of deisgns to complement the graph
		*/		
		systemDesigns.forEach(function(x) {
			$("#designTable").append("<tr><td>" + x.name + "</td><td>" + x.television + "</td><td>" + x.speaker + "</td><td>" + x.amplifier +"</td></tr>");
		});		
	};
});

