(function($) {
	//// Constants ////
	var DATA = "../data/";
	var OUTPUT = DATA + "output/";
	var INPUT = DATA + "input/";
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
	
	var player = {};
	
	
	//// Flow ////
	$.getJSON(SAMPLES, initApp);
	
	
	//// Functions ////
	//// Initialization ////
	function initApp(data) {
		samples = data;
		
		initPlayer();
		
		displaySamples();
		displayCurrentSample();
	}
	
	
	//// UI ////
	function displaySamples() {
		var dropdown = $(".dropdown-menu");
		dropdown.on("click", "li", onSampleClick);
		
		$.each(samples, function(key, value) {
			var item ="<li data-key=" + key + "><a href=''>" + value.title + " (" + value.artist + ")</a></li>";
			dropdown.append(item);
		});
	}
	
	function displayCurrentSample() {
		displayMetadata();
		displayFeatures();
	}
	
	function changeSample(key) {
		currentKey = key;
		displayCurrentSample();
		
		loadSample();
	}
	
	function displayMetadata() {
		var s = samples[currentKey];
		
		$(".meta img").attr("src", OUTPUT + s.directory + "thumb.jpg");
		$(".meta img").attr("alt", s.artist);
		
		var entries = [];
		entries[0] = "<p><a href='" + s.URL + "'>" + s.title + "</a> by " + s.artist + "</p>";
		entries[1] = "<p>" + s.album + " (" + s.year + ")</p>";
		entries[2] = "<p><em>Time</em>: " + s.time + " | <em>Size</em>: " + s.size + " | <em>Bit rate</em>: " + s.bitRate + "</p>";
		
		var container = $(".info").empty();
		for (var i = 0; i < entries.length; i++) {
			container.append(entries[i]);
		}
	}
	
	
	//// Player ////
	function initPlayer() {
		$(".jp-jplayer").jPlayer({
			ready: function(event) {
				player = this;
				loadSample();
			},
			solution: "html",
			supplied: "mp3",
			preload: "auto",
			volume: 1,
			cssSelectorAncestor: ".controls",
			cssSelector: {
				play: ".play",
				stop: ".stop"
			}
		});
		
		$(".jp-jplayer").bind($.jPlayer.event.play, onPlay);
		$(".jp-jplayer").bind($.jPlayer.event.pause, onStop);
		$(".jp-jplayer").bind($.jPlayer.event.emptied, onClear);
	}
	
	function loadSample() {
		var s = samples[currentKey];
		
		$(player).jPlayer("setMedia", {
			mp3: INPUT + s.filename
		});
	}
	
	function displayPlay() {
		$(".stop").css("display", "none");
		$(".play").css("display", "block");
	}
	
	function displayStop() {
		$(".play").css("display", "none");
		$(".stop").css("display", "block");
	}
	
	
	//// Visualization ////
	function displayFeatures() {
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
	var onSampleClick = function(event) {
		event.preventDefault();
		
		var item = $(event.currentTarget);
		var key = item.data().key;
		
		changeSample(key);
	}
	
	var onPlay = function(event) {
		displayStop();
	}
	
	var onStop = function(event) {
		displayPlay();
	}
	
	var onClear = function(event) {
		displayPlay();
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