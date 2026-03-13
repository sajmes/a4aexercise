<?php
/**
 * A4A Solution Builder — Child theme functions.
 *
 * @package A4A_Theme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enqueue parent theme styles.
 */
function a4a_theme_enqueue_styles() {
	wp_enqueue_style(
		'twentytwentyfive-style',
		get_template_directory_uri() . '/style.css',
		array(),
		wp_get_theme( 'twentytwentyfive' )->get( 'Version' )
	);
}
add_action( 'wp_enqueue_scripts', 'a4a_theme_enqueue_styles' );

/**
 * Ensure the Solution Builder block scripts and styles load on the front page.
 */
function a4a_theme_enqueue_solution_builder() {
	if ( ! is_front_page() ) {
		return;
	}

	$plugin_url = plugins_url( '', WP_PLUGIN_DIR . '/telex-automattic-solution-builder/telex-automattic-solution-builder.php' );
	$view_asset = include WP_PLUGIN_DIR . '/telex-automattic-solution-builder/build/view.asset.php';

	wp_enqueue_script(
		'asb-view',
		$plugin_url . '/build/view.js',
		$view_asset['dependencies'],
		$view_asset['version'],
		true
	);

	wp_enqueue_style(
		'asb-style',
		$plugin_url . '/build/style-index.css',
		array(),
		$view_asset['version']
	);
}
add_action( 'wp_enqueue_scripts', 'a4a_theme_enqueue_solution_builder' );

/**
 * Register navigation menu locations.
 */
function a4a_theme_setup() {
	register_nav_menus(
		array(
			'primary' => __( 'Primary Menu', 'a4a-theme' ),
		)
	);
}
add_action( 'after_setup_theme', 'a4a_theme_setup' );

/**
 * Simple page view counter via AJAX for demo analytics.
 */
function a4a_theme_track_pageview() {
	$count = (int) get_option( 'a4a_pageview_count', 0 );
	update_option( 'a4a_pageview_count', $count + 1 );
	wp_send_json_success( array( 'count' => $count + 1 ) );
}
add_action( 'wp_ajax_a4a_pageview', 'a4a_theme_track_pageview' );
add_action( 'wp_ajax_nopriv_a4a_pageview', 'a4a_theme_track_pageview' );

/**
 * Inline analytics tracking script.
 */
function a4a_theme_analytics_script() {
	?>
	<script>
	(function() {
		var xhr = new XMLHttpRequest();
		xhr.open( 'POST', '<?php echo esc_url( admin_url( 'admin-ajax.php' ) ); ?>', true );
		xhr.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
		xhr.send( 'action=a4a_pageview' );
	})();
	</script>
	<?php
}
add_action( 'wp_footer', 'a4a_theme_analytics_script' );
