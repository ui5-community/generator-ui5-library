/*global QUnit, jQuery */
sap.ui.define(["<%= libURI %>/library", "<%= libURI %>/Example"], function (library, Example) {
	"use strict";

	// refer to library types
	const ExampleColor = library.ExampleColor;

	// prepare DOM
	const oDiv = document.createElement("div");
	oDiv.id = "uiArea1";
	document.body.appendChild(oDiv);

	// module for basic checks
	QUnit.module("Example Tests");

	// example sync test
	QUnit.test("Sync", function (assert) {
		assert.expect(1);
		assert.ok(true, "ok");
	});

	// example async test
	QUnit.test("Async", function (assert) {
		assert.expect(1);
		return new Promise(function (resolve /*, reject*/) {
			assert.ok(true, "ok");
			resolve();
		});
	});

	// module for basic checks
	QUnit.module("Basic Control Checks");

	// some basic control checks
	QUnit.test("Test get properties", function (assert) {
		assert.expect(2);
		const oExample = new Example({
			text: "Example"
		});
		assert.equal(oExample.getText(), "Example", "Check text equals 'Example'");
		assert.equal(oExample.getColor(), ExampleColor.Default, "Check color equals 'Default'");
	});

	// some basic eventing check
	QUnit.test("Test click event", function (assert) {
		assert.expect(1);
		const oExample = new Example("example", {
			text: "Example",
			press: function () {
				assert.ok(true, "Event has been fired!");
			}
		}).placeAt("uiArea1");
		return new Promise(function (resolve /*, reject*/) {
			setTimeout(function () {
				// eslint-disable-next-line new-cap
				oExample.$().trigger(jQuery.Event("click"));
				resolve();
			}, 100);
		});
	});
});
