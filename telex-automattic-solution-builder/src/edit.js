
import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { useState } from '@wordpress/element';
import './editor.scss';

const QUESTIONS = [
	{
		id: 'siteType',
		label: __( 'What type of site are you building?', 'telex-automattic-solution-builder' ),
		options: [
			{ value: 'content', label: __( 'Content / Blog', 'telex-automattic-solution-builder' ) },
			{ value: 'ecommerce', label: __( 'Ecommerce Store', 'telex-automattic-solution-builder' ) },
			{ value: 'membership', label: __( 'Membership / Subscription', 'telex-automattic-solution-builder' ) },
			{ value: 'enterprise', label: __( 'Corporate / Enterprise', 'telex-automattic-solution-builder' ) },
			{ value: 'portfolio', label: __( 'Portfolio / Brochure', 'telex-automattic-solution-builder' ) },
		],
	},
	{
		id: 'traffic',
		label: __( 'What\'s your expected monthly traffic?', 'telex-automattic-solution-builder' ),
		options: [
			{ value: 'under10k', label: __( 'Under 10K visitors', 'telex-automattic-solution-builder' ) },
			{ value: '10k-100k', label: __( '10K – 100K visitors', 'telex-automattic-solution-builder' ) },
			{ value: '100k-1m', label: __( '100K – 1M visitors', 'telex-automattic-solution-builder' ) },
			{ value: 'over1m', label: __( 'Over 1M visitors', 'telex-automattic-solution-builder' ) },
		],
	},
	{
		id: 'ecommerce',
		label: __( 'Do you need ecommerce functionality?', 'telex-automattic-solution-builder' ),
		options: [
			{ value: 'no', label: __( 'No', 'telex-automattic-solution-builder' ) },
			{ value: 'basic', label: __( 'Basic (simple products)', 'telex-automattic-solution-builder' ) },
			{ value: 'advanced', label: __( 'Advanced (subscriptions, marketplaces, complex inventory)', 'telex-automattic-solution-builder' ) },
		],
	},
	{
		id: 'security',
		label: __( 'What level of security and compliance do you need?', 'telex-automattic-solution-builder' ),
		options: [
			{ value: 'standard', label: __( 'Standard', 'telex-automattic-solution-builder' ) },
			{ value: 'enhanced', label: __( 'Enhanced (SOC 2, PCI)', 'telex-automattic-solution-builder' ) },
			{ value: 'enterprise', label: __( 'Enterprise (FedRAMP, custom SLAs)', 'telex-automattic-solution-builder' ) },
		],
	},
	{
		id: 'budget',
		label: __( 'What\'s your budget range for hosting?', 'telex-automattic-solution-builder' ),
		options: [
			{ value: 'under50', label: __( 'Under $50/mo', 'telex-automattic-solution-builder' ) },
			{ value: '50-200', label: __( '$50 – $200/mo', 'telex-automattic-solution-builder' ) },
			{ value: '200-1000', label: __( '$200 – $1,000/mo', 'telex-automattic-solution-builder' ) },
			{ value: 'over1000', label: __( '$1,000+/mo', 'telex-automattic-solution-builder' ) },
		],
	},
];

export default function Edit() {
	const blockProps = useBlockProps();
	const [ currentStep, setCurrentStep ] = useState( 0 );
	const [ answers, setAnswers ] = useState( {} );

	const question = QUESTIONS[ currentStep ];
	const selectedValue = answers[ question.id ] || '';

	const handleSelect = ( value ) => {
		setAnswers( { ...answers, [ question.id ]: value } );
	};

	const handleNext = () => {
		if ( currentStep < QUESTIONS.length - 1 && selectedValue ) {
			setCurrentStep( currentStep + 1 );
		}
	};

	const handleBack = () => {
		if ( currentStep > 0 ) {
			setCurrentStep( currentStep - 1 );
		}
	};

	return (
		<div { ...blockProps }>
			<div className="asb-wizard">
				<div className="asb-progress">
					<div className="asb-progress__bar">
						<div
							className="asb-progress__fill"
							style={ { width: `${ ( ( currentStep + 1 ) / QUESTIONS.length ) * 100 }%` } }
						/>
					</div>
					<span className="asb-progress__label">
						{ __( 'Step', 'telex-automattic-solution-builder' ) } { currentStep + 1 } { __( 'of', 'telex-automattic-solution-builder' ) } { QUESTIONS.length }
					</span>
				</div>
				<div className="asb-card">
					<h3 className="asb-card__question">{ question.label }</h3>
					<div className="asb-card__options">
						{ question.options.map( ( option ) => (
							<button
								key={ option.value }
								type="button"
								className={ `asb-option ${ selectedValue === option.value ? 'is-selected' : '' }` }
								onClick={ () => handleSelect( option.value ) }
							>
								<span className="asb-option__radio">
									{ selectedValue === option.value && <span className="asb-option__radio-dot" /> }
								</span>
								<span className="asb-option__label">{ option.label }</span>
							</button>
						) ) }
					</div>
					<div className="asb-card__nav">
						{ currentStep > 0 && (
							<button type="button" className="asb-btn asb-btn--secondary" onClick={ handleBack }>
								{ __( 'Back', 'telex-automattic-solution-builder' ) }
							</button>
						) }
						<button
							type="button"
							className={ `asb-btn asb-btn--primary ${ ! selectedValue ? 'is-disabled' : '' }` }
							onClick={ handleNext }
							disabled={ ! selectedValue }
						>
							{ currentStep < QUESTIONS.length - 1
								? __( 'Next', 'telex-automattic-solution-builder' )
								: __( 'See Recommendation', 'telex-automattic-solution-builder' ) }
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
