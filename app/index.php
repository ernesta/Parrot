<?php 

if ((isset($_GET['page'])) && (file_exists($_GET['page'] . '.php'))) {
	$page = $_GET['page'] . '.php';
} else {
	$page = 'explore.php';
}

require_once($page);
