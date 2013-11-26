var Compare = (function($) {
	//// Attributes ////
	var tracks = [];
	var current = [0, 0];
	
	var players = 0;
	var extensions = 0;
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
		
		for (var i = 0; i < tracks.length; i++) {
			extensions += tracks[i].length;
		}
		
		extendTrackList();
	}
	
	function extendTrackList() {
		for (var i = 0; i < tracks.length; i++) {
			for (var j = 0; j < tracks[i].length; j++) {
				(function(i, j) {
					var path = Constants.TRACKS.OUTPUT + tracks[i][j].directory + Constants.TRACK.INFO;
					
					$.getJSON(path, function(track) {
						$.extend(tracks[i][j], track);
						
						if (--extensions === 0) {
							initApp();
						}
					});
				})(i, j);
			}
		}
	}
	
	
	// Display //
	function displayContent(track) {
		for (var i = 0; i < tracks.length; i++) {
			UI.displayTrackList(tracks[i], i);
		}
		
		var position = displays % tracks[displays].length;
		var track = tracks[displays][current[displays]];
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
		
		loadPlayerMedia(tracks[0][current[0]], 0);
		loadPlayerMedia(tracks[1][current[1]], 1);
	}
	
	function onTrackPlay() {}
	
	function onTrackStop() {}
	
	function onTrackClear() {}
	
	
	// UI //
	function onDropdownClick(data) {
		current[data.pos] = data.track;
		var track = tracks[data.pos][data.track];
		
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
			var track = tracks[displays][current[displays]];
			displayTrack(track, displays);
		} else {
			UI.toggleProgress(false);
			displays = 1;
		}
	}
	
	
	return {
		init: init
	};
})(jQuery);