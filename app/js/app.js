(function($) {
	//// Constants ////
	var PATH = "../data/output/161e4df51c6495d5e3f95d313cbb522a/";
	
	var BAR_CHART = 0;
	var HEATMAP = 1;
	
	
	//// Features ////
	var bars = [
		{container: "#notes1", file: "notes.tsv", x: "time", y: "noteMIDI", z: null, colors: ["#8A9B0F", "#8A9B0F"]},
		{container: "#notes2", file: "notes.tsv", x: "time", y: null, z: "noteMIDI", colors: ["#C4ED68", "#2A5C0B"]},
		{container: "#chords1", file: "chords.tsv", x: "time", y: "chordKey", z: null, colors: ["#E84A5F", "#E84A5F"]},
		{container: "#chords2", file: "chords.tsv", x: "time", y: null, z: "chordKey", colors: ["#E43D82", "#452B72"]},
		{container: "#chords4", file: "chords.tsv", x: "time", y: null, z: "chordMode", colors: ["#2E2633", "#99173C"]},
		{container: "#timbre1", file: "ZC.tsv", x: "time", y: null, z: "ZC", colors: ["#00C7FF", "#07093D"]},
		{container: "#intensity1", file: "RMS.tsv", x: "time", y: "RMS", z: null, colors: ["#FF9900", "#FF9900"]},
		{container: "#intensity2", file: "RMS.tsv", x: "time", y: null, z: "RMS", colors: ["#F9D423", "#E15E32"]}
	];
	
	var heats = [
		{container: "#chords3", file: "chords.tsv", x: "time", y: "chordNotes", z: null, colors: ["#EEEEEE", "#CC2A41"]},
		{container: "#timbre2", file: "MFCC.tsv", x: "time", y: "MFCC", z: "MFCC", colors: ["#00DFFC", "#000524"]}
	];
	
	
	//// Flow ////
	visualize(bars, BAR_CHART);
	visualize(heats, HEATMAP);
	
	
	//// Functions ////
	function visualize(features, type) {
		for (var i = 0; i < features.length; i++) {
			(function(index) {
				d3.tsv(PATH + features[index].file, function(error, data) {
					var bar = features[index];
					
					var config = createConfig(bar);
					var input = parse(data, bar.x, bar.y, bar.z);
					
					Parrot.init(config);
					
					if (type === BAR_CHART) {
						Parrot.BarChart(input);
					} else {
						Parrot.Heatmap(input);
					}
				});
			})(i)
		}
	}
	
	function createConfig(config) {
		return {
			container: config.container,
			colors: config.colors
		};
	}
	
	function parse(data, x, y, z) {
		var input = [];
		
		for (var i = 0; i < data.length; i++) {
			input[i] = {};
			
			input[i].x = (x !== null) ? JSON.parse(data[i][x]) : 1;
			input[i].y = (y !== null) ? JSON.parse(data[i][y]) : 1;
			input[i].z = (z !== null) ? JSON.parse(data[i][z]) : 1;
		}
		
		return input;
	}
})(jQuery);