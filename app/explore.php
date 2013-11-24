<!DOCTYPE html>
<?php require_once "functions.php"; ?>
<html lang="en">
	<?php require "templates/head.php"; ?>
	<body class="explore">
		<!-- Navbar -->
		<?php generateNavigationBar(EXPLORE); ?>
		<!-- /Navbar -->
	
		<!-- Meta -->
		<div class="container">
			<?php generateMeta(EXPLORE); ?>
		</div>
		<!-- /Meta -->
	
		<!-- Graphs -->
		<div id="graphs" class="container">
			<?php generateFingerprints(EXPLORE); ?>
			<?php generateFeatures(EXPLORE); ?>
		</div>
		<!-- /Graphs -->
	
		<!-- Scripts -->
		<?php require "templates/footer.php"; ?>
		<!-- /Scripts -->
	</body>
</html>
