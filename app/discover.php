<!DOCTYPE html>
<?php require_once "functions.php"; ?>
<html lang="en">
	<?php require "templates/head.php"; ?>
	<body class="discover">
		<!-- Navbar -->
		<?php generateNavigationBar(DISCOVER); ?>
		<!-- /Navbar -->
	
		<!-- Graphs -->
		<div id="graphs" class="container">
			<?php generateFingerprints(DISCOVER); ?>
		</div>
		<!-- /Graphs -->
	
		<!-- Scripts -->
		<?php require "templates/footer.php"; ?>
		<!-- /Scripts -->
	</body>
</html>