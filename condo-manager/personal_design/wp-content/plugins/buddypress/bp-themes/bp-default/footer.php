		</div> <!-- #container -->

		<?php do_action( 'bp_after_container' ) ?>
		<?php do_action( 'bp_before_footer' ) ?>

		<div id="footer">
	    	<p><?php bloginfo('name'); ?> - &copy;Protoboard<!--#coto--></p>

			<?php do_action( 'bp_footer' ) ?>
		</div><!-- #footer -->

		<?php do_action( 'bp_after_footer' ) ?>

		<?php wp_footer(); ?>
<script type="text/javascript">
	var _gaq = _gaq || [];
	_gaq.push(
	['_setAccount', 'UA-15733015-1'],
	['_setDomainName', 'aqua.protoboard.cl'],
	['_setCustomVar', 1, 'Section', 'Life & Style', 3],
	['_trackPageview']
	);

	(function() {
	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	})();
</script>
	</body>

</html>
