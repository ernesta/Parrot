var Compare = (function($) {
	//// Attributes ////
	var tracks = [];
	var current = [0, 1];
	
	var players = 0;
	var displays = 0;
	
	
	//// Functions ////
	// Initialization //
	function init() {
		$.getJSON(Constants.TRACKS.COMPARE, loadTrackList);
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
	function displayContent(track) {
		for (var i = 0; i < current.length; i++) {
			UI.displayTrackList(tracks, i);
		}
		
		var track = tracks[current[displays]];
		displayTrack(track, displays);
	}
	
	function displayTrack(track, position) {
		UI.displayTrackInfo(track, position);
		Visualizer.displayCompare(track, position);
	}
	
	
	// Player //
	function loadPlayerMedia(track, position) {
		var path = Constants.TRACKS.INPUT + track.filename;
		Player.loadTrack(path, position);
	}
	
	
	//// Events ////
	// Player //
	function onPlayerReady() {
		if (++players === current.length) {
			onPlayersReady();
		}
	}
	
	function onPlayersReady() {
		players = 0;
		
		loadPlayerMedia(tracks[current[0]], 0);
		loadPlayerMedia(tracks[current[1]], 1);
	}
	
	function onTrackPlay() {}
	
	function onTrackStop() {}
	
	function onTrackClear() {}
	
	
	// UI //
	function onDropdownClick(data) {
		onDrawingStarted();
		
		current[data.pos] = data.track;
		var track = tracks[data.track];
		
		displayTrack(track, data.pos);
		loadPlayerMedia(track, data.pos);
	}
	
	
	// Visualizer //
	function onDrawingStarted() {
		UI.toggleProgress(true);
	}
	
	function onDrawingDone() {
		displays++;
		if (displays < current.length) {
			var track = tracks[current[displays]];
			displayTrack(track, displays);
		} else {
			UI.toggleProgress(false);
		}
	}
	
	
	return {
		init: init
	};
})(jQuery);