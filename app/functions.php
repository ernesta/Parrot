<?php
require_once "constants.php";

function getConfig($configFile) {
	$config = @json_decode(file_get_contents($configFile));
	if ($config === null) {
		die("No configuration found!");
	}
	
	return $config;
}

function generateFeatures($page) {
	$configFile = findConfigFile($page);
	generateHTML(getConfig($configFile), FEATURES);
}

function generateFingerprints($page) {
	$configFile = findConfigFile($page);
	if ($page === DISCOVER) {
		generateDiscoverHTML(getConfig($configFile), FINGERPRINTS);
	} else {
		generateHTML(getConfig($configFile), FINGERPRINTS);
	}
}

function findConfigFile($page) {
	switch ($page) {
		case EXPLORE:
			return EXPLORE_CONF;
		case COMPARE:
			return COMPARE_CONF;
		case DISCOVER:
			return DISCOVER_CONF;
	}
}

function generateDiscoverHTML($config, $property) {
	foreach ($config->{$property} as $key=>$row) {
		$cellSize = GRID_SIZE / count($row);
		
		generateMeta(DISCOVER, $key);
		echo "<div class='row'>\n";
		
		foreach ($row as $cell) {
			generateDiv(substr($cell->container, 1), $cell->caption, $cellSize);
		}
		echo "</div>";
	}
}

function generateHTML($config, $property) {
	foreach ($config->{$property} as $row) {
		$cellSize = GRID_SIZE / count($row);
		
		echo "<div class='row'>\n";
		foreach ($row as $cell) {
			generateDiv(substr($cell->container, 1), $cell->caption, $cellSize);
		}
		echo "</div>";
	}
}

function generateDiv($id, $caption, $cellSize) {
	echo
		"<div class='col-md-$cellSize graph'>
			<div id='$id'></div>
			<p>$caption</p>
		</div>\n";
}

function generateMeta($mode, $position = 0) {
	$summary = file_get_contents("templates/summary.php");
	$class = "meta";
	
	switch ($mode) {
		case EXPLORE:
			$row = generateRow([generatePlayer(0), $summary], $class);
			break;
		case COMPARE:
			$row = generateRow([generatePlayer(0), generatePlayer(1)], $class . " player");
			$row .= generateRow([$summary, $summary], $class);
			break;
		default:
			$row = generateRow([generatePlayer($position * 2), generatePlayer($position * 2 + 1)], $class . " player");
			$row .= generateRow([$summary, $summary], $class);
			
	}
	
	echo $row;
}

function generatePlayer($position) {
	return
		"<div class='col-md-6'>
			<div class='jp-jplayer'></div>
	
			<div data-pos=$position class='controls jp-audio' id='control_$position'>
				<div class='jp-type-single'>
					<div class='jp-gui jp-interface'>
						<ul class='jp-controls'>
							<li><a href='javascript:;' class='play' tabindex='1'>
								<span class='glyphicon glyphicon-play'></span>
							</a></li>
							<li><a href='javascript:;' class='stop' tabindex='1'>
								<span class='glyphicon glyphicon-stop'></span>
							</a></li>
						</ul>
					</div>
				</div>
			</div>
	
			<img class='cover' />
			<div class='info'></div>
		</div>";
}

function generateRow($cells, $class) {
	$content = "";
	foreach ($cells as $index => $cell) {
		$content .= $cell;
	}
	
	return "
		<div class='row $class'>
			$content
		</div>
	";
}

function generateNavigationBar($page) {
	$start = file_get_contents("templates/navbarStart.php");
	$end = file_get_contents("templates/navbarEnd.php");
	
	$active = generateActive($page);
	$dropdowns = generateDropdowns($page);
	
	echo
		"$start
		<ul class='nav navbar-nav'>
			<li$active[0]><a href='index.php'>Explore</a></li>
			<li$active[1]><a href='compare.php'>Compare</a></li>
			<li$active[2]><a href='discover.php'>Discover</a></li>
		</ul>
		$dropdowns
		$end";
}

function generateActive($page) {
	$modes = [EXPLORE, COMPARE, DISCOVER];
	$active = [];
	
	foreach ($modes as $index => $mode) {
		$active[$index] = ($page === $mode) ? " class='active'" : "";
	}
	
	return $active;
}

function generateDropdowns($page) {
	switch ($page) {
		case EXPLORE:
			$dropdowns = generateDropdown("Samples");
			break;
		case COMPARE:
			$dropdowns = generateDropdown("1st sample");
			$dropdowns .= generateDropdown("2nd sample");
			break;
		case DISCOVER:
			$dropdowns = generateDropdown("Presets");
	}
	
	return "
		<ul class='nav navbar-nav navbar-right'>
			$dropdowns
		</ul>
	";
}

function generateDropdown($title) {
	return "<li class='dropdown'>
			<a href='#' class='dropdown-toggle' data-toggle='dropdown'>$title <b class='caret'></b></a>
			<ul class='dropdown-menu'></ul>
		</li>";
}