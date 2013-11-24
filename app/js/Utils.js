var Utils = (function($) {
	function computeMean(values) {
		var sum = 0;
		
		for (var i = 0; i < values.length; i++) {
			sum += values[i];
		}
		
		return sum / values.length;
	}
	
	function computeWeightedMean(values) {
		var sum = 0;
		
		for (var i = 0; i < values.length; i++) {
			sum += (values.length - i) * values[i];
		}
		
		return sum / values.length;
	}
	
	function computeDeviation(values) {
		var mean = computeMean(values);
		var sum = 0;
		
		for (var i = 0; i < values.length; i++) {
			sum += Math.pow(values[i] - mean, 2);
		}
		
		return Math.sqrt(sum / values.length);
	}
	
	
	return {
		computeMean: computeMean,
		computeWeightedMean: computeWeightedMean,
		computeDeviation: computeDeviation
	};
})(jQuery);