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
	
	function displayCurrentSample() {
		displayMetadata();
		
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
	
	
	//// UI ////
	function displaySamples() {
		var dropdown = $(".dropdown-menu");
		dropdown.on("click", "li", onTrackClick);
		
		$.each(samples, function(key, value) {
			var item ="<li data-key=" + key + "><a href=''>" + value.title + " (" + value.artist + ")</a></li>";
			dropdown.append(item);
		});
	}
	
	function displayMetadata() {
		var s = samples[currentKey];
		
		$("#meta img").attr("src", OUTPUT + s.directory + "thumb.jpg");
		$("#meta img").attr("alt", s.artist);
		
		var entries = [];
		entries[0] = "<p><a href='" + s.URL + "'>" + s.title + "</a> by " + s.artist + "</p>";
		entries[1] = "<p>" + s.album + " (" + s.year + ")</p>";
		entries[2] = "<p><em>Time</em>: " + s.time + " | <em>Size</em>: " + s.size + " | <em>Bit rate</em>: " + s.bitRate + "</p>";
		
		var container = $("#meta > div").empty();
		for (var i = 0; i < entries.length; i++) {
			container.append(entries[i]);
		}
	}
	
	
	//// Visualization ////
	function visualize(features, type) {
		for (var i = 0; i < features.length; i++) {
			(function(index) {
				var filename = OUTPUT + samples[currentKey].directory + features[index].file;
				
				d3.tsv(filename, function(error, data) {
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