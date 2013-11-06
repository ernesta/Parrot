<?php

define("GRID_SIZE", 12);
define("FEATURES", "features");
define("FINGERPRINTS", "fingerprints");

function getConfig($configFile) {
	$config = @json_decode(file_get_contents($configFile));
	if ($config === null) {
		die("No configuration found!");
	}
	
	return $config;
}

function generateFeatures($configFile) {
	generateHTML(getConfig($configFile), FEATURES);
}

function generateFingerprints($configFile) {
	generateHTML(getConfig($configFile), FINGERPRINTS);
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
			<p>$caption</p>
			<div id='$id'></div>
		</div>\n";
}