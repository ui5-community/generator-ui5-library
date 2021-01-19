/*!
 * ${copyright}
 */

/**
 * Initialization Code and shared classes of library com.librarygenerator.librarygenerator.
 */
sap.ui.define(["sap/ui/core/library"], // library dependency
	function () {

		"use strict";

		/**
		 * Library Generator
		 *
		 * @namespace
		 * @name com.librarygenerator.librarygenerator
		 * @author SAP SE
		 * @version 1.0.0
		 * @public
		 */

		// delegate further initialization of this library to the Core
		sap.ui.getCore().initLibrary({
			name: "com.librarygenerator.librarygenerator",
			version: "1.0.0",
			dependencies: ["sap.ui.core"],
			types: [],
			interfaces: [],
			controls: [
				"com.librarygenerator.librarygenerator.controls.Example"
			],
			elements: []
		});

		/* eslint-disable */
		return com.librarygenerator.librarygenerator;
		/* eslint-enable */

	}, /* bExport= */ false);