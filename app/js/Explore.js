var Explore = (function($) {
	//// Attributes ////
	var tracks = [];
	var current = 0;
	
	var extensions = 0;
	var displays = 0;
	
	
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
		attachListeners();
	}
	
	function attachListeners() {
		$(".controls").click(function(event) {
			var position = $(event.currentTarget).data().pos;
			Player.setOrigin(position);
		});
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
		extensions = tracks.length;
		
		extendTrackList();
	}
	
	function extendTrackList() {
		for (var i = 0; i < tracks.length; i++) {
			(function(i) {
				var path = Constants.TRACKS.OUTPUT + tracks[i].directory + Constants.TRACK.INFO;
				
				$.getJSON(path, function(track) {
					$.extend(tracks[i], track);
					
					if (--extensions === 0) {
						initApp();
					}
				});
			})(i);
		}
	}
	
	
	// Display //
	function displayContent(track) {
		UI.displayTrackList(tracks, 0);
		
		var track = tracks[current];
		displayTrack(track);
	}
	
	function displayTrack(track) {
		UI.displayTrackInfo(track, 0);
		Visualizer.displayExplore(track);
	}
	
	
	// Player //
	function loadPlayerMedia(track) {
		var path = Constants.TRACKS.INPUT + track.filename;
		Player.loadTrack(path, 0);
	}
	
	
	//// Events ////
	// Player //
	function onPlayerReady() {
		loadPlayerMedia(tracks[current]);
	}
	
	function onTrackPlay() {}
	
	function onTrackStop() {}
	
	function onTrackClear() {}
	
	
	// UI //
	function onDropdownClick(data) {
		current = data.track;
		var track = tracks[current];
		
		loadPlayerMedia(track);
		displayTrack(track);
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