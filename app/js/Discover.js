var Discover = (function($) {
	//// Attributes ////
	var presets = [];
	var tracks = [];
	var current = 0;
	
	var players = 0;
	var extensions = 0;
	var displays = 0;
	
	
	//// Functions ////
	// Initialization //
	function init() {
		$.getJSON(Constants.TRACKS.DISCOVER, loadPresetList);
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
	function loadPresetList(data) {
		presets = data;
		
		for (var i = 0; i < presets.length; i++) {
			extensions += presets[i].tracks.length;
		}
		
		for (var i = 0; i < presets.length; i++) {
			(function(i) {
				extendTrackList(presets[i].tracks);
			})(i);
		}
		
		tracks = presets[current].tracks;
	}
	
	function extendTrackList(tracks) {
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
		UI.displayPresetList(presets);
		
		var track = tracks[displays];
		displayTrack(track, displays);
	}
	
	function displayTrack(track, position) {
		UI.displayTrackInfo(track, position);
		Visualizer.displayDiscover(track, position);
	}
	
	
	// Player //
	function loadPlayerMedia(track, position) {
		var path = Constants.TRACKS.INPUT + track.filename;
		Player.loadTrack(path, position);
	}
	
	
	//// Events ////
	// Player //
	function onPlayerReady() {
		if (++players === tracks.length) {
			onPlayersReady();
		}
	}
	
	function onPlayersReady() {
		players = 0;
		
		for (var i = 0; i < tracks.length; i++) {
			loadPlayerMedia(tracks[i], i);
		}
	}
	
	function onTrackPlay() {}
	
	function onTrackStop() {}
	
	function onTrackClear() {}
	
	
	// UI //
	function onDropdownClick(data) {
		onDrawingStarted();
		
		current = data.track;
		tracks = presets[current].tracks;
		
		var track = tracks[displays];
		displayTrack(track, displays);
		loadPlayerMedia(track, displays);
	}
	
	
	// Visualizer //
	function onDrawingStarted() {
		UI.toggleProgress(true);
	}
	
	function onDrawingDone() {
		displays++;
		if (displays < tracks.length) {
			var track = tracks[displays];
			displayTrack(track, displays);
			loadPlayerMedia(track, displays);
		} else {
			UI.toggleProgress(false);
			displays = 0;
		}
	}
	
	
	return {
		init: init
	};
})(jQuery);