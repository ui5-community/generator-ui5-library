module.exports = function (config) {
	"use strict";

	require("./karma-ci.conf")(config);
	config.set({
		reporters: ["progress", "coverage"],
		preprocessors: {
			"src/**/*.js": ["coverage"],
			"test/**/*.js": ["coverage"]
		},<% if (flat) { %>
		proxies: {
			'/resources/<%= libURI %>/': '/base/src/',
			'/test-resources/<%= libURI %>/': '/base/test/',
		},<% } %>
		coverageReporter: {
			dir: "coverage",
			reporters: [
				{ type: "html", subdir: "report-html" },
				{ type: "cobertura", subdir: ".", file: "cobertura.txt" },
				{ type: "lcovonly", subdir: ".", file: "report-lcovonly.txt" },
				{ type: "text-summary" }
			]
		}
	});
};
