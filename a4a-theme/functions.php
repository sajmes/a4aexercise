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
	check_ajax_referer( 'a4a_pageview_nonce', '_nonce' );

	$count = (int) get_option( 'a4a_pageview_count', 0 );
	update_option( 'a4a_pageview_count', $count + 1, false );
	wp_send_json_success( array( 'count' => $count + 1 ) );
}
add_action( 'wp_ajax_a4a_pageview', 'a4a_theme_track_pageview' );
add_action( 'wp_ajax_nopriv_a4a_pageview', 'a4a_theme_track_pageview' );

/**
 * Enqueue analytics tracking script.
 */
function a4a_theme_enqueue_analytics() {
	wp_register_script( 'a4a-analytics', '', array(), '1.0.0', true );
	wp_enqueue_script( 'a4a-analytics' );
	wp_add_inline_script(
		'a4a-analytics',
		'(function() {' .
			'var xhr = new XMLHttpRequest();' .
			'xhr.open("POST", "' . esc_url( admin_url( 'admin-ajax.php' ) ) . '", true);' .
			'xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");' .
			'xhr.send("action=a4a_pageview&_nonce=' . wp_create_nonce( 'a4a_pageview_nonce' ) . '");' .
		'})();'
	);
}
add_action( 'wp_enqueue_scripts', 'a4a_theme_enqueue_analytics' );

/**
 * Handle contact form submission.
 */
function a4a_theme_handle_contact_form() {
	if ( ! isset( $_POST['a4a_contact_nonce'] ) ) {
		return;
	}

	if ( ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['a4a_contact_nonce'] ) ), 'a4a_contact_submit' ) ) {
		wp_die( esc_html__( 'Security check failed.', 'a4a-theme' ) );
	}

	$name    = isset( $_POST['name'] ) ? sanitize_text_field( wp_unslash( $_POST['name'] ) ) : '';
	$email   = isset( $_POST['email'] ) ? sanitize_email( wp_unslash( $_POST['email'] ) ) : '';
	$agency  = isset( $_POST['agency'] ) ? sanitize_text_field( wp_unslash( $_POST['agency'] ) ) : '';
	$message = isset( $_POST['message'] ) ? sanitize_textarea_field( wp_unslash( $_POST['message'] ) ) : '';

	if ( empty( $name ) || empty( $email ) || empty( $message ) ) {
		return;
	}

	$submissions   = get_option( 'a4a_contact_submissions', array() );
	$submissions[] = array(
		'name'    => $name,
		'email'   => $email,
		'agency'  => $agency,
		'message' => $message,
		'date'    => current_time( 'mysql' ),
	);
	update_option( 'a4a_contact_submissions', $submissions );

	wp_safe_redirect( add_query_arg( 'contact', 'success', wp_get_referer() ) );
	exit;
}
add_action( 'admin_post_a4a_contact', 'a4a_theme_handle_contact_form' );
add_action( 'admin_post_nopriv_a4a_contact', 'a4a_theme_handle_contact_form' );

/**
 * Contact form shortcode.
 *
 * @return string Form HTML.
 */
function a4a_theme_contact_form_shortcode() {
	$success = isset( $_GET['contact'] ) && 'success' === $_GET['contact'];

	ob_start();

	if ( $success ) {
		?>
		<div class="a4a-contact-success">
			<p><?php esc_html_e( 'Thank you! Your message has been sent. We will be in touch within one business day.', 'a4a-theme' ); ?></p>
		</div>
		<?php
	}
	?>
	<form class="a4a-contact-form" method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
		<input type="hidden" name="action" value="a4a_contact" />
		<?php wp_nonce_field( 'a4a_contact_submit', 'a4a_contact_nonce' ); ?>
		<p>
			<label for="a4a-name"><?php esc_html_e( 'Name', 'a4a-theme' ); ?></label><br />
			<input type="text" id="a4a-name" name="name" required />
		</p>
		<p>
			<label for="a4a-email"><?php esc_html_e( 'Email', 'a4a-theme' ); ?></label><br />
			<input type="email" id="a4a-email" name="email" required />
		</p>
		<p>
			<label for="a4a-agency"><?php esc_html_e( 'Agency Name', 'a4a-theme' ); ?></label><br />
			<input type="text" id="a4a-agency" name="agency" />
		</p>
		<p>
			<label for="a4a-message"><?php esc_html_e( 'How can we help?', 'a4a-theme' ); ?></label><br />
			<textarea id="a4a-message" name="message" rows="5" required></textarea>
		</p>
		<p>
			<button type="submit" class="wp-element-button"><?php esc_html_e( 'Send Message', 'a4a-theme' ); ?></button>
		</p>
	</form>
	<?php

	return ob_get_clean();
}
add_shortcode( 'a4a_contact_form', 'a4a_theme_contact_form_shortcode' );

/**
 * Enqueue contact form styles.
 */
function a4a_theme_enqueue_contact_styles() {
	if ( ! is_page( 'contact' ) ) {
		return;
	}

	wp_register_style( 'a4a-contact', false );
	wp_enqueue_style( 'a4a-contact' );
	wp_add_inline_style(
		'a4a-contact',
		'.a4a-contact-form input[type="text"],' .
		'.a4a-contact-form input[type="email"],' .
		'.a4a-contact-form textarea {' .
			'width: 100%;' .
			'padding: 0.75rem 1rem;' .
			'border: 1px solid #A7AAAD;' .
			'border-radius: 4px;' .
			'font-size: 1rem;' .
			'font-family: inherit;' .
		'}' .
		'.a4a-contact-success {' .
			'background: var(--wp--preset--color--accent-4);' .
			'padding: 1rem 1.5rem;' .
			'border-radius: 4px;' .
			'margin-bottom: 1.5rem;' .
		'}'
	);
}
add_action( 'wp_enqueue_scripts', 'a4a_theme_enqueue_contact_styles' );
