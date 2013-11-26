var Visualizer = (function($) {
	//// Constants ////
	var TYPE = {
		FINGERPRINT: 0,
		FEATURE: 1
	};
	
	var FEATURE = {
		HEIGHT: "height",
		COLOR: "color",
		POSITION: "position"
	};
	
	
	//// Attributes ////
	var config = {
		onDrawingStarted: function() {},
		onDrawingDone: function() {}
	};
	
	var graphCount = 0;
	var loadCount = 0;
	var inProgress = false;
	
	var position = 0;
	var track = {};
	
	
	//// Public ////
	function init(c) {
		setConfig(c);
	}
	
	function displayExplore(t) {
		config.onDrawingStarted();
		
		track = t;
		$.getJSON(Constants.VISUALIZATIONS.EXPLORE, loadExplore);
	}
	
	function displayCompare(t, p) {
		config.onDrawingStarted();
		
		track = t;
		position = p;
		$.getJSON(Constants.VISUALIZATIONS.COMPARE, loadCompare);
	}
	
	function displayDiscover(t, p) {
		config.onDrawingStarted();
		
		track = t;
		position = p;
		$.getJSON(Constants.VISUALIZATIONS.DISCOVER, loadDiscover);
	}
			
	
	//// Visualizing ////
	function loadExplore(data) {
		var fingerprints = flattenByRows(data.fingerprints);
		var features = flattenByRows(data.features);
		
		graphCount = fingerprints.length;
		graphCount += features.length;
		
		visualize(fingerprints, TYPE.FINGERPRINT);
		visualize(features, TYPE.FEATURE);
	}
	
	function loadCompare(data) {
		var fingerprints = flattenByColumns(data.fingerprints)[position];
		var features = flattenByColumns(data.features)[position];
		
		graphCount = fingerprints.length;
		graphCount += features.length;
		
		visualize(fingerprints, TYPE.FINGERPRINT);
		visualize(features, TYPE.FEATURE);
	}
	
	function loadDiscover(data) {
		var fingerprints = [flattenByRows(data.fingerprints)[position]];
		
		graphCount = fingerprints.length;
		
		visualize(fingerprints, TYPE.FINGERPRINT);
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
						case TYPE.FEATURE:
							input = parseFeature(data, item.x, item.y, item.z);
							switch (item.type) {
								case FEATURE.HEIGHT:
									Parrot.FeatureByHeight(input);
									break;
								case FEATURE.COLOR:
									Parrot.FeatureByColor(input);
									break;
								case FEATURE.POSITION:
									Parrot.FeatureByPosition(input);
									break;
							}
							break;
						default:
							input = parseFingerprint(data, item.x, item.y, item.z);
							Parrot.Fingerprint(input);
					}
				});
			})(i);
		}
	}
	
	
	//// Data ////
	function flattenByRows(rows) {
		var flattened = [];
		for (var i = 0; i < rows.length; i++) {
			for (var j = 0; j < rows[i].length; j++) {
				flattened.push(rows[i][j]);
			}
		}
		
		return flattened;
	}
	
	function flattenByColumns(rows) {
		var flattened = [[], []];
		for (var i = 0; i < rows.length; i++) {
			for (var j = 0; j < 2; j++) {
				flattened[j].push(rows[i][j]);
			}
		}
		
		return flattened;
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
		displayExplore: displayExplore,
		displayCompare: displayCompare,
		displayDiscover: displayDiscover
	};
})(jQuery);