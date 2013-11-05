<?php

define('GRID_SIZE', 12);

function getConfig($configFile) {
	$config = @json_decode(file_get_contents($configFile));
	if ($config === null) {
		die("no config found!");
	}
	return $config;
}

function generateFeatures($configFile) {
	generateHTML(getConfig($configFile), "features");
}

function generateFingerprints($configFile) {
	generateHTML(getConfig($configFile), "fingerprints");
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
		"<div class='col-md-$cellSize feature'>
			<p>$caption</p>
			<div id='$id'></div>
		</div>\n";
}
