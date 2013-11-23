var Player = (function($) {
	//// Constants ////
	var SOLUTION = "html";
	var FORMAT = "mp3";
	var PRELOAD = "auto";
	
	var PLAYER = ".jp-jplayer";
	var CONTROL = "#control_"
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
	
	var players = [];
	var origin = 0;
	
	
	function init(c) {
		setConfig(c);
		
		for (var i = 0; i < $(PLAYER).length; i++) {
			$($(PLAYER)[i]).jPlayer({
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
			
			$($(PLAYER)[i]).bind($.jPlayer.event.play, onPlay);
			$($(PLAYER)[i]).bind($.jPlayer.event.pause, onStop);
			$($(PLAYER)[i]).bind($.jPlayer.event.emptied, onClear);
		}
	}
	
	//// Player ////
	function loadTrack(path, position) {
		$(players[position]).jPlayer("setMedia", {
			mp3: path
		});
	}
	
	function onPlayerReady(event) {
		players.push(event.target);
		config.onPlayerReady();
	}
	
	function onPlay(event) {
		pauseOthers();
		displayStop($(event.target));
		config.onPlay();
	}
	
	function pauseOthers() {
		for (var i = 0; i < players.length; i++) {
			var player = $(players[i]);
			var key = player.attr("id").split("_");
			key = +key[key.length - 1];
			
			if (key !== origin) {
				player.jPlayer("stop");
			}
		}
	}
	
	function setOrigin(value) {
		origin = value;
	}
	
	function onStop(event) {
		displayPlay($(event.target));
		config.onStop();
	}
	
	function onClear(event) {
		displayPlay($(event.target));
		config.onClear();
	}
	
	function displayPlay(container) {
		var current = container.attr("id").split("_");
		current = current[current.length - 1];
		container = CONTROL + current;
		
		$(container + " " + STOP).css("display", "none");
		$(container + " " + PLAY).css("display", "block");
	}
	
	function displayStop(container) {
		var current = container.attr("id").split("_");
		current = current[current.length - 1];
		container = CONTROL + current;
		
		$(container + " " + PLAY).css("display", "none");
		$(container + " " + STOP).css("display", "block");
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
		loadTrack: loadTrack,
		setOrigin: setOrigin
	};
})(jQuery);