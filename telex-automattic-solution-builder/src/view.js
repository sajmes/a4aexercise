
( function () {
	'use strict';

	var QUESTIONS = [
		{
			id: 'siteType',
			label: 'What type of site are you building?',
			options: [
				{ value: 'content', label: 'Content / Blog' },
				{ value: 'ecommerce', label: 'Ecommerce Store' },
				{ value: 'membership', label: 'Membership / Subscription' },
				{ value: 'enterprise', label: 'Corporate / Enterprise' },
				{ value: 'portfolio', label: 'Portfolio / Brochure' },
			],
		},
		{
			id: 'traffic',
			label: "What's your expected monthly traffic?",
			options: [
				{ value: 'under10k', label: 'Under 10K visitors' },
				{ value: '10k-100k', label: '10K \u2013 100K visitors' },
				{ value: '100k-1m', label: '100K \u2013 1M visitors' },
				{ value: 'over1m', label: 'Over 1M visitors' },
			],
		},
		{
			id: 'ecommerce',
			label: 'Do you need ecommerce functionality?',
			options: [
				{ value: 'no', label: 'No' },
				{ value: 'basic', label: 'Basic (simple products)' },
				{ value: 'advanced', label: 'Advanced (subscriptions, marketplaces, complex inventory)' },
			],
		},
		{
			id: 'security',
			label: 'What level of security and compliance do you need?',
			options: [
				{ value: 'standard', label: 'Standard' },
				{ value: 'enhanced', label: 'Enhanced (SOC 2, PCI)' },
				{ value: 'enterprise', label: 'Enterprise (FedRAMP, custom SLAs)' },
			],
		},
		{
			id: 'budget',
			label: "What's your budget range for hosting?",
			options: [
				{ value: 'under50', label: 'Under $50/mo' },
				{ value: '50-200', label: '$50 \u2013 $200/mo' },
				{ value: '200-1000', label: '$200 \u2013 $1,000/mo' },
				{ value: 'over1000', label: '$1,000+/mo' },
			],
		},
	];

	var PRODUCTS = {
		vip: {
			name: 'WordPress VIP',
			description: 'Enterprise-grade managed WordPress platform with dedicated support, security, and performance.',
			url: 'https://wordpress.com/vip',
		},
		pressable: {
			name: 'Pressable',
			description: 'Managed WordPress hosting with great performance, staging environments, and 24/7 support.',
			url: 'https://pressable.com',
		},
		woocommerce: {
			name: 'WooCommerce',
			description: 'The most customizable open-source ecommerce platform for WordPress.',
			url: 'https://woocommerce.com',
		},
		jetpack: {
			name: 'Jetpack',
			description: 'Security, performance, and marketing tools to grow and protect your WordPress site.',
			url: 'https://jetpack.com',
		},
	};

	function getRecommendation( answers ) {
		var siteType = answers.siteType;
		var traffic = answers.traffic;
		var ecommerce = answers.ecommerce;
		var security = answers.security;
		var budget = answers.budget;

		var needsEnterprise = siteType === 'enterprise' || traffic === 'over1m' || security === 'enterprise' || budget === 'over1000';
		var needsEcommerce = ecommerce === 'basic' || ecommerce === 'advanced';
		var needsAdvancedEcommerce = ecommerce === 'advanced';

		if ( needsAdvancedEcommerce && needsEnterprise ) {
			return {
				title: 'WordPress VIP + WooCommerce',
				description: 'Your project demands enterprise-level infrastructure combined with advanced ecommerce capabilities. WordPress VIP provides the scalability, security, and compliance you need, while WooCommerce delivers powerful, flexible ecommerce features for subscriptions, marketplaces, and complex inventory management.',
				products: [ 'vip', 'woocommerce' ],
			};
		}

		if ( needsEnterprise ) {
			return {
				title: 'WordPress VIP',
				description: 'Based on your enterprise requirements \u2014 whether it\u2019s high traffic volumes, strict security compliance, or the need for dedicated support \u2014 WordPress VIP is the ideal platform. It offers unmatched reliability, performance, and a team of experts to support your mission-critical site.',
				products: [ 'vip' ],
			};
		}

		if ( needsEcommerce ) {
			return {
				title: 'Pressable + WooCommerce + Jetpack',
				description: 'You need a reliable hosting foundation with ecommerce capabilities. Pressable provides optimized WordPress hosting, WooCommerce powers your online store, and Jetpack adds essential security, backups, and performance features to keep everything running smoothly.',
				products: [ 'pressable', 'woocommerce', 'jetpack' ],
			};
		}

		var midTraffic = traffic === '10k-100k' || traffic === '100k-1m';
		var midSecurity = security === 'standard' || security === 'enhanced';

		if ( midTraffic && midSecurity ) {
			return {
				title: 'Pressable + Jetpack',
				description: 'Your site sits in the sweet spot for managed WordPress hosting. Pressable delivers excellent performance and support for your traffic level, while Jetpack provides comprehensive security scanning, automated backups, and performance optimization to keep your site fast and protected.',
				products: [ 'pressable', 'jetpack' ],
			};
		}

		return {
			title: 'Pressable + Jetpack',
			description: 'For your project, we recommend starting with Pressable\u2019s managed WordPress hosting paired with Jetpack\u2019s all-in-one toolkit. This combination gives you a solid, secure, and fast foundation that\u2019s easy to manage and can scale as your site grows.',
			products: [ 'pressable', 'jetpack' ],
		};
	}

	function initWizard( wrapper ) {
		var wizard = wrapper.querySelector( '[data-asb-wizard]' );
		if ( ! wizard ) {
			return;
		}

		var progressFill = wizard.querySelector( '[data-asb-progress-fill]' );
		var progressLabel = wizard.querySelector( '[data-asb-progress-label]' );
		var card = wizard.querySelector( '[data-asb-card]' );
		var questionEl = wizard.querySelector( '[data-asb-question]' );
		var optionsEl = wizard.querySelector( '[data-asb-options]' );
		var navEl = wizard.querySelector( '[data-asb-nav]' );
		var resultEl = wizard.querySelector( '[data-asb-result]' );
		var resultTitle = wizard.querySelector( '[data-asb-result-title]' );
		var resultDesc = wizard.querySelector( '[data-asb-result-description]' );
		var resultProducts = wizard.querySelector( '[data-asb-result-products]' );
		var resultActions = wizard.querySelector( '[data-asb-result-actions]' );
		var progressContainer = wizard.querySelector( '.asb-progress' );

		var currentStep = 0;
		var answers = {};

		function renderStep() {
			var question = QUESTIONS[ currentStep ];
			var total = QUESTIONS.length;

			progressFill.style.width = ( ( ( currentStep + 1 ) / total ) * 100 ) + '%';
			progressLabel.textContent = 'Step ' + ( currentStep + 1 ) + ' of ' + total;

			questionEl.textContent = question.label;

			optionsEl.innerHTML = '';
			question.options.forEach( function ( option ) {
				var btn = document.createElement( 'button' );
				btn.type = 'button';
				btn.className = 'asb-option';
				if ( answers[ question.id ] === option.value ) {
					btn.classList.add( 'is-selected' );
				}

				var radio = document.createElement( 'span' );
				radio.className = 'asb-option__radio';
				if ( answers[ question.id ] === option.value ) {
					var dot = document.createElement( 'span' );
					dot.className = 'asb-option__radio-dot';
					radio.appendChild( dot );
				}

				var label = document.createElement( 'span' );
				label.className = 'asb-option__label';
				label.textContent = option.label;

				btn.appendChild( radio );
				btn.appendChild( label );

				btn.addEventListener( 'click', function () {
					answers[ question.id ] = option.value;
					renderStep();
				} );

				optionsEl.appendChild( btn );
			} );

			navEl.innerHTML = '';

			if ( currentStep > 0 ) {
				var backBtn = document.createElement( 'button' );
				backBtn.type = 'button';
				backBtn.className = 'asb-btn asb-btn--secondary';
				backBtn.textContent = 'Back';
				backBtn.addEventListener( 'click', function () {
					currentStep--;
					renderStep();
				} );
				navEl.appendChild( backBtn );
			}

			var nextBtn = document.createElement( 'button' );
			nextBtn.type = 'button';
			nextBtn.className = 'asb-btn asb-btn--primary';
			var hasAnswer = !! answers[ question.id ];

			if ( currentStep < total - 1 ) {
				nextBtn.textContent = 'Next';
			} else {
				nextBtn.textContent = 'See Recommendation';
			}

			if ( ! hasAnswer ) {
				nextBtn.classList.add( 'is-disabled' );
				nextBtn.disabled = true;
			}

			nextBtn.addEventListener( 'click', function () {
				if ( ! hasAnswer ) {
					return;
				}
				if ( currentStep < total - 1 ) {
					currentStep++;
					renderStep();
				} else {
					showResult();
				}
			} );

			navEl.appendChild( nextBtn );
		}

		function showResult() {
			var recommendation = getRecommendation( answers );

			card.style.display = 'none';
			progressContainer.style.display = 'none';
			resultEl.style.display = '';

			resultTitle.textContent = recommendation.title;
			resultDesc.textContent = recommendation.description;

			resultProducts.innerHTML = '';
			recommendation.products.forEach( function ( key ) {
				var product = PRODUCTS[ key ];
				var li = document.createElement( 'li' );
				var strong = document.createElement( 'strong' );
				strong.textContent = product.name;
				var sep = document.createTextNode( ' \u2014 ' );
				var span = document.createElement( 'span' );
				span.textContent = product.description;
				li.appendChild( strong );
				li.appendChild( sep );
				li.appendChild( span );
				resultProducts.appendChild( li );
			} );

			resultActions.innerHTML = '';
			recommendation.products.forEach( function ( key ) {
				var product = PRODUCTS[ key ];
				var a = document.createElement( 'a' );
				a.className = 'asb-link';
				a.href = product.url;
				a.target = '_blank';
				a.rel = 'noopener noreferrer';
				a.textContent = 'Visit ' + product.name;
				resultActions.appendChild( a );
			} );

			var restartDiv = document.createElement( 'div' );
			restartDiv.className = 'asb-restart';
			var restartBtn = document.createElement( 'button' );
			restartBtn.type = 'button';
			restartBtn.className = 'asb-restart__btn';
			restartBtn.textContent = 'Start over';
			restartBtn.addEventListener( 'click', function () {
				currentStep = 0;
				answers = {};
				card.style.display = '';
				progressContainer.style.display = '';
				resultEl.style.display = 'none';
				renderStep();
			} );
			restartDiv.appendChild( restartBtn );
			resultEl.appendChild( restartDiv );
		}

		renderStep();
	}

	document.querySelectorAll( '.wp-block-telex-block-telex-automattic-solution-builder' ).forEach( initWizard );
}() );
