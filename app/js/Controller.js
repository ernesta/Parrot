(function($) {
	//// Attributes ////
	var tracks = [];
	var current = 0;
	
	
	//// Flow ////
	$.getJSON(Constants.TRACKS.LIST, loadTrackList);
	
	
	//// Functions ////
	// Initialization //
	function initApp() {
		initPlayer();
		initUI();
		initVisualizer();
		
		displayContent();
	}
	
	function initPlayer() {
		var config = {
			onPlayerReady: onPlayerReady,
			onPlay: onTrackPlay,
			onStop: onTrackStop,
			onClear: onTrackClear
		};
		
		Player.init(config);
	}
	
	function initUI() {
		var config = {
			onTrackClick: onTrackClick
		};
		
		UI.init(config);
	}
	
	function initVisualizer() {
		var config = {
			onDrawingStarted: onDrawingStarted,
			onDrawingDone: onDrawingDone
		};
		
		Visualizer.init(config);
	}
	
	
	// Data //
	function loadTrackList(data) {
		tracks = data;
		extendTrackList();
	}
	
	function extendTrackList() {
		for (var i = 0; i < tracks.length; i++) {
			(function(i) {
				var path = Constants.TRACKS.OUTPUT + tracks[i].directory + Constants.TRACK.INFO;
				
				$.getJSON(path, function(track) {
					$.extend(tracks[i], track);
					
					if (i + 1 === tracks.length) {
						initApp();
					}
				});
			})(i);
		}
	}
	
	
	// Display //
	function displayContent() {
		UI.displayTrackList(tracks);
		displayTrack();
	}
	
	function displayTrack() {
		var track = tracks[current];
		
		UI.displayTrackInfo(track);
		loadPlayerMedia();
		
		Visualizer.displayFingerprints(track);
		Visualizer.displayFeatures(track);
	}
	
	
	// Player //
	function loadPlayerMedia() {
		var track = tracks[current];
		var path = Constants.TRACKS.INPUT + track.filename;
		
		Player.loadTrack(path);
	}
	
	
	//// Events ////
	// Player //
	function onPlayerReady() {
		loadPlayerMedia();
	}
	
	function onTrackPlay() {}
	
	function onTrackStop() {}
	
	function onTrackClear() {}
	
	
	// UI //
	function onTrackClick(key) {
		onDrawingStarted();
		
		current = key;
		displayTrack();
	}
	
	
	// Visualizer //
	function onDrawingStarted() {
		Visualizer.cleanCanvas();
		UI.toggleProgress(true);
	}
	
	function onDrawingDone() {
		UI.toggleProgress(false);
	}
})(jQuery);