var Explore = (function($) {
	//// Attributes ////
	var tracks = [];
	var current = 0;
	
	
	//// Functions ////
	// Initialization //
	function init() {
		$.getJSON(Constants.TRACKS.EXPLORE, loadTrackList);
	}
	
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
			onDropdownClick: onDropdownClick
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
		UI.displayTrackList(tracks, 0);
		displayTrack();
	}
	
	function displayTrack() {
		var track = tracks[current];
		
		UI.displayTrackInfo(track, 0);
		Visualizer.displayExplore(track);
	}
	
	
	// Player //
	function loadPlayerMedia() {
		var track = tracks[current];
		var path = Constants.TRACKS.INPUT + track.filename;
		
		Player.loadTrack(path, 0);
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
	function onDropdownClick(data) {
		onDrawingStarted();
		
		current = data.track;
		loadPlayerMedia();
		displayTrack();
	}
	
	
	// Visualizer //
	function onDrawingStarted() {
		UI.toggleProgress(true);
	}
	
	function onDrawingDone() {
		UI.toggleProgress(false);
	}
	
	
	return {
		init: init
	};
})(jQuery);