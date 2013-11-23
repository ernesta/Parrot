<!DOCTYPE html>
<?php require_once "functions.php"; ?>
<html lang="en">
	<?php require "templates/head.php"; ?>
	<body class="compare">
		<!-- Navbar -->
		<?php generateNavigationBar(COMPARE); ?>
		<!-- /Navbar -->
	
		<!-- Meta -->
		<div class="container">
			<?php generateMeta(COMPARE); ?>
		</div>
		<!-- /Meta -->
	
		<!-- Graphs -->
		<div id="graphs" class="container">
			<?php generateFingerprints(COMPARE); ?>
			<?php generateFeatures(COMPARE); ?>
		</div>
		<!-- /Graphs -->
	
		<!-- Scripts -->
		<?php require "templates/footer.php"; ?>
		<!-- /Scripts -->
	</body>
</html>