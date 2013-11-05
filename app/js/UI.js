var UI = (function($) {
	//// Attributes ////
	var config = {
		onDropdownClick: function() {}
	};
	
	
	//// Public ////
	function init(c) {
		setConfig(c);
	}
	
	function displayTrackList(tracks) {
		var dropdown = $(".dropdown-menu");
		dropdown.on("click", "li", onTrackClick);
		
		$.each(tracks, function(key, value) {
			var track ="<li data-key=" + key + "><a href=''>" + value.title + " (" + value.artist + ")</a></li>";
			dropdown.append(track);
		});
	}
	
	function displayTrackInfo(track) {
		displayBasicInformation(track);
		displayAnalysisSummary(track);
	}
	
	function toggleProgress(on) {
		var visibility = on ? "visible" : "hidden";
		$(".progress").css("visibility", visibility);
	}
	
	
	//// Private ////
	function displayBasicInformation(track) {
		$(".meta img").attr("src", Constants.TRACKS.OUTPUT + track.directory + "thumb.jpg");
		$(".meta img").attr("alt", track.artist);
		
		var entries = [];
		
		if (track.URL !== undefined) {
			entries[0] = "<p><a href='" + track.URL + "'>" + track.title + "</a> by " + track.artist + "</p>";
		} else {
			entries[0] = "<p>" + track.title + " by " + track.artist + "</p>";
		}
		entries[1] = "<p>" + track.album + "</p>";
		entries[2] ="<p>" +
			"<em>Time</em>: " + getPrettyTime(track.duration) + " | " +
			"<em>Sample rate</em>: " + track.sample_rate / 1000 + " kHz | " +
			"<em>Bit rate</em>: " + track.bitrate + " kb/s" +
			"</p>";
		
		var container = $(".info").empty();
		for (var i = 0; i < entries.length; i++) {
			container.append(entries[i]);
		}
	}
	
	function displayAnalysisSummary(track) {
		var entries = [];
		entries[0] = "<p>" +
			"<span title='Speechiness' class='glyphicon glyphicon-comment'></span>" + ~~(track.speechiness * 100) + "%" +
			"<span title='Acousticness' class='glyphicon glyphicon-leaf'></span>" + ~~(track.acousticness * 100) + "%" +
			"<span title='Liveness' class='glyphicon glyphicon-eye-open'></span>" + ~~(track.liveness * 100) + "%" +
			"<span title='Valence' class='glyphicon glyphicon-certificate'></span>" + ~~(track.valence * 100) + "%" +
			"<span title='Energy' class='glyphicon glyphicon-fire'></span>" + ~~(track.energy * 100) + "%" +
			"<span title='Danceability' class='glyphicon glyphicon-record'></span>" + ~~(track.danceability * 100) + "%" +
			"</p>";
		entries[1] = "<p>" +
			"<em>Signature</em>: " + getPrettySignature(track.time_signature) + " | " +
			"<em>Tempo</em>: " + Math.round(track.tempo) + " BPM | " +
			"<em>Key</em>: " + getPrettyKey(track.key) + " | " +
			"<em>Mode</em>: " + getPrettyMode(track.mode) +
			"</p>";
		entries[2] = "<p>" + "<em>Genre</em>: " + track.genre + "</p>";
		
		var container = $(".summary").empty();
		for (var i = 0; i < entries.length; i++) {
			container.append(entries[i]);
		}
		
		$(".summary span").tooltip();
	}
	
	
	//// Events ////
	function onTrackClick(event) {
		event.preventDefault();
		
		var item = $(event.currentTarget);
		var key = item.data().key;
		
		config.onTrackClick(key);
	}
	
	
	//// Utilities ////
	function getPrettyTime(time) {
		minutes = ~~(time / 60);
		seconds = ~~(time % 60);
		seconds = (seconds < 10) ? "0" + seconds : seconds;
		
		return minutes + ":" + seconds;
	}
	
	function getPrettySignature(value) {
		switch (value) {
			case -1:
				return "No";
				break;
			case 1:
				return "Varied";
				break;
			default:
				return value + "/7";
		}
	}
	
	function getPrettyKey(value) {
		return ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"][value];
	}
	
	function getPrettyMode(value) {
		return (value === 0) ? "Minor" : "Major";
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
		displayTrackList: displayTrackList,
		displayTrackInfo: displayTrackInfo,
		toggleProgress: toggleProgress
	};
})(jQuery);