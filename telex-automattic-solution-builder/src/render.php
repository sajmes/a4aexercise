<?php
/**
 * Renders the Automattic Solution Builder block on the frontend.
 *
 * @package AutomatticSolutionBuilder
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Block default content.
 * @var WP_Block $block      Block instance.
 */

$align_class = ! empty( $attributes['align'] ) ? 'align' . $attributes['align'] : '';
$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => $align_class ) );
?>
<div <?php echo $wrapper_attributes; ?>>
	<div class="asb-wizard" data-asb-wizard>
		<div class="asb-progress">
			<div class="asb-progress__bar">
				<div class="asb-progress__fill" data-asb-progress-fill></div>
			</div>
			<span class="asb-progress__label" data-asb-progress-label>Step 1 of 5</span>
		</div>
		<div class="asb-card" data-asb-card>
			<h3 class="asb-card__question" data-asb-question></h3>
			<div class="asb-card__options" data-asb-options></div>
			<div class="asb-card__nav" data-asb-nav></div>
		</div>
		<div class="asb-result" data-asb-result style="display:none">
			<h2 class="asb-result__title" data-asb-result-title></h2>
			<p class="asb-result__description" data-asb-result-description></p>
			<ul class="asb-result__products" data-asb-result-products></ul>
			<div class="asb-result__actions" data-asb-result-actions></div>
		</div>
	</div>
</div>
