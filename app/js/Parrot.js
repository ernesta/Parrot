var Parrot = (function($) {
	//// Constants ////
	var DIMENSIONS = ["x", "y", "z"];
	
	var PEAKS = 0;
	var MATRIX = 1;
	
	
	//// Attributes ////
	var config = {
		container: "#graph",
		colors: ["#FFFFFF", "#000000"],
		onStart: function() {},
		onFinish: function() {}
	};
	
	var props = {
		width: 0,
		height: 0,
		margin: {top: 20, right: 20, bottom: 20, left: 20}
	};
	
	var scale = {};
	
	
	//// Public ////
	function init(conf) {
		setConfig(conf);
		setProperties();
		
		cleanCanvas();
	}
	
	function FeatureByHeight(data) {
		drawFeature(data, PEAKS);
	}
	
	function FeatureByColor(data) {
		drawFeature(data, PEAKS);
	}
	
	function FeatureByPosition(data) {
		drawFeature(data, MATRIX);
	}
	
	function Fingerprint(data) {
		config.onStart();
		
		setFingerprintRange();
		setFingerprintDomain(data);
		
		drawHeatmap(data);
	}
	
	
	//// Drawing ////
	function cleanCanvas() {
		d3.select(config.container + " svg").remove();
	}
	
	function drawFeature(data, type) {
		config.onStart();
		
		setFeatureRange();
		setFeatureDomain(data);
		
		switch (type) {
			case PEAKS:
				drawPeaks(data);
				break;
			default:
				drawMatrix(data);
		}
	}
	
	function drawPeaks(data) {
		var svg = createSVG();
		
		svg.selectAll(config.container + " .peak")
			.data(data)
			.enter()
			.append("svg:rect")
			.attr("class", "peak")
			.attr("x", function(d) { return scale.x(d.x); })
			.attr("y", function(d) { return scale.y(d.y); })
			.attr("width", props.width / data.length)
			.attr("height", function(d) { return props.height - scale.y(d.y); })
			.style("fill", function(d) { return scale.z(d.z); });
		
		config.onFinish();
	}
	
	function drawMatrix(data) {
		var svg = createSVG();
		var column = createColumn(svg, data);
		var row = createRow(column, data);
		
		row
			.attr("width", props.width / data.length)
			.style("fill", function(d) { return scale.z(d); });
		
		config.onFinish();
	}
	
	function drawHeatmap(data) {
		var svg = createSVG();
		var column = createColumn(svg, data);
		var row = createRow(column, data);
		
		row
			.attr("width", function(d) { return scale.x(d.width); })
			.style("fill", function(d) { return computeColor(scale.y(d.value), d.level); });
		
		config.onFinish();
	}
	
	function createSVG() {
		return d3.select(config.container)
			.append("svg:svg")
			.attr("width", props.width + props.margin.left + props.margin.right)
			.attr("height", props.height + props.margin.top + props.margin.bottom)
			.append("svg:g")
			.attr("transform", "translate(" + props.margin.left + "," + props.margin.top + ")");
	}
	
	function createColumn(svg, data) {
		return svg.selectAll(config.container + " .peak")
			.data(data)
			.enter()
			.append("g")
			.attr("class", "peak")
			.attr("transform", function(d) { return "translate(" + scale.x(d.x) + ", 0)"; });
	}
	
	function createRow(column, data) {
		var height = props.height / data[0].y.length;
		
		return column.selectAll(config.container + " .cell")
			.data(function(d) { return d.y; })
			.enter()
			.append("svg:rect")
			.attr("class", "cell")
			.attr("y", function(d, i) { return i * height; })
			.attr("height", height);
	}
	
	function computeColor(value, level) {
		var color = d3.rgb(scale.z(value));
		
		if (level > 0.8) {
			return color.darker(level - 0.8);
		} else {
			return "none";
		}
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
	
	function setFeatureRange() {
		scale.x = d3.scale.linear().range([0, props.width]);
		scale.y = d3.scale.linear().range([props.height, 0]);
		scale.z = d3.scale.linear().range(config.colors);
	}
	
	function setFingerprintRange() {
		scale.x = d3.scale.linear().range([0, props.width]);
		scale.y = d3.scale.linear().range([0, 1]);
		scale.z = d3.scale.linear().range(config.colors);
	}
	
	function setFeatureDomain(data) {
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
	
	function setFingerprintDomain(data) {
		var last = data[data.length - 1];
		var end = last.x + last.y[0].width;
		
		scale.x.domain([0, end]);
		scale.y.domain([d3.min(data, function(d) {
			return d.y[0].value;
		}), d3.max(data, function(d) {
			return d.y[0].value;
		})]);
		scale.z.domain(generateList(0, 1, config.colors.length));
	}
	
	
	//// Utils ////
	function generateList(start, end, length) {
		var list = [];
		var step = (end - start) / (length - 1);
		
		for (var i = 0; i < length; i++) {
			list[i] = start + i * step;
		}
		
		return list;
	}
	
	
	//// Definition ////
	return {
		init: init,
		FeatureByHeight: FeatureByHeight,
		FeatureByColor: FeatureByColor,
		FeatureByPosition: FeatureByPosition,
		Fingerprint: Fingerprint
	};
})(jQuery);