var Visualizer = (function($) {
	//// Constants ////
	var TYPE = {
		HEIGHT: 0,
		COLOR: 1,
		POSITION: 2,
		FINGERPRINT: 3
	};
	
	
	//// Attributes ////
	var config = {
		onDrawingStarted: function() {},
		onDrawingDone: function() {}
	};
	
	var graphCount = 0;
	var loadCount = 0;
	
	var track = {};
	
	
	//// Public ////
	function init(c) {
		setConfig(c);
	}
	
	function displayFingerprints(t) {
		track = t;
		
		$.getJSON(Constants.VISUALIZATIONS.FINGERPRINT, loadFingerprint);
	}
	
	function displayFeatures(t) {
		track = t;
		
		$.getJSON(Constants.VISUALIZATIONS.HEIGHT, loadHeight);
		$.getJSON(Constants.VISUALIZATIONS.COLOR, loadColor);
		$.getJSON(Constants.VISUALIZATIONS.POSITION, loadPosition);
	}
	
	function cleanCanvas() {
		$("svg").remove();
	}
	
	
	//// Private ////
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
	
	function loadFingerprint(data) {
		graphCount += data.length;
		visualize(data, TYPE.FINGERPRINT);
	}
	
		
	function visualize(items, type) {
		for (var i = 0; i < items.length; i++) {
			(function(i) {
				var item = items[i];
				var filename = Constants.TRACKS.OUTPUT + track.directory + item.file;
				
				d3.tsv(filename, function(error, data) {
					var config = createConfig(item);
					var input = [];
					
					Parrot.init(config);
					switch (type) {
						case TYPE.HEIGHT:
							input = parseFeature(data, item.x, item.y, item.z);
							Parrot.FeatureByHeight(input);
							break;
						case TYPE.COLOR:
							input = parseFeature(data, item.x, item.y, item.z);
							Parrot.FeatureByColor(input);
							break;
						case TYPE.POSITION:
							input = parseFeature(data, item.x, item.y, item.z);
							Parrot.FeatureByPosition(input);
							break;
						default:
							input = parseFingerprint(data, item.x, item.y, item.z);
							Parrot.Fingerprint(input);
					}
				});
			})(i);
		}
	}
		
	function parseFeature(data, x, y, z) {
		var input = [];
		
		for (var i = 0; i < data.length; i++) {
			input[i] = {};
			
			input[i].x = (x !== null) ? JSON.parse(data[i][x]) : 1;
			input[i].y = (y !== null) ? JSON.parse(data[i][y]) : 1;
			input[i].z = (z !== null) ? JSON.parse(data[i][z]) : 1;
		}
		
		return input;
	}
	
	function parseFingerprint(data, x, y, z) {
		var input = [];
		
		for (var i = 0; i < data.length; i++) {
			input[i] = {};
			
			var width = computePeriod(i, data);
			var value = Utils.computeDeviation(JSON.parse(data[i][y]));
			var level = JSON.parse(data[i][z]);
			
			input[i].x = JSON.parse(data[i][x]);
			input[i].y = [];
			
			for (var j = 0; j < level.length; j++) {
				input[i].y[j] = {
					width: width,
					value: value,
					level: level[j]
				};
			}
		}
		
		return input;
	}
	
	function computePeriod(i, data) {
		if (i === data.length - 1) {
			return track.duration - JSON.parse(data[i].time);
		} else {
			return JSON.parse(data[i + 1].time) - JSON.parse(data[i].time);
		}
	}
	
	
	//// Events ////
	function onDrawingStarted() {}
	
	function onDrawingDone() {
		loadCount++;
		
		if (loadCount === graphCount) {
			loadCount = 0;
			graphCount = 0;
			
			config.onDrawingDone();
		}
	}
		
	
	//// Helpers ////
	function setConfig(c) {
		for (var prop in c) {
			if (c.hasOwnProperty(prop)) {
				config[prop] = c[prop];
			}
		}
	}
	
	function createConfig(c) {
		return {
			container: c.container,
			colors: c.colors,
			onStart: onDrawingStarted,
			onFinish: onDrawingDone
		};
	}
	
		
	return {
		init: init,
		displayFingerprints: displayFingerprints,
		displayFeatures: displayFeatures,
		cleanCanvas: cleanCanvas
	};
})(jQuery);