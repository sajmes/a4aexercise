
import { useBlockProps } from '@wordpress/block-editor';

export default function save() {
	return (
		<div { ...useBlockProps.save() }>
			<div className="asb-wizard" data-asb-wizard>
				<div className="asb-progress">
					<div className="asb-progress__bar">
						<div className="asb-progress__fill" data-asb-progress-fill />
					</div>
					<span className="asb-progress__label" data-asb-progress-label>Step 1 of 5</span>
				</div>
				<div className="asb-card" data-asb-card>
					<h3 className="asb-card__question" data-asb-question></h3>
					<div className="asb-card__options" data-asb-options></div>
					<div className="asb-card__nav" data-asb-nav></div>
				</div>
				<div className="asb-result" data-asb-result style={ { display: 'none' } }>
					<h2 className="asb-result__title" data-asb-result-title></h2>
					<p className="asb-result__description" data-asb-result-description></p>
					<ul className="asb-result__products" data-asb-result-products></ul>
					<div className="asb-result__actions" data-asb-result-actions></div>
				</div>
			</div>
		</div>
	);
}
