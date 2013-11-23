(function($) {
	var page = $("body").attr("class");
	
	switch (page) {
		case Constants.PAGES.EXPLORE:
			Explore.init();
			break;
		case Constants.PAGES.COMPARE:
			Compare.init();
			break;
		case Constants.PAGES.DISCOVER:
			Discover.init();
	}
})(jQuery);