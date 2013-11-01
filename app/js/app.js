(function($) {
	//// Constants ////
	var DATA = "../data/";
	var OUTPUT = DATA + "output/";
	var INPUT = DATA + "input/";
	var SAMPLES = DATA + "samples.json";
	
	var INFO = "info.json"
	
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
	$.getJSON(SAMPLES, loadData);
	
	
	//// Functions ////
	//// Initialization ////
	function initApp() {
		initPlayer();
		displaySamples();
		displaySample();
	}
	
	
	//// Data ////
	function loadData(data) {
		samples = data;
		extendSamples();
	}
	
	function extendSamples() {
		for (var i = 0; i < samples.length; i++) {
			(function(i) {
				var path = OUTPUT + samples[i].directory + INFO;
				
				$.getJSON(path, function(sample) {
					$.extend(samples[i], sample);
					
					if (i + 1 === samples.length) {
						initApp();
					}
				});
			})(i);
		}
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
	
	function displaySample() {
		displayMetadata();
		displayFeatures();
	}
	
	function changeSample(key) {
		currentKey = key;
		
		displaySample();
		loadSample();
	}
	
	function displayMetadata() {
		var s = samples[currentKey];
		
		$(".meta img").attr("src", OUTPUT + s.directory + "thumb.jpg");
		$(".meta img").attr("alt", s.artist);
		
		var entries = [];
		entries[0] = "<p><a href='" + s.URL + "'>" + s.title + "</a> by " + s.artist + "</p>";
		entries[1] = "<p>" + s.album + "</p>";
		entries[2] = "<p><em>Time</em>: " + getPrettyTime(s.duration) + " | <em>Sample rate</em>: " + s.sample_rate / 1000 + "kHz | <em>Bit rate</em>: " + s.bitrate + "kb/s </p>";
		
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
			(function(i) {
				var filename = OUTPUT + samples[currentKey].directory + features[i].file;
				
				d3.tsv(filename, function(error, data) {
					var bar = features[i];
					
					var config = createConfig(bar);
					var input = parse(data, bar.x, bar.y, bar.z);
					
					Parrot.init(config);
					
					if (type === BAR_CHART) {
						Parrot.BarChart(input);
					} else {
						Parrot.Heatmap(input);
					}
				});
			})(i);
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
	
	function getPrettyTime(time) {
		minutes = ~~(time / 60);
		seconds = ~~(time % 60);
		seconds = (seconds < 10) ? "0" + seconds : seconds;
		
		return minutes + ":" + seconds;
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