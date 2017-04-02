/* jshint esnext: true */

const doc = document;

doc.addEventListener( 'DOMContentLoaded', () => {
	/**
	 * Main Syncope application.
	 */
	new Vue( {
		el: '.app',
		data: {
			config: {
				baseFontSize: 16,
				baseLineHeight: 1.6,
				capHeight: 0.68,
				font: {
					current: 'Helvetica',
					options: [
						{ value: 'Arial', label: 'Arial' },
						{ value: 'Georgia', label: 'Georgia' },
						{ value: 'Helvetica', label: 'Helvetica' },
						{ value: 'Roboto', label: 'Roboto' },
						{ value: 'Times New Roman', label: 'Times New Roman' },
					],
					boldHeaders: true
				},
				scale: {
					current: 1.5,
					options: [
						{ value: 1.2, label: 'Minor Third (1.2)' },
						{ value: 1.25, label: 'Major Third (1.25)' },
						{ value: 1.333, label: 'Fourth (1.333)' },
						{ value: 1.5, label: 'Fifth (1.5)' },
						{ value: 1.618, label: 'Fibonacci (1.618)' },
						{ value: 1.778, label: 'Minor Seventh (1.778)' },
						{ value: 1.875, label: 'Major Seventh (1.875)' },
						{ value: 2, label: 'Octave (2.0)' },
					],
					factors: {
						h1: 4,
						h2: 3,
						h3: 2,
						h4: 1,
						p: 0
					},
					headerSpacing: {
						before: 0,
						after: 0
					}
				},
				textWidth: 40,
				outputUnit: 'em',
				outputSyntax: 'css',
				outputVisible: false,
				showGrid: true,
			},

			output: '',
			collapse: [ 'basic' ],
			outputElement: doc.querySelector( '.output code' ),
			sandboxStylesSheetElement: doc.querySelector( '.sandbox-styles' )
		},

		watch: {
			config: {
				deep: true,
				handler: 'update'
			}
		},

		methods: {
			/**
			 * Updates the sandbox (preview) with the rhythm styles.
			 */
			update() {
				const cfg = this.config;
				const rhythms = {};

				cfg.rhythmUnit = Math.round( cfg.baseFontSize * cfg.baseLineHeight );

				for ( let i in cfg.scale.factors ) {
					rhythms[ i ] = new Rhythm( cfg.scale.factors[ i ], cfg );
				}

				this._setSandboxStyles( rhythms );
				this._setOutput( rhythms );
			},

			_setSandboxStyles( rhythms ) {
				const cfg = this.config;

				let styles = `.sandbox {
	font: ${ cfg.baseFontSize }px/${ cfg.baseLineHeight } ${ cfg.font.current };
	padding: ${ cfg.baseLineHeight }em;
	background: ${ cfg.showGrid ?
		`linear-gradient( to bottom, #fff, #fff 98%, rgba( 32,160,255,1 ) 100% );`
		:
		'transparent;'
	}
	max-width: ${ cfg.textWidth }em;
	background-size: 100% ${ cfg.rhythmUnit }px;
}`;

				for ( let i in rhythms ) {
					styles += `.sandbox ${ i } {${
	rhythms[ i ].print( 'css', 'px' )
}}\n\n`;
				}

				styles += `.sandbox h1, .sandbox h2, .sandbox h3, .sandbox h4 {
	font-weight: ${ cfg.font.boldHeaders ? 'bold' : 'normal' };
}`;

				this.sandboxStylesSheetElement.innerHTML = styles;
			},

			/**
			 * Updates the output area with the rhythm production styles.
			 *
			 * @param {Object.<Rhythm>} rhythms
			 */
			_setOutput( rhythms ) {
				const cfg = this.config;
				let code = `/**
 * Vertical rhythm by Syncope
 * http://nowodzinski.pl/syncope
 */

html, body {
	font: ${ cfg.baseFontSize }px/${ cfg.baseLineHeight } '${ cfg.font.current }';
}

`;

				if ( !cfg.font.boldHeaders ) {
					code += `h1, h2, h3, h4 {
	font-weight: normal;
}

`;
				}

				if ( cfg.outputSyntax == 'css' ) {
					for ( let r in rhythms ) {
						code += `${ r } {${
	rhythms[ r ].print( cfg.outputSyntax, cfg.outputUnit )
}}\n\n`;
					}
				} else {
					code += '$v-rhythm-levels: (\n';

					for ( let r in rhythms ) {
						code += `	${ cfg.scale.factors[ r ] }: ( ${ rhythms[ r ].print( cfg.outputSyntax, cfg.outputUnit ) } ),\n`;
					}

					code += ');\n';

					code += `
/**
 * Sets vertical–rhythm for the given level.
 * Usage:
 *
 * 	h1 {
 * 		@include v-rhythm( 4 );
 * 	}
 */
@mixin v-rhythm( $level ) {
	$rhythm: map-get( $v-rhythm-levels, $level );

	font-size: nth( $rhythm, 1 );
	line-height: nth( $rhythm, 2 );
	padding-top: nth( $rhythm, 3 );
	margin-bottom: nth( $rhythm, 4 );
}
`;
				}

				this.output = hljs.highlight( cfg.outputSyntax, code ).value;
			}
		}
	} ).update();
} );
