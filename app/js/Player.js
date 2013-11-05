var Player = (function($) {
	//// Constants ////
	var SOLUTION = "html";
	var FORMAT = "mp3";
	var PRELOAD = "auto";
	
	var PLAYER = ".jp-jplayer";
	var CONTROLS = ".controls";
	var PLAY = ".play";
	var STOP = ".stop";
	
	
	//// Properties ////
	var config = {
		onPlayerReady: function() {},
		onPlay: function() {},
		onStop: function() {},
		onClear: function() {}
	};
	
	var player = {};
	
	
	function init(c) {
		setConfig(c);
		
		$(PLAYER).jPlayer({
			ready: onPlayerReady,
			solution: SOLUTION,
			supplied: FORMAT,
			preload: PRELOAD,
			volume: 1,
			cssSelectorAncestor: CONTROLS,
			cssSelector: {
				play: PLAY,
				stop: STOP
			}
		});
		
		$(PLAYER).bind($.jPlayer.event.play, onPlay);
		$(PLAYER).bind($.jPlayer.event.pause, onStop);
		$(PLAYER).bind($.jPlayer.event.emptied, onClear);
	}
	
	//// Player ////
	function loadTrack(path) {
		$(player).jPlayer("setMedia", {
			mp3: path
		});
	}
	
	function onPlayerReady(event) {
		player = event.target;
		config.onPlayerReady();
	}
	
	function onPlay(event) {
		displayStop();
		config.onPlay();
	}
	
	function onStop(event) {
		displayPlay();
		config.onStop();
	}
	
	function onClear(event) {
		displayPlay();
		config.onClear();
	}
	
	function displayPlay() {
		$(STOP).css("display", "none");
		$(PLAY).css("display", "block");
	}
	
	function displayStop() {
		$(PLAY).css("display", "none");
		$(STOP).css("display", "block");
	}
	
	//// Helpers ////
	function setConfig(c) {
		for (var prop in c) {
			if (c.hasOwnProperty(prop)) {
				config[prop] = c[prop];
			}
		}
	}
	
	return {
		init: init,
		loadTrack: loadTrack
	};
})(jQuery);