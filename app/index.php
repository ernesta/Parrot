<!DOCTYPE html>
<?php define("INDEX", "config/explore.json"); ?>
<?php require_once "functions.php"; ?>
<html lang="en">
	<?php require "templates/head.php"; ?>
	<body>
		<!-- Navbar -->
		<?php require "templates/navbar.php"; ?>
		<!-- /Navbar -->
	
		<!-- Meta -->
		<?php require "templates/meta.php"; ?>
		<!-- /Meta -->
	
		<!-- Graphs -->
		<div id="graphs" class="container">
			<?php generateFingerprints(INDEX); ?>
			<?php generateFeatures(INDEX); ?>
		</div>
		<!-- /Graphs -->
	
		<!-- Scripts -->
		<?php require "templates/footer.php"; ?>
		<!-- /Scripts -->
	</body>
</html>