(function($) {
	//// Constants ////
	var DATA = "../data/";
	var OUTPUT = DATA + "output/";
	var SAMPLES = DATA + "samples.json";
	
	var BARS = "js/bars.json";
	var HEATS = "js/heats.json";
	
	var BAR_CHART = 0;
	var HEATMAP = 1;
	
	
	//// Attributes ////
	var currentKey = 0;
	var currentDir = "";
	
	var samples = [];
	var bars = [];
	var heats = [];
	
	
	//// Flow ////
	$.getJSON(SAMPLES, initApp);
	
	
	//// Functions ////
	//// Initialization ////
	function initApp(data) {
		samples = data;
		
		displaySamples();
		displayCurrentSample();
	}
	
	
	//// UI ////
	function displaySamples() {
		var dropdown = $(".dropdown-menu");
		dropdown.on("click", "li", onTrackClick);
		
		$.each(samples, function(key, value) {
			var item ="<li data-key=" + key + "><a href=''>" + value.title + " (" + value.artist + ")</a></li>";
			dropdown.append(item);
		});
	}
	
	
	//// Visualization ////
	function displayCurrentSample() {
		currentDir = samples[currentKey].directory;
		
		$.getJSON(BARS, loadBars);
		$.getJSON(HEATS, loadHeats);
	}
	
	function loadBars(data) {
		bars = data;
		visualize(bars, BAR_CHART);
	}
	
	function loadHeats(data) {
		heats = data;
		visualize(heats, HEATMAP);
	}
	
	function visualize(features, type) {
		for (var i = 0; i < features.length; i++) {
			(function(index) {
				d3.tsv(OUTPUT + currentDir + features[index].file, function(error, data) {
					var bar = features[index];
					
					var config = createConfig(bar);
					var input = parse(data, bar.x, bar.y, bar.z);
					
					Parrot.init(config);
					
					if (type === BAR_CHART) {
						Parrot.BarChart(input);
					} else {
						Parrot.Heatmap(input);
					}
				});
			})(i)
		}
	}
	
	
	//// Events ////
	var onTrackClick = function(event) {
		event.preventDefault();
		
		var item = $(event.currentTarget);
		
		currentKey = item.data().key;
		displayCurrentSample();
	}
		
	
	
	//// Utilities ////
	function createConfig(config) {
		return {
			container: config.container,
			colors: config.colors
		};
	}
	
	function parse(data, x, y, z) {
		var input = [];
		
		for (var i = 0; i < data.length; i++) {
			input[i] = {};
			
			input[i].x = (x !== null) ? JSON.parse(data[i][x]) : 1;
			input[i].y = (y !== null) ? JSON.parse(data[i][y]) : 1;
			input[i].z = (z !== null) ? JSON.parse(data[i][z]) : 1;
		}
		
		return input;
	}
})(jQuery);