var Parrot = (function($) {
	//// Constants ////
	var DIMENSIONS = ["x", "y", "z"];
	
	
	//// Properties ////
	var config = {
		container: "#graph",
		colors: ["#FFFFFF", "#000000"]
	};
	
	var props = {
		width: 0,
		height: 0,
		margin: {top: 20, right: 20, bottom: 20, left: 20}
	};
	
	var scale = {
		x: {},
		y: {},
		z: {}
	};
	
	
	//// Public ////
	function init(conf) {
		setConfig(conf);
		
		setProperties();
		setScale();
		
		cleanCanvas();
	}
	
	function BarChart(data) {
		setDomain(data);
		drawBarChart(data);
	}
	
	function Heatmap(data) {
		setDomain(data);
		drawHeatmap(data);
	}
	
	
	//// Drawing ////
	function cleanCanvas() {
		d3.select(config.container + " svg").remove();
	}
	
	function drawBarChart(data) {
		var svg = createSVG();
		
		svg.selectAll(config.container + " .bar")
			.data(data)
			.enter()
			.append("svg:rect")
			.attr("class", "bar")
			.attr("x", function(d) { return scale.x(d.x); })
			.attr("y", function(d) { return scale.y(d.y); })
			.attr("width", props.width / data.length)
			.attr("height", function(d) { return props.height - scale.y(d.y); })
			.style("fill", function(d) { return d3.interpolateRgb(config.colors[0], config.colors[1])(scale.z(d.z)); });
	}
	
	function drawHeatmap(data) {
		var svg = createSVG();
		
		var h = props.height / data[0].y.length;
		var w = props.width / data.length;
		
		var column = svg.selectAll(config.container + " .heat")
			.data(data)
			.enter()
			.append("g")
			.attr("class", "heat")
			.attr("transform", function(d) { return "translate(" + scale.x(d.x) + ", 0)"; });
		
		var row = column.selectAll(config.container + " .cell")
			.data(function(d) { return d.y; })
			.enter()
			.append("svg:rect")
			.attr("class", "cell")
			.attr("y", function(d, i) { return i * h; })
			.attr("width", w)
			.attr("height", h)
			.style("fill", function(d) { return d3.interpolateRgb(config.colors[0], config.colors[1])(scale.z(d)); });
	}
	
	function createSVG() {
		return d3.select(config.container)
			.append("svg:svg")
			.attr("width", props.width + props.margin.left + props.margin.right)
			.attr("height", props.height + props.margin.top + props.margin.bottom)
			.append("svg:g")
			.attr("transform", "translate(" + props.margin.left + "," + props.margin.top + ")");
	}
	
	
	//// Helpers ////
	function setConfig(conf) {
		for (var prop in conf) {
			if (conf.hasOwnProperty(prop)) {
				config[prop] = conf[prop];
			}
		}
	}
	
	function setProperties() {
		props.width =
			$(config.container).width() -
			props.margin.left -
			props.margin.right;
		
		props.height =
			$(config.container).height() -
			props.margin.top -
			props.margin.bottom;
	}
	
	function setScale() {
		scale.x = d3.scale.linear().range([0, props.width]);
		scale.y = d3.scale.linear().range([props.height, 0]);
		scale.z = d3.scale.linear().range([0, 1]);
	}
	
	function setDomain(data) {
		for (var i = 0; i < DIMENSIONS.length; i++) {
			var dim = DIMENSIONS[i];
			
			scale[dim].domain([d3.min(data, function(d) {
				return (d[dim] instanceof Array) ? d3.min(d[dim]) : d[dim];
			}), d3.max(data, function(d) {
				return (d[dim] instanceof Array) ? d3.max(d[dim]) : d[dim];
			})]);
			
			if (scale[dim].domain()[0] === scale[dim].domain()[1]) {
				scale[dim].domain([--scale[dim].domain()[0], scale[dim].domain()[1]]);
			}
		}
	}	
	
	
	//// Definition ////
	return {
		init: init,
		BarChart: BarChart,
		Heatmap: Heatmap
	};
})(jQuery);