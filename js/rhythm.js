/* jshint esnext: true */

const p = getToPrecision( 3 );

/**
 * A class representing a particular, configured vertical rhythm with
 * its properties.
 */
class Rhythm {
	/**
	 * Creates an instance of the Rhythm.
	 *
	 * @param {Integer} level Level of the rhythm.
	 * @param {Object} config Configuration of the Syncope application.
	 */
	constructor( level, config ) {
		/**
		 * @readonly
		 * @member {Object} #config
		 */
		const cfg = this.config = config;
		const fontSizeFactor = Math.pow( cfg.scale.current, level );

		/**
		 * @readonly
		 * @member {Object} #fontSize
		 */
		this.fontSize = Math.round( cfg.baseFontSize * fontSizeFactor );

		const unitsInSize = Math.ceil( ( this.fontSize + 0.001 ) / cfg.rhythmUnit );

		/**
		 * @readonly
		 * @member {Object} #lineHeight
		 */
		this.lineHeight = Math.round( cfg.rhythmUnit * unitsInSize );

		const shift = Math.round( ( this.lineHeight - ( this.fontSize * cfg.capHeight ) ) / 2 );

		/**
		 * @readonly
		 * @member {Object} #paddingTop
		 */
		this.paddingTop = shift;

		/**
		 * @readonly
		 * @member {Object} #marginBottom
		 */
		this.marginBottom = ( shift > cfg.rhythmUnit ? 2 : 1 ) * cfg.rhythmUnit - shift;

		if ( level ) {
			this.paddingTop += cfg.scale.headerSpacing.before * cfg.rhythmUnit;
			this.marginBottom += cfg.scale.headerSpacing.after * cfg.rhythmUnit;
		}
	}

	/**
	 * Prints the Rhythm instance as a string, e.g. to use in CSS or SCSS file.
	 *
	 * @param {String} syntax Name of the syntax (css or scss).
	 * @param {String} unit Name of the unit (px, em or rem).
	 * @returns {String}
	 */
	print( syntax, unit ) {
		const r = this.toUnit( unit );

		if ( syntax == 'css' ) {
			return `
	font-size: ${ r.fontSize };
	line-height: ${ r.lineHeight };
	padding-top: ${ r.paddingTop };
	margin-bottom: ${ r.marginBottom };
`;
		} else {
			return `${ r.fontSize }, ${ r.lineHeight }, ${ r.paddingTop }, ${ r.marginBottom }`;
		}
	}

	/**
	 * Returns a rhythm in an object format, properties in desired units.
	 *
	 * @param {String} unit Name of the unit (px, em or rem).
	 * @returns {Object}
	 */
	toUnit( unit ) {
		const cfg = this.config;

		if ( unit == 'px' ) {
			return {
				fontSize: `${ this.fontSize + unit }`,
				lineHeight: `${ this.lineHeight + unit }`,
				paddingTop: `${ this.paddingTop + unit }`,
				marginBottom: `${ this.marginBottom + unit }`
			};
		} else {
			return {
				fontSize: `${ p( this.fontSize / cfg.baseFontSize ) + unit }`,
				lineHeight: `${ p( this.lineHeight / this.fontSize ) + unit }`,
				paddingTop: `${ p( this.paddingTop / this.fontSize ) + unit }`,
				marginBottom: `${ p( this.marginBottom / this.fontSize ) + unit }`
			};
		}
	}
}

function getToPrecision( precision ) {
	return ( num ) => num.toPrecision( precision );
}