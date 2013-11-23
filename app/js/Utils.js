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
	
	function computeSkewness(values) {
		var m2 = 0;
		var m3 = 0;
		
		var mean = computeMean(values);
		var n = values.length;
		
		for (var i = 0; i < n; i++) {
			m2 += Math.pow(values[i] - mean, 2);
			m3 += Math.pow(values[i] - mean, 3);
		}
		
		m2 = m2 / n;
		m3 = m3 / n;
		
		var skew = Math.pow(m3 / m2, 1.5);
		skew = (Math.sqrt(n * (n - 1)) * skew) / (n - 2);
		
		return skew;
	}
	
	
	return {
		computeMean: computeMean,
		computeWeightedMean: computeWeightedMean,
		computeDeviation: computeDeviation,
		computeSkewness: computeSkewness
	};
})(jQuery);