/*!
 * ${copyright}
 */

/**
 * Initialization Code and shared classes of library <%= librarynamespace %>.
 */
sap.ui.define(["sap/ui/core/library"], // library dependency
	function () {

		"use strict";

		/**
		 * Library Generator
		 *
		 * @namespace
		 * @name <%= librarynamespace %>
		 * @author SAP SE
		 * @version 1.0.0
		 * @public
		 */

		// delegate further initialization of this library to the Core
		sap.ui.getCore().initLibrary({
			name: "<%= librarynamespace %>",
			version: "1.0.0",
			dependencies: ["sap.ui.core"],
			types: [],
			interfaces: [],
			controls: [
				"<%= librarynamespace %>.controls.Example"
			],
			elements: []
		});

		/* eslint-disable */
		return <%= librarynamespace %>;
		/* eslint-enable */

	}, /* bExport= */ false);