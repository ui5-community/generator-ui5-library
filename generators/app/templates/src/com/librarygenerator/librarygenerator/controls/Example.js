/*!
 * ${copyright}
 */
// Provides control com.librarygenerator.librarygenerator.Example.
sap.ui.define([
	"./../library", "sap/ui/core/Control", "./ExampleRenderer"
], function (library, Control, ExampleRenderer) {
	"use strict";

	/**
	 * Constructor for a new Example control.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Some class description goes here.
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.0.0
	 *
	 * @constructor
	 * @public
	 * @alias com.librarygenerator.librarygenerator.controls.Example
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var Example = Control.extend("com.librarygenerator.librarygenerator.controls.Example", {
		metadata: {
			library: "com.librarygenerator.librarygenerator",
			properties: {
				/**
				 * text
				 */
				text: {
					type: "string",
					defaultValue: null
				}
			},
			events: {
				/**
				 * Event is fired when the user clicks on the control.
				 */
				press: {}
			}
		},
		renderer: ExampleRenderer
	});
	return Example;
}, /* bExport= */ true);