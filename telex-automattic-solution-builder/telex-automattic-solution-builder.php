<?php
/**
 * Plugin Name:       Automattic Solution Builder
 * Description:       An interactive step-by-step questionnaire that recommends the ideal Automattic product stack based on your site type, traffic, ecommerce needs, security requirements, and budget.
 * Version:           0.1.0
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            WordPress Telex
 * License:           GPLv2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       telex-automattic-solution-builder
 *
 * @package AutomatticSolutionBuilder
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 */
if ( ! function_exists( 'automattic_solution_builder_telex_automattic_solution_builder_block_init' ) ) {
	function automattic_solution_builder_telex_automattic_solution_builder_block_init() {
		register_block_type( __DIR__ . '/build/' );
	}
}
add_action( 'init', 'automattic_solution_builder_telex_automattic_solution_builder_block_init' );