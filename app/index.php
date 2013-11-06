<!DOCTYPE html>
<?php require_once 'functions.php'; ?>
<html lang="en">
	<?php require 'templates/head.php'; ?>
<body>
	<!-- Navbar -->
		<?php require 'templates/navbar.php'; ?>
	<!-- /Navbar -->

	<!-- Meta -->
		<?php require 'templates/meta.php'; ?>
	<!-- /Meta -->

	<!-- Graphs -->
	<div id="graphs" class="container">
		<?php generateFingerprints('js/config/index.json'); ?>

		<?php generateFeatures('js/config/index.json'); ?>
	</div>
	<!-- /Graphs -->

	<!-- Scripts -->
		<?php require 'templates/footer.php'; ?>
	<!-- /Scripts -->
  </body>
</html>