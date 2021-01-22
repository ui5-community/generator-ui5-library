/*!
 * ${copyright}
 */

sap.ui.define([],

	function () {
		"use strict";

		/**
		 * Example renderer.
		 * @namespace
		 */
		var ExampleRenderer = {};

		/**
		 * Renders the HTML for the given control, using the provided
		 * {@link sap.ui.core.RenderManager}.
		 *
		 * @param {sap.ui.core.RenderManager} oRm
		 *            the RenderManager that can be used for writing to
		 *            the Render-Output-Buffer
		 * @param {sap.ui.core.Control} oControl
		 *            the control to be rendered
		 */
		ExampleRenderer.render = function (oRm, oControl) {

			oRm.write("<div");
			oRm.writeControlData(oControl);
			oRm.addClass("sapRULTExample");
			oRm.writeClasses();
			oRm.write(">");
			oRm.write(sap.ui.getCore().getLibraryResourceBundle("<%= librarynamespace %>").getText("ANY_TEXT"));

			oRm.writeEscaped(oControl.getText());
			oRm.write("</div>");

		};

		return ExampleRenderer;

	}, /* bExport= */ true);