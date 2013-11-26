var UI = (function($) {
	//// Attributes ////
	var config = {
		onDropdownClick: function() {}
	};
	
	
	//// Public ////
	function init(c) {
		setConfig(c);
	}
	
	function displayTrackList(tracks, position) {
		var dropdown = $(".dropdown-menu");
		$(dropdown[position]).on("click", "li", onDropdownClick);
		
		for (var i = 0; i < tracks.length; i++) {
			var track ="<li data-pos=" + position + " data-track=" + i + "><a href=''>" + tracks[i].title + " (" + tracks[i].artist + ")</a></li>";
			$(dropdown[position]).append(track);
		}
	}
	
	function displayPresetList(presets) {
		var dropdown = $(".dropdown-menu");
		dropdown.on("click", "li", onDropdownClick);
		
		for (var i = 0; i < presets.length; i++) {
			var preset = "<li data-track=" + i + "><a href=''>" + presets[i].title + "</a></li>";
			$(dropdown[0]).append(preset);
		}
	}
		
	function displayTrackInfo(track, position) {
		displayBasicInformation(track, position);
		displayAnalysisSummary(track, position);
	}
	
	function toggleProgress(on) {
		var visibility = on ? "visible" : "hidden";
		$(".progress").css("visibility", visibility);
	}
	
	
	//// Private ////
	function displayBasicInformation(track, position) {
		$($(".cover")[position]).attr("src", track.thumb);
		$($(".cover")[position]).attr("alt", track.artist);
		
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
		
		var container = $($(".info")[position]).empty();
		for (var i = 0; i < entries.length; i++) {
			container.append(entries[i]);
		}
	}
	
	function displayAnalysisSummary(track, position) {
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
		
		var container = $($(".summary")[position]).empty();
		for (var i = 0; i < entries.length; i++) {
			container.append(entries[i]);
		}
		
		$(".summary span").tooltip();
	}
	
	
	//// Events ////
	function onDropdownClick(event) {
		event.preventDefault();
		
		var item = $(event.currentTarget);
		var data = item.data();
		
		config.onDropdownClick(data);
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
		displayPresetList: displayPresetList,
		displayTrackInfo: displayTrackInfo,
		toggleProgress: toggleProgress
	};
})(jQuery);