var jsValidator = require("@sap/di.code-validation.js");
var xmlValidator = require("@sap/di.code-validation.xml");

module.exports = function (grunt) {
	"use strict";

	grunt.loadNpmTasks("grunt-run");
	grunt.initConfig({
		run: {
			options: {
				failOnError: true
			},
			build: {
				exec: "npm run build-for-deploy"
			},
			clean: {
				exec: "npm run clean"
			}
		}
	});

	grunt.registerTask("default", ["run:clean", "lint", "run:build"]);

	grunt.registerTask("lint", function () {
		var issues = [];
		[xmlValidator, jsValidator].forEach(function (validator) {
			issues = issues.concat(validator.validateFiles().issues);
		});
		if (issues.length) {
			grunt.log.writeln("Linting issues: \n" + issues.map(JSON.stringify).join("\n"));
		}
		if (issues.filter(function (issue) {
				return issue.severity === "error";
			}).length) {
			grunt.fail.fatal("Linting errors found");
		}
	});
};