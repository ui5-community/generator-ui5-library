/*!
 * ${copyright}
 */

/**
 * Initialization Code and shared classes of library <%= libId %>.
 */
sap.ui.define([
	"sap/base/util/ObjectPath",
	"sap/ui/core/library"
], function (ObjectPath) {
	"use strict";

	// delegate further initialization of this library to the Core
	// Hint: sap.ui.getCore() must still be used to support preload with sync bootstrap!
	sap.ui.getCore().initLibrary({
		name: "<%= libId %>",
		version: "${version}",
		dependencies: [ // keep in sync with the ui5.yaml and .library files
			"sap.ui.core"
		],
		types: [
			"<%= libId %>.ExampleColor"
		],
		interfaces: [],
		controls: [
			"<%= libId %>.Example"
		],
		elements: [],
		noLibraryCSS: false // if no CSS is provided, you can disable the library.css load here
	});

	/**
	 * Some description about <code><%= libId %></code>
	 *
	 * @namespace
	 * @alias <%= libId %>
	 * @author <%= author %>
	 * @version ${version}
	 * @public
	 */
	const thisLib = ObjectPath.get("<%= libId %>");

	/**
	 * Semantic Colors of the <code><%= libId %>.Example</code>.
	 *
	 * @enum {string}
	 * @public
	 */
	thisLib.ExampleColor = {

		/**
		 * Default color (brand color)
		 * @public
		 */
		Default : "Default",

		/**
		 * Highlight color
		 * @public
		 */
		Highlight : "Highlight"

	};

	return thisLib;

});
