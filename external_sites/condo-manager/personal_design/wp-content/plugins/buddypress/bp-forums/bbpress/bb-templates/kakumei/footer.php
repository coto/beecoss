		</div>
	</div>
	<div id="footer" role="contentinfo">
		<p><?php bloginfo('name'); ?> - &copy;Protoboard<!--#coto--></p>

		<!-- If you like showing off the fact that your server rocks -->
		<!-- <p class="showoff">
<?php
global $bbdb;
printf(
__( 'This page generated in %s seconds, using %d queries.' ),
bb_number_format_i18n( bb_timer_stop(), 2 ),
bb_number_format_i18n( $bbdb->num_queries )
);
?>
		</p> -->
	</div>

<?php do_action('bb_foot'); ?>

</body>
</html>
