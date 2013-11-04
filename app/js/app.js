(function($) {
	//// Constants ////
	var DATA = "../data/";
	var OUTPUT = DATA + "output/";
	var INPUT = DATA + "input/";
	var SAMPLES = DATA + "samples.json";
	
	var INFO = "info.json"
	
	var FEATURE = {
		HEIGHT: "js/height.json",
		COLOR: "js/color.json",
		POSITION: "js/position.json"
	};
	
	var TYPE = {
		HEIGHT: 0,
		COLOR: 1,
		POSITION: 2
	};
	
	
	//// Attributes ////
	var samples = [];
	var currentKey = 0;
	
	var graphCount = 0;
	var loadCount = 0;
	
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
		displayFingerprint();
		displayFeatures();
	}
	
	function changeSample(key) {
		currentKey = key;
		
		displaySample();
		loadSample();
	}
	
	function displayMetadata() {
		displayBasicInformation();
		displayAnalysisSummary();
	}
	
	function displayBasicInformation() {
		var s = samples[currentKey];
		
		$(".meta img").attr("src", OUTPUT + s.directory + "thumb.jpg");
		$(".meta img").attr("alt", s.artist);
		
		var entries = [];
		entries[0] = "<p><a href='" + s.URL + "'>" + s.title + "</a> by " + s.artist + "</p>";
		entries[1] = "<p>" + s.album + "</p>";
		entries[2] ="<p>" +
			"<em>Time</em>: " + getPrettyTime(s.duration) + " | " +
			"<em>Sample rate</em>: " + s.sample_rate / 1000 + " kHz | " +
			"<em>Bit rate</em>: " + s.bitrate + " kb/s" +
			"</p>";
		
		var container = $(".info").empty();
		for (var i = 0; i < entries.length; i++) {
			container.append(entries[i]);
		}
	}
	
	function displayAnalysisSummary() {
		var s = samples[currentKey];
		
		var entries = [];
		entries[0] = "<p>" +
			"<span title='Speechiness' class='glyphicon glyphicon-comment'></span>" + ~~(s.speechiness * 100) + "%" +
			"<span title='Acousticness' class='glyphicon glyphicon-leaf'></span>" + ~~(s.acousticness * 100) + "%" +
			"<span title='Liveness' class='glyphicon glyphicon-eye-open'></span>" + ~~(s.liveness * 100) + "%" +
			"<span title='Valence' class='glyphicon glyphicon-certificate'></span>" + ~~(s.valence * 100) + "%" +
			"<span title='Energy' class='glyphicon glyphicon-fire'></span>" + ~~(s.energy * 100) + "%" +
			"<span title='Danceability' class='glyphicon glyphicon-record'></span>" + ~~(s.danceability * 100) + "%" +
			"</p>";
		entries[1] = "<p>" +
			"<em>Signature</em>: " + getPrettySignature(s.time_signature) + " | " +
			"<em>Tempo</em>: " + Math.round(s.tempo) + " BPM | " +
			"<em>Key</em>: " + getPrettyKey(s.key) + " | " +
			"<em>Mode</em>: " + getPrettyMode(s.mode) +
			"</p>";
		entries[2] = "<p>" + "<em>Genre</em>: " + s.genre + "</p>";
		
		var container = $(".summary").empty();
		for (var i = 0; i < entries.length; i++) {
			container.append(entries[i]);
		}
		
		$(".summary span").tooltip();
	}
	
	function toggleProgress(on) {
		var visibility = on ? "visible" : "hidden";
		$(".progress").css("visibility", visibility);
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
	function displayFingerprint() {
		graphCount++;
		
		var filename = OUTPUT + samples[currentKey].directory + "segments.tsv";
		d3.tsv(filename, function(error, data) {
			var config = createConfig({ container: "#finger1" });
			
			var input = [];
			for (var i = 0; i < data.length; i++) {
				input[i] = {};
				
				var period = computePeriod(i, data);
				var timbre = computeTimbre(JSON.parse(data[i].timbre));
				var chroma = JSON.parse(data[i].chroma);
				
				input[i].x = JSON.parse(data[i].time);
				input[i].y = [];
				
				for (var j = 0; j < chroma.length; j++) {
					input[i].y[j] = {
						width: period,
						value: timbre,
						level: chroma[j]
					};
				}
			}
			
			Parrot.init(config);
			Parrot.Fingerprint(input);
		});
	}
	
	function computePeriod(i, data) {
		if (i === data.length - 1) {
			return samples[currentKey].duration - JSON.parse(data[i].time);
		} else {
			return JSON.parse(data[i + 1].time) - JSON.parse(data[i].time);
		}
	}
	
	function computeTimbre(values) {
		var timbre = 0;
		var coefficient = values.length;
		
		for (var i = 0; i < values.length; i++) {
			timbre += values[i] * coefficient;
			coefficient--;
		}
		
		return timbre;
	}
	
	function displayFeatures() {
		$.getJSON(FEATURE.HEIGHT, loadHeight);
		$.getJSON(FEATURE.COLOR, loadColor);
		$.getJSON(FEATURE.POSITION, loadPosition);
	}
	
	function loadHeight(data) {
		graphCount += data.length;
		visualize(data, TYPE.HEIGHT);
	}
	
	function loadColor(data) {
		graphCount += data.length;
		visualize(data, TYPE.COLOR);
	}
	
	function loadPosition(data) {
		graphCount += data.length;
		visualize(data, TYPE.POSITION);
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
					
					switch (type) {
						case TYPE.HEIGHT:
							Parrot.FeatureByHeight(input);
							break;
						case TYPE.COLOR:
							Parrot.FeatureByColor(input);
							break;
						default:
							Parrot.FeatureByPosition(input);
					}
				});
			})(i);
		}
	}
	
	function cleanAllGraphs() {
		$("svg").remove();
	}
	
	
	//// Events ////
	function onSampleClick(event) {
		event.preventDefault();
		
		var item = $(event.currentTarget);
		var key = item.data().key;
		
		onDrawingStarted();
		changeSample(key);
	}
	
	function onDrawingStarted() {
		if (graphCount === 0) {
			toggleProgress(true);
			cleanAllGraphs();
		}
	}
	
	function onDrawingDone() {
		loadCount++;
		
		if (loadCount === graphCount) {
			loadCount = 0;
			graphCount = 0;
			
			toggleProgress(false);
		}
	}
	
	function onPlay(event) {
		displayStop();
	}
	
	function onStop(event) {
		displayPlay();
	}
	
	function onClear(event) {
		displayPlay();
	}
	
	
	//// Utilities ////
	function createConfig(conf) {
		var config = {
			onStart: onDrawingStarted,
			onFinish: onDrawingDone
		};
		
		if (conf.container !== undefined) {
			config.container = conf.container;
		}
		
		if (conf.colors !== undefined) {
			config.colors = conf.colors;
		}
		
		return config;
	}
	
	function getPrettyTime(time) {
		minutes = ~~(time / 60);
		seconds = ~~(time % 60);
		seconds = (seconds < 10) ? "0" + seconds : seconds;
		
		return minutes + ":" + seconds;
	}
	
	function getPrettySignature(value) {
		switch (value) {
			case -1:
				return "No";
				break;
			case 1:
				return "Varied";
				break;
			default:
				return value + "/7";
		}
	}
	
	function getPrettyKey(value) {
		return ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"][value];
	}
	
	function getPrettyMode(value) {
		return (value === 0) ? "Minor" : "Major";
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